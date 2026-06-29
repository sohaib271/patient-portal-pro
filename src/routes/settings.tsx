import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Bell, Users } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — MediFlow" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [section, setSection] = useState<"clinic" | "reminders" | "users">("clinic");
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Settings" }, { label: section === "clinic" ? "Clinic Information" : section === "reminders" ? "Reminder Config" : "User Management" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage clinic settings, notifications, and team access</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Card className="p-2 h-fit">
          {[{ k: "clinic", l: "Clinic Information", i: Building2 }, { k: "reminders", l: "Reminder Config", i: Bell }, { k: "users", l: "User Management", i: Users }].map((s) => {
            const Icon = s.i;
            const active = section === s.k;
            return (
              <button key={s.k} onClick={() => setSection(s.k as typeof section)} className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted")}>
                <Icon className="h-4 w-4" /> {s.l}
              </button>
            );
          })}
        </Card>

        <Card className="p-6 animate-in fade-in duration-200">
          {section === "clinic" && <ClinicInfo />}
          {section === "reminders" && <ReminderConfig />}
          {section === "users" && <UserManagement />}
        </Card>
      </div>
    </AppShell>
  );
}

function ClinicInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Clinic Information</h2>
        <p className="text-sm text-muted-foreground">Update your clinic's details and contact information.</p>
      </div>
      <div>
        <div className="mb-3 text-sm font-semibold">Basic Information</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Clinic Name" defaultValue="Greenway Medical Clinic" />
          <Field label="Tax ID / NPI" defaultValue="1234567890" />
          <Field label="Founded Year" defaultValue="2014" />
          <Field label="Timezone" defaultValue="America/Chicago (CST)" />
        </div>
      </div>
      <div>
        <div className="mb-3 text-sm font-semibold">Contact &amp; Location</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone Number" defaultValue="+1 (555) 800-1000" />
          <Field label="Email Address" defaultValue="contact@carepoint.clinic" />
          <Field label="Website" defaultValue="www.carepoint.clinic" />
          <Field label="Fax Number" defaultValue="+1 (555) 800-1001" />
          <div className="sm:col-span-2"><Field label="Street Address" defaultValue="500 Medical Plaza Drive, Suite 200, Springfield, IL 62701" /></div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

function ReminderConfig() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Reminder Configuration</h2>
        <p className="text-sm text-muted-foreground">Choose default reminder timings and channels.</p>
      </div>
      <Field label="Default Timing" defaultValue="1 Hour Before" />
      <Field label="Default Channel" defaultValue="Email" />
    </div>
  );
}

function UserManagement() {
  const users = [
    { i: "JJ", n: "Jacob Jones", e: "andreas@gmail.com", r: "Doctor", s: "Active", t: "Jun 11, 7:50 AM" },
    { i: "JW", n: "Jenny Wilson", e: "steven@gmail.com", r: "Doctor", s: "Inactive", t: "Jun 10, 10:35 AM" },
    { i: "CW", n: "Cameron Will", e: "gerad@gmail.com", r: "Nurse", s: "Active", t: "Jun 12, 1:15 PM" },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div><h2 className="text-lg font-semibold">User Management</h2><p className="text-sm text-muted-foreground">Manage team members and access.</p></div>
        <Button>+ Add User</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"><th className="py-3 pr-4">User</th><th className="py-3 pr-4">Email</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Last Active</th></tr></thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.n} className="hover:bg-muted/40">
                <td className="py-3 pr-4"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">{u.i}</span><span className="font-medium">{u.n}</span></div></td>
                <td className="py-3 pr-4 text-muted-foreground">{u.e}</td>
                <td className="py-3 pr-4">{u.r}</td>
                <td className="py-3 pr-4"><span className={cn("rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", u.s === "Active" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200")}>{u.s}</span></td>
                <td className="py-3 pr-4 text-muted-foreground">{u.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="mt-1" defaultValue={defaultValue} />
    </div>
  );
}