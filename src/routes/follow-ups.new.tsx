import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AppShell, Avatar } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CalendarCheck2, CheckCircle2, ChevronLeft, ChevronRight, Search, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctors } from "@/hooks/useDoctors";
import { Appointment, type AppointmentRecord, type AppointmentSlot, type DoctorAvailability, type FollowUpReason, type HandlerType } from "@/services/appointment.service";
import { Patient, type PatientRecord } from "@/services/patient.service";
import { CheckupService } from "@/services/checkup.service";
import type { Doctor } from "@/services/doctor.service";

export const Route = createFileRoute("/follow-ups/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    appointmentId: typeof search.appointmentId === "string" ? search.appointmentId : undefined,
  }),
  head: () => ({ meta: [{ title: "New Follow-up - MediFlow" }] }),
  component: NewFollowUpPage,
});

type FollowUpPatient = PatientRecord & { phone?: string; whatsappNo?: string; email?: string };

const MAX_BOOKING_WEEK_OFFSET = 7;
const REASONS: { value: FollowUpReason; label: string }[] = [
  { value: "planned_revisit", label: "Planned Revisit" },
  { value: "emergency_revisit", label: "Emergency Revisit" },
  { value: "test_only", label: "Test Only" },
  { value: "prescription_pickup", label: "Prescription Pickup" },
  { value: "other", label: "Other" },
];

