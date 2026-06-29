import { createFileRoute, Link } from "@tanstack/react-router";
import { PatientShell } from "./patient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app-shell";
import { Plus, CalendarCheck, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/patient/dashboard")({
  head: () => ({ meta: [{ title: "My Portal — MediFlow" }] }),
  component: PatientDashboard,
});

function PatientDashboard() {
  return (
    <PatientShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, Jacob</h1>
        <p className="text-sm text-muted-foreground">Here is a summary of your health portal today.</p>
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
          <div className="mt-3 rounded-lg bg-primary-soft p-3 text-sm">
            <div className="font-medium text-primary">Tomorrow · 10:00 AM</div>
            <div className="text-xs text-muted-foreground">Dr. Wilson · Cardiology</div>
          </div>
          <Button asChild variant="outline" className="mt-3 w-full"><Link to="/patient/appointments">View all</Link></Button>
        </Card>
      </div>
      <Card className="mt-6 p-5">
        <h3 className="text-sm font-semibold mb-3">My Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase text-muted-foreground"><th className="py-2 pr-4">Appt ID</th><th className="py-2 pr-4">Doctor</th><th className="py-2 pr-4">Reason</th><th className="py-2 pr-4">Date</th><th className="py-2 pr-4">Time</th><th className="py-2 pr-4">Status</th></tr></thead>
            <tbody className="divide-y divide-border">
              {[{ id: "APT-5001", d: "Dr. Sarah Jenkins · Cardiology", r: "Quarterly cardiology follow-up", dt: "Jul 24, 2026", tm: "10:30 AM", s: "Confirmed" }, { id: "APT-5002", d: "Dr. James John · General Practice", r: "Medication review", dt: "Aug 02, 2026", tm: "4:30 PM", s: "Confirmed" }].map((a) => (
                <tr key={a.id} className="hover:bg-muted/40"><td className="py-3 pr-4 font-medium text-primary">{a.id}</td><td className="py-3 pr-4">{a.d}</td><td className="py-3 pr-4 text-muted-foreground">{a.r}</td><td className="py-3 pr-4 text-muted-foreground">{a.dt}</td><td className="py-3 pr-4 text-muted-foreground">{a.tm}</td><td className="py-3 pr-4"><StatusBadge status={a.s} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PatientShell>
  );
}