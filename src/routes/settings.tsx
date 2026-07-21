import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Bell, Users, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClinicSettingsService } from "@/services/clinic-settings.service";

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
  const [form, setForm] = useState({
    clinicName: "",
    phoneNumber: "",
    emailAddress: "",
    website: "",
    address: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    ClinicSettingsService.getSettings().then((response) => {
      setForm({
        clinicName: response.settings?.clinicName ?? "",
        phoneNumber: response.settings?.phoneNumber ?? "",
        emailAddress: response.settings?.emailAddress ?? "",
        website: response.settings?.website ?? "",
        address: response.settings?.address ?? "",
      });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await ClinicSettingsService.updateSettings(form, logoFile ?? undefined);
      setMessage("Clinic settings saved successfully.");
      setLogoFile(null);
    } catch (error) {
      setMessage("Unable to save clinic settings right now.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Clinic Information</h2>
        <p className="text-sm text-muted-foreground">Update your clinic's details and contact information.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 rounded-lg border border-dashed border-border p-4">
          <div className="mb-2 text-sm font-semibold">Clinic Logo</div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            <Upload className="mb-2 h-5 w-5" />
            <span>Upload clinic logo</span>
            <input type="file" accept="image/*" className="hidden" onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)} />
          </label>
        </div>
        <Field label="Clinic Name" value={form.clinicName} onChange={(value) => setForm((current) => ({ ...current, clinicName: value }))} />
        <Field label="Phone Number" value={form.phoneNumber} onChange={(value) => setForm((current) => ({ ...current, phoneNumber: value }))} />
        <Field label="Email Address" value={form.emailAddress} onChange={(value) => setForm((current) => ({ ...current, emailAddress: value }))} />
        <Field label="Website" value={form.website} onChange={(value) => setForm((current) => ({ ...current, website: value }))} />
        <div className="md:col-span-2"><Field label="Street Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} /></div>
      </div>
      {message ? <p className="text-sm text-primary">{message}</p> : null}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={() => setForm({ clinicName: "", phoneNumber: "", emailAddress: "", website: "", address: "" })}>Reset</Button>
        <Button type="button" onClick={handleSave} disabled={saving || loading}>{saving ? "Saving..." : "Save Changes"}</Button>
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

function Field({ label, value, defaultValue, onChange }: { label: string; value?: string; defaultValue?: string; onChange?: (value: string) => void }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="mt-1" value={value ?? defaultValue ?? ""} onChange={(event) => onChange?.(event.target.value)} />
    </div>
  );
}