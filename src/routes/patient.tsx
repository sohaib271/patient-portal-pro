import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { CalendarDays, LayoutGrid, Plus, Stethoscope, PanelLeftOpen, Bell, Settings as SettingsIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo, Breadcrumbs, LogoutConfirmButton } from "@/components/app-shell";
import { useUser } from "@/hooks/useUser";

export const Route = createFileRoute("/patient")({
  component: PatientLayout,
});

const nav = [
  { to: "/patient/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/patient/appointments", label: "My Appointments", icon: CalendarDays },
  { to: "/patient/book", label: "Book Appointment", icon: Plus },
  { to: "/patient/doctors", label: "My Doctors", icon: Stethoscope },
];

function PatientLayout() {
  return <Outlet />;
}

export function PatientShell({ children, breadcrumbs }: { children: ReactNode; breadcrumbs?: { label: string; to?: string }[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useUser();
  const patientName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Patient";
  const initials = patientName.split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase();
  const gender = user?.gender === "F" ? "Female" : user?.gender === "M" ? "Male" : "Patient";
  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar transition-transform", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="px-4 py-4"><Logo /></div>
        <nav className="flex-1 px-3 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-muted/60")}>
                <Icon className={cn("h-[18px] w-[18px]", active && "text-primary")} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 px-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">PATIENT PORTAL</div>
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-sky-400 text-xs font-bold text-primary-foreground">{initials}</div>
            <div><div className="text-sm font-semibold">{patientName}</div><div className="text-xs text-muted-foreground">{gender}</div></div>
          </div>
          <LogoutConfirmButton />
        </div>
      </aside>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"><PanelLeftOpen className="h-5 w-5" /></button>
          <div className="flex-1">{breadcrumbs && <Breadcrumbs items={breadcrumbs} />}</div>
          <div className="relative hidden sm:block w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-9 bg-muted/50 border-transparent" />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full"><SettingsIcon className="h-4 w-4" /></Button>
          <LogoutConfirmButton iconOnly />
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 animate-in fade-in duration-300">{children}</main>
      </div>
    </div>
  );
}
