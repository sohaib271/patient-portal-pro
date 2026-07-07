import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, StatusBadge, Avatar } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CalendarRange,
  ClipboardPenLine,
  Plus,
  Search,
  Stethoscope,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useAppointments, useDoctorAppointments } from "@/hooks/useAppointments";
import { useDoctorProfile } from "@/hooks/useDoctors";
import { useMemo, useState } from "react";
import type { AppointmentRecord } from "@/services/appointment.service";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard - MediFlow" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useUser();
  if (user?.role === "doctor") return <DoctorDashboard />;
  return <AdminDashboard />;
}

function AdminDashboard() {
  const { user } = useUser();
  const [appointmentQuery, setAppointmentQuery] = useState("");
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Staff";
  const today = useMemo(() => getPakistanTodayValue(), []);
  const todayLabel = useMemo(() => formatLongDate(today), [today]);
  const { data: todayAppointments = [], isLoading: isLoadingTodayAppointments, isError: todayAppointmentsError } = useAppointments(today);
  const normalizedAppointmentQuery = appointmentQuery.trim().toLowerCase();
  const filteredTodayAppointments = useMemo(() => {
    return todayAppointments.filter((appointment) => {
      const text = [
        getPatientName(appointment),
        getPatientCode(appointment),
        getDoctorName(appointment),
        getSpecialty(appointment),
        appointment._id,
      ].join(" ").toLowerCase();
      return !normalizedAppointmentQuery || text.includes(normalizedAppointmentQuery);
    });
  }, [normalizedAppointmentQuery, todayAppointments]);
  const doctorStats = useMemo(() => buildDoctorStats(todayAppointments), [todayAppointments]);
  const completedToday = todayAppointments.filter((appointment) => appointment.status === "completed").length;
  const remainingToday = todayAppointments.filter((appointment) => !["completed", "cancelled"].includes(appointment.status ?? "")).length;

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Good morning, {displayName}</h1>
        <p className="text-sm text-muted-foreground">{todayLabel} - Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link to="/appointments/new" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-sky-500 p-4 text-primary-foreground transition-transform hover:-translate-y-0.5">
                <Plus className="mb-6 h-6 w-6" />
                <div className="font-semibold">Book a New Appointment</div>
                <div className="text-xs opacity-90">{todayAppointments.length} appointments scheduled for today</div>
                <CalendarCheck className="absolute -right-2 -bottom-2 h-20 w-20 opacity-10" />
              </Link>
              <Link to="/patients" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary"><UserPlus className="h-5 w-5" /></div>
                <div className="text-sm font-medium">Register New Patient</div>
              </Link>
              <Link to="/doctors" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary"><CalendarRange className="h-5 w-5" /></div>
                <div className="text-sm font-medium">View Doctor Schedules</div>
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-sm font-semibold">Today's Appointments</h3>
                <p className="text-xs text-muted-foreground">{todayAppointments.length} appointments scheduled</p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={appointmentQuery} onChange={(event) => setAppointmentQuery(event.target.value)} placeholder="Search by name or ID..." className="pl-9 h-9 w-56" />
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {doctorStats.map((doctor, index) => (
                <span key={index} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${doctor.tone}`}>
                  {doctor.name} <span className="opacity-70">{doctor.count}</span>
                </span>
              ))}
            </div>
            <div className="divide-y divide-border">
              {isLoadingTodayAppointments ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading today's appointments...</div>
              ) : todayAppointmentsError ? (
                <div className="py-8 text-center text-sm text-destructive">Unable to load today's appointments.</div>
              ) : filteredTodayAppointments.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No appointments found for today.</div>
              ) : filteredTodayAppointments.slice(0, 6).map((appointment) => (
                <div key={appointment._id} className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <div className="text-sm font-medium text-muted-foreground">{getAppointmentTimeLabel(appointment)}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{getPatientName(appointment)}</div>
                    <div className="truncate text-xs text-muted-foreground">{getPatientCode(appointment)} - {getDoctorName(appointment)} - {getSpecialty(appointment)}</div>
                  </div>
                  <StatusBadge status={formatStatus(appointment.status)} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <StatCard icon={CalendarCheck} title="Today's Appointments" value={todayAppointments.length} a={{ label: "Completed", value: completedToday }} b={{ label: "Remaining", value: remainingToday }} />
          <StatCard icon={Users} title="Patients" value={1740} a={{ label: "Registered this Month", value: 140 }} b={{ label: "Older than 1 month", value: 1600 }} />
          <StatCard icon={Stethoscope} title="Doctors" value={15} a={{ label: "Available Today", value: 14 }} b={{ label: "Unavailable", value: "01" }} />
          <StatCard icon={TrendingUp} title="Follow-up Checkups" value="82%" a={{ label: "Expected", value: 100 }} b={{ label: "Confirmed", value: 82 }} />
        </div>
      </div>
    </AppShell>
  );
}

function DoctorDashboard() {
  const { user } = useUser();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Savannah";
  const today = useMemo(() => getPakistanTodayValue(), []);
  const todayLabel = useMemo(() => formatLongDate(today), [today]);
  const { data: doctorProfile, isLoading: isLoadingDoctorProfile } = useDoctorProfile(user?.role === "doctor" ? user?._id : undefined);
  const doctorProfileId = doctorProfile?._id;
  const { data: rawTodayAppointments = [], isLoading: isLoadingTodayAppointments, isError: todayAppointmentsError } = useDoctorAppointments(doctorProfileId, today, Boolean(user && user.role === "doctor" && doctorProfileId));
  const { data: myAppointments = [], isLoading: isLoadingMyAppointments, isError: myAppointmentsError } = useDoctorAppointments(doctorProfileId, undefined, Boolean(user && user.role === "doctor" && doctorProfileId));
  const todayAppointments = useMemo(
    () => rawTodayAppointments.filter((appointment) => getAppointmentDateValue(appointment) === today),
    [rawTodayAppointments, today],
  );
  const upcomingAppointments = useMemo(() => {
    const todayStart = new Date(`${today}T00:00:00+05:00`).getTime();
    const nextSevenDaysEnd = todayStart + 8 * 24 * 60 * 60 * 1000;
    return myAppointments
      .filter((appointment) => {
        if (["completed", "cancelled", "delayed"].includes(appointment.status ?? "")) return false;
        const appointmentTime = new Date(appointment.estimatedTurnTime ?? appointment.appointmentDate).getTime();
        return appointmentTime >= Date.now() && appointmentTime < nextSevenDaysEnd;
      })
      .sort((a, b) => new Date(a.estimatedTurnTime ?? a.appointmentDate).getTime() - new Date(b.estimatedTurnTime ?? b.appointmentDate).getTime());
  }, [myAppointments, today]);
  const completedToday = todayAppointments.filter((appointment) => appointment.status === "completed").length;
  const remainingToday = todayAppointments.filter((appointment) => !["completed", "cancelled"].includes(appointment.status ?? "")).length;
  const activePatientCount = new Set(myAppointments.map((appointment) => getPatientObject(appointment)?._id).filter(Boolean)).size;

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Good morning, Dr. {displayName}</h1>
        <p className="text-sm text-muted-foreground">{todayLabel} - Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card className="overflow-hidden p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.9fr)]">
              <Link to="/doctors" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-sky-500 p-4 text-primary-foreground transition-transform hover:-translate-y-0.5">
                <ClipboardPenLine className="mb-6 h-6 w-6" />
                <div className="font-semibold">Edit Your Schedule</div>
                <div className="text-xs opacity-90">Click here to update your schedule</div>
                <CalendarCheck className="absolute -right-2 -bottom-2 h-20 w-20 opacity-10" />
              </Link>
              <div className="grid gap-3">
                <Link to="/appointments/new" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary"><CalendarPlus className="h-4 w-4" /></div>
                  <div className="text-sm font-medium">Book a New Appointment</div>
                </Link>
                <Link to="/patients" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary"><UserPlus className="h-4 w-4" /></div>
                  <div className="text-sm font-medium">Register a New Patient</div>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">Today's Patients</h3>
              <p className="text-xs text-muted-foreground">{todayAppointments.length} visited clinic today</p>
            </div>
            <div className="divide-y divide-border">
              {isLoadingDoctorProfile || isLoadingTodayAppointments ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading today's patients...</div>
              ) : todayAppointmentsError ? (
                <div className="py-8 text-center text-sm text-destructive">Unable to load today's patients.</div>
              ) : todayAppointments.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No patients visited today.</div>
              ) : todayAppointments.map((appointment) => (
                <div key={appointment._id} className="grid gap-3 py-3 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center">
                  <div className="w-14 rounded-lg bg-muted px-2 py-1.5 text-center">
                    <div className="text-sm font-bold leading-tight">{getAppointmentTimeParts(appointment).time}</div>
                    <div className="text-[10px] text-muted-foreground">{getAppointmentTimeParts(appointment).period}</div>
                  </div>
                  <div className="flex min-w-0 items-start gap-3">
                    <Avatar initials={getInitials(getPatientName(appointment))} />
                    <div className="min-w-0">
                      <div className="font-medium leading-tight">{getPatientName(appointment)}</div>
                      <div className="truncate text-xs text-muted-foreground">{getPatientCode(appointment)} - {getCheckupName(appointment)}</div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">{getPatientContact(appointment)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <StatusBadge status={formatStatus(appointment.status)} />
                    <Link to="/patients" className="text-xs font-medium text-primary hover:underline">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">Upcoming Appointments</h3>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </div>
            <div className="divide-y divide-border">
              {isLoadingDoctorProfile || isLoadingMyAppointments ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading upcoming appointments...</div>
              ) : myAppointmentsError ? (
                <div className="py-8 text-center text-sm text-destructive">Unable to load upcoming appointments.</div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No upcoming appointments found.</div>
              ) : upcomingAppointments.slice(0, 6).map((appointment) => (
                <div key={appointment._id} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <div className="rounded-lg bg-primary-soft px-2 py-1 text-center text-xs font-semibold text-primary">{getShortDateLabel(appointment)}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{getPatientName(appointment)}</div>
                    <div className="truncate text-xs text-muted-foreground">{getAppointmentTimeLabel(appointment)} - {getSpecialty(appointment)}</div>
                  </div>
                  <StatusBadge status={formatStatus(appointment.status)} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <StatCard icon={CalendarDays} title="Today's Appointments" value={todayAppointments.length} a={{ label: "Completed", value: completedToday }} b={{ label: "Remaining", value: remainingToday }} />
          <StatCard icon={Users} title="Patients" value={activePatientCount} a={{ label: "Visited Today", value: todayAppointments.length }} b={{ label: "With Appointments", value: activePatientCount }} />
          <StatCard icon={CalendarCheck} title="Expected Appointments" value={upcomingAppointments.length} a={{ label: "Expected Today", value: remainingToday }} b={{ label: "Next 7 Days", value: upcomingAppointments.length }} />

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Today's Patient Alerts</h3>
            <div className="space-y-2">
              {todayAppointments.filter((appointment) => appointment.status === "delayed" || appointment.status === "cancelled").length === 0 ? (
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">No appointment alerts for today.</div>
              ) : todayAppointments
                .filter((appointment) => appointment.status === "delayed" || appointment.status === "cancelled")
                .map((appointment) => (
                  <div key={appointment._id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="text-xs font-semibold text-amber-900">{getPatientName(appointment)}</div>
                    <p className="mt-1 text-xs leading-relaxed text-amber-800">Appointment is {formatStatus(appointment.status).toLowerCase()}.</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function buildDoctorStats(appointments: AppointmentRecord[]) {
  const tones = [
    "bg-amber-50 text-amber-700 ring-amber-200",
    "bg-rose-50 text-rose-700 ring-rose-200",
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "bg-sky-50 text-sky-700 ring-sky-200",
    "bg-violet-50 text-violet-700 ring-violet-200",
  ];
  const counts = new Map<string, { name: string; total: number; completed: number }>();

  appointments.forEach((appointment) => {
    const doctorId = getDoctorId(appointment) || getDoctorName(appointment);
    const current = counts.get(doctorId) ?? { name: getDoctorName(appointment), total: 0, completed: 0 };
    current.total += 1;
    if (appointment.status === "completed") current.completed += 1;
    counts.set(doctorId, current);
  });

  return Array.from(counts.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((item, index) => ({
      name: item.name,
      count: `${item.completed} / ${item.total}`,
      tone: tones[index % tones.length],
    }));
}

function getPatientName(appointment: AppointmentRecord) {
  const patient = getPatientObject(appointment);
  return [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}

function getPatientCode(appointment: AppointmentRecord) {
  const patient = getPatientObject(appointment);
  return patient?.patientId ?? appointment._id.slice(-6).toUpperCase();
}

function getPatientObject(appointment: AppointmentRecord) {
  return typeof appointment.patientId === "object" ? appointment.patientId : undefined;
}

function getDoctorId(appointment: AppointmentRecord) {
  return typeof appointment.doctorId === "object" ? appointment.doctorId._id : appointment.doctorId ?? "";
}

function getDoctorName(appointment: AppointmentRecord) {
  const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : undefined;
  const doctorUser = typeof doctor?.userId === "object" ? doctor.userId : undefined;
  const name = [doctorUser?.firstName, doctorUser?.lastName].filter(Boolean).join(" ");
  return name ? `Dr. ${name}` : "Unassigned Doctor";
}

function getSpecialty(appointment: AppointmentRecord) {
  const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : undefined;
  const checkup = typeof appointment.checkupId === "object" ? appointment.checkupId : undefined;
  return doctor?.speciality ?? checkup?.specialityRequired ?? "No specialty";
}

function getCheckupName(appointment: AppointmentRecord) {
  const checkup = typeof appointment.checkupId === "object" ? appointment.checkupId : undefined;
  return checkup?.name ?? getSpecialty(appointment);
}

function getPatientContact(appointment: AppointmentRecord) {
  const contact = typeof appointment.contactId === "object" ? appointment.contactId : undefined;
  return contact?.phone || contact?.whatsappNo || contact?.email || "No contact saved";
}

function getAppointmentTimeLabel(appointment: AppointmentRecord) {
  if (appointment.status === "delayed") return "N/A";
  if (!appointment.estimatedTurnTime) return "-";
  return new Date(appointment.estimatedTurnTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Karachi",
  });
}

function getAppointmentTimeParts(appointment: AppointmentRecord) {
  const label = getAppointmentTimeLabel(appointment);
  const [time = "-", period = ""] = label.split(" ");
  return { time, period };
}

function getShortDateLabel(appointment: AppointmentRecord) {
  return new Date(appointment.estimatedTurnTime ?? appointment.appointmentDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Karachi",
  });
}

function getAppointmentDateValue(appointment: AppointmentRecord) {
  const value = appointment.estimatedTurnTime ?? appointment.appointmentDate;
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Karachi",
  }).formatToParts(new Date(value));
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT";
}

function formatStatus(status?: string) {
  if (!status) return "Pending";
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPakistanTodayValue() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Karachi",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

function formatLongDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({
  icon: Icon,
  title,
  value,
  a,
  b,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  a: { label: string; value: string | number };
  b: { label: string; value: string | number };
}) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
        <div>
          <div className="text-muted-foreground">{a.label}</div>
          {a.value !== "" && <div className="font-semibold text-foreground">{a.value}</div>}
        </div>
        <div className="text-right">
          <div className="text-muted-foreground">{b.label}</div>
          <div className="font-semibold text-foreground">{b.value}</div>
        </div>
      </div>
    </Card>
  );
}
