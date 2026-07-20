import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  CalendarDays,
  Users,
  Stethoscope,
  CalendarClock,
  Bell,
  Settings as SettingsIcon,
  Search,
  Plus,
  ChevronRight,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useDoctorProfile } from "@/hooks/useDoctors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const adminNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/follow-ups", label: "Follow-ups", icon: CalendarClock },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const doctorNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/appointments", label: "My Appointments", icon: CalendarDays },
  { to: "/follow-ups", label: "My Follow-ups", icon: CalendarClock },
  { to: "/patients", label: "My Patients", icon: Users },
  { to: "/doctors", label: "My Schedule", icon: CalendarClock },
];

export function Logo({ collapsed }: { collapsed?: boolean }) {
  const { user } = useUser();
  const homeRoute = user?.role === "patient" ? "/patient/dashboard" : "/dashboard";

  return (
    <Link to={homeRoute} className="flex items-center gap-2 px-1">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Plus className="h-5 w-5" strokeWidth={3} />
      </div>
      {!collapsed && <span className="text-lg font-semibold tracking-tight text-foreground">MediFlow</span>}
    </Link>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export function AppShell({
  children,
  breadcrumbs,
}: {
  children: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useUser();
  const userId = user?._id;
  const { data: doctorProfile } = useDoctorProfile(user?.role === "doctor" ? userId : undefined);
  const staffName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Staff";
  const staffInitials = staffName.split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase();
  const staffRole = user?.role ? user.role.replace(/^\w/, (letter: string) => letter.toUpperCase()) : "Staff";
  const staffSubtitle = user?.role === "doctor" ? doctorProfile?.speciality ?? "Doctor" : staffRole;
  const nav = user?.role === "doctor" ? doctorNav : adminNav;
  const portalLabel = user?.role === "doctor" ? "DOCTOR PORTAL" : "RECEPTION PORTAL";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Logo collapsed={collapsed} />
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-xl border border-sidebar-border bg-muted/40 px-3 py-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">Greenway Clinic</div>
              <div className="truncate text-xs text-muted-foreground">775 Rolling Green Rd.</div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-muted/60 hover:text-sidebar-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {!collapsed && (
            <div className="mb-2 px-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
              {portalLabel}
            </div>
          )}
          <div className={cn("flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60", collapsed && "justify-center")}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-sky-400 text-xs font-bold text-primary-foreground">
              {staffInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">{staffName}</div>
                <div className="truncate text-xs text-muted-foreground">{staffSubtitle}</div>
              </div>
            )}
          </div>
          <LogoutConfirmButton collapsed={collapsed} />
        </div>
      </aside>

      {/* Backdrop mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]",
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          </div>
          <div className="relative hidden sm:block w-72 max-w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search patient, ID, or doctor..." className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background" />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <SettingsIcon className="h-4 w-4" />
          </Button>
          <LogoutConfirmButton iconOnly />
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

export function LogoutConfirmButton({ collapsed, iconOnly }: { collapsed?: boolean; iconOnly?: boolean }) {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate({ to: "/login" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {iconOnly || collapsed ? (
          <Button variant="ghost" size="icon" className={cn("rounded-full text-muted-foreground hover:text-destructive", collapsed && "mt-2")} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" className="mt-2 w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log out?</AlertDialogTitle>
          <AlertDialogDescription>
            Your current session will end and you will need to sign in again to access the portal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isLoggingOut ? "Logging out..." : "Log out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
    Booked: "bg-sky-50 text-sky-700 ring-sky-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "In Progress": "bg-violet-50 text-violet-700 ring-violet-200",
    Completed: "bg-slate-100 text-slate-700 ring-slate-200",
    Delayed: "bg-orange-50 text-orange-700 ring-orange-200",
    Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
    "No-show": "bg-rose-50 text-rose-700 ring-rose-200",
    Available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Busy: "bg-amber-50 text-amber-700 ring-amber-200",
    "Off Today": "bg-slate-100 text-slate-600 ring-slate-200",
    Sent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Failed: "bg-rose-50 text-rose-700 ring-rose-200",
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", map[status] ?? "bg-slate-100 text-slate-700 ring-slate-200")}>
      {status}
    </span>
  );
}

export function Avatar({ initials, tone = "sky" }: { initials: string; tone?: "sky" | "rose" | "amber" | "emerald" | "violet" }) {
  const tones: Record<string, string> = {
    sky: "bg-sky-100 text-sky-700",
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold", tones[tone])}>
      {initials}
    </div>
  );
}
