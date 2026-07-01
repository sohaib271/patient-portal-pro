import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, UserPlus, CalendarCheck, Users, Stethoscope, CalendarRange, TrendingUp, Search } from "lucide-react";
import { appointments } from "@/lib/mock-data";
import { useUser } from "@/hooks/useUser";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MediFlow" }] }),
  component: Dashboard,
});

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
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <div>
          <div className="text-muted-foreground">{a.label}</div>
          <div className="font-semibold text-foreground">{a.value}</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground">{b.label}</div>
          <div className="font-semibold text-foreground">{b.value}</div>
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  const { user } = useUser();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Staff";
  const docs: { name: string; count: string; tone: string }[] = [
    { name: "Dr. James Brown", count: "32 / 43", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
    { name: "Dr. James Brown", count: "27 / 38", tone: "bg-rose-50 text-rose-700 ring-rose-200" },
    { name: "Dr. Emily Lopez", count: "21 / 25", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
    { name: "Dr. Amanda John", count: "2 / 18", tone: "bg-sky-50 text-sky-700 ring-sky-200" },
    { name: "Dr. Sarah Mitchell", count: "2 / 4", tone: "bg-violet-50 text-violet-700 ring-violet-200" },
  ];
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Good morning, {displayName}</h1>
        <p className="text-sm text-muted-foreground">Wednesday, June 10, 2026 — Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link to="/appointments/new" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-sky-500 p-4 text-primary-foreground transition-transform hover:-translate-y-0.5">
                <Plus className="mb-6 h-6 w-6" />
                <div className="font-semibold">Book a New Appointment</div>
                <div className="text-xs opacity-90">5 appointments scheduled for today</div>
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
                <p className="text-xs text-muted-foreground">5 appointments scheduled</p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by name or ID..." className="pl-9 h-9 w-56" />
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {docs.map((d, i) => (
                <span key={i} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${d.tone}`}>
                  {d.name} <span className="opacity-70">{d.count}</span>
                </span>
              ))}
            </div>
            <div className="divide-y divide-border">
              {appointments.slice(0, 5).map((a) => (
                <div key={a.id} className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <div className="text-sm font-medium text-muted-foreground">{a.time}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{a.patient}</div>
                    <div className="truncate text-xs text-muted-foreground">{a.id} · Dr. {a.doctor.split(" ").slice(-1)} · {a.specialty}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <StatCard icon={CalendarCheck} title="Today's Appointments" value={24} a={{ label: "Completed", value: 14 }} b={{ label: "Remaining", value: 10 }} />
          <StatCard icon={Users} title="Patients" value={1740} a={{ label: "Registered this Month", value: 140 }} b={{ label: "Older than 1 month", value: 1600 }} />
          <StatCard icon={Stethoscope} title="Doctors" value={15} a={{ label: "Available Today", value: 14 }} b={{ label: "Unavailable", value: "01" }} />
          <StatCard icon={TrendingUp} title="Follow-up Checkups" value="82%" a={{ label: "Expected", value: 100 }} b={{ label: "Confirmed", value: 82 }} />
        </div>
      </div>
    </AppShell>
  );
}
