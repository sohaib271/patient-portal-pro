import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { PatientShell } from "./patient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Bell, CheckCircle2, ChevronLeft, ChevronRight, Users, User as UserIcon, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePatientRelatives } from "@/hooks/usePatientRelatives";
import { useUser } from "@/hooks/useUser";
import { useDoctors } from "@/hooks/useDoctors";
import { Patient } from "@/services/patient.service";
import { Appointment, type AppointmentSlot, type DoctorAvailability } from "@/services/appointment.service";
import { CheckupService } from "@/services/checkup.service";
import type { Doctor } from "@/services/doctor.service";
import type { PatientWithPhone } from "@/services/patient.service";

const MAX_BOOKING_WEEK_OFFSET = 7;
const REMINDER_OPTIONS = [
  { value: 15, label: "15 Minutes Before" },
  { value: 30, label: "30 Minutes Before" },
  { value: 60, label: "1 Hour Before" },
  { value: 1440, label: "1 Day Before" },
];
const NOTIFICATION_CHANNEL_OPTIONS = [
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
];

export const Route = createFileRoute("/patient/book")({
  head: () => ({ meta: [{ title: "Book Appointment — MediFlow" }] }),
  component: PatientBook,
});

function PatientBook() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [who, setWho] = useState<"Self" | "Relative">("Self");
  const [selectedRelative, setSelectedRelative] = useState<PatientWithPhone | null>(null);
  const [addedRelatives, setAddedRelatives] = useState<PatientWithPhone[]>([]);
  const [showAddRelative, setShowAddRelative] = useState(false);
  const [isCreatingRelative, setIsCreatingRelative] = useState(false);
  const [relativeError, setRelativeError] = useState("");
  const [newRelative, setNewRelative] = useState({ firstName: "", lastName: "", age: "", city: "", gender: "M", relation: "Other" });
  const [checkupName, setCheckupName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctor, setDoctor] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availability, setAvailability] = useState<DoctorAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [patientReminderMinutes, setPatientReminderMinutes] = useState(60);
  const [notificationChannels, setNotificationChannels] = useState<string[]>(["whatsapp"]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [done, setDone] = useState(false);
  const contact = getContact(user);
  const contactPhone = contact?.phone;
  const { data: relatives = [], isLoading: isLoadingRelatives, isError: relativesError } = usePatientRelatives(contactPhone, user?._id);
  const { data: doctors = [], isLoading: isLoadingDoctors, isError: doctorsError } = useDoctors();
  const availableDoctors = doctors.filter((item) => item.isAvailable !== false);
  const specialties = Array.from(new Set(availableDoctors.map((item) => item.speciality).filter(Boolean))).sort();
  const filteredDoctors = specialty ? availableDoctors.filter((item) => item.speciality === specialty) : [];
  const selectedDoctor = availableDoctors.find((item) => item._id === doctor);
  const weekDates = useMemo(() => buildWeekDates(weekOffset), [weekOffset]);
  const weekRangeLabel = useMemo(() => getWeekRangeLabel(weekDates), [weekDates]);
  const scheduledDays = useMemo(() => new Set((selectedDoctor?.schedule ?? []).map((slot) => slot.day.toLowerCase())), [selectedDoctor]);
  const allRelatives = [...addedRelatives, ...relatives.filter((patient) => !addedRelatives.some((added) => added._id === patient._id))];
  const selectedPatientName = who === "Self" ? "you" : selectedRelative ? getPatientName(selectedRelative) : "your relative";

  useEffect(() => {
    if (!selectedDoctor) {
      setAppointmentDate("");
      return;
    }

    if (appointmentDate && scheduledDays.has(getWeekday(appointmentDate).toLowerCase())) return;

    const nextScheduledDate = weekDates.find((date) => !date.isPast && scheduledDays.has(date.day.toLowerCase()));
    setAppointmentDate(nextScheduledDate?.value ?? "");
  }, [appointmentDate, scheduledDays, selectedDoctor, weekDates]);

  useEffect(() => {
    if (!doctor || !appointmentDate) {
      setAvailability(null);
      setSelectedSlot(null);
      return;
    }

    const controller = new AbortController();
    setIsLoadingSlots(true);
    setSlotError("");
    setSelectedSlot(null);

    Appointment.getDoctorAvailability(doctor, appointmentDate, undefined, undefined, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        setAvailability(response);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setAvailability(null);
        setSlotError(getErrorMessage(err) ?? "Unable to load slots for this day.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingSlots(false);
      });

    return () => {
      controller.abort();
    };
  }, [appointmentDate, doctor]);

  const handleCreateRelative = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contactPhone) return;
    setRelativeError("");
    setIsCreatingRelative(true);

    try {
      const response = await Patient.createPatientByPhone({
        phone: contactPhone,
        whatsappNo: contact.whatsappNo,
        email: contact.email,
        firstName: newRelative.firstName.trim(),
        lastName: newRelative.lastName.trim(),
        age: Number(newRelative.age),
        city: newRelative.city.trim(),
        gender: newRelative.gender,
        relation: newRelative.relation.trim().toLowerCase() || "other",
      });
      const patient = { ...response.patient, phone: contactPhone } as PatientWithPhone;
      setAddedRelatives((current) => [patient, ...current.filter((item) => item._id !== patient._id)]);
      setSelectedRelative(patient);
      setShowAddRelative(false);
      setNewRelative({ firstName: "", lastName: "", age: "", city: "", gender: "M", relation: "Other" });
    } catch (err) {
      setRelativeError(getErrorMessage(err) ?? "Unable to add patient.");
    } finally {
      setIsCreatingRelative(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (isSubmittingBooking) return;

    const patientId = who === "Self" ? user?._id : selectedRelative?._id;
    const contactId = who === "Self" ? contact?._id : selectedRelative?.contactId;

    if (!patientId || !contactId || !doctor || !appointmentDate || !selectedSlot) {
      setBookingError("Please complete patient, doctor, date, and slot details.");
      return;
    }

    setBookingError("");
    setIsSubmittingBooking(true);

    try {
      const checkupResponse = await CheckupService.findOrCreate({
        name: checkupName.trim(),
        specialityRequired: specialty,
      });

      await Appointment.bookAppointment({
        contactId,
        patientId,
        checkupId: checkupResponse.data._id,
        doctorId: doctor,
        reasonForVisit: reasonForVisit.trim(),
        appointmentDate,
        appointmentTime: selectedSlot.time,
        patientReminderMinutes,
        notificationChannel: notificationChannels,
        bufferMinutes: 5,
      });

      setDone(true);
    } catch (err) {
      setBookingError(getErrorMessage(err) ?? "Unable to book appointment. Please try another slot.");
      if (doctor && appointmentDate) {
        try {
          const response = await Appointment.getDoctorAvailability(doctor, appointmentDate);
          setAvailability(response);
          setSelectedSlot(null);
        } catch {
          setAvailability(null);
        }
      }
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  if (done) {
    return (
      <PatientShell breadcrumbs={[{ label: "Dashboard", to: "/patient/dashboard" }, { label: "Book" }, { label: "Confirmation" }]}>
        <div className="mx-auto max-w-xl">
          <Card className="p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold">Appointment Confirmed!</h2>
            <p className="mt-1 text-sm text-muted-foreground">We've scheduled your appointment for {selectedPatientName}.</p>
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
                { v: "Relative" as const, icon: HeartHandshake, t: "For a Relative", d: "Choose another patient on your phone number" },
              ]).map((o) => {
                const Icon = o.icon;
                const active = who === o.v;
                return (
                  <button key={o.v} onClick={() => { setWho(o.v); if (o.v === "Self") setSelectedRelative(null); }} className={cn("group relative rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5",
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
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-primary" /> Existing Patients on Your Phone Number</div>
                {!contactPhone ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">No phone number is linked to your profile.</div>
                ) : isLoadingRelatives ? (
                  <div className="rounded-lg border border-border bg-background px-3 py-3 text-sm text-muted-foreground">Loading relatives...</div>
                ) : relativesError ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">Unable to load patients against this phone number.</div>
                ) : allRelatives.length === 0 ? (
                  <div className="rounded-lg border border-border bg-background px-3 py-3 text-sm text-muted-foreground">No other patients are registered against this phone number.</div>
                ) : (
                  <div className="space-y-2">
                    {allRelatives.map((patient) => (
                      <button
                        type="button"
                        key={patient._id}
                        onClick={() => setSelectedRelative(patient)}
                        className={cn("flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all", selectedRelative?._id === patient._id ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/40")}
                      >
                        <div>
                          <div className="text-sm font-semibold">{getPatientName(patient)}</div>
                          <div className="text-xs text-muted-foreground">{patient.patientId} - {patient.age} years - {patient.gender === "F" ? "Female" : "Male"}</div>
                        </div>
                        {selectedRelative?._id === patient._id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
                {relativeError && <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{relativeError}</div>}
                {contactPhone && (
                  <div className="mt-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAddRelative((current) => !current)}>
                      {showAddRelative ? "Hide form" : "Add another patient"}
                    </Button>
                  </div>
                )}
                {contactPhone && showAddRelative && (
                  <form onSubmit={handleCreateRelative} className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4">
                    <div className="text-sm font-semibold">Add Patient Against This Phone</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="First name" value={newRelative.firstName} onChange={(firstName) => setNewRelative({ ...newRelative, firstName })} required />
                      <Field label="Last name" value={newRelative.lastName} onChange={(lastName) => setNewRelative({ ...newRelative, lastName })} required />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Age" type="number" min="0" value={newRelative.age} onChange={(age) => setNewRelative({ ...newRelative, age })} required />
                      <Field label="City" value={newRelative.city} onChange={(city) => setNewRelative({ ...newRelative, city })} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Gender</Label>
                        <div className="mt-1.5 grid grid-cols-2 gap-2">
                          {[["M", "Male"], ["F", "Female"]].map(([value, label]) => (
                            <button type="button" key={value} onClick={() => setNewRelative({ ...newRelative, gender: value })}
                              className={cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all", newRelative.gender === value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40")}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Relation</Label>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {["Parent", "Spouse", "Child", "Sibling", "Other"].map((relation) => (
                            <button type="button" key={relation} onClick={() => setNewRelative({ ...newRelative, relation })}
                              className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", newRelative.relation === relation ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40")}>
                              {relation}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button type="submit" disabled={isCreatingRelative}>{isCreatingRelative ? "Adding..." : "Add and select patient"}</Button>
                  </form>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button onClick={() => setStep(2)} disabled={who === "Relative" && !selectedRelative}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
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
              <Label>Checkup Name</Label>
              <Input className="mt-1.5" value={checkupName} onChange={(event) => setCheckupName(event.target.value)} placeholder="General consultation" required />
            </div>
            <div>
              <Label>Specialty</Label>
              <select
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={specialty}
                onChange={(event) => { setSpecialty(event.target.value); setDoctor(""); setAppointmentDate(""); setSelectedSlot(null); setAvailability(null); }}
                disabled={isLoadingDoctors || specialties.length === 0}
                required
              >
                <option value="">{isLoadingDoctors ? "Loading specialties..." : "Select specialty"}</option>
                {specialties.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              {doctorsError && <div className="mt-2 text-sm text-destructive">Unable to load available specialties.</div>}
            </div>
            <div>
              <Label>Doctor</Label>
              {!specialty ? (
                <div className="mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Select a specialty to see doctors.</div>
              ) : filteredDoctors.length === 0 ? (
                <div className="mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">No available doctors found for this specialty.</div>
              ) : (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {filteredDoctors.map((item) => (
                    <button key={item._id} onClick={() => { setDoctor(item._id); setAppointmentDate(""); setSelectedSlot(null); setAvailability(null); }} className={cn("flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                      doctor === item._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}>
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">{getInitials(getDoctorName(item))}</div>
                      <div><div className="text-sm font-medium">{getDoctorName(item)}</div><div className="text-xs text-muted-foreground">{item.speciality}</div></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label>Date and free slot</Label>
                  <div className="mt-1 text-xs text-muted-foreground">{weekRangeLabel}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={weekOffset === 0}
                    onClick={() => { setWeekOffset((current) => Math.max(0, current - 1)); setAppointmentDate(""); setSelectedSlot(null); setAvailability(null); }}
                    aria-label="Previous week"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="min-w-28 text-center text-xs font-medium text-muted-foreground">
                    {weekOffset === 0 ? "Next 7 days" : `Week ${weekOffset + 1}`}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={weekOffset === MAX_BOOKING_WEEK_OFFSET}
                    onClick={() => { setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1)); setAppointmentDate(""); setSelectedSlot(null); setAvailability(null); }}
                    aria-label="Next week"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!selectedDoctor ? (
                <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Select a doctor to see available days and slots.</div>
              ) : (
                <>
                  <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
                    {weekDates.map((date) => {
                      const hasSchedule = scheduledDays.has(date.day.toLowerCase());
                      const active = appointmentDate === date.value;
                      return (
                        <button
                          type="button"
                          key={date.value}
                          disabled={!hasSchedule || date.isPast}
                          onClick={() => { setAppointmentDate(date.value); setSelectedSlot(null); }}
                          className={cn("rounded-xl border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50",
                            active ? "border-primary bg-primary-soft ring-2 ring-primary/20" : "border-border hover:border-primary/40")}
                        >
                          <div className="text-xs font-medium text-muted-foreground">{date.day.slice(0, 3)}</div>
                          <div className="text-sm font-semibold">{date.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  {!weekDates.some((date) => !date.isPast && scheduledDays.has(date.day.toLowerCase())) && (
                    <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                      <span>This doctor has no schedule days in this date range.</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={weekOffset === MAX_BOOKING_WEEK_OFFSET}
                        onClick={() => { setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1)); setAppointmentDate(""); setSelectedSlot(null); setAvailability(null); }}
                      >
                        Try later week <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {isLoadingSlots ? (
                    <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Checking doctor schedule and existing appointments...</div>
                  ) : slotError ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{slotError}</div>
                  ) : availability?.schedule === null ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{availability.message}. Please change the day or week.</div>
                  ) : availability && availability.slots.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                      {availability.slots.map((slot) => (
                        <button
                          type="button"
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
                            selectedSlot?.time === slot.time ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40")}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  ) : availability ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">No free slots are available for this day. Please change the date/day.</div>
                  ) : null}

                  {availability && availability.slots.length > 0 && !availability.slots.some((slot) => slot.available) && (
                    <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                      <span>All slots are already booked for this doctor on {formatDisplayDate(appointmentDate)}. Please choose another day.</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={weekOffset === MAX_BOOKING_WEEK_OFFSET}
                        onClick={() => { setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1)); setAppointmentDate(""); setSelectedSlot(null); setAvailability(null); }}
                      >
                        Try later week <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <Label>Reason for Visit</Label>
              <Textarea className="mt-1.5" rows={3} value={reasonForVisit} onChange={(event) => setReasonForVisit(event.target.value)} placeholder="Describe your symptoms or reason..." />
            </div>
            <div>
              <Label className="flex items-center gap-2"><Bell className="h-3.5 w-3.5" /> Reminder Timing</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {REMINDER_OPTIONS.map((reminder) => (
                  <button
                    type="button"
                    key={reminder.value}
                    onClick={() => setPatientReminderMinutes(reminder.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                      patientReminderMinutes === reminder.value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40",
                    )}
                  >
                    <Checkbox checked={patientReminderMinutes === reminder.value} className="pointer-events-none" />
                    {reminder.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Notification Channel</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {[...NOTIFICATION_CHANNEL_OPTIONS, { value: "all", label: "All" }].map((channel) => {
                  const isAll = channel.value === "all";
                  const active = isAll
                    ? notificationChannels.length === NOTIFICATION_CHANNEL_OPTIONS.length
                    : notificationChannels.includes(channel.value);

                  return (
                    <button
                      type="button"
                      key={channel.value}
                      onClick={() => {
                        if (isAll) {
                          setNotificationChannels(NOTIFICATION_CHANNEL_OPTIONS.map((option) => option.value));
                          return;
                        }

                        setNotificationChannels((current) => {
                          if (current.includes(channel.value)) {
                            return current.length === 1 ? current : current.filter((item) => item !== channel.value);
                          }

                          return [...current, channel.value];
                        });
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                        active ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40",
                      )}
                    >
                      <Checkbox checked={active} className="pointer-events-none" />
                      {channel.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button onClick={() => setStep(3)} disabled={!checkupName.trim() || !specialty || !doctor || !appointmentDate || !selectedSlot || notificationChannels.length === 0}>Review &amp; Confirm <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-semibold">Review &amp; Confirm</h2>
              <p className="text-sm text-muted-foreground">Please verify the details before submitting</p>
            </div>
            <Block>
              <ReviewHeading title="Patient" />
              <div className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                <Row k="For" v={who} />
                {who === "Relative" ? (
                  <>
                    <Row k="Name" v={selectedRelative ? getPatientName(selectedRelative) : ""} />
                    <Row k="Age / Gender" v={selectedRelative ? `${selectedRelative.age} - ${selectedRelative.gender === "F" ? "Female" : "Male"}` : ""} />
                    <Row k="Patient ID" v={selectedRelative?.patientId ?? ""} />
                    <Row k="Relation" v={selectedRelative?.relation ?? ""} />
                  </>
                ) : (
                  <>
                    <Row k="Name" v={getUserName(user)} />
                    <Row k="Patient ID" v={user?.patientId ?? user?._id ?? ""} />
                  </>
                )}
              </div>
              <div className="my-4 border-t border-border" />
              <ReviewHeading title="Appointment" />
              <div className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                <Row k="Checkup" v={checkupName} />
                <Row k="Specialty" v={specialty} />
                <Row k="Doctor" v={selectedDoctor ? getDoctorName(selectedDoctor) : ""} />
                <Row k="Date" v={formatDisplayDate(appointmentDate)} />
                <Row k="Time" v={selectedSlot?.label ?? ""} />
                <Row k="Reminder" v={getReminderLabel(patientReminderMinutes)} />
                <Row k="Channel" v={getChannelLabel(notificationChannels)} />
                {reasonForVisit.trim() && <Row k="Reason" v={reasonForVisit.trim()} />}
              </div>
            </Block>
            {bookingError && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{bookingError}</div>}
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button onClick={handleConfirmBooking} disabled={isSubmittingBooking}>
                {isSubmittingBooking ? "Booking..." : "Confirm Booking"} <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </PatientShell>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <dl>{children}</dl>
    </div>
  );
}

function ReviewHeading({ title }: { title: string }) {
  return <div className="mb-3 text-sm font-semibold text-primary">{title}</div>;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}

function getPatientName(patient: PatientWithPhone) {
  return [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}

function getUserName(user: { firstName?: string; lastName?: string } | null | undefined) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Patient";
}

function getDoctorName(doctor: Doctor) {
  const user = typeof doctor.userId === "object" ? doctor.userId : undefined;
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "DR";
}

function getReminderLabel(value: number) {
  return REMINDER_OPTIONS.find((option) => option.value === value)?.label ?? `${value} Minutes Before`;
}

function getChannelLabel(values: string[]) {
  if (values.length === NOTIFICATION_CHANNEL_OPTIONS.length) return "All";

  return values
    .map((value) => NOTIFICATION_CHANNEL_OPTIONS.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

function buildWeekDates(offset: number) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + offset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const value = toDateInputValue(date);
    return {
      value,
      day: getWeekday(value),
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      isPast: false,
    };
  });
}

function getWeekRangeLabel(dates: ReturnType<typeof buildWeekDates>) {
  const first = dates[0]?.value;
  const last = dates[dates.length - 1]?.value;
  if (!first || !last) return "";
  return `${formatShortDate(first)} - ${formatShortDate(last)}`;
}

function formatShortDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekday(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { weekday: "long" });
}

function formatDisplayDate(value: string) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getContact(user: any) {
  return typeof user?.contactId === "object" ? user.contactId : undefined;
}

function getErrorMessage(err: unknown) {
  if (typeof err === "object" && err && "response" in err) {
    const response = (err as { response?: { data?: { message?: string | string[] } } }).response;
    const message = response?.data?.message;
    return Array.isArray(message) ? message.join(", ") : message;
  }
  return undefined;
}

function Field({ label, value, onChange, type = "text", required, min }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; min?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1.5" type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </div>
  );
}
