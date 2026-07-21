import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Avatar, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDoctorProfile } from "@/hooks/useDoctors";
import type { DoctorSchedule, DoctorUser } from "@/services/doctor.service";

export const Route = createFileRoute("/doctors/$id")({
  head: () => ({ meta: [{ title: "Doctor Profile — MediFlow" }] }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const { id } = Route.useParams();
  const { data: doctor, isLoading, isError } = useDoctorProfile(id);
  const [tab, setTab] = useState<"Overview" | "Schedule">("Overview");

  if (isLoading) return <AppShell breadcrumbs={[{ label: "Doctors", to: "/doctors" }, { label: "Doctor Profile" }]}><Card className="p-10 text-center text-sm text-muted-foreground">Loading doctor profile...</Card></AppShell>;
  if (isError || !doctor) return <AppShell breadcrumbs={[{ label: "Doctors", to: "/doctors" }, { label: "Doctor Profile" }]}><Card className="p-10 text-center text-sm text-destructive">Unable to load this doctor profile.</Card></AppShell>;

  const user = typeof doctor.userId === "object" ? doctor.userId as DoctorUser : undefined;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Doctor";

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Doctors", to: "/doctors" }, { label: name }]}>
      <Link to="/doctors" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to Doctors</Link>
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="[&>div]:h-16 [&>div]:w-16 [&>div]:text-base"><Avatar initials={getInitials(name)} src={user?.image} alt={name} /></div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-semibold">{name}</h1><StatusBadge status={doctor.isAvailable === false ? "Inactive" : "Available"} /></div>
              <div className="text-sm text-muted-foreground">{doctor.speciality}</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {user?.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {user.phone}</span>}
                {user?.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</span>}
                {(user?.city || user?.address) && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {[user.address, user.city].filter(Boolean).join(", ")}</span>}
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 px-4 py-3 text-right"><div className="text-xl font-bold">{doctor.averageCheckupTime} min</div><div className="text-xs text-muted-foreground">Average checkup</div></div>
        </div>
      </Card>

      <div className="mt-6 flex gap-1 border-b border-border">
        {(["Overview", "Schedule"] as const).map((value) => <button key={value} onClick={() => setTab(value)} className={cn("relative px-4 py-2 text-sm font-medium", tab === value ? "text-primary" : "text-muted-foreground hover:text-foreground")}>{value}{tab === value && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}</button>)}
      </div>

      {tab === "Overview" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-5"><h2 className="mb-2 text-sm font-semibold">Biography</h2><p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{doctor.biography || "No biography has been added yet."}</p></Card>
          <Card className="p-5"><h2 className="mb-3 text-sm font-semibold">Qualifications</h2>{doctor.qualifications?.length ? <ul className="space-y-2 text-sm">{doctor.qualifications.map((qualification) => <li key={qualification} className="flex gap-2"><span className="text-primary">•</span><span>{qualification}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No qualifications have been added yet.</p>}</Card>
        </div>
      ) : (
        <Card className="mt-6 p-5"><h2 className="mb-3 text-sm font-semibold">Weekly Schedule</h2>{doctor.schedule?.length ? <div className="space-y-2">{doctor.schedule.map((slot) => <ScheduleRow key={`${slot.day}-${slot.startTime}-${slot.endTime}`} slot={slot} />)}</div> : <p className="text-sm text-muted-foreground">No weekly schedule has been configured.</p>}</Card>
      )}
    </AppShell>
  );
}

function ScheduleRow({ slot }: { slot: DoctorSchedule }) {
  return <div className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[140px_1fr]"><span className="font-medium">{slot.day}</span><span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span></div>;
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "DR";
}
