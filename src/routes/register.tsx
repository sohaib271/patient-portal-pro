import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Mail, MessageCircle, Phone, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — MediFlow" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [contact, setContact] = useState({ phone: "", whatsapp: "", email: "" });
  const [profile, setProfile] = useState({ first: "", last: "", age: "", city: "", gender: "Male", password: "" });

  if (done) {
    return (
      <Shell>
        <div className="text-center animate-in zoom-in-95 duration-300">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Account Created!</h2>
          <p className="mt-1 text-sm text-muted-foreground">Welcome to MediFlow, {profile.first || "patient"}.</p>
          <Button className="mt-5" onClick={() => navigate({ to: "/patient/dashboard" })}>Continue to Portal</Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Plus className="h-7 w-7" strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 2 — {step === 1 ? "Contact information" : "Personal details"}</p>
      </div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold ring-4 ring-primary/15">1</div>
          <span className="text-xs font-medium">Contact</span>
        </div>
        <div className={cn("h-px flex-1 transition-colors", step === 2 ? "bg-primary" : "bg-border")} />
        <div className="flex flex-1 items-center gap-2 justify-end">
          <span className={cn("text-xs font-medium", step === 2 ? "text-foreground" : "text-muted-foreground")}>Profile</span>
          <div className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-all", step === 2 ? "bg-primary text-primary-foreground ring-4 ring-primary/15" : "bg-muted text-muted-foreground")}>2</div>
        </div>
      </div>

      {step === 1 ? (
        <form
          onSubmit={(e) => { e.preventDefault(); setStep(2); }}
          className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300"
        >
          <FieldWithIcon icon={Phone} label="Phone number" type="tel" placeholder="+1 (555) 123-4567" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} required />
          <FieldWithIcon icon={MessageCircle} label="WhatsApp number" type="tel" placeholder="+1 (555) 123-4567" value={contact.whatsapp} onChange={(v) => setContact({ ...contact, whatsapp: v })} required />
          <FieldWithIcon icon={Mail} label="Email address" type="email" placeholder="you@example.com" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} required />
          <Button type="submit" className="w-full h-11">Continue <ArrowRight className="h-4 w-4" /></Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setDone(true); }}
          className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>First name</Label><Input className="mt-1.5" value={profile.first} onChange={(e) => setProfile({ ...profile, first: e.target.value })} required /></div>
            <div><Label>Last name</Label><Input className="mt-1.5" value={profile.last} onChange={(e) => setProfile({ ...profile, last: e.target.value })} required /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Age</Label><Input className="mt-1.5" type="number" min="0" max="120" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} required /></div>
            <div><Label>City</Label><Input className="mt-1.5" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} required /></div>
          </div>
          <div>
            <Label>Gender</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button type="button" key={g} onClick={() => setProfile({ ...profile, gender: g })}
                  className={cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all", profile.gender === g ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40")}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative mt-1.5">
              <Input type={show ? "text" : "password"} value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} required minLength={6} />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
            <Button type="submit" className="flex-1 h-11">Create account</Button>
          </div>
        </form>
      )}
    </Shell>
  );
}

function FieldWithIcon({ icon: Icon, label, ...props }: { icon: React.ComponentType<{ className?: string }>; label: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  const { onChange, value, ...rest } = props;
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1.5">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_-20px_rgba(14,165,233,0.25)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}