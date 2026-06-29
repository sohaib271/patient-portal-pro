import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell, StatusBadge, Avatar } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { appointments } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Appointments — MediFlow" }] }),
  component: AppointmentsLayout,
});

function AppointmentsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/appointments") return <Outlet />;
  return <AppointmentsList />;
}

const tabs = ["All", "Scheduled", "Confirmed", "Pending", "Completed", "Cancelled", "No-show"] as const;

function AppointmentsList() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const filtered = tab === "All" ? appointments : appointments.filter((a) => a.status === tab);
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Appointments" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">{appointments.length} total appointments</p>
        </div>
        <Button asChild>
          <Link to="/appointments/new"><Plus className="h-4 w-4" /> New Appointment</Link>
        </Button>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by patient name, ID, or doctor..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm"><SlidersHorizontal className="h-4 w-4" /> Filter</Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1 border-b border-border">
          {tabs.map((t) => {
            const count = t === "All" ? appointments.length : appointments.filter((a) => a.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t} <span className="ml-1 text-xs opacity-70">{count}</span>
                {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">APT ID</th>
                <th className="py-3 pr-4">Patient</th>
                <th className="py-3 pr-4">Doctor</th>
                <th className="py-3 pr-4">Specialty</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Time</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr key={a.id} className="group hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4 font-medium text-primary">{a.id}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={a.patient.split(" ").map((n) => n[0]).join("").slice(0, 2)} />
                      <div>
                        <div className="font-medium">{a.patient}</div>
                        <div className="text-xs text-muted-foreground">{a.pid}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{a.doctor}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{a.specialty}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{a.date}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{a.time}</td>
                  <td className="py-3 pr-4"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}