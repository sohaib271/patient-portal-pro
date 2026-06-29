import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell, Avatar, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { doctors } from "@/lib/mock-data";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "Doctors — MediFlow" }] }),
  component: DoctorsLayout,
});

function DoctorsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/doctors") return <Outlet />;
  return <DoctorsList />;
}

function DoctorsList() {
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Doctors" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
        <p className="text-sm text-muted-foreground">5 medical staff registered</p>
      </div>
      <Card className="p-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, ID, or phone..." className="pl-9" />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Doctor</th>
                <th className="py-3 pr-4">Specialty</th>
                <th className="py-3 pr-4">Next Available</th>
                <th className="py-3 pr-4">Today's Appts</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={d.id} />
                      <div className="font-medium">{d.name}</div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{d.specialty}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{d.next}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{d.todays}</td>
                  <td className="py-3 pr-4"><StatusBadge status={d.status} /></td>
                  <td className="py-3 pr-4"><Link to="/doctors/$id" params={{ id: d.id }} className="text-sm font-medium text-primary hover:underline">View Profile</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}