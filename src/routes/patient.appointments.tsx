import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "./patient";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/app-shell";

export const Route = createFileRoute("/patient/appointments")({
  head: () => ({ meta: [{ title: "My Appointments — MediFlow" }] }),
  component: () => (
    <PatientShell breadcrumbs={[{ label: "Dashboard", to: "/patient/dashboard" }, { label: "My Appointments" }]}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">My Appointments</h1>
      <p className="mb-6 text-sm text-muted-foreground">Past and upcoming visits</p>
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase text-muted-foreground"><th className="py-2 pr-4">Appt ID</th><th className="py-2 pr-4">Doctor</th><th className="py-2 pr-4">Reason</th><th className="py-2 pr-4">Date</th><th className="py-2 pr-4">Time</th><th className="py-2 pr-4">Status</th></tr></thead>
            <tbody className="divide-y divide-border">
              {[{ id: "APT-5001", d: "Dr. Sarah Jenkins · Cardiology", r: "Quarterly cardiology follow-up", dt: "Jul 24, 2026", tm: "10:30 AM", s: "Confirmed" }, { id: "APT-5002", d: "Dr. James John · General Practice", r: "Medication review", dt: "Aug 02, 2026", tm: "4:30 PM", s: "Confirmed" }, { id: "APT-4998", d: "Dr. Emma Roberts · Dermatology", r: "Routine checkup", dt: "May 30, 2026", tm: "9:00 AM", s: "Completed" }].map((a) => (
                <tr key={a.id} className="hover:bg-muted/40"><td className="py-3 pr-4 font-medium text-primary">{a.id}</td><td className="py-3 pr-4">{a.d}</td><td className="py-3 pr-4 text-muted-foreground">{a.r}</td><td className="py-3 pr-4 text-muted-foreground">{a.dt}</td><td className="py-3 pr-4 text-muted-foreground">{a.tm}</td><td className="py-3 pr-4"><StatusBadge status={a.s} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PatientShell>
  ),
});