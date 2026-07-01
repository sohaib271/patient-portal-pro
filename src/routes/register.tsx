import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { ComponentType, Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Mail, MessageCircle, Phone, Plus, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Patient, type PatientRecord } from "@/services/patient.service";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register - MediFlow" }] }),
  component: RegisterPage,
});

type RegisterStep = "contact" | "existing" | "profile";

function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<RegisterStep>("contact");
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [contactId, setContactId] = useState("");
  const [matchedPatients, setMatchedPatients] = useState<PatientRecord[]>([]);
  const [contactHasPassword, setContactHasPassword] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [claimPassword, setClaimPassword] = useState("");
  const [contact, setContact] = useState({ phone: "", whatsapp: "", email: "" });
  const [profile, setProfile] = useState({ first: "", last: "", age: "", city: "", gender: "M", password: "" });

  const selectedPatient = matchedPatients.find((patient) => patient._id === selectedPatientId);
  const displayName = selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : profile.first || "patient";

  const finishRegistration = (patient: unknown) => {
    queryClient.setQueryData(["user"], patient);
    setDone(true);
  };

  const getErrorMessage = (err: unknown) => {
    if (typeof err === "object" && err && "response" in err) {
      const response = (err as { response?: { data?: { message?: string | string[] } } }).response;
      const message = response?.data?.message;
      return Array.isArray(message) ? message.join(", ") : message;
    }
    return undefined;
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await Patient.addOrSearchContact({
        phone: contact.phone.trim(),
        whatsappNo: contact.whatsapp.trim(),
        email: contact.email.trim(),
      });
      const patients = (response.patients ?? []) as PatientRecord[];
      const hasExistingPassword = Boolean(response.contactHasPassword) || patients.some((patient) => patient.hasPassword);
      const nextContactId =
        response.contact?._id ??
        response.newContact?._id ??
        response.contactId ??
        patients[0]?.contactId ??
        "";

      if (!nextContactId) {
        throw new Error("Contact saved, but no contact id was returned.");
      }

      setContactId(nextContactId);
      setMatchedPatients(patients);
      setContactHasPassword(hasExistingPassword);
      setSelectedPatientId(patients[0]?._id ?? "");
      setStep(patients.length > 0 ? "existing" : "profile");
    } catch (err) {
      setError(getErrorMessage(err) ?? (err instanceof Error ? err.message : "Unable to check contact information."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await Patient.selfRegister({
        contactId,
        firstName: profile.first.trim(),
        lastName: profile.last.trim(),
        age: Number(profile.age),
        city: profile.city.trim(),
        gender: profile.gender,
        relation: "self",
        password: profile.password,
      });
      finishRegistration(response.patient);
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExistingPatientSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await Patient.setPassword(selectedPatientId, contactId, claimPassword);
      finishRegistration(response.patient);
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to create a password for this patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <Shell>
        <div className="text-center animate-in zoom-in-95 duration-300">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Account Created!</h2>
          <p className="mt-1 text-sm text-muted-foreground">Welcome to MediFlow, {displayName}.</p>
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
        <p className="text-sm text-muted-foreground">{step === "contact" ? "Contact information" : step === "existing" ? "Select your patient record" : "Personal details"}</p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold ring-4 ring-primary/15">1</div>
          <span className="text-xs font-medium">Contact</span>
        </div>
        <div className={cn("h-px flex-1 transition-colors", step !== "contact" ? "bg-primary" : "bg-border")} />
        <div className="flex flex-1 items-center gap-2 justify-end">
          <span className={cn("text-xs font-medium", step !== "contact" ? "text-foreground" : "text-muted-foreground")}>{step === "existing" ? "Patient" : "Profile"}</span>
          <div className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-all", step !== "contact" ? "bg-primary text-primary-foreground ring-4 ring-primary/15" : "bg-muted text-muted-foreground")}>2</div>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

      {step === "contact" ? (
        <form onSubmit={handleContactSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
          <FieldWithIcon icon={Phone} label="Phone number" type="tel" placeholder="+1 (555) 123-4567" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} required />
          <FieldWithIcon icon={MessageCircle} label="WhatsApp number" type="tel" placeholder="+1 (555) 123-4567" value={contact.whatsapp} onChange={(v) => setContact({ ...contact, whatsapp: v })} required />
          <FieldWithIcon icon={Mail} label="Email address" type="email" placeholder="you@example.com" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} required />
          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>{isSubmitting ? "Checking..." : "Continue"} <ArrowRight className="h-4 w-4" /></Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      ) : step === "existing" ? (
        <form onSubmit={handleExistingPatientSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
          {contactHasPassword ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              This contact already has a portal account. Please sign in instead of creating another profile.
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Choose one of the existing patient records to create a password, or create a new profile for this contact.
            </div>
          )}
          <div className="space-y-2">
            {matchedPatients.map((patient) => (
              <button
                type="button"
                key={patient._id}
                onClick={() => setSelectedPatientId(patient._id)}
                className={cn("flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all", selectedPatientId === patient._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{patient.firstName} {patient.lastName}</div>
                  <div className="text-xs text-muted-foreground">{patient.patientId} - {patient.age} years - {patient.gender === "F" ? "Female" : "Male"}</div>
                </div>
                {patient.hasPassword && <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Account active</span>}
              </button>
            ))}
          </div>
          {!contactHasPassword && <PasswordField show={show} setShow={setShow} value={claimPassword} onChange={setClaimPassword} />}
          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setStep("contact")}><ArrowLeft className="h-4 w-4" /> Back</Button>
            {!contactHasPassword && (
              <>
                <Button type="button" variant="outline" className="flex-1 h-11" onClick={() => setStep("profile")}>New profile</Button>
                <Button type="submit" className="flex-1 h-11" disabled={isSubmitting || !selectedPatientId}>{isSubmitting ? "Creating..." : "Create password"}</Button>
              </>
            )}
          </div>
          {contactHasPassword && (
            <Button asChild className="w-full h-11">
              <Link to="/login">Go to sign in</Link>
            </Button>
          )}
        </form>
      ) : (
        <form onSubmit={handleProfileSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
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
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {[["M", "Male"], ["F", "Female"]].map(([value, label]) => (
                <button type="button" key={value} onClick={() => setProfile({ ...profile, gender: value })}
                  className={cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all", profile.gender === value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40")}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <PasswordField show={show} setShow={setShow} value={profile.password} onChange={(password) => setProfile({ ...profile, password })} />
          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setStep("contact")}><ArrowLeft className="h-4 w-4" /> Back</Button>
            <Button type="submit" className="flex-1 h-11" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create account"}</Button>
          </div>
        </form>
      )}
    </Shell>
  );
}

function FieldWithIcon({ icon: Icon, label, ...props }: { icon: ComponentType<{ className?: string }>; label: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
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

function PasswordField({ show, setShow, value, onChange }: { show: boolean; setShow: Dispatch<SetStateAction<boolean>>; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label>Password</Label>
      <div className="relative mt-1.5">
        <Input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} required minLength={6} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-10">
      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_-20px_rgba(14,165,233,0.25)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
