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
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCreateDoctor, useDoctors, useUpdateDoctor } from "@/hooks/useDoctors";
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
  const { data: doctors = [], isLoading, isError } = useDoctors();

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
                          <Avatar initials={getInitials(name)} />
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
  });
  const [doctorForm, setDoctorForm] = useState({
    speciality: "",
    averageCheckUpTime: "15",
    isAvailable: true,
  });
  const [schedule, setSchedule] = useState<DoctorSchedule[]>([
    { day: "Monday", startTime: "09:00", endTime: "17:00" },
  ]);

  const reset = () => {
    setStep(1);
    setError("");
    setUserForm({ firstName: "", lastName: "", email: "", phone: "", password: "", city: "", address: "", gender: "M" });
    setDoctorForm({ speciality: "", averageCheckUpTime: "15", isAvailable: true });
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
  });
  const [schedule, setSchedule] = useState<DoctorSchedule[]>(initialSchedule);

  useEffect(() => {
    if (!open) {
      setForm({
        speciality: doctor.speciality,
        averageCheckUpTime: String(doctor.averageCheckupTime),
        isAvailable: doctor.isAvailable !== false,
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
        },
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
          <Field label="Specialty" value={form.speciality} onChange={(speciality) => setForm({ ...form, speciality })} required />
          <Field label="Average checkup time (minutes)" type="number" min="1" value={form.averageCheckUpTime} onChange={(averageCheckUpTime) => setForm({ ...form, averageCheckUpTime })} required />
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
