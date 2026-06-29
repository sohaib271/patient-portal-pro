import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "./patient";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/app-shell";
import { doctors } from "@/lib/mock-data";

export const Route = createFileRoute("/patient/doctors")({
  head: () => ({ meta: [{ title: "My Doctors — MediFlow" }] }),
  component: () => (
    <PatientShell breadcrumbs={[{ label: "Dashboard", to: "/patient/dashboard" }, { label: "My Doctors" }]}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">My Doctors</h1>
      <p className="mb-6 text-sm text-muted-foreground">Your care team</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => (
          <Card key={d.id} className="p-5 hover:border-primary/40 hover:shadow-md transition-all">
            <div className="flex items-center gap-3"><Avatar initials={d.id} /><div><div className="font-semibold">{d.name}</div><div className="text-xs text-muted-foreground">{d.specialty}</div></div></div>
            <div className="mt-3 text-xs text-muted-foreground">Next available: <span className="font-medium text-foreground">{d.next}</span></div>
          </Card>
        ))}
      </div>
    </PatientShell>
  ),
});