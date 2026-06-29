import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Avatar, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Phone, Mail, MapPin, ShieldAlert, CalendarDays } from "lucide-react";
import { patients } from "@/lib/mock-data";

export const Route = createFileRoute("/patients/$id")({
  head: () => ({ meta: [{ title: "Patient Profile — MediFlow" }] }),
  component: PatientProfile,
});

function PatientProfile() {
  const { id } = Route.useParams();
  const p = patients.find((x) => x.id === id) ?? patients[0];

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Patients", to: "/patients" }, { label: "Patient Profile" }]}>
      <Link to="/patients" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </Link>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Patient Profile</h1>
        <p className="text-sm text-muted-foreground">Check patient details and history</p>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar initials={p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)} />
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold">{p.name}</div>
              <div className="truncate text-xs text-muted-foreground">{p.id} · {p.age} years · {p.gender} · Blood Type: O+</div>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button asChild><Link to="/appointments/new"><Plus className="h-4 w-4" /> Book Appointment</Link></Button>
            <Button variant="outline"><Pencil className="h-4 w-4" /> Edit</Button>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Contact Information</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><div className="text-xs text-muted-foreground">Phone</div><div className="font-medium">{p.phone}</div></div></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><div className="text-xs text-muted-foreground">Email</div><div className="font-medium">{p.email}</div></div></li>
            <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><div className="text-xs text-muted-foreground">Address</div><div className="font-medium">245 Oak Street, Springfield, IL 62701</div></div></li>
            <li className="flex gap-3"><ShieldAlert className="h-4 w-4 mt-0.5 text-rose-500" /><div><div className="text-xs text-muted-foreground">Emergency Contact</div><div className="font-medium">Mary Anderson · +1 (555) 234-8913</div></div></li>
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Insurance &amp; Medical</h3>
          <dl className="space-y-3 text-sm">
            <Row k="Insurance Provider" v="BlueCross BlueShield" />
            <Row k="Insurance ID" v="BCB-447821" />
            <Row k="Blood Type" v="O+" />
            <Row k="Date of Birth" v="1977-03-14" />
            <Row k="Patient Since" v="2023-08-10" />
          </dl>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Appointment History</h3>
          <ol className="relative space-y-4 border-l border-border pl-5">
            {[{ s: "Scheduled", t: "Cardiology · APT-5008", d: "Dr. James Walker", when: "Jun 12, 2026 · 2:00 PM", note: "Cardiology referral — new onset chest pain evaluation" }, { s: "Scheduled", t: "General Practice · APT-5003", d: "Dr. Daniel Cooper", when: "Jun 10, 2026 · 11:00 AM", note: "Annual physical examination and blood pressure check" }].map((a) => (
              <li key={a.t} className="relative">
                <span className="absolute -left-[26px] top-1 grid h-5 w-5 place-items-center rounded-full bg-primary-soft text-primary"><CalendarDays className="h-3 w-3" /></span>
                <div className="rounded-lg border border-border p-3 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between gap-2"><div className="text-sm font-semibold">{a.t}</div><StatusBadge status={a.s} /></div>
                  <div className="text-xs text-muted-foreground">{a.d}</div>
                  <div className="text-xs text-muted-foreground">{a.when}</div>
                  <p className="mt-2 text-xs">{a.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h3 className="mb-4 text-sm font-semibold">Visit Summary</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[{ v: "2", l: "Total Visits" }, { v: "2", l: "Completed" }, { v: "0", l: "Cancelled" }, { v: "2026-05-22", l: "Last Visit" }].map((x) => (
            <div key={x.l} className="rounded-xl border border-border bg-muted/30 p-4 text-center">
              <div className="text-2xl font-bold">{x.v}</div>
              <div className="text-xs text-muted-foreground">{x.l}</div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="text-sm font-medium text-right">{v}</dd>
    </div>
  );
}