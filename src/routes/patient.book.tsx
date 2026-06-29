import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PatientShell } from "./patient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, CheckCircle2, Users, User as UserIcon, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { specialties, doctors } from "@/lib/mock-data";

export const Route = createFileRoute("/patient/book")({
  head: () => ({ meta: [{ title: "Book Appointment — MediFlow" }] }),
  component: PatientBook,
});

function PatientBook() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [who, setWho] = useState<"Self" | "Relative">("Self");
  const [relative, setRelative] = useState({ first: "", last: "", age: "", gender: "Male", city: "", relation: "Parent" });
  const [specialty, setSpecialty] = useState("Cardiology");
  const [doctor, setDoctor] = useState(doctors[0].id);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <PatientShell breadcrumbs={[{ label: "Dashboard", to: "/patient/dashboard" }, { label: "Book" }, { label: "Confirmation" }]}>
        <div className="mx-auto max-w-xl">
          <Card className="p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold">Appointment Confirmed!</h2>
            <p className="mt-1 text-sm text-muted-foreground">We've scheduled your appointment for {who === "Self" ? "you" : `${relative.first} ${relative.last}`}.</p>
            <div className="mt-5 flex justify-center gap-2">
              <Button variant="outline" onClick={() => navigate({ to: "/patient/appointments" })}>View Appointments</Button>
              <Button onClick={() => { setDone(false); setStep(1); }}>Book Another</Button>
            </div>
          </Card>
        </div>
      </PatientShell>
    );
  }

  return (
    <PatientShell breadcrumbs={[{ label: "Dashboard", to: "/patient/dashboard" }, { label: "Book Appointment" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Book Appointment</h1>
        <p className="text-sm text-muted-foreground">Schedule a visit in a few quick steps</p>
      </div>

      {/* Stepper */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <div className={cn("grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all",
              n < step ? "bg-primary text-primary-foreground" : n === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground")}>
              {n < step ? <CheckCircle2 className="h-4 w-4" /> : n}
            </div>
            <div className={cn("text-sm font-medium", n <= step ? "text-foreground" : "text-muted-foreground")}>
              {["For Whom", "Details", "Confirm"][i]}
            </div>
            {i < 2 && <div className={cn("mx-2 h-px flex-1", n < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-semibold">Who is this appointment for?</h2>
              <p className="text-sm text-muted-foreground">Choose whether this booking is for you or a relative.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { v: "Self" as const, icon: UserIcon, t: "For Myself", d: "Use your existing patient profile" },
                { v: "Relative" as const, icon: HeartHandshake, t: "For a Relative", d: "Add basic details about the patient" },
              ]).map((o) => {
                const Icon = o.icon;
                const active = who === o.v;
                return (
                  <button key={o.v} onClick={() => setWho(o.v)} className={cn("group relative rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5",
                    active ? "border-primary bg-primary-soft ring-2 ring-primary/20" : "border-border hover:border-primary/40")}>
                    <div className={cn("grid h-10 w-10 place-items-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-3 font-semibold">{o.t}</div>
                    <div className="text-xs text-muted-foreground">{o.d}</div>
                    {active && <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>

            {who === "Relative" && (
              <div className="rounded-xl border border-border bg-muted/30 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-primary" /> Relative's Information</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label>First name</Label><Input className="mt-1.5" value={relative.first} onChange={(e) => setRelative({ ...relative, first: e.target.value })} /></div>
                  <div><Label>Last name</Label><Input className="mt-1.5" value={relative.last} onChange={(e) => setRelative({ ...relative, last: e.target.value })} /></div>
                  <div><Label>Age</Label><Input type="number" className="mt-1.5" value={relative.age} onChange={(e) => setRelative({ ...relative, age: e.target.value })} /></div>
                  <div><Label>City</Label><Input className="mt-1.5" value={relative.city} onChange={(e) => setRelative({ ...relative, city: e.target.value })} /></div>
                  <div className="sm:col-span-2">
                    <Label>Gender</Label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button type="button" key={g} onClick={() => setRelative({ ...relative, gender: g })}
                          className={cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all", relative.gender === g ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40")}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Relation</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {["Parent", "Spouse", "Child", "Sibling", "Other"].map((r) => (
                        <button type="button" key={r} onClick={() => setRelative({ ...relative, relation: r })}
                          className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", relative.relation === r ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40")}>{r}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button onClick={() => setStep(2)} disabled={who === "Relative" && (!relative.first || !relative.last || !relative.age)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-semibold">Appointment Details</h2>
              <p className="text-sm text-muted-foreground">Choose specialty, doctor, and time</p>
            </div>
            <div>
              <Label>Specialty</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <button key={s} onClick={() => setSpecialty(s)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    specialty === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40")}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Doctor</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {doctors.map((d) => (
                  <button key={d.id} onClick={() => setDoctor(d.id)} className={cn("flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                    doctor === d.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}>
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">{d.id}</div>
                    <div><div className="text-sm font-medium">{d.name}</div><div className="text-xs text-muted-foreground">{d.specialty}</div></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Date</Label><Input type="date" className="mt-1.5" defaultValue="2026-06-15" /></div>
              <div><Label>Time</Label><Input type="time" className="mt-1.5" defaultValue="10:00" /></div>
            </div>
            <div>
              <Label>Reason for Visit</Label>
              <Textarea className="mt-1.5" rows={3} placeholder="Describe your symptoms or reason..." />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button onClick={() => setStep(3)}>Review &amp; Confirm <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-semibold">Review &amp; Confirm</h2>
              <p className="text-sm text-muted-foreground">Please verify the details before submitting</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Block title="Patient">
                <Row k="For" v={who} />
                {who === "Relative" ? (
                  <>
                    <Row k="Name" v={`${relative.first} ${relative.last}`} />
                    <Row k="Age / Gender" v={`${relative.age} · ${relative.gender}`} />
                    <Row k="City" v={relative.city} />
                    <Row k="Relation" v={relative.relation} />
                  </>
                ) : (
                  <>
                    <Row k="Name" v="Jacob Jones" />
                    <Row k="Patient ID" v="P-10051" />
                  </>
                )}
              </Block>
              <Block title="Appointment">
                <Row k="Specialty" v={specialty} />
                <Row k="Doctor" v={doctors.find((d) => d.id === doctor)?.name ?? ""} />
                <Row k="Date" v="Monday, June 15, 2026" />
                <Row k="Time" v="10:00 AM" />
              </Block>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button onClick={() => setDone(true)}>Confirm Booking <CheckCircle2 className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </Card>
    </PatientShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 text-sm font-semibold text-primary">{title}</div>
      <dl className="space-y-1.5">{children}</dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}