function NewFollowUpPage() {
  const navigate = useNavigate();
  const { appointmentId } = Route.useSearch();
  const [parentAppointment, setParentAppointment] = useState<AppointmentRecord | null>(null);
  const [patient, setPatient] = useState<FollowUpPatient | null>(null);
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<FollowUpPatient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingParent, setIsLoadingParent] = useState(Boolean(appointmentId));
  const [handlerType, setHandlerType] = useState<HandlerType>("doctor");
  const [reason, setReason] = useState<FollowUpReason>("planned_revisit");
  const [reasonNote, setReasonNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState(getTodayValue());
  const [followUpTime, setFollowUpTime] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [checkupName, setCheckupName] = useState("Follow-up");
  const [weekOffset, setWeekOffset] = useState(0);
  const [availability, setAvailability] = useState<DoctorAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [bufferMinutes, setBufferMinutes] = useState(5);
  const [patientReminderMinutes, setPatientReminderMinutes] = useState(60);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: doctors = [], isLoading: isLoadingDoctors } = useDoctors();

  const availableDoctors = doctors.filter((doctor) => doctor.isAvailable !== false);
  const specialties = Array.from(new Set(availableDoctors.map((doctor) => doctor.speciality).filter(Boolean))).sort();
  const filteredDoctors = specialty ? availableDoctors.filter((doctor) => doctor.speciality === specialty) : [];
  const selectedDoctor = availableDoctors.find((doctor) => doctor._id === doctorId);
  const scheduledDays = useMemo(() => new Set((selectedDoctor?.schedule ?? []).map((slot) => slot.day.toLowerCase())), [selectedDoctor]);
  const weekDates = useMemo(() => buildWeekDates(weekOffset), [weekOffset]);
  const needsDoctorSchedule = handlerType === "doctor";

  useEffect(() => {
    if (!appointmentId) return;
    let active = true;
    setIsLoadingParent(true);
    Appointment.getAppointmentById(appointmentId)
      .then((response) => {
        if (!active) return;
        const appointment = response.appointment;
        setParentAppointment(appointment);
        const appointmentPatient = typeof appointment.patientId === "object" ? appointment.patientId : undefined;
        const contact = typeof appointment.contactId === "object" ? appointment.contactId : undefined;
        if (appointmentPatient) setPatient({ ...appointmentPatient, phone: contact?.phone, whatsappNo: contact?.whatsappNo, email: contact?.email });
        const appointmentDoctor = typeof appointment.doctorId === "object" ? appointment.doctorId : undefined;
        const appointmentCheckup = typeof appointment.checkupId === "object" ? appointment.checkupId : undefined;
        if (appointmentDoctor?._id) setDoctorId(appointmentDoctor._id);
        if (appointmentDoctor?.speciality) setSpecialty(appointmentDoctor.speciality);
        if (appointmentCheckup?.name) setCheckupName(appointmentCheckup.name);
      })
      .catch((err) => setError(getErrorMessage(err) ?? "Unable to load appointment details."))
      .finally(() => active && setIsLoadingParent(false));
    return () => {
      active = false;
    };
  }, [appointmentId]);

  useEffect(() => {
    if (!needsDoctorSchedule || !doctorId || !followUpDate) {
      setAvailability(null);
      setSelectedSlot(null);
      return;
    }
    let active = true;
    setIsLoadingSlots(true);
    setSelectedSlot(null);
    Appointment.getDoctorAvailability(doctorId, followUpDate, bufferMinutes)
      .then((response) => active && setAvailability(response))
      .catch((err) => active && setError(getErrorMessage(err) ?? "Unable to load doctor slots."))
      .finally(() => active && setIsLoadingSlots(false));
    return () => {
      active = false;
    };
  }, [bufferMinutes, doctorId, followUpDate, needsDoctorSchedule]);

  const handlePatientSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phone = query.trim();
    if (!phone) return;
    setIsSearching(true);
    setHasSearched(false);
    setFound([]);
    setError("");
    try {
      const response = await Patient.searchByPhone(phone);
      setFound(((response.patients ?? []) as PatientRecord[]).map((item) => ({
        ...item,
        phone: response.contact?.phone ?? phone,
        whatsappNo: response.contact?.whatsappNo,
        email: response.contact?.email,
      })));
      setHasSearched(true);
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to search patients.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!patient?._id) return setError("Please select a patient.");
    if (!reasonNote.trim()) return setError("Reason note is required.");
    if (!followUpDate) return setError("Please select a follow-up date.");
    if (handlerType === "nurse" && !followUpTime) return setError("Please select a follow-up time.");
    if (handlerType === "doctor" && (!doctorId || !selectedSlot)) return setError("Please select a doctor and available slot.");

    setError("");
    setIsSubmitting(true);
    try {
      const parentCheckup = typeof parentAppointment?.checkupId === "object" ? parentAppointment.checkupId : undefined;
      const checkupId = parentCheckup?._id || (handlerType === "doctor"
        ? (await CheckupService.findOrCreate({ name: checkupName.trim() || "Follow-up", specialityRequired: specialty || "General", bufferTime: bufferMinutes })).data._id
        : undefined);

      await Appointment.createFollowUp({
        patientId: patient._id,
        handlerType,
        doctorId: handlerType === "doctor" ? doctorId : undefined,
        followUpDate,
        followUpTime: handlerType === "doctor" ? selectedSlot?.time : followUpTime,
        reason,
        reasonNote: reasonNote.trim(),
        parentAppointmentId: parentAppointment?._id,
        checkupId,
        patientReminderMinutes: handlerType === "doctor" ? patientReminderMinutes : undefined,
        bufferMinutes,
      });
      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to create follow-up.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Follow-up" }]}>
        <div className="mx-auto max-w-xl">
          <Card className="p-8 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold">Follow-up Created</h2>
            <p className="mt-1 text-sm text-muted-foreground">The follow-up has been saved successfully.</p>
            <Button className="mt-5" onClick={() => navigate({ to: "/dashboard" })}>Back to Dashboard</Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "New Follow-up" }]}>
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Follow-up</h1>
        <p className="text-sm text-muted-foreground">Schedule a doctor follow-up or create a nurse follow-up visit.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="space-y-5 p-6">
          {isLoadingParent ? (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Loading appointment...</div>
          ) : !patient ? (
            <PatientSearch query={query} setQuery={setQuery} found={found} hasSearched={hasSearched} isSearching={isSearching} onSearch={handlePatientSearch} onSelect={setPatient} />
          ) : (
            <>
              <div>
                <h2 className="text-base font-semibold">Handler</h2>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {(["doctor", "nurse"] as HandlerType[]).map((value) => (
                    <button key={value} type="button" onClick={() => { setHandlerType(value); setSelectedSlot(null); }} className={cn("rounded-lg border px-3 py-3 text-left text-sm font-medium capitalize transition-all", handlerType === value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40")}>
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Reason</Label>
                  <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={reason} onChange={(event) => setReason(event.target.value as FollowUpReason)}>
                    {REASONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Buffer Minutes</Label>
                  <Input className="mt-1.5" type="number" min="0" value={bufferMinutes} onChange={(event) => setBufferMinutes(Math.max(0, Number(event.target.value) || 0))} />
                </div>
              </div>

              <div>
                <Label>Reason Note</Label>
                <Textarea className="mt-1.5" rows={3} value={reasonNote} onChange={(event) => setReasonNote(event.target.value)} placeholder="Add required follow-up details..." />
              </div>

              {handlerType === "nurse" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Date</Label>
                    <Input className="mt-1.5" type="date" value={followUpDate} min={getTodayValue()} onChange={(event) => setFollowUpDate(event.target.value)} />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input className="mt-1.5" type="time" value={followUpTime} onChange={(event) => setFollowUpTime(event.target.value)} />
                  </div>
                </div>
              ) : (
                <DoctorScheduleForm
                  doctors={availableDoctors}
                  isLoadingDoctors={isLoadingDoctors}
                  specialties={specialties}
                  filteredDoctors={filteredDoctors}
                  specialty={specialty}
                  setSpecialty={setSpecialty}
                  doctorId={doctorId}
                  setDoctorId={setDoctorId}
                  selectedDoctor={selectedDoctor}
                  scheduledDays={scheduledDays}
                  weekDates={weekDates}
                  weekOffset={weekOffset}
                  setWeekOffset={setWeekOffset}
                  followUpDate={followUpDate}
                  setFollowUpDate={setFollowUpDate}
                  availability={availability}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  isLoadingSlots={isLoadingSlots}
                  checkupName={checkupName}
                  setCheckupName={setCheckupName}
                  patientReminderMinutes={patientReminderMinutes}
                  setPatientReminderMinutes={setPatientReminderMinutes}
                />
              )}

              {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Follow-up"}</Button>
              </div>
            </>
          )}
        </Card>

        <aside>
          <Card className="sticky top-20 p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground"><UserRound className="h-3.5 w-3.5" /> Patient</div>
            {patient ? (
              <div className="flex flex-col items-center text-center">
                <Avatar initials={getInitials(getPatientName(patient))} />
                <div className="mt-2 font-semibold">{getPatientName(patient)}</div>
                <div className="text-xs text-muted-foreground">{patient.patientId}</div>
                <div className="mt-3 text-xs text-muted-foreground">{patient.phone || patient.whatsappNo || patient.email || "No contact saved"}</div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a patient to continue.</p>
            )}
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function PatientSearch(props: { query: string; setQuery: (value: string) => void; found: FollowUpPatient[]; hasSearched: boolean; isSearching: boolean; onSearch: (event: FormEvent<HTMLFormElement>) => void; onSelect: (patient: FollowUpPatient) => void }) {
  const { query, setQuery, found, hasSearched, isSearching, onSearch, onSelect } = props;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Patient</h2>
        <p className="text-sm text-muted-foreground">Search by phone and select a patient for this follow-up.</p>
      </div>
      <form onSubmit={onSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="tel" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="03001234567" className="pl-9" />
        </div>
        <Button type="submit" disabled={isSearching || !query.trim()}>{isSearching ? "Searching..." : "Search"}</Button>
      </form>
      {hasSearched && found.length === 0 && <div className="rounded-lg border border-border bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">No patient found.</div>}
      {found.map((patient) => (
        <button key={patient._id} type="button" onClick={() => onSelect(patient)} className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-all hover:border-primary/40">
          <Avatar initials={getInitials(getPatientName(patient))} />
          <div>
            <div className="font-medium">{getPatientName(patient)}</div>
            <div className="text-xs text-muted-foreground">{patient.patientId} - {patient.phone}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function DoctorScheduleForm(props: {
  doctors: Doctor[];
  isLoadingDoctors: boolean;
  specialties: string[];
  filteredDoctors: Doctor[];
  specialty: string;
  setSpecialty: (value: string) => void;
  doctorId: string;
  setDoctorId: (value: string) => void;
  selectedDoctor?: Doctor;
  scheduledDays: Set<string>;
  weekDates: ReturnType<typeof buildWeekDates>;
  weekOffset: number;
  setWeekOffset: (value: (current: number) => number) => void;
  followUpDate: string;
  setFollowUpDate: (value: string) => void;
  availability: DoctorAvailability | null;
  selectedSlot: AppointmentSlot | null;
  setSelectedSlot: (value: AppointmentSlot | null) => void;
  isLoadingSlots: boolean;
  checkupName: string;
  setCheckupName: (value: string) => void;
  patientReminderMinutes: number;
  setPatientReminderMinutes: (value: number) => void;
}) {
  const { isLoadingDoctors, specialties, filteredDoctors, specialty, setSpecialty, doctorId, setDoctorId, selectedDoctor, scheduledDays, weekDates, weekOffset, setWeekOffset, followUpDate, setFollowUpDate, availability, selectedSlot, setSelectedSlot, isLoadingSlots, checkupName, setCheckupName, patientReminderMinutes, setPatientReminderMinutes } = props;
  return (
    <div className="space-y-5">
      <div>
        <Label>Checkup Name</Label>
        <Input className="mt-1.5" value={checkupName} onChange={(event) => setCheckupName(event.target.value)} placeholder="Follow-up" />
      </div>
      <div>
        <Label>Specialty</Label>
        <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={specialty} onChange={(event) => { setSpecialty(event.target.value); setDoctorId(""); setSelectedSlot(null); }} disabled={isLoadingDoctors}>
          <option value="">{isLoadingDoctors ? "Loading specialties..." : "Select specialty"}</option>
          {specialties.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div>
        <Label>Doctor</Label>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <button key={doctor._id} type="button" onClick={() => { setDoctorId(doctor._id); setSelectedSlot(null); }} className={cn("rounded-lg border p-3 text-left transition-all", doctorId === doctor._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}>
              <div className="text-sm font-medium">{getDoctorName(doctor)}</div>
              <div className="text-xs text-muted-foreground">{doctor.speciality}</div>
            </button>
          ))}
        </div>
      </div>
      {selectedDoctor && (
        <>
          <div className="flex items-center justify-between">
            <Label>Date and Slot</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" disabled={weekOffset === 0} onClick={() => setWeekOffset((current) => Math.max(0, current - 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <Button type="button" variant="outline" size="icon" disabled={weekOffset === MAX_BOOKING_WEEK_OFFSET} onClick={() => setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weekDates.map((date) => {
              const hasSchedule = scheduledDays.has(date.day.toLowerCase());
              return (
                <button key={date.value} type="button" disabled={!hasSchedule} onClick={() => { setFollowUpDate(date.value); setSelectedSlot(null); }} className={cn("rounded-lg border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50", followUpDate === date.value ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}>
                  <div className="text-xs text-muted-foreground">{date.day.slice(0, 3)}</div>
                  <div className="text-sm font-semibold">{date.label}</div>
                </button>
              );
            })}
          </div>
          {isLoadingSlots ? (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Checking slots...</div>
          ) : availability?.slots?.length ? (
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {availability.slots.map((slot) => (
                <button key={slot.time} type="button" disabled={!slot.available} onClick={() => setSelectedSlot(slot)} className={cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground", selectedSlot?.time === slot.time ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40")}>
                  {slot.label}
                </button>
              ))}
            </div>
          ) : availability ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">No free slots are available for this day.</div>
          ) : null}
          <div>
            <Label>Patient Reminder Minutes</Label>
            <Input className="mt-1.5" type="number" min="0" value={patientReminderMinutes} onChange={(event) => setPatientReminderMinutes(Math.max(0, Number(event.target.value) || 0))} />
          </div>
        </>
      )}
    </div>
  );
}

function getPatientName(patient: FollowUpPatient) {
  return [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}

function getDoctorName(doctor: Doctor) {
  const user = typeof doctor.userId === "object" ? doctor.userId : undefined;
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT";
}

function buildWeekDates(offset: number) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + offset * 7);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const value = toDateInputValue(date);
    return { value, day: getWeekday(value), label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
  });
}

function getTodayValue() {
  return toDateInputValue(new Date());
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

function getErrorMessage(err: unknown) {
  if (typeof err === "object" && err && "response" in err) {
    const response = (err as { response?: { data?: { message?: string | string[] } } }).response;
    const message = response?.data?.message;
    return Array.isArray(message) ? message.join(", ") : message;
  }
  if (err instanceof Error) return err.message;
  return undefined;
}
