import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell, Avatar, StatusBadge } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock, Clock, ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useCreateDoctor, useDoctorProfile, useDoctors, useUpdateDoctor } from "@/hooks/useDoctors";
import { useUser } from "@/hooks/useUser";
import type { Doctor, DoctorSchedule, DoctorUser } from "@/services/doctor.service";

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
  const [query, setQuery] = useState("");
  const { user } = useUser();
  const { data: doctors = [], isLoading, isError } = useDoctors();

  if (user?.role === "doctor") return <MySchedulePage userId={user._id} />;

  const filteredDoctors = doctors.filter((doctor) => {
    const user = getDoctorUser(doctor);
    const haystack = [
      doctor._id,
      doctor.speciality,
      user?.firstName,
      user?.lastName,
      user?.phone,
      user?.email,
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Doctors" }]}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
          <p className="text-sm text-muted-foreground">{doctors.length} medical staff registered</p>
        </div>
        <AddDoctorDialog />
      </div>
      <Card className="p-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, ID, or phone..." className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        {isError && <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">Unable to load doctors.</div>}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Doctor</th>
                <th className="py-3 pr-4">Specialty</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Checkup Time</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td className="py-8 text-center text-muted-foreground" colSpan={6}>Loading doctors...</td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-muted-foreground" colSpan={6}>No doctors found.</td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => {
                  const user = getDoctorUser(doctor);
                  const userId = getDoctorUserId(doctor);
                  const name = getDoctorName(doctor);

                  return (
                    <tr key={doctor._id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={getInitials(name)} src={user?.image} alt={name} />
                          <div>
                            <div className="font-medium">{name}</div>
                            <div className="text-xs text-muted-foreground">{user?.email ?? "No email"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{doctor.speciality}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{user?.phone ?? "-"}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{doctor.averageCheckupTime} min</td>
                      <td className="py-3 pr-4"><StatusBadge status={doctor.isAvailable === false ? "Inactive" : "Available"} /></td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <EditDoctorDialog doctor={doctor} />
                          <Link to="/doctors/$id" params={{ id: userId }} className="text-sm font-medium text-primary hover:underline">View Profile</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}

function MySchedulePage({ userId }: { userId: string }) {
  const { data: doctor, isLoading, isError } = useDoctorProfile(userId);
  const updateDoctor = useUpdateDoctor();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ speciality: "", averageCheckUpTime: "15", isAvailable: true });
  const [schedule, setSchedule] = useState<DoctorSchedule[]>([{ day: "Monday", startTime: "09:00", endTime: "17:00" }]);

  useEffect(() => {
    if (!doctor) return;
    setForm({
      speciality: doctor.speciality,
      averageCheckUpTime: String(doctor.averageCheckupTime),
      isAvailable: doctor.isAvailable !== false,
    });
    setSchedule(doctor.schedule?.length ? doctor.schedule : [{ day: "Monday", startTime: "09:00", endTime: "17:00" }]);
    setError("");
    setSaved(false);
  }, [doctor]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!doctor) return;
    setError("");
    setSaved(false);

    try {
      await updateDoctor.mutateAsync({
        userId,
        data: {
          speciality: form.speciality.trim(),
          averageCheckUpTime: Number(form.averageCheckUpTime),
          isAvailable: form.isAvailable,
        },
        schedule,
      });
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to update schedule.");
    }
  };

  const updateSchedule = (index: number, patch: Partial<DoctorSchedule>) => {
    setSchedule((current) => current.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));
    setSaved(false);
  };

  const removeSchedule = (index: number) => {
    setSchedule((current) => current.filter((_, i) => i !== index));
    setSaved(false);
  };

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "My Schedule" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-sm text-muted-foreground">Review your doctor profile and update your appointment availability.</p>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">Loading your schedule...</Card>
      ) : isError || !doctor ? (
        <Card className="p-8 text-center text-destructive">Unable to load your doctor profile.</Card>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <Avatar initials={getInitials(getDoctorName(doctor))} src={getDoctorUser(doctor)?.image} alt={getDoctorName(doctor)} />
              <div className="min-w-0">
                <div className="truncate text-base font-semibold">{getDoctorName(doctor)}</div>
                <div className="truncate text-xs text-muted-foreground">{getDoctorUser(doctor)?.email ?? "No email"}</div>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <InfoRow label="Specialty" value={doctor.speciality} />
              <InfoRow label="Checkup Time" value={`${doctor.averageCheckupTime} min`} />
              <InfoRow label="Status" value={doctor.isAvailable === false ? "Inactive" : "Available"} />
              <InfoRow label="Phone" value={getDoctorUser(doctor)?.phone ?? "-"} />
            </dl>
          </Card>

          <Card className="p-5">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Schedule Details</h2>
                <p className="text-sm text-muted-foreground">Changes here control your bookable appointment slots.</p>
              </div>
              <StatusBadge status={form.isAvailable ? "Available" : "Inactive"} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Specialty" value={form.speciality} onChange={(speciality) => { setForm({ ...form, speciality }); setSaved(false); }} required />
              <Field label="Average checkup time (minutes)" type="number" min="1" value={form.averageCheckUpTime} onChange={(averageCheckUpTime) => { setForm({ ...form, averageCheckUpTime }); setSaved(false); }} required />
            </div>

            <label className="mt-4 flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
              <input type="checkbox" checked={form.isAvailable} onChange={(event) => { setForm({ ...form, isAvailable: event.target.checked }); setSaved(false); }} />
              <span>
                <span className="block font-medium">Available for appointments</span>
                <span className="text-xs text-muted-foreground">Turn this off when patients should not be able to book you.</span>
              </span>
            </label>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label>Weekly Schedule</Label>
                  <div className="mt-1 text-xs text-muted-foreground">{schedule.length} active day(s)</div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => { setSchedule([...schedule, { day: getNextAvailableDay(schedule), startTime: "09:00", endTime: "17:00" }]); setSaved(false); }}>
                  <Plus className="h-4 w-4" /> Add day
                </Button>
              </div>

              {schedule.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No schedule days selected.</div>
              ) : (
                schedule.map((slot, index) => (
                  <div key={`${slot.day}-${index}`} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_130px_130px_auto]">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" /> Day</div>
                      <select value={slot.day} onChange={(event) => updateSchedule(index, { day: event.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        {days.map((day) => <option key={day} value={day}>{day}</option>)}
                      </select>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Start</div>
                      <Input type="time" value={slot.startTime} onChange={(event) => updateSchedule(index, { startTime: event.target.value })} required />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Clock className="h-3.5 w-3.5" /> End</div>
                      <Input type="time" value={slot.endTime} onChange={(event) => updateSchedule(index, { endTime: event.target.value })} required />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSchedule(index)} aria-label={`Remove ${slot.day}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {error && <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
            {saved && <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Schedule updated successfully.</div>}

            <div className="mt-5 flex justify-end">
              <Button type="submit" disabled={updateDoctor.isPending || schedule.length === 0}>
                {updateDoctor.isPending ? "Saving..." : "Save Schedule"}
              </Button>
            </div>
          </Card>
        </form>
      )}
    </AppShell>
  );
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getDoctorUser(doctor: Doctor): DoctorUser | undefined {
  return typeof doctor.userId === "object" ? doctor.userId : undefined;
}

function getDoctorUserId(doctor: Doctor) {
  return typeof doctor.userId === "object" ? doctor.userId._id : doctor.userId;
}

function getDoctorName(doctor: Doctor) {
  const user = getDoctorUser(doctor);
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "DR";
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function getNextAvailableDay(schedule: DoctorSchedule[]) {
  return days.find((day) => !schedule.some((slot) => slot.day === day)) ?? "Monday";
}

function getErrorMessage(err: unknown) {
  if (typeof err === "object" && err && "response" in err) {
    const response = (err as { response?: { data?: { message?: string | string[] } } }).response;
    const message = response?.data?.message;
    return Array.isArray(message) ? message.join(", ") : message;
  }
  return undefined;
}

function AddDoctorDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const createDoctor = useCreateDoctor();
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    address: "",
    gender: "M",
    image: "",
  });
  const [doctorForm, setDoctorForm] = useState({
    speciality: "",
    averageCheckUpTime: "15",
    isAvailable: true,
    biography: "",
    qualifications: "",
  });
  const [schedule, setSchedule] = useState<DoctorSchedule[]>([
    { day: "Monday", startTime: "09:00", endTime: "17:00" },
  ]);

  const reset = () => {
    setStep(1);
    setError("");
    setUserForm({ firstName: "", lastName: "", email: "", phone: "", password: "", city: "", address: "", gender: "M", image: "" });
    setDoctorForm({ speciality: "", averageCheckUpTime: "15", isAvailable: true, biography: "", qualifications: "" });
    setSchedule([{ day: "Monday", startTime: "09:00", endTime: "17:00" }]);
  };

  const getErrorMessage = (err: unknown) => {
    if (typeof err === "object" && err && "response" in err) {
      const response = (err as { response?: { data?: { message?: string | string[] } } }).response;
      const message = response?.data?.message;
      return Array.isArray(message) ? message.join(", ") : message;
    }
    return undefined;
  };

  const handleUserSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStep(2);
  };

  const handleDoctorSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await createDoctor.mutateAsync({
        user: {
          ...userForm,
          firstName: userForm.firstName.trim(),
          lastName: userForm.lastName.trim(),
          email: userForm.email.trim(),
          phone: userForm.phone.trim(),
          city: userForm.city.trim(),
          address: userForm.address.trim(),
        },
        doctor: {
          speciality: doctorForm.speciality.trim(),
          averageCheckUpTime: Number(doctorForm.averageCheckUpTime),
          isAvailable: doctorForm.isAvailable,
          biography: doctorForm.biography.trim(),
          qualifications: parseQualifications(doctorForm.qualifications),
          schedule,
        },
      });
      setOpen(false);
      reset();
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to create doctor profile.");
    }
  };

  const updateSchedule = (index: number, patch: Partial<DoctorSchedule>) => {
    setSchedule((current) => current.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) reset(); }}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> Add Doctor</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Doctor</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Step 1 of 2: add personal details." : "Step 2 of 2: add doctor details and schedule."}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-primary" />
          <div className={step === 2 ? "h-2 flex-1 rounded-full bg-primary" : "h-2 flex-1 rounded-full bg-muted"} />
        </div>

        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <ImageUpload value={userForm.image} name={[userForm.firstName, userForm.lastName].filter(Boolean).join(" ")} onChange={(image) => setUserForm({ ...userForm, image })} onError={setError} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name" value={userForm.firstName} onChange={(firstName) => setUserForm({ ...userForm, firstName })} required />
              <Field label="Last name" value={userForm.lastName} onChange={(lastName) => setUserForm({ ...userForm, lastName })} required />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Email" type="email" value={userForm.email} onChange={(email) => setUserForm({ ...userForm, email })} required />
              <Field label="Phone" type="tel" value={userForm.phone} onChange={(phone) => setUserForm({ ...userForm, phone })} required />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Password" type="password" value={userForm.password} onChange={(password) => setUserForm({ ...userForm, password })} required />
              <Field label="City" value={userForm.city} onChange={(city) => setUserForm({ ...userForm, city })} required />
            </div>
            <Field label="Address" value={userForm.address} onChange={(address) => setUserForm({ ...userForm, address })} required />
            <div>
              <Label>Gender</Label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {[["M", "Male"], ["F", "Female"]].map(([value, label]) => (
                  <button type="button" key={value} onClick={() => setUserForm({ ...userForm, gender: value })}
                    className={userForm.gender === value ? "rounded-lg border border-primary bg-primary-soft px-3 py-2 text-sm font-medium text-primary" : "rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/40"}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">Continue</Button>
          </form>
        ) : (
          <form onSubmit={handleDoctorSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Specialty" value={doctorForm.speciality} onChange={(speciality) => setDoctorForm({ ...doctorForm, speciality })} required />
              <Field label="Average checkup time (minutes)" type="number" min="1" value={doctorForm.averageCheckUpTime} onChange={(averageCheckUpTime) => setDoctorForm({ ...doctorForm, averageCheckUpTime })} required />
            </div>
            <div>
              <Label>Biography</Label>
              <Textarea className="mt-1.5 min-h-24" value={doctorForm.biography} onChange={(event) => setDoctorForm({ ...doctorForm, biography: event.target.value })} placeholder="Professional background, interests, and approach to patient care" maxLength={2000} />
            </div>
            <div>
              <Label>Qualifications</Label>
              <Textarea className="mt-1.5 min-h-24" value={doctorForm.qualifications} onChange={(event) => setDoctorForm({ ...doctorForm, qualifications: event.target.value })} placeholder={"One qualification per line\nMBBS — University name\nBoard Certified"} />
              <p className="mt-1 text-xs text-muted-foreground">Enter one qualification per line.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={doctorForm.isAvailable} onChange={(event) => setDoctorForm({ ...doctorForm, isAvailable: event.target.checked })} />
              Available for appointments
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Schedule</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setSchedule([...schedule, { day: "Monday", startTime: "09:00", endTime: "17:00" }])}>
                  <Plus className="h-4 w-4" /> Add day
                </Button>
              </div>
              {schedule.map((slot, index) => (
                <div key={index} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_120px_120px_auto]">
                  <select value={slot.day} onChange={(event) => updateSchedule(index, { day: event.target.value })} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                    {days.map((day) => <option key={day} value={day}>{day}</option>)}
                  </select>
                  <Input type="time" value={slot.startTime} onChange={(event) => updateSchedule(index, { startTime: event.target.value })} required />
                  <Input type="time" value={slot.endTime} onChange={(event) => updateSchedule(index, { endTime: event.target.value })} required />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setSchedule(schedule.filter((_, i) => i !== index))} disabled={schedule.length === 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit" className="flex-1" disabled={createDoctor.isPending}>{createDoctor.isPending ? "Creating doctor..." : "Create doctor"}</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditDoctorDialog({ doctor }: { doctor: Doctor }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const updateDoctor = useUpdateDoctor();
  const initialSchedule = doctor.schedule?.length
    ? doctor.schedule
    : [{ day: "Monday", startTime: "09:00", endTime: "17:00" }];
  const [form, setForm] = useState({
    speciality: doctor.speciality,
    averageCheckUpTime: String(doctor.averageCheckupTime),
    isAvailable: doctor.isAvailable !== false,
    biography: doctor.biography ?? "",
    qualifications: (doctor.qualifications ?? []).join("\n"),
    image: getDoctorUser(doctor)?.image ?? "",
  });
  const [schedule, setSchedule] = useState<DoctorSchedule[]>(initialSchedule);

  useEffect(() => {
    if (!open) {
      setForm({
        speciality: doctor.speciality,
        averageCheckUpTime: String(doctor.averageCheckupTime),
        isAvailable: doctor.isAvailable !== false,
        biography: doctor.biography ?? "",
        qualifications: (doctor.qualifications ?? []).join("\n"),
        image: getDoctorUser(doctor)?.image ?? "",
      });
      setSchedule(doctor.schedule?.length ? doctor.schedule : [{ day: "Monday", startTime: "09:00", endTime: "17:00" }]);
      setError("");
    }
  }, [doctor, open]);

  const getErrorMessage = (err: unknown) => {
    if (typeof err === "object" && err && "response" in err) {
      const response = (err as { response?: { data?: { message?: string | string[] } } }).response;
      const message = response?.data?.message;
      return Array.isArray(message) ? message.join(", ") : message;
    }
    return undefined;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await updateDoctor.mutateAsync({
        userId: getDoctorUserId(doctor),
        data: {
          speciality: form.speciality.trim(),
          averageCheckUpTime: Number(form.averageCheckUpTime),
          isAvailable: form.isAvailable,
          biography: form.biography.trim(),
          qualifications: parseQualifications(form.qualifications),
        },
        userData: form.image && form.image !== getDoctorUser(doctor)?.image ? { image: form.image } : undefined,
        schedule,
      });
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to update doctor.");
    }
  };

  const updateSchedule = (index: number, patch: Partial<DoctorSchedule>) => {
    setSchedule((current) => current.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${getDoctorName(doctor)}`}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogDescription>{getDoctorName(doctor)}</DialogDescription>
        </DialogHeader>

        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload value={form.image} name={getDoctorName(doctor)} onChange={(image) => setForm({ ...form, image })} onError={setError} />
          <Field label="Specialty" value={form.speciality} onChange={(speciality) => setForm({ ...form, speciality })} required />
          <Field label="Average checkup time (minutes)" type="number" min="1" value={form.averageCheckUpTime} onChange={(averageCheckUpTime) => setForm({ ...form, averageCheckUpTime })} required />
          <div>
            <Label>Biography</Label>
            <Textarea className="mt-1.5 min-h-24" value={form.biography} onChange={(event) => setForm({ ...form, biography: event.target.value })} maxLength={2000} />
          </div>
          <div>
            <Label>Qualifications</Label>
            <Textarea className="mt-1.5 min-h-24" value={form.qualifications} onChange={(event) => setForm({ ...form, qualifications: event.target.value })} placeholder="One qualification per line" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })} />
            Available for appointments
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Schedule</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setSchedule([...schedule, { day: "Monday", startTime: "09:00", endTime: "17:00" }])}>
                <Plus className="h-4 w-4" /> Add day
              </Button>
            </div>
            {schedule.map((slot, index) => (
              <div key={index} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_120px_120px_auto]">
                <select value={slot.day} onChange={(event) => updateSchedule(index, { day: event.target.value })} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                  {days.map((day) => <option key={day} value={day}>{day}</option>)}
                </select>
                <Input type="time" value={slot.startTime} onChange={(event) => updateSchedule(index, { startTime: event.target.value })} required />
                <Input type="time" value={slot.endTime} onChange={(event) => updateSchedule(index, { endTime: event.target.value })} required />
                <Button type="button" variant="ghost" size="icon" onClick={() => setSchedule(schedule.filter((_, i) => i !== index))} disabled={schedule.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={updateDoctor.isPending}>{updateDoctor.isPending ? "Saving..." : "Save changes"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, type = "text", required, min }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; min?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1.5" type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </div>
  );
}

function ImageUpload({ value, name, onChange, onError }: { value: string; name: string; onChange: (value: string) => void; onError: (message: string) => void }) {
  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return onError("Please select a valid image file.");
    if (file.size > 5 * 1024 * 1024) return onError("Profile image must be 5 MB or smaller.");
    const reader = new FileReader();
    reader.onload = () => { onError(""); onChange(String(reader.result ?? "")); };
    reader.onerror = () => onError("Unable to read the selected image.");
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Label>Profile picture</Label>
      <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-border p-3">
        <Avatar initials={getInitials(name || "Doctor")} src={value} alt={name || "Doctor profile preview"} />
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent">
          <ImagePlus className="h-4 w-4" /> {value ? "Change image" : "Choose image"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = ""; }} />
        </label>
        {value && value.startsWith("data:") && <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")} aria-label="Remove selected image"><X className="h-4 w-4" /></Button>}
        <span className="text-xs text-muted-foreground">JPG, PNG or WebP · max 5 MB</span>
      </div>
    </div>
  );
}

function parseQualifications(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}
