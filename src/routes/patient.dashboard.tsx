import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PatientShell } from "./patient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app-shell";
import { Plus, CalendarCheck, Stethoscope } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Appointment, type AppointmentRecord } from "@/services/appointment.service";

export const Route = createFileRoute("/patient/dashboard")({
  head: () => ({ meta: [{ title: "My Portal — MediFlow" }] }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const { user } = useUser();
  const patientName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Patient";
  const today = getTodayDateValue();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patient-dashboard-appointments"],
    queryFn: () => Appointment.getMyAppointments(),
  });

  const allAppointments = useMemo(() => {
    const records = data?.appointments ?? [];
    return records
      .filter((appointment) => !isCancelledOrDelayed(appointment))
      .sort((left, right) => getAppointmentSortValue(left) - getAppointmentSortValue(right));
  }, [data?.appointments]);

  const appointments = useMemo(() => {
    return allAppointments.filter((appointment) => isAppointmentForToday(appointment, today));
  }, [allAppointments, today]);

  const nextAppointment = getNextAppointment(allAppointments);

  return (
    <PatientShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {patientName}</h1>
        <p className="text-sm text-muted-foreground">Here is a summary of your health portal today.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {user?.patientId && <span className="rounded-md border border-border px-2 py-1">Patient ID: {user.patientId}</span>}
          {user?.age && <span className="rounded-md border border-border px-2 py-1">Age: {user.age}</span>}
          {user?.city && <span className="rounded-md border border-border px-2 py-1">City: {user.city}</span>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Quick Actions</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Link to="/patient/book" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-sky-500 p-5 text-primary-foreground transition-transform hover:-translate-y-0.5">
              <Plus className="mb-6 h-6 w-6" />
              <div className="font-semibold">Book a New Appointment</div>
              <div className="text-xs opacity-90">For yourself or a relative</div>
              <CalendarCheck className="absolute -right-2 -bottom-2 h-20 w-20 opacity-10" />
            </Link>
            <Link to="/patient/doctors" className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary"><Stethoscope className="h-5 w-5" /></div>
              <div><div className="font-medium">View My Doctors</div><div className="text-xs text-muted-foreground">Your care team</div></div>
            </Link>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold">Upcoming</h3>
          {isLoading ? (
            <div className="mt-3 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Loading today's visits...</div>
          ) : isError ? (
            <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">Unable to load appointments.</div>
          ) : nextAppointment ? (
            <div className="mt-3 rounded-lg bg-primary-soft p-3 text-sm">
              <div className="font-medium text-primary">{formatDate(nextAppointment.appointmentDate)} · {formatTime(nextAppointment.estimatedTurnTime ?? nextAppointment.appointmentDate)}</div>
              <div className="text-xs text-muted-foreground">{getDoctorLabel(nextAppointment)} · {getSpecialty(nextAppointment)}</div>
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">No upcoming appointments.</div>
          )}
          <Button asChild variant="outline" className="mt-3 w-full"><Link to="/patient/appointments">View all</Link></Button>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h3 className="mb-3 text-sm font-semibold">My Appointments</h3>
        {isLoading ? (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Loading today's appointments...</div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">Unable to load appointments.</div>
        ) : appointments.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">No active appointments for today.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Appt ID</th>
                  <th className="py-2 pr-4">Doctor</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-muted/40">
                    <td className="py-3 pr-4 font-medium text-primary">{formatAppointmentId(appointment._id)}</td>
                    <td className="py-3 pr-4">{getDoctorLabel(appointment)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{appointment.reasonForVisit || "Not specified"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatDate(appointment.appointmentDate)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatTime(appointment.estimatedTurnTime ?? appointment.appointmentDate)}</td>
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

function getTodayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isCancelledOrDelayed(appointment: AppointmentRecord) {
  const status = (appointment.status || "").toLowerCase();
  return status === "cancelled" || status === "delayed";
}

function getAppointmentSortValue(appointment: AppointmentRecord) {
  const value = getAppointmentDateTimeValue(appointment);
  const dateValue = value ? new Date(value).getTime() : Number.POSITIVE_INFINITY;
  return Number.isFinite(dateValue) ? dateValue : Number.POSITIVE_INFINITY;
}

function getNextAppointment(appointments: AppointmentRecord[]) {
  const now = Date.now();
  return appointments.find((appointment) => {
    const value = getAppointmentDateTimeValue(appointment);
    if (!value) return false;
    const timestamp = new Date(value).getTime();
    return Number.isFinite(timestamp) && timestamp >= now;
  }) ?? null;
}

function getAppointmentDateTimeValue(appointment: AppointmentRecord) {
  const explicit = appointment.estimatedTurnTime ?? appointment.appointmentDate;
  if (!explicit) return "";

  const candidate = explicit.trim();
  if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(candidate)) {
    return appointment.appointmentDate ? `${appointment.appointmentDate}T${candidate}` : "";
  }

  return candidate;
}

function isAppointmentForToday(appointment: AppointmentRecord, today: string) {
  return normalizeDateValue(appointment.appointmentDate) === today;
}

function normalizeDateValue(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function getDoctorLabel(appointment: AppointmentRecord) {
  const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : undefined;
  const user = doctor && typeof doctor.userId === "object" ? doctor.userId : undefined;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Doctor";
  return doctor?.speciality ? `${name} · ${doctor.speciality}` : name;
}

function getSpecialty(appointment: AppointmentRecord) {
  const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : undefined;
  return doctor?.speciality || "General Practice";
}
