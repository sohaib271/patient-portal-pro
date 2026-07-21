import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { AppShell, Avatar } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  UserRound,
  CalendarCheck2,
  CheckCircle2,
  Bell,
  FileText,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctors } from "@/hooks/useDoctors";
import { Patient, type PatientRecord } from "@/services/patient.service";
import {
  Appointment,
  type AppointmentSlot,
  type DoctorAvailability,
} from "@/services/appointment.service";
import { CheckupService } from "@/services/checkup.service";
import type { Doctor } from "@/services/doctor.service";

export const Route = createFileRoute("/appointments/new")({
  head: () => ({ meta: [{ title: "New Appointment - MediFlow" }] }),
  component: NewAppointmentPage,
});

type Step = 1 | 2 | 3;
type AppointmentPatient = PatientRecord & { phone: string; whatsappNo?: string; email?: string };
type NewPatientFormState = {
  firstName: string;
  lastName: string;
  age: string;
  city: string;
  gender: string;
  relation: string;
  whatsappNo: string;
  email: string;
};

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
const RELATION_OPTIONS = [
  { value: "self", label: "Self" },
  { value: "spouse", label: "Spouse" },
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];

function NewAppointmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<AppointmentPatient | null>(null);
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<AppointmentPatient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [isRegisteringAnother, setIsRegisteringAnother] = useState(false);
  const [patientError, setPatientError] = useState("");
  const [newPatient, setNewPatient] = useState<NewPatientFormState>(getEmptyPatientForm());
  const [checkupName, setCheckupName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctor, setDoctor] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availability, setAvailability] = useState<DoctorAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [patientReminderMinutes, setPatientReminderMinutes] = useState(60);
  const [notificationChannels, setNotificationChannels] = useState<string[]>(["whatsapp"]);
  const [bufferMinutes, setBufferMinutes] = useState(5);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [done, setDone] = useState(false);
  const { data: doctors = [], isLoading: isLoadingDoctors, isError: doctorsError } = useDoctors();
  const availableDoctors = doctors.filter((item) => item.isAvailable !== false);
  const specialties = Array.from(
    new Set(availableDoctors.map((item) => item.speciality).filter(Boolean)),
  ).sort();
  const filteredDoctors = specialty
    ? availableDoctors.filter((item) => item.speciality === specialty)
    : [];
  const selectedDoctor = availableDoctors.find((item) => item._id === doctor);
  const weekDates = useMemo(() => buildWeekDates(weekOffset), [weekOffset]);
  const weekRangeLabel = useMemo(() => getWeekRangeLabel(weekDates), [weekDates]);
  const scheduledDays = useMemo(
    () => new Set((selectedDoctor?.schedule ?? []).map((slot) => slot.day.toLowerCase())),
    [selectedDoctor],
  );

  useEffect(() => {
    if (!selectedDoctor) {
      setAppointmentDate("");
      return;
    }

    if (appointmentDate && scheduledDays.has(getWeekday(appointmentDate).toLowerCase())) return;

    const nextScheduledDate = weekDates.find(
      (date) => !date.isPast && scheduledDays.has(date.day.toLowerCase()),
    );
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

    // Buffer input can change rapidly. Debounce it and abort obsolete HTTP calls so
    // the server only computes availability for the latest selection.
    const timer = window.setTimeout(() => {
      Appointment.getDoctorAvailability(
        doctor,
        appointmentDate,
        bufferMinutes,
        undefined,
        controller.signal,
      )
        .then((response) => {
          if (!controller.signal.aborted) setAvailability(response);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          setAvailability(null);
          setSlotError(getErrorMessage(err) ?? "Unable to load slots for this day.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoadingSlots(false);
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [appointmentDate, bufferMinutes, doctor]);

  if (done)
    return (
      <Confirmed
        onBack={() => navigate({ to: "/appointments" })}
        onBookAnother={() => {
          setDone(false);
          setStep(1);
        }}
      />
    );

  const handlePatientSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phone = query.trim();
    if (!phone) return;
    setPatientError("");
    setIsSearching(true);
    setHasSearched(false);
    setSelected(null);
    setIsRegisteringAnother(false);

    try {
      const response = await Patient.searchByPhone(phone);
      const patients = ((response.patients ?? []) as PatientRecord[]).map((patient) => ({
        ...patient,
        phone: response.contact?.phone ?? phone,
        whatsappNo: response.contact?.whatsappNo,
        email: response.contact?.email,
      }));
      setFound(patients);
      setHasSearched(true);
    } catch (err) {
      setFound([]);
      setPatientError(getErrorMessage(err) ?? "Unable to search patients by phone.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreatePatient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phone = query.trim();
    setPatientError("");
    setIsCreatingPatient(true);

    try {
      const response = await Patient.createPatientByPhone({
        phone,
        whatsappNo: newPatient.whatsappNo.trim(),
        email: newPatient.email.trim(),
        firstName: newPatient.firstName.trim(),
        lastName: newPatient.lastName.trim(),
        age: Number(newPatient.age),
        city: newPatient.city.trim(),
        gender: newPatient.gender,
        relation: newPatient.relation.trim() || "self",
      });
      const patient = {
        ...response.patient,
        phone: response.contact?.phone ?? phone,
        whatsappNo: response.contact?.whatsappNo,
        email: response.contact?.email,
      } as AppointmentPatient;
      setSelected(patient);
      setFound((current) => [patient, ...current.filter((item) => item._id !== patient._id)]);
      setHasSearched(true);
      setIsRegisteringAnother(false);
      setNewPatient(getEmptyPatientForm());
    } catch (err) {
      setPatientError(getErrorMessage(err) ?? "Unable to register patient.");
    } finally {
      setIsCreatingPatient(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (isSubmittingBooking) return;

    const contactId =
      typeof selected?.contactId === "string" ? selected.contactId : selected?.contactId?._id;
    if (!selected || !contactId || !doctor || !appointmentDate || !selectedSlot) {
      setBookingError("Please complete patient, doctor, date, and slot details.");
      return;
    }

    setBookingError("");
    setIsSubmittingBooking(true);

    try {
      const checkupResponse = await CheckupService.findOrCreate({
        name: checkupName.trim(),
        specialityRequired: specialty,
        bufferTime: bufferMinutes,
      });

      await Appointment.bookAppointment({
        contactId,
        patientId: selected._id,
        checkupId: checkupResponse.data._id,
        doctorId: doctor,
        reasonForVisit: [reasonForVisit.trim(), clinicalNotes.trim()].filter(Boolean).join("\n\n"),
        appointmentDate,
        appointmentTime: selectedSlot.time,
        patientReminderMinutes,
        notificationChannel: notificationChannels,
        bufferMinutes,
      });

      setDone(true);
    } catch (err) {
      setBookingError(
        getErrorMessage(err) ?? "Unable to book appointment. Please try another slot.",
      );
      if (doctor && appointmentDate) {
        try {
          const response = await Appointment.getDoctorAvailability(
            doctor,
            appointmentDate,
            bufferMinutes,
          );
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

  return (
    <AppShell
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Appointments", to: "/appointments" },
        { label: "New Appointment" },
      ]}
    >
      <Link
        to="/appointments"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Appointments
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Appointment</h1>
        <p className="text-sm text-muted-foreground">
          Complete the booking flow to schedule an appointment
        </p>
      </div>

      <Stepper step={step} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6">
          {step === 1 && (
            <PatientStep
              query={query}
              found={found}
              selected={selected}
              hasSearched={hasSearched}
              isSearching={isSearching}
              isCreatingPatient={isCreatingPatient}
              isRegisteringAnother={isRegisteringAnother}
              patientError={patientError}
              newPatient={newPatient}
              setNewPatient={setNewPatient}
              onSearch={handlePatientSearch}
              onCreate={handleCreatePatient}
              onQueryChange={(value) => {
                setQuery(value);
                setSelected(null);
                setHasSearched(false);
                setFound([]);
              }}
              onSelect={setSelected}
              onToggleRegister={() => setIsRegisteringAnother((current) => !current)}
              onContinue={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <AppointmentDetailsStep
              checkupName={checkupName}
              specialty={specialty}
              doctor={doctor}
              reasonForVisit={reasonForVisit}
              clinicalNotes={clinicalNotes}
              bufferMinutes={bufferMinutes}
              patientReminderMinutes={patientReminderMinutes}
              notificationChannels={notificationChannels}
              specialties={specialties}
              filteredDoctors={filteredDoctors}
              selectedDoctor={selectedDoctor}
              scheduledDays={scheduledDays}
              weekDates={weekDates}
              weekOffset={weekOffset}
              weekRangeLabel={weekRangeLabel}
              appointmentDate={appointmentDate}
              availability={availability}
              selectedSlot={selectedSlot}
              isLoadingDoctors={isLoadingDoctors}
              doctorsError={doctorsError}
              isLoadingSlots={isLoadingSlots}
              slotError={slotError}
              setCheckupName={setCheckupName}
              setSpecialty={setSpecialty}
              setDoctor={setDoctor}
              setReasonForVisit={setReasonForVisit}
              setClinicalNotes={setClinicalNotes}
              setBufferMinutes={setBufferMinutes}
              setPatientReminderMinutes={setPatientReminderMinutes}
              setNotificationChannels={setNotificationChannels}
              setWeekOffset={setWeekOffset}
              setAppointmentDate={setAppointmentDate}
              setAvailability={setAvailability}
              setSelectedSlot={setSelectedSlot}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          )}

          {step === 3 && selected && (
            <ReviewStep
              selected={selected}
              checkupName={checkupName}
              specialty={specialty}
              selectedDoctor={selectedDoctor}
              appointmentDate={appointmentDate}
              selectedSlot={selectedSlot}
              bufferMinutes={bufferMinutes}
              patientReminderMinutes={patientReminderMinutes}
              notificationChannels={notificationChannels}
              reasonForVisit={reasonForVisit}
              clinicalNotes={clinicalNotes}
              bookingError={bookingError}
              isSubmitting={isSubmittingBooking}
              onBack={() => setStep(2)}
              onConfirm={handleConfirmBooking}
            />
          )}
        </Card>

        <PatientSummary patient={selected} />
      </div>
    </AppShell>
  );
}

function PatientStep({
  query,
  found,
  selected,
  hasSearched,
  isSearching,
  isCreatingPatient,
  isRegisteringAnother,
  patientError,
  newPatient,
  setNewPatient,
  onSearch,
  onCreate,
  onQueryChange,
  onSelect,
  onToggleRegister,
  onContinue,
}: {
  query: string;
  found: AppointmentPatient[];
  selected: AppointmentPatient | null;
  hasSearched: boolean;
  isSearching: boolean;
  isCreatingPatient: boolean;
  isRegisteringAnother: boolean;
  patientError: string;
  newPatient: NewPatientFormState;
  setNewPatient: (value: NewPatientFormState) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onCreate: (event: FormEvent<HTMLFormElement>) => void;
  onQueryChange: (value: string) => void;
  onSelect: (patient: AppointmentPatient) => void;
  onToggleRegister: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <h2 className="text-base font-semibold">Patient</h2>
        <p className="text-sm text-muted-foreground">
          Search by phone and select the patient for this appointment.
        </p>
      </div>
      <div>
        <Label htmlFor="search">Search Patient by Phone</Label>
        <form onSubmit={onSearch} className="mt-1.5 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="tel"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="03001234567"
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={isSearching || !query.trim()}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>

      {patientError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {patientError}
        </div>
      )}

      {hasSearched && found.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600">
            <Search className="h-5 w-5" />
          </div>
          <div className="font-semibold">Patient Not Found</div>
          <p className="mt-1 text-sm text-muted-foreground">
            No patient exists against this phone number. Register a patient to continue.
          </p>
        </div>
      )}
      {hasSearched && found.length === 0 && (
        <PatientForm
          patient={newPatient}
          setPatient={setNewPatient}
          onSubmit={onCreate}
          isSubmitting={isCreatingPatient}
          title="Register Patient"
        />
      )}

      {found.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">{found.length} patient(s) found</div>
            <Button type="button" variant="outline" size="sm" onClick={onToggleRegister}>
              {isRegisteringAnother ? "Hide form" : "Register another patient"}
            </Button>
          </div>
          {found.slice(0, 5).map((patient) => (
            <button
              key={patient._id}
              type="button"
              onClick={() => onSelect(patient)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all",
                selected?._id === patient._id
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-primary/50 hover:bg-muted/40",
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar initials={getInitials(`${patient.firstName} ${patient.lastName}`)} />
                <div>
                  <div className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {patient.patientId} - {patient.phone}
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
      {hasSearched && found.length > 0 && isRegisteringAnother && (
        <PatientForm
          patient={newPatient}
          setPatient={setNewPatient}
          onSubmit={onCreate}
          isSubmitting={isCreatingPatient}
          title="Register Another Patient"
        />
      )}

      <div className="flex justify-end pt-2">
        <Button disabled={!selected} onClick={onContinue}>
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function AppointmentDetailsStep(props: {
  checkupName: string;
  specialty: string;
  doctor: string;
  reasonForVisit: string;
  clinicalNotes: string;
  bufferMinutes: number;
  patientReminderMinutes: number;
  notificationChannels: string[];
  specialties: string[];
  filteredDoctors: Doctor[];
  selectedDoctor?: Doctor;
  scheduledDays: Set<string>;
  weekDates: ReturnType<typeof buildWeekDates>;
  weekOffset: number;
  weekRangeLabel: string;
  appointmentDate: string;
  availability: DoctorAvailability | null;
  selectedSlot: AppointmentSlot | null;
  isLoadingDoctors: boolean;
  doctorsError: boolean;
  isLoadingSlots: boolean;
  slotError: string;
  setCheckupName: (value: string) => void;
  setSpecialty: (value: string) => void;
  setDoctor: (value: string) => void;
  setReasonForVisit: (value: string) => void;
  setClinicalNotes: (value: string) => void;
  setBufferMinutes: (value: number) => void;
  setPatientReminderMinutes: (value: number) => void;
  setNotificationChannels: Dispatch<SetStateAction<string[]>>;
  setWeekOffset: Dispatch<SetStateAction<number>>;
  setAppointmentDate: (value: string) => void;
  setAvailability: (value: DoctorAvailability | null) => void;
  setSelectedSlot: (value: AppointmentSlot | null) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const {
    checkupName,
    specialty,
    doctor,
    reasonForVisit,
    clinicalNotes,
    bufferMinutes,
    patientReminderMinutes,
    notificationChannels,
    specialties,
    filteredDoctors,
    selectedDoctor,
    scheduledDays,
    weekDates,
    weekOffset,
    weekRangeLabel,
    appointmentDate,
    availability,
    selectedSlot,
    isLoadingDoctors,
    doctorsError,
    isLoadingSlots,
    slotError,
    setCheckupName,
    setSpecialty,
    setDoctor,
    setReasonForVisit,
    setClinicalNotes,
    setBufferMinutes,
    setPatientReminderMinutes,
    setNotificationChannels,
    setWeekOffset,
    setAppointmentDate,
    setAvailability,
    setSelectedSlot,
    onBack,
    onContinue,
  } = props;

  const clearScheduleSelection = () => {
    setAppointmentDate("");
    setSelectedSlot(null);
    setAvailability(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <h2 className="text-base font-semibold">Appointment Details</h2>
        <p className="text-sm text-muted-foreground">
          Choose specialty, doctor, date, slot, buffer, and reminder.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Checkup Name</Label>
          <Input
            className="mt-1.5"
            value={checkupName}
            onChange={(event) => setCheckupName(event.target.value)}
            placeholder="General consultation"
            required
          />
        </div>
        <div>
          <Label>Buffer Minutes</Label>
          <Input
            className="mt-1.5"
            type="number"
            min="0"
            value={bufferMinutes}
            onChange={(event) => setBufferMinutes(Math.max(0, Number(event.target.value) || 0))}
          />
        </div>
      </div>
      <div>
        <Label>Specialty</Label>
        <select
          className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={specialty}
          onChange={(event) => {
            setSpecialty(event.target.value);
            setDoctor("");
            clearScheduleSelection();
          }}
          disabled={isLoadingDoctors || specialties.length === 0}
          required
        >
          <option value="">
            {isLoadingDoctors ? "Loading specialties..." : "Select specialty"}
          </option>
          {specialties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {doctorsError && (
          <div className="mt-2 text-sm text-destructive">Unable to load available specialties.</div>
        )}
      </div>
      <div>
        <Label>Doctor</Label>
        {!specialty ? (
          <div className="mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
            Select a specialty to see doctors.
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
            No available doctors found for this specialty.
          </div>
        ) : (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {filteredDoctors.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  setDoctor(item._id);
                  clearScheduleSelection();
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                  doctor === item._id
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                  {getInitials(getDoctorName(item))}
                </div>
                <div>
                  <div className="text-sm font-medium">{getDoctorName(item)}</div>
                  <div className="text-xs text-muted-foreground">{item.speciality}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <DateSlotPicker
        selectedDoctor={selectedDoctor}
        scheduledDays={scheduledDays}
        weekDates={weekDates}
        weekOffset={weekOffset}
        weekRangeLabel={weekRangeLabel}
        appointmentDate={appointmentDate}
        availability={availability}
        selectedSlot={selectedSlot}
        isLoadingSlots={isLoadingSlots}
        slotError={slotError}
        setWeekOffset={setWeekOffset}
        setAppointmentDate={setAppointmentDate}
        setSelectedSlot={setSelectedSlot}
        setAvailability={setAvailability}
      />
      <div>
        <Label>Reason for Visit</Label>
        <Textarea
          className="mt-1.5"
          rows={3}
          value={reasonForVisit}
          onChange={(event) => setReasonForVisit(event.target.value)}
          placeholder="Describe symptoms or reason..."
        />
      </div>
      <div>
        <Label className="flex items-center gap-2">
          <Bell className="h-3.5 w-3.5" /> Reminder Timing
        </Label>
        <div className="mt-2 flex flex-wrap gap-3">
          {REMINDER_OPTIONS.map((reminder) => (
            <button
              type="button"
              key={reminder.value}
              onClick={() => setPatientReminderMinutes(reminder.value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                patientReminderMinutes === reminder.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border hover:border-primary/40",
              )}
            >
              <Checkbox
                checked={patientReminderMinutes === reminder.value}
                className="pointer-events-none"
              />
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
                  if (isAll)
                    return setNotificationChannels(
                      NOTIFICATION_CHANNEL_OPTIONS.map((option) => option.value),
                    );
                  setNotificationChannels((current) =>
                    current.includes(channel.value)
                      ? current.length === 1
                        ? current
                        : current.filter((item) => item !== channel.value)
                      : [...current, channel.value],
                  );
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                  active
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border hover:border-primary/40",
                )}
              >
                <Checkbox checked={active} className="pointer-events-none" />
                {channel.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Label>Clinical Notes</Label>
        <Textarea
          className="mt-1.5"
          value={clinicalNotes}
          onChange={(event) => setClinicalNotes(event.target.value)}
          placeholder="Add clinical notes..."
          rows={3}
        />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={
            !checkupName.trim() ||
            !specialty ||
            !doctor ||
            !appointmentDate ||
            !selectedSlot ||
            notificationChannels.length === 0
          }
        >
          Review &amp; Confirm <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ReviewStep({
  selected,
  checkupName,
  specialty,
  selectedDoctor,
  appointmentDate,
  selectedSlot,
  bufferMinutes,
  patientReminderMinutes,
  notificationChannels,
  reasonForVisit,
  clinicalNotes,
  bookingError,
  isSubmitting,
  onBack,
  onConfirm,
}: {
  selected: AppointmentPatient;
  checkupName: string;
  specialty: string;
  selectedDoctor?: Doctor;
  appointmentDate: string;
  selectedSlot: AppointmentSlot | null;
  bufferMinutes: number;
  patientReminderMinutes: number;
  notificationChannels: string[];
  reasonForVisit: string;
  clinicalNotes: string;
  bookingError: string;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <h2 className="text-base font-semibold">Review &amp; Confirm</h2>
        <p className="text-sm text-muted-foreground">
          Please review all appointment details before confirming.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ReviewBlock
          icon={UserIcon}
          title="Patient"
          items={[
            ["Name", getPatientName(selected)],
            ["Patient ID", selected.patientId],
            ["Phone", selected.phone],
            ["Age", String(selected.age)],
          ]}
        />
        <ReviewBlock
          icon={CalendarCheck2}
          title="Appointment"
          items={[
            ["Checkup", checkupName],
            ["Specialty", specialty],
            ["Doctor", selectedDoctor ? getDoctorName(selectedDoctor) : ""],
            ["Date", formatDisplayDate(appointmentDate)],
            ["Time", selectedSlot?.label ?? ""],
            ["Buffer", `${bufferMinutes} minutes`],
          ]}
        />
        <ReviewBlock
          icon={Bell}
          title="Reminders"
          items={[
            ["Timing", getReminderLabel(patientReminderMinutes)],
            ["Channel", getChannelLabel(notificationChannels)],
          ]}
        />
        <ReviewBlock
          icon={FileText}
          title="Notes"
          items={[
            ["Reason", reasonForVisit.trim() || "Not specified"],
            ["Clinical", clinicalNotes.trim() || "None"],
          ]}
        />
      </div>
      {bookingError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {bookingError}
        </div>
      )}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
        <Button onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Confirm Booking"} <CheckCircle2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function PatientSummary({ patient }: { patient: AppointmentPatient | null }) {
  return (
    <aside>
      {patient ? (
        <Card className="p-5 sticky top-20">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" /> Patient Summary
          </div>
          <div className="flex flex-col items-center text-center">
            <Avatar initials={getInitials(getPatientName(patient))} />
            <div className="mt-2 font-semibold">{getPatientName(patient)}</div>
            <div className="text-xs text-muted-foreground">{patient.patientId}</div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <SumRow label="Phone" value={patient.phone} />
            <SumRow label="Age" value={String(patient.age)} />
            <SumRow label="Gender" value={patient.gender === "F" ? "Female" : "Male"} />
            <SumRow label="Relation" value={patient.relation ?? "Self"} />
          </dl>
        </Card>
      ) : (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
            <UserRound className="h-6 w-6" />
          </div>
          <div className="mt-3 font-medium">No Patient Selected</div>
          <p className="text-xs text-muted-foreground">
            Search and select a patient to view their information.
          </p>
        </Card>
      )}
    </aside>
  );
}

function DateSlotPicker(props: {
  selectedDoctor?: Doctor;
  scheduledDays: Set<string>;
  weekDates: ReturnType<typeof buildWeekDates>;
  weekOffset: number;
  weekRangeLabel: string;
  appointmentDate: string;
  availability: DoctorAvailability | null;
  selectedSlot: AppointmentSlot | null;
  isLoadingSlots: boolean;
  slotError: string;
  setWeekOffset: (value: (current: number) => number) => void;
  setAppointmentDate: (value: string) => void;
  setSelectedSlot: (value: AppointmentSlot | null) => void;
  setAvailability: (value: DoctorAvailability | null) => void;
}) {
  const {
    selectedDoctor,
    scheduledDays,
    weekDates,
    weekOffset,
    weekRangeLabel,
    appointmentDate,
    availability,
    selectedSlot,
    isLoadingSlots,
    slotError,
    setWeekOffset,
    setAppointmentDate,
    setSelectedSlot,
    setAvailability,
  } = props;
  const clearSlotState = () => {
    setAppointmentDate("");
    setSelectedSlot(null);
    setAvailability(null);
  };

  return (
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
            onClick={() => {
              setWeekOffset((current) => Math.max(0, current - 1));
              clearSlotState();
            }}
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
            onClick={() => {
              setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1));
              clearSlotState();
            }}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!selectedDoctor ? (
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
          Select a doctor to see available days and slots.
        </div>
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
                  onClick={() => {
                    setAppointmentDate(date.value);
                    setSelectedSlot(null);
                  }}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50",
                    active
                      ? "border-primary bg-primary-soft ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="text-xs font-medium text-muted-foreground">
                    {date.day.slice(0, 3)}
                  </div>
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
                onClick={() => {
                  setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1));
                  clearSlotState();
                }}
              >
                Try later week <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isLoadingSlots ? (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
              Checking doctor schedule and existing appointments...
            </div>
          ) : slotError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {slotError}
            </div>
          ) : availability?.schedule === null ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {availability.message}. Please change the day or week.
            </div>
          ) : availability && availability.slots.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {availability.slots.map((slot) => (
                <button
                  type="button"
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
                    selectedSlot?.time === slot.time
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          ) : availability ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              No free slots are available for this day. Please change the date/day.
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function PatientForm({
  patient,
  setPatient,
  onSubmit,
  isSubmitting,
  title,
}: {
  patient: NewPatientFormState;
  setPatient: (value: NewPatientFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  title: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="WhatsApp Number"
          type="tel"
          value={patient.whatsappNo}
          onChange={(whatsappNo) => setPatient({ ...patient, whatsappNo })}
          placeholder="03001234567"
        />
        <Field
          label="Email"
          type="email"
          value={patient.email}
          onChange={(email) => setPatient({ ...patient, email })}
          placeholder="patient@example.com"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="First name"
          value={patient.firstName}
          onChange={(firstName) => setPatient({ ...patient, firstName })}
          required
        />
        <Field
          label="Last name"
          value={patient.lastName}
          onChange={(lastName) => setPatient({ ...patient, lastName })}
          required
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Age"
          type="number"
          min="0"
          value={patient.age}
          onChange={(age) => setPatient({ ...patient, age })}
          required
        />
        <Field
          label="City"
          value={patient.city}
          onChange={(city) => setPatient({ ...patient, city })}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Gender</Label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {[
              ["M", "Male"],
              ["F", "Female"],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => setPatient({ ...patient, gender: value })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                  patient.gender === value
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border hover:border-primary/40",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <RelationField
          value={patient.relation}
          onChange={(relation) => setPatient({ ...patient, relation })}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register and select patient"}
      </Button>
    </form>
  );
}

function getEmptyPatientForm(): NewPatientFormState {
  return {
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    gender: "M",
    relation: "self",
    whatsappNo: "",
    email: "",
  };
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
            <div
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all",
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : n}
            </div>
            <div
              className={cn(
                "text-sm font-medium",
                active || done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s}
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-px flex-1", done ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewBlock({
  icon: Icon,
  title,
  items,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  items: [string, string][];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </div>
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

function getPatientName(patient: AppointmentPatient) {
  return [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}

function getDoctorName(doctor: Doctor) {
  const user = typeof doctor.userId === "object" ? doctor.userId : undefined;
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PT"
  );
}

function getReminderLabel(value: number) {
  return (
    REMINDER_OPTIONS.find((option) => option.value === value)?.label ?? `${value} Minutes Before`
  );
}

function getChannelLabel(values: string[]) {
  if (values.length === NOTIFICATION_CHANNEL_OPTIONS.length) return "All";
  return values
    .map(
      (value) =>
        NOTIFICATION_CHANNEL_OPTIONS.find((option) => option.value === value)?.label ?? value,
    )
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

function getErrorMessage(err: unknown) {
  if (typeof err === "object" && err && "response" in err) {
    const response = (err as { response?: { data?: { message?: string | string[] } } }).response;
    const message = response?.data?.message;
    return Array.isArray(message) ? message.join(", ") : message;
  }
  return undefined;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  min,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        className="mt-1.5"
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

function RelationField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label>Relation</Label>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {RELATION_OPTIONS.map((relation) => (
          <button
            type="button"
            key={relation.value}
            onClick={() => onChange(relation.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              value === relation.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/40",
            )}
          >
            {relation.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Confirmed({ onBack, onBookAnother }: { onBack: () => void; onBookAnother: () => void }) {
  return (
    <AppShell
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Appointments", to: "/appointments" },
        { label: "Confirmation" },
      ]}
    >
      <div className="mx-auto max-w-xl">
        <Card className="p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Appointment Booked!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The appointment has been successfully scheduled.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button variant="outline" onClick={onBack}>
              View Appointments
            </Button>
            <Button onClick={onBookAnother}>Book Another</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
