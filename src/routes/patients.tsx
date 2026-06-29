import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell, Avatar } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { patients } from "@/lib/mock-data";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patients — MediFlow" }] }),
  component: PatientsLayout,
});

function PatientsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/patients") return <Outlet />;
  return <PatientsList />;
}

function PatientsList() {
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Patients" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">1740 registered patients</p>
        </div>
        <Button asChild><Link to="/register"><Plus className="h-4 w-4" /> Register Patient</Link></Button>
      </div>
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, ID, or phone..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm"><SlidersHorizontal className="h-4 w-4" /> Filter</Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Patient ID</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Age</th>
                <th className="py-3 pr-4">Gender</th>
                <th className="py-3 pr-4">Phone Number</th>
                <th className="py-3 pr-4">Last Visit</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4 font-medium text-primary"><Link to="/patients/$id" params={{ id: p.id }}>{p.id}</Link></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)} />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.age}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.gender}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.phone}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.lastVisit}</td>
                  <td className="py-3 pr-4"><Link to="/appointments/new" className="text-sm font-medium text-primary hover:underline">Book Appointment</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}