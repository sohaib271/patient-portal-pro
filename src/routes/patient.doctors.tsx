import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PatientShell } from "./patient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/app-shell";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Patient } from "@/services/patient.service";

type PatientScheduleEntry = {
  day: string;
  startTime?: string;
  endTime?: string;
};

type PatientDoctor = {
  _id: string;
  name: string;
  speciality: string;
  isAvailable: boolean;
  appointmentCount: number;
  lastAppointmentDate?: string;
  scheduleSummary: string;
  scheduleEntries: PatientScheduleEntry[];
};

export const Route = createFileRoute("/patient/doctors")({
  head: () => ({ meta: [{ title: "My Doctors — MediFlow" }] }),
  component: MyDoctorsPage,
});

function MyDoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<PatientDoctor | null>(null);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ["patient-doctors"],
    queryFn: async () => {
      const response = await Patient.getMyDoctors();
      const appointments = Array.isArray(response?.doctors) ? response.doctors : [];
      const byDoctor = new Map<string, PatientDoctor>();

      appointments.forEach((appointment: any) => {
        const doctor = appointment?.doctorId;
        if (!doctor?._id) return;

        const doctorId = doctor._id;
        const existing = byDoctor.get(doctorId);
        const doctorUser = typeof doctor.userId === "object" ? doctor.userId : undefined;
        const name = [doctorUser?.firstName, doctorUser?.lastName].filter(Boolean).join(" ") || "Doctor";

        const scheduleEntries = getScheduleEntries(doctor?.schedule);

        byDoctor.set(doctorId, {
          _id: doctorId,
          name,
          speciality: doctor.speciality || "General Practice",
          isAvailable: doctor.isAvailable !== false,
          appointmentCount: (existing?.appointmentCount ?? 0) + 1,
          lastAppointmentDate: appointment?.appointmentDate ?? existing?.lastAppointmentDate,
          scheduleSummary: getScheduleSummary(scheduleEntries),
          scheduleEntries,
        });
      });

      return Array.from(byDoctor.values()).sort((left, right) => {
        if (right.appointmentCount !== left.appointmentCount) {
          return right.appointmentCount - left.appointmentCount;
        }
        return left.name.localeCompare(right.name);
      });
    },
  });

  return (
    <PatientShell breadcrumbs={[{ label: "Dashboard", to: "/patient/dashboard" }, { label: "My Doctors" }]}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">My Doctors</h1>
      <p className="mb-6 text-sm text-muted-foreground">Your care team</p>

      {isLoading ? (
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Loading your doctors...</div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">Unable to load your doctors right now.</div>
      ) : doctors.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">You do not have any doctors linked to your account yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card
              key={doctor._id}
              role="button"
              tabIndex={0}
              className="cursor-pointer p-5 transition-all hover:border-primary/40 hover:shadow-md"
              onClick={() => {
                setSelectedDoctor(doctor);
                setIsScheduleExpanded(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedDoctor(doctor);
                  setIsScheduleExpanded(false);
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={getInitials(doctor.name)} tone={doctor.isAvailable ? "emerald" : "amber"} />
                  <div>
                    <div className="font-semibold">{doctor.name}</div>
                    <div className="text-xs text-muted-foreground">{doctor.speciality}</div>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${doctor.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                  {doctor.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Care visits</span>
                  <span className="font-medium text-foreground">{doctor.appointmentCount}</span>
                </div>
                <div className="rounded-md border border-border/70 bg-background/70 px-3 py-2">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Availability</div>
                  <div className="mt-1 text-sm font-medium text-foreground">{doctor.scheduleSummary}</div>
                </div>
                {doctor.lastAppointmentDate ? (
                  <div className="text-xs text-muted-foreground">Last visit: {formatDate(doctor.lastAppointmentDate)}</div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(selectedDoctor)} onOpenChange={(open) => {
        if (!open) {
          setSelectedDoctor(null);
          setIsScheduleExpanded(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedDoctor?.name}</DialogTitle>
            <DialogDescription>{selectedDoctor?.speciality}</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Care visits</span>
                <span className="font-medium text-foreground">{selectedDoctor?.appointmentCount ?? 0}</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="text-right text-sm font-medium text-foreground">{selectedDoctor?.scheduleSummary ?? "Schedule pending"}</span>
                </div>

                {selectedDoctor?.scheduleEntries?.length ? (
                  <div className="mt-3 rounded-lg border border-border/70 bg-background/70 p-3">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Schedule details</div>
                    <div className="space-y-2">
                      {(isScheduleExpanded ? selectedDoctor.scheduleEntries : selectedDoctor.scheduleEntries.slice(0, 2)).map((entry) => (
                        <div key={`${entry.day}-${entry.startTime ?? ""}-${entry.endTime ?? ""}`} className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 px-3 py-2">
                          <span className="font-medium text-foreground">{entry.day}</span>
                          <span className="text-sm text-muted-foreground">{formatScheduleRange(entry)}</span>
                        </div>
                      ))}
                    </div>

                    {selectedDoctor.scheduleEntries.length > 2 ? (
                      <Button type="button" variant="ghost" className="mt-3 h-auto px-0 text-sm" onClick={() => setIsScheduleExpanded((value) => !value)}>
                        {isScheduleExpanded ? "Show less" : "Read more"}
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${selectedDoctor?.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                  {selectedDoctor?.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/patient/book">Book appointment</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PatientShell>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "DR";
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getScheduleEntries(schedule?: Array<{ day?: string; startTime?: string; endTime?: string }>): PatientScheduleEntry[] {
  if (!schedule?.length) return [];

  return schedule
    .filter((entry) => entry?.day)
    .map((entry) => ({
      day: entry.day!.trim(),
      startTime: entry.startTime,
      endTime: entry.endTime,
    }))
    .filter((entry) => entry.day);
}

function getScheduleSummary(entries: PatientScheduleEntry[]) {
  if (!entries.length) return "Schedule pending";

  const previewEntries = entries.slice(0, 2);
  const summary = previewEntries
    .map((entry) => `${entry.day} · ${formatScheduleRange(entry)}`)
    .join(" • ");

  if (entries.length <= 2) return summary;
  return `${summary} • +${entries.length - 2} more`;
}

function formatScheduleRange(entry: PatientScheduleEntry) {
  const formattedStart = formatScheduleTime(entry.startTime);
  const formattedEnd = formatScheduleTime(entry.endTime);
  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }
  return formattedStart || formattedEnd || "Time pending";
}

function formatScheduleTime(value?: string) {
  if (!value) return "";
  const trimmed = value.trim();
  if (/AM|PM/i.test(trimmed)) return trimmed;

  const match = trimmed.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!match) return trimmed;

  const hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  if (!Number.isFinite(hour)) return trimmed;

  const period = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${String(minute).padStart(2, "0")} ${period}`;
}