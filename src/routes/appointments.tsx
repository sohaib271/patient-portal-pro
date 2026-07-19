import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AppShell, StatusBadge, Avatar } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, SlidersHorizontal, Eye, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppointments, useDoctorAppointments, useUpdateAppointment, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { useDoctorProfile, useDoctors } from "@/hooks/useDoctors";
import { useUser } from "@/hooks/useUser";
import { Appointment, type AppointmentRecord, type AppointmentSlot, type AppointmentStatus, type UpdateAppointmentPayload } from "@/services/appointment.service";
import type { Doctor } from "@/services/doctor.service";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Appointments - MediFlow" }] }),
  component: AppointmentsLayout,
});

const MAX_BOOKING_WEEK_OFFSET = 7;
const statuses: { value: "All" | AppointmentStatus; label: string }[] = [
  { value: "All", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "booked", label: "Booked" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "delayed", label: "Delayed" },
  { value: "cancelled", label: "Cancelled" },
];

function AppointmentsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/appointments") return <Outlet />;
  return <AppointmentsList />;
}

function AppointmentsList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof statuses)[number]["value"]>("All");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AppointmentRecord | null>(null);
  const [viewing, setViewing] = useState<AppointmentRecord | null>(null);
  const { user, isLoading: isLoadingUser } = useUser();
  const isDoctor = user?.role === "doctor";
  const { data: doctorProfile, isLoading: isLoadingDoctorProfile } = useDoctorProfile(isDoctor ? user?._id : undefined);
  const adminAppointments = useAppointments({ enabled: Boolean(user && !isDoctor) });
  const doctorAppointments = useDoctorAppointments(doctorProfile?._id, undefined, Boolean(user && isDoctor && doctorProfile?._id));
  const activeQuery = isDoctor ? doctorAppointments : adminAppointments;
  const { data: appointments = [], isLoading, isError, refetch } = activeQuery;
  const isLoadingAppointments = isLoadingUser || (isDoctor && isLoadingDoctorProfile) || isLoading;
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return appointments.filter((appointment) => {
      const statusMatch = tab === "All" || appointment.status === tab;
      const text = [getPatientName(appointment), getPatientCode(appointment), getDoctorName(appointment), getSpecialty(appointment)]
        .join(" ")
        .toLowerCase();
      return statusMatch && (!normalizedQuery || text.includes(normalizedQuery));
    });
  }, [appointments, normalizedQuery, tab]);

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: isDoctor ? "My Appointments" : "Appointments" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isDoctor ? "My Appointments" : "Appointments"}</h1>
          <p className="text-sm text-muted-foreground">{appointments.length} total appointments</p>
        </div>
        {!isDoctor && (
          <Button asChild>
            <Link to="/appointments/new"><Plus className="h-4 w-4" /> New Appointment</Link>
          </Button>
        )}
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by patient, ID, doctor, or specialty..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}><SlidersHorizontal className="h-4 w-4" /> Refresh</Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1 border-b border-border">
          {statuses.map((status) => {
            const count = status.value === "All" ? appointments.length : appointments.filter((appointment) => appointment.status === status.value).length;
            return (
              <button
                key={status.value}
                onClick={() => setTab(status.value)}
                className={cn("relative px-3 py-2 text-sm font-medium transition-colors", tab === status.value ? "text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                {status.label} <span className="ml-1 text-xs opacity-70">{count}</span>
                {tab === status.value && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">APT ID</th>
                <th className="py-3 pr-4">Patient</th>
                {!isDoctor && <th className="py-3 pr-4">Doctor</th>}
                <th className="py-3 pr-4">Specialty</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Time</th>
                <th className="py-3 pr-4">Created By</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoadingAppointments ? (
                <tr><td colSpan={isDoctor ? 8 : 9} className="py-8 text-center text-muted-foreground">Loading appointments...</td></tr>
              ) : isError ? (
                <tr><td colSpan={isDoctor ? 8 : 9} className="py-8 text-center text-destructive">Unable to load appointments.</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={isDoctor ? 8 : 9} className="py-8 text-center text-muted-foreground">No appointments found.</td></tr>
              ) : filtered.map((appointment) => (
                <tr key={appointment._id} className="group hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4 font-medium text-primary">{appointment._id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={getInitials(getPatientName(appointment))} />
                      <div>
                        <div className="font-medium">{getPatientName(appointment)}</div>
                        <div className="text-xs text-muted-foreground">{getPatientCode(appointment)}</div>
                      </div>
                    </div>
                  </td>
                  {!isDoctor && <td className="py-3 pr-4">{getDoctorName(appointment)}</td>}
                  <td className="py-3 pr-4 text-muted-foreground">{getSpecialty(appointment)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{getAppointmentDateLabel(appointment)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{getAppointmentTimeLabel(appointment)}</td>
                  <td className="py-3 pr-4"><CreatorRoleBadge role={appointment.createdByRole} /></td>
                  <td className="py-3 pr-4"><StatusBadge status={formatStatus(appointment.status)} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewing(appointment)} aria-label="View appointment"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditing(appointment)} aria-label="Update appointment"><Pencil className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AppointmentDetails appointment={viewing} open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)} />
      <AppointmentEditor
  appointment={editing}
  open={Boolean(editing)}
  onOpenChange={(open) => !open && setEditing(null)}
  lockSchedule={isDoctor}
  onCreateFollowUp={(appointment) => {
    setEditing(null);
    navigate({ to: "/follow-ups/new", search: { appointmentId: appointment._id } });
  }}
/>
    </AppShell>
  );
}

function AppointmentEditor({ appointment, open, onOpenChange, lockSchedule = false, onCreateFollowUp }: { appointment: AppointmentRecord | null; open: boolean; onOpenChange: (open: boolean) => void; lockSchedule?: boolean; onCreateFollowUp?: (appointment: AppointmentRecord) => void }) {
  const [status, setStatus] = useState<AppointmentStatus>("pending");
  const [specialty, setSpecialty] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [bufferMinutes, setBufferMinutes] = useState(5);
  const [error, setError] = useState("");
  const { data: doctors = [], isLoading: isLoadingDoctors } = useDoctors();
  const updateAppointment = useUpdateAppointment();
  const updateAppointmentStatus = useUpdateAppointmentStatus();
  const availableDoctors = useMemo(() => doctors.filter((doctor) => doctor.isAvailable !== false), [doctors]);
  const specialties = useMemo(() => Array.from(new Set(availableDoctors.map((doctor) => doctor.speciality).filter(Boolean))).sort(), [availableDoctors]);
  const filteredDoctors = useMemo(() => availableDoctors.filter((doctor) => !specialty || doctor.speciality === specialty), [availableDoctors, specialty]);
  const selectedDoctor = availableDoctors.find((doctor) => doctor._id === doctorId);
  const weekDates = useMemo(() => buildWeekDates(weekOffset), [weekOffset]);
  const scheduledDays = useMemo(() => new Set((selectedDoctor?.schedule ?? []).map((slot) => slot.day.toLowerCase())), [selectedDoctor]);

  const isCompleted = appointment?.status === "completed";
  const isDelayedStatus = status === "delayed";
  // Completed appointments are fully locked — no schedule edits, no field edits at all except viewing.
  const canEditSchedule = !lockSchedule && !isDelayedStatus && !isCompleted;
  const isReadOnly = isCompleted;

  const originalDoctorId = appointment ? getDoctorId(appointment) : "";
  const originalDate = appointment ? getDateValue(appointment) : "";
  const originalTime = appointment ? getTimeValue(appointment.estimatedTurnTime) : "";
  const originalBufferMinutes = appointment?.bufferMinutes ?? 5;
  const scheduleFieldsChanged = canEditSchedule && Boolean(appointment) && (
    doctorId !== originalDoctorId ||
    appointmentDate !== originalDate ||
    bufferMinutes !== originalBufferMinutes
  );

  // Only exclude the current appointment's slot when we're checking availability
  // for the SAME doctor+date it's already booked on — otherwise there's nothing to exclude.
  const excludeAppointmentId = appointment && doctorId === originalDoctorId && appointmentDate === originalDate
    ? appointment._id
    : undefined;

  const availabilityQuery = useQuery({
    queryKey: ["doctor-availability", doctorId, appointmentDate, bufferMinutes, excludeAppointmentId],
    queryFn: () => Appointment.getDoctorAvailability(doctorId, appointmentDate, bufferMinutes, excludeAppointmentId),
    enabled: Boolean(open && canEditSchedule && doctorId && appointmentDate),
  });

  useEffect(() => {
    if (!appointment || !open) return;
    const currentSpecialty = getSpecialty(appointment);
    setStatus((appointment.status as AppointmentStatus) ?? "pending");
    setSpecialty(currentSpecialty);
    setDoctorId(getDoctorId(appointment));
    setAppointmentDate(getDateValue(appointment));
    setSelectedSlot(null);
    setReasonForVisit(appointment.reasonForVisit ?? "");
    setBufferMinutes(appointment.bufferMinutes ?? 5);
    setWeekOffset(0);
    setError("");
  }, [appointment, open]);

  useEffect(() => {
    if (!open || !selectedDoctor || !canEditSchedule) return;
    if (appointmentDate && scheduledDays.has(getWeekday(appointmentDate).toLowerCase())) return;
    const nextScheduledDate = weekDates.find((date) => scheduledDays.has(date.day.toLowerCase()));
    setAppointmentDate(nextScheduledDate?.value ?? "");
  }, [appointmentDate, open, scheduledDays, selectedDoctor, weekDates, canEditSchedule]);

  // Mark the appointment's own current slot as selected/available by default when nothing changed yet,
  // so the disabled-Save logic doesn't force a reselect when the user hasn't touched schedule fields.
  const effectiveSlotOk = !canEditSchedule || !scheduleFieldsChanged || Boolean(selectedSlot);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!appointment || isReadOnly) return;
    setError("");

    if (canEditSchedule && scheduleFieldsChanged && !selectedSlot) {
      setError("Please select an available slot before saving schedule changes.");
      return;
    }

    if (canEditSchedule && selectedSlot && !selectedSlot.available) {
      setError("Selected slot is no longer available. Please choose another slot.");
      availabilityQuery.refetch();
      return;
    }

    try {
      const reasonChanged = reasonForVisit !== (appointment.reasonForVisit ?? "");
      const doctorChanged = doctorId !== originalDoctorId;
      const dateChanged = appointmentDate !== originalDate;
      const bufferChanged = bufferMinutes !== originalBufferMinutes;
      const timeChanged = Boolean(selectedSlot && selectedSlot.time !== originalTime);
      const data: UpdateAppointmentPayload = {};

      if (reasonChanged) data.reasonForVisit = reasonForVisit;
      if (!lockSchedule && !isDelayedStatus) {
        if (doctorChanged) data.doctorId = doctorId;
        if (dateChanged) data.appointmentDate = appointmentDate;
        if (timeChanged) data.appointmentTime = selectedSlot!.time;
        if (bufferChanged) data.bufferMinutes = bufferMinutes;
      }

      if (Object.keys(data).length > 0) {
        await updateAppointment.mutateAsync({
          appointmentId: appointment._id,
          data,
        });
      }
      if (status !== appointment.status) {
        await updateAppointmentStatus.mutateAsync({ appointmentId: appointment._id, status });
      }
      onOpenChange(false);
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to update appointment.");
      availabilityQuery.refetch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isCompleted ? "Appointment (Completed)" : "Update Appointment"}</DialogTitle>
          <DialogDescription>
            {isCompleted
              ? "This appointment is completed and can no longer be edited. You can schedule a follow-up instead."
              : "Change status, doctor, date, slot, or visit notes."}
          </DialogDescription>
        </DialogHeader>

        {isCompleted && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Completed appointments are locked. Need to see the patient again?{" "}
            <button
              type="button"
              className="font-medium underline underline-offset-2"
              onClick={() => appointment && onCreateFollowUp?.(appointment)}
            >
              Schedule a follow-up
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset disabled={isReadOnly} className="space-y-5 disabled:opacity-60">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Status</Label>
                <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value as AppointmentStatus)} disabled={isReadOnly}>
                  {statuses.filter((item) => item.value !== "All").map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                {status === "delayed" && <p className="mt-1 text-xs text-muted-foreground">Delayed appointments are ignored by the scheduling system.</p>}
              </div>
              {!lockSchedule && !isCompleted && (
                <div>
                <Label>Buffer Minutes</Label>
                <Input className="mt-1.5" type="number" min="0" value={bufferMinutes} onChange={(event) => { setBufferMinutes(Math.max(0, Number(event.target.value) || 0)); setSelectedSlot(null); }} />
                </div>
              )}
            </div>

            {canEditSchedule && (
              <>
                <div>
                  <Label>Specialty</Label>
                  <select
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={specialty}
                    onChange={(event) => { setSpecialty(event.target.value); setDoctorId(""); setAppointmentDate(""); setSelectedSlot(null); }}
                    disabled={isLoadingDoctors}
                  >
                    <option value="">{isLoadingDoctors ? "Loading specialties..." : "Select specialty"}</option>
                    {specialties.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

                <div>
                  <Label>Doctor</Label>
                  {!specialty ? (
                    <div className="mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Select a specialty to see doctors.</div>
                  ) : filteredDoctors.length === 0 ? (
                    <div className="mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">No available doctors found for this specialty.</div>
                  ) : (
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {filteredDoctors.map((doctor) => (
                        <button key={doctor._id} type="button" onClick={() => { setDoctorId(doctor._id); setAppointmentDate(""); setSelectedSlot(null); }} className={cn("flex items-center gap-3 rounded-lg border p-3 text-left transition-all", doctorId === doctor._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}>
                          <Avatar initials={getInitials(getDoctorDisplayName(doctor))} />
                          <div><div className="text-sm font-medium">{getDoctorDisplayName(doctor)}</div><div className="text-xs text-muted-foreground">{doctor.speciality}</div></div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <DateSlotPicker
                  selectedDoctor={selectedDoctor}
                  weekDates={weekDates}
                  weekOffset={weekOffset}
                  appointmentDate={appointmentDate}
                  scheduledDays={scheduledDays}
                  selectedSlot={selectedSlot}
                  availability={availabilityQuery.data}
                  isLoadingSlots={availabilityQuery.isLoading || availabilityQuery.isFetching}
                  slotError={availabilityQuery.isError ? getErrorMessage(availabilityQuery.error) ?? "Unable to load slots." : ""}
                  setWeekOffset={setWeekOffset}
                  setAppointmentDate={setAppointmentDate}
                  setSelectedSlot={setSelectedSlot}
                />
              </>
            )}

            <div>
              <Label>Reason for Visit</Label>
              <Textarea className="mt-1.5" rows={3} value={reasonForVisit} onChange={(event) => setReasonForVisit(event.target.value)} disabled={isReadOnly} />
            </div>
          </fieldset>

          {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
          <DialogFooter>
            {isCompleted ? (
              <>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                <Button type="button" onClick={() => appointment && onCreateFollowUp?.(appointment)}>Schedule Follow-up</Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={updateAppointment.isPending || updateAppointmentStatus.isPending || (canEditSchedule && (!doctorId || !appointmentDate || (scheduleFieldsChanged && !selectedSlot)))}>{updateAppointment.isPending || updateAppointmentStatus.isPending ? "Saving..." : "Save Changes"}</Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DateSlotPicker(props: {
  selectedDoctor?: Doctor;
  weekDates: ReturnType<typeof buildWeekDates>;
  weekOffset: number;
  appointmentDate: string;
  scheduledDays: Set<string>;
  selectedSlot: AppointmentSlot | null;
  availability?: { schedule: unknown; slots: AppointmentSlot[]; message?: string } | null;
  isLoadingSlots: boolean;
  slotError: string;
  setWeekOffset: (value: (current: number) => number) => void;
  setAppointmentDate: (value: string) => void;
  setSelectedSlot: (value: AppointmentSlot | null) => void;
}) {
  const { selectedDoctor, weekDates, weekOffset, appointmentDate, scheduledDays, selectedSlot, availability, isLoadingSlots, slotError, setWeekOffset, setAppointmentDate, setSelectedSlot } = props;
  const clearSelection = () => {
    setAppointmentDate("");
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Label>Date and Slot</Label>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" disabled={weekOffset === 0} onClick={() => { setWeekOffset((current) => Math.max(0, current - 1)); clearSelection(); }} aria-label="Previous week"><ChevronLeft className="h-4 w-4" /></Button>
          <div className="min-w-28 text-center text-xs font-medium text-muted-foreground">{weekOffset === 0 ? "Next 7 days" : `Week ${weekOffset + 1}`}</div>
          <Button type="button" variant="outline" size="icon" disabled={weekOffset === MAX_BOOKING_WEEK_OFFSET} onClick={() => { setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1)); clearSelection(); }} aria-label="Next week"><ChevronRight className="h-4 w-4" /></Button>
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
                <button key={date.value} type="button" disabled={!hasSchedule} onClick={() => { setAppointmentDate(date.value); setSelectedSlot(null); }} className={cn("rounded-lg border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50", active ? "border-primary bg-primary-soft ring-2 ring-primary/20" : "border-border hover:border-primary/40")}>
                  <div className="text-xs font-medium text-muted-foreground">{date.day.slice(0, 3)}</div>
                  <div className="text-sm font-semibold">{date.label}</div>
                </button>
              );
            })}
          </div>
          {isLoadingSlots ? (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">Checking doctor schedule and existing appointments...</div>
          ) : slotError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{slotError}</div>
          ) : availability?.schedule === null ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{availability.message}</div>
          ) : availability && availability.slots.length > 0 ? (
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
        </>
      )}
    </div>
  );
}

function AppointmentDetails({ appointment, open, onOpenChange }: { appointment: AppointmentRecord | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>{appointment ? appointment._id : ""}</DialogDescription>
        </DialogHeader>
        {appointment && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Detail label="Patient" value={`${getPatientName(appointment)} (${getPatientCode(appointment)})`} />
            <Detail label="Doctor" value={getDoctorName(appointment)} />
            <Detail label="Specialty" value={getSpecialty(appointment)} />
            <Detail label="Checkup" value={getCheckupName(appointment)} />
            <Detail label="Date" value={getAppointmentDateLabel(appointment)} />
            <Detail label="Time" value={getAppointmentTimeLabel(appointment)} />
            <Detail label="Turn" value={isDelayedAppointment(appointment) ? "N/A" : appointment.turnNumber ? String(appointment.turnNumber) : "-"} />
            <Detail label="Status" value={formatStatus(appointment.status)} />
            <div className="sm:col-span-2"><Detail label="Reason" value={appointment.reasonForVisit || "Not specified"} /></div>
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-border p-3"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>;
}

function CreatorRoleBadge({ role }: { role?: string }) {
  const normalizedRole = (role || "unknown").toLowerCase();
  const roleClassName = {
    admin: "border-sky-200 bg-sky-50 text-sky-700",
    doctor: "border-emerald-200 bg-emerald-50 text-emerald-700",
    patient: "border-amber-200 bg-amber-50 text-amber-700",
    user: "border-slate-200 bg-slate-50 text-slate-700",
    unknown: "border-slate-200 bg-slate-50 text-slate-600",
  }[normalizedRole] ?? "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", roleClassName)}>
      {formatCreatorRole(role)}
    </span>
  );
}

function getPatientName(appointment: AppointmentRecord) {
  const patient = typeof appointment.patientId === "object" ? appointment.patientId : undefined;
  return [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}

function getPatientCode(appointment: AppointmentRecord) {
  const patient = typeof appointment.patientId === "object" ? appointment.patientId : undefined;
  return patient?.patientId ?? "No patient ID";
}

function getDoctorName(appointment: AppointmentRecord) {
  const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : undefined;
  const user = typeof doctor?.userId === "object" ? doctor.userId : undefined;
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unassigned Doctor";
}

function getDoctorDisplayName(doctor: Doctor) {
  const user = typeof doctor.userId === "object" ? doctor.userId : undefined;
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
}

function getDoctorId(appointment: AppointmentRecord) {
  return typeof appointment.doctorId === "object" ? appointment.doctorId._id : appointment.doctorId ?? "";
}

function getSpecialty(appointment: AppointmentRecord) {
  const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : undefined;
  const checkup = typeof appointment.checkupId === "object" ? appointment.checkupId : undefined;
  return doctor?.speciality ?? checkup?.specialityRequired ?? "";
}

function getCheckupName(appointment: AppointmentRecord) {
  const checkup = typeof appointment.checkupId === "object" ? appointment.checkupId : undefined;
  return checkup?.name ?? "Not specified";
}

function getDateValue(appointment: AppointmentRecord) {
  return getPakistanDateValue(appointment.appointmentDate);
}

function isDelayedAppointment(appointment: AppointmentRecord) {
  return appointment.status === "delayed";
}

function getAppointmentDateLabel(appointment: AppointmentRecord) {
  if (isDelayedAppointment(appointment)) return "N/A";
  return formatDisplayDate(getDateValue(appointment));
}

function getAppointmentTimeLabel(appointment: AppointmentRecord) {
  if (isDelayedAppointment(appointment)) return "N/A";
  return formatDisplayTime(appointment.estimatedTurnTime);
}

function getTimeValue(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Karachi" });
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AP";
}

function formatStatus(status?: string) {
  const match = statuses.find((item) => item.value === status);
  return match?.label ?? "Pending";
}

function formatCreatorRole(role?: string) {
  if (!role) return "Unknown";
  return role.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDisplayDate(value: string) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDisplayTime(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Karachi" });
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

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPakistanDateValue(value: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Karachi",
  }).formatToParts(new Date(value));
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
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
