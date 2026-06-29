import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, Avatar } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Search, UserRound, CalendarCheck2, CheckCircle2, Bell, FileText, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { patients, specialties } from "@/lib/mock-data";

export const Route = createFileRoute("/appointments/new")({
  head: () => ({ meta: [{ title: "New Appointment — MediFlow" }] }),
  component: NewAppointmentPage,
});

type Step = 1 | 2 | 3;

function NewAppointmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<(typeof patients)[number] | null>(null);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("Cardiology");
  const [done, setDone] = useState(false);

  const found = query ? patients.filter((p) => p.id.toLowerCase().includes(query.toLowerCase()) || p.name.toLowerCase().includes(query.toLowerCase())) : [];

  if (done) return <Confirmed onBack={() => navigate({ to: "/appointments" })} />;

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Appointments", to: "/appointments" }, { label: "New Appointment" }]}>
      <Link to="/appointments" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Appointments
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Appointment</h1>
        <p className="text-sm text-muted-foreground">Complete the booking flow to schedule an appointment</p>
      </div>

      <Stepper step={step} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <h2 className="text-base font-semibold">Appointment Details</h2>
                <p className="text-sm text-muted-foreground">Select a patient and fill in the appointment details</p>
              </div>
              <div>
                <Label htmlFor="search">Search Patient</Label>
                <div className="mt-1.5 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="P-10051 or name" className="pl-9" />
                  </div>
                  <Button>Search</Button>
                </div>
              </div>

              {query && found.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600">
                    <Search className="h-5 w-5" />
                  </div>
                  <div className="font-semibold">Patient Not Found</div>
                  <p className="mt-1 text-sm text-muted-foreground">No patient found with that ID. Register a new patient?</p>
                  <Button asChild className="mt-3" size="sm"><Link to="/register">Register New Patient</Link></Button>
                </div>
              )}
              {found.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">{found.length} patient(s) found</div>
                  {found.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all",
                        selected?.id === p.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50 hover:bg-muted/40",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar initials={p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)} />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.id} · {p.phone}</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button disabled={!selected} onClick={() => setStep(2)}>Continue <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <h2 className="text-base font-semibold">Appointment Details</h2>
                <p className="text-sm text-muted-foreground">Choose specialty, doctor, time, and reminder</p>
              </div>

              <div>
                <Label>Checkup Type</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {specialties.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpecialty(s)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        specialty === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:border-primary/40",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Doctor</Label>
                  <Input className="mt-1.5" defaultValue="Dr. James Walker" />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" className="mt-1.5" defaultValue="2026-06-15" />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" className="mt-1.5" defaultValue="10:00" />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2"><Bell className="h-3.5 w-3.5" /> Reminder Timing</Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {["15 Minutes Before", "30 Minutes Before", "1 Hour Before", "1 Day Before"].map((r, i) => (
                    <label key={r} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", i === 2 ? "border-primary bg-primary-soft" : "border-border")}>
                      <Checkbox defaultChecked={i === 2} /> {r}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Notification Channel</Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {["SMS", "WhatsApp", "Email", "All"].map((c, i) => (
                    <label key={c} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", i === 2 ? "border-primary bg-primary-soft" : "border-border")}>
                      <Checkbox defaultChecked={i === 2} /> {c}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Reason for Visit</Label>
                <Input className="mt-1.5" defaultValue="Quarterly cardiology follow-up and ECG review" />
              </div>
              <div>
                <Label>Clinical Notes</Label>
                <Textarea className="mt-1.5" placeholder="Add clinical notes..." rows={3} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Go Back</Button>
                <Button onClick={() => setStep(3)}>Review &amp; Confirm <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && selected && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <h2 className="text-base font-semibold">Review &amp; Confirm</h2>
                <p className="text-sm text-muted-foreground">Please review all appointment details before confirming.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ReviewBlock icon={UserIcon} title="Patient" items={[["Name", selected.name], ["Patient ID", selected.id], ["Phone", selected.phone], ["Last Visit", selected.lastVisit]]} />
                <ReviewBlock icon={CalendarCheck2} title="Appointment" items={[["Specialty", specialty], ["Doctor", "Dr. Daniel Cooper"], ["Date", "Monday, June 15, 2026"], ["Time", "10:00 AM"]]} />
                <ReviewBlock icon={Bell} title="Reminders" items={[["Timing", "1 Hour Before"], ["Channel", "Email"]]} />
                <ReviewBlock icon={FileText} title="Notes" items={[["Reason", "Quarterly cardiology follow..."], ["Clinical", "Patient reports occasion..."]]} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4" /> Go Back</Button>
                <Button onClick={() => setDone(true)}>Confirm Booking <CheckCircle2 className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </Card>

        <aside>
          {selected ? (
            <Card className="p-5 sticky top-20">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground"><UserRound className="h-3.5 w-3.5" /> Patient Summary</div>
              <div className="flex flex-col items-center text-center">
                <Avatar initials={selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)} />
                <div className="mt-2 font-semibold">{selected.name}</div>
                <div className="text-xs text-muted-foreground">{selected.id}</div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <SumRow label="Phone" value={selected.phone} />
                <SumRow label="Age" value={String(selected.age)} />
                <SumRow label="Last Visit" value={selected.lastVisit} />
                <SumRow label="Insurance" value="—" />
              </dl>
              <div className="mt-4 rounded-lg bg-primary-soft p-3 text-xs">
                <div className="font-medium text-primary">Upcoming Appointment</div>
                <div className="text-muted-foreground">Tomorrow · 10:00 AM · Dr. Wilson</div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground"><UserRound className="h-6 w-6" /></div>
              <div className="mt-3 font-medium">No Patient Selected</div>
              <p className="text-xs text-muted-foreground">Search and select a patient to view their information.</p>
            </Card>
          )}
        </aside>
      </div>
    </AppShell>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = ["Patient", "Details", "Confirm"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const n = (i + 1) as Step;
        const active = n === step;
        const done = n < step;
        return (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={cn("grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all",
              done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground")}>
              {done ? <CheckCircle2 className="h-4 w-4" /> : n}
            </div>
            <div className={cn("text-sm font-medium", active || done ? "text-foreground" : "text-muted-foreground")}>{s}</div>
            {i < steps.length - 1 && <div className={cn("mx-2 h-px flex-1", done ? "bg-primary" : "bg-border")} />}
          </div>
        );
      })}
    </div>
  );
}

function ReviewBlock({ icon: Icon, title, items }: { icon: React.ComponentType<{ className?: string }>; title: string; items: [string, string][] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Icon className="h-4 w-4 text-primary" /> {title}</div>
      <dl className="space-y-1.5 text-sm">
        {items.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Confirmed({ onBack }: { onBack: () => void }) {
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Appointments", to: "/appointments" }, { label: "Confirmation" }]}>
      <div className="mx-auto max-w-xl">
        <Card className="p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Appointment Booked!</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your appointment has been successfully scheduled.</p>
          <div className="mt-5 grid gap-2 rounded-xl border border-border bg-muted/30 p-4 text-left text-sm">
            <Row k="Appointment ID" v="APT-5012" />
            <Row k="Doctor" v="Dr. Daniel Cooper" />
            <Row k="Specialty" v="General Consultation" />
            <Row k="Date" v="Monday, June 15, 2026" />
            <Row k="Time" v="10:00 AM" />
            <Row k="Reminders" v="1 Hour Before · Email" />
          </div>
          <div className="mt-5 flex justify-center gap-2">
            <Button variant="outline" onClick={onBack}>View Appointments</Button>
            <Button onClick={onBack}>Book Another</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}