import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PatientShell } from "./patient";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/app-shell";
import { Appointment, type AppointmentRecord } from "@/services/appointment.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/appointments")({
  head: () => ({ meta: [{ title: "My Appointments — MediFlow" }] }),
  component: PatientAppointments,
});

function PatientAppointments() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: () => Appointment.getMyAppointments(),
  });

  const appointments = data?.appointments ?? [];

  return (
    <PatientShell breadcrumbs={[{ label: "Dashboard", to: "/patient/dashboard" }, { label: "My Appointments" }]}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">My Appointments</h1>
      <p className="mb-6 text-sm text-muted-foreground">Past and upcoming visits</p>
      <Card className="p-5">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Loading appointments...</div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">Unable to load appointments.</div>
        ) : appointments.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">No appointments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Appt ID</th>
                  <th className="py-2 pr-4">Patient</th>
                  <th className="py-2 pr-4">Doctor</th>
                  <th className="py-2 pr-4">Checkup</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Created By</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-muted/40">
                    <td className="py-3 pr-4 font-medium text-primary">{formatAppointmentId(appointment._id)}</td>
                    <td className="py-3 pr-4">{getPatientLabel(appointment)}</td>
                    <td className="py-3 pr-4">{getDoctorLabel(appointment)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{getCheckupName(appointment)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{appointment.reasonForVisit || "Not specified"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{getAppointmentDateLabel(appointment)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{getAppointmentTimeLabel(appointment)}</td>
                    <td className="py-3 pr-4"><CreatorRoleBadge role={appointment.createdByRole} /></td>
                    <td className="py-3 pr-4"><StatusBadge status={formatStatus(appointment.status)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PatientShell>
  );
}

function getPatientLabel(appointment: AppointmentRecord) {
  const patient = typeof appointment.patientId === "object" ? appointment.patientId : undefined;
  const name = [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Patient";
  return patient?.patientId ? `${name} - ${patient.patientId}` : name;
}

function getDoctorLabel(appointment: AppointmentRecord) {
  const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : undefined;
  const user = doctor && typeof doctor.userId === "object" ? doctor.userId : undefined;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Doctor";
  return doctor?.speciality ? `${name} - ${doctor.speciality}` : name;
}

function getCheckupName(appointment: AppointmentRecord) {
  const checkup = typeof appointment.checkupId === "object" ? appointment.checkupId : undefined;
  return checkup?.name ?? "Checkup";
}

function CreatorRoleBadge({ role }: { role?: string }) {
  const normalizedRole = (role || "unknown").toLowerCase();
  const roleClassName = {
    admin: "border-sky-200 bg-sky-50 text-sky-700",
    doctor: "border-emerald-200 bg-emerald-50 text-emerald-700",
    patient: "border-amber-200 bg-amber-50 text-amber-700",
    user: "border-slate-200 bg-slate-50 text-slate-700",
    unknown: "border-slate-200 bg-slate-50 text-slate-600",
  }[normalizedRole] ?? "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", roleClassName)}>
      {formatCreatorRole(role)}
    </span>
  );
}

function formatAppointmentId(id: string) {
  return `APT-${id.slice(-5).toUpperCase()}`;
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isDelayedAppointment(appointment: AppointmentRecord) {
  return appointment.status === "delayed";
}

function getAppointmentDateLabel(appointment: AppointmentRecord) {
  if (isDelayedAppointment(appointment)) return "N/A";
  return formatDate(appointment.appointmentDate);
}

function getAppointmentTimeLabel(appointment: AppointmentRecord) {
  if (isDelayedAppointment(appointment)) return "N/A";
  return formatTime(appointment.estimatedTurnTime);
}

function formatTime(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatStatus(status = "pending") {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCreatorRole(role?: string) {
  if (!role) return "Unknown";
  return role.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
