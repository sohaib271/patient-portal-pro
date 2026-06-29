import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Avatar, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Phone, Mail, Clock } from "lucide-react";
import { doctors } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doctors/$id")({
  head: () => ({ meta: [{ title: "Doctor Profile — MediFlow" }] }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const { id } = Route.useParams();
  const d = doctors.find((x) => x.id === id) ?? doctors[0];
  const [tab, setTab] = useState<"Overview" | "Schedule" | "Availability">("Overview");

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Doctors", to: "/doctors" }, { label: "Doctor Profile" }]}>
      <Link to="/doctors" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Doctors
      </Link>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Doctor Profile</h1>
        <p className="text-sm text-muted-foreground">Check doctor details and appointments</p>
      </div>
      <Card className="p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar initials={d.id} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><span className="text-lg font-semibold">{d.name}</span><StatusBadge status={d.status} /></div>
              <div className="text-xs text-muted-foreground">{d.specialty}</div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> +1 (555) 900-1102</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {d.id.toLowerCase()}@clinic.com</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Next: {d.next}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{d.todays}</div>
            <div className="text-xs text-muted-foreground">Today's appointments</div>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex gap-1 border-b border-border">
        {(["Overview", "Schedule", "Availability"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("relative px-4 py-2 text-sm font-medium", tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            {t}
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-2 text-sm font-semibold">Biography</h3>
            <p className="text-sm text-muted-foreground">{d.name} specializes in {d.specialty.toLowerCase()} with a focus on patient-centered care and modern diagnostic methods.</p>
            <h3 className="mt-5 mb-2 text-sm font-semibold">Qualifications</h3>
            <ul className="space-y-1.5 text-sm">
              <li className="flex gap-2"><span className="text-primary">•</span> MD, University of Pennsylvania</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Residency — UCSF Medical Center</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Board Certified</li>
            </ul>
          </Card>
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Appointments</h3>
              <a className="text-xs font-medium text-primary hover:underline" href="#">View all</a>
            </div>
            <div className="space-y-3">
              {[{ n: "Jennifer Brooks", d: "2026-06-11 · 10:30 AM", s: "Scheduled" }, { n: "Bessie Cooper", d: "2026-06-10 · 10:00 AM", s: "Confirmed" }, { n: "Savannah Nguyen", d: "2026-06-08 · 09:30 AM", s: "Confirmed" }, { n: "Darlene Robertson", d: "2026-06-04 · 09:00 AM", s: "Confirmed" }].map((a) => (
                <div key={a.n} className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-primary/40 transition-colors">
                  <div><div className="text-sm font-medium">{a.n}</div><div className="text-xs text-muted-foreground">{a.d}</div></div>
                  <StatusBadge status={a.s} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab !== "Overview" && (
        <Card className="mt-6 p-5">
          <h3 className="mb-3 text-sm font-semibold">Weekly Availability</h3>
          <div className="space-y-2">
            {[["Monday", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"], ["Tuesday", "9:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"], ["Wednesday", "10:00 AM", "11:00 AM", "3:00 PM"], ["Thursday", "9:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"], ["Friday", "9:00 AM", "10:00 AM"]].map(([day, ...slots]) => (
              <div key={day} className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border p-3">
                <div className="text-sm font-medium">{day}</div>
                <div className="flex flex-wrap gap-2">{slots.map((s) => <span key={s} className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">{s}</span>)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AppShell>
  );
}