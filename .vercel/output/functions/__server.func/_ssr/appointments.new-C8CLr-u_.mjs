import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as UserRound, C as FileText, D as ChevronRight, K as CircleCheck, L as Bell, N as CalendarCheck2, O as ChevronLeft, R as ArrowRight, d as Search, r as User, z as ArrowLeft } from "../_libs/lucide-react.mjs";
import { l as useDoctors, n as Avatar, t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as Label } from "./label-BuKBvabm.mjs";
import { t as Textarea } from "./textarea-BCF4nEK2.mjs";
import { t as Appointment } from "./appointment.service-Cx5LZS-H.mjs";
import { t as Checkbox } from "./checkbox-BejW3u6J.mjs";
import { t as Patient } from "./patient.service-CCdChYiv.mjs";
import { t as CheckupService } from "./checkup.service-CQreqd1m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/appointments.new-C8CLr-u_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_BOOKING_WEEK_OFFSET = 7;
var REMINDER_OPTIONS = [
	{
		value: 15,
		label: "15 Minutes Before"
	},
	{
		value: 30,
		label: "30 Minutes Before"
	},
	{
		value: 60,
		label: "1 Hour Before"
	},
	{
		value: 1440,
		label: "1 Day Before"
	}
];
var NOTIFICATION_CHANNEL_OPTIONS = [
	{
		value: "sms",
		label: "SMS"
	},
	{
		value: "whatsapp",
		label: "WhatsApp"
	},
	{
		value: "email",
		label: "Email"
	}
];
var RELATION_OPTIONS = [
	{
		value: "self",
		label: "Self"
	},
	{
		value: "spouse",
		label: "Spouse"
	},
	{
		value: "parent",
		label: "Parent"
	},
	{
		value: "child",
		label: "Child"
	},
	{
		value: "sibling",
		label: "Sibling"
	},
	{
		value: "other",
		label: "Other"
	}
];
function NewAppointmentPage() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [found, setFound] = (0, import_react.useState)([]);
	const [hasSearched, setHasSearched] = (0, import_react.useState)(false);
	const [isSearching, setIsSearching] = (0, import_react.useState)(false);
	const [isCreatingPatient, setIsCreatingPatient] = (0, import_react.useState)(false);
	const [isRegisteringAnother, setIsRegisteringAnother] = (0, import_react.useState)(false);
	const [patientError, setPatientError] = (0, import_react.useState)("");
	const [newPatient, setNewPatient] = (0, import_react.useState)(getEmptyPatientForm());
	const [checkupName, setCheckupName] = (0, import_react.useState)("");
	const [specialty, setSpecialty] = (0, import_react.useState)("");
	const [doctor, setDoctor] = (0, import_react.useState)("");
	const [reasonForVisit, setReasonForVisit] = (0, import_react.useState)("");
	const [clinicalNotes, setClinicalNotes] = (0, import_react.useState)("");
	const [weekOffset, setWeekOffset] = (0, import_react.useState)(0);
	const [appointmentDate, setAppointmentDate] = (0, import_react.useState)("");
	const [availability, setAvailability] = (0, import_react.useState)(null);
	const [selectedSlot, setSelectedSlot] = (0, import_react.useState)(null);
	const [patientReminderMinutes, setPatientReminderMinutes] = (0, import_react.useState)(60);
	const [notificationChannels, setNotificationChannels] = (0, import_react.useState)(["whatsapp"]);
	const [bufferMinutes, setBufferMinutes] = (0, import_react.useState)(5);
	const [isLoadingSlots, setIsLoadingSlots] = (0, import_react.useState)(false);
	const [slotError, setSlotError] = (0, import_react.useState)("");
	const [bookingError, setBookingError] = (0, import_react.useState)("");
	const [isSubmittingBooking, setIsSubmittingBooking] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const { data: doctors = [], isLoading: isLoadingDoctors, isError: doctorsError } = useDoctors();
	const availableDoctors = doctors.filter((item) => item.isAvailable !== false);
	const specialties = Array.from(new Set(availableDoctors.map((item) => item.speciality).filter(Boolean))).sort();
	const filteredDoctors = specialty ? availableDoctors.filter((item) => item.speciality === specialty) : [];
	const selectedDoctor = availableDoctors.find((item) => item._id === doctor);
	const weekDates = (0, import_react.useMemo)(() => buildWeekDates(weekOffset), [weekOffset]);
	const weekRangeLabel = (0, import_react.useMemo)(() => getWeekRangeLabel(weekDates), [weekDates]);
	const scheduledDays = (0, import_react.useMemo)(() => new Set((selectedDoctor?.schedule ?? []).map((slot) => slot.day.toLowerCase())), [selectedDoctor]);
	(0, import_react.useEffect)(() => {
		if (!selectedDoctor) {
			setAppointmentDate("");
			return;
		}
		if (appointmentDate && scheduledDays.has(getWeekday(appointmentDate).toLowerCase())) return;
		setAppointmentDate(weekDates.find((date) => !date.isPast && scheduledDays.has(date.day.toLowerCase()))?.value ?? "");
	}, [
		appointmentDate,
		scheduledDays,
		selectedDoctor,
		weekDates
	]);
	(0, import_react.useEffect)(() => {
		if (!doctor || !appointmentDate) {
			setAvailability(null);
			setSelectedSlot(null);
			return;
		}
		let active = true;
		setIsLoadingSlots(true);
		setSlotError("");
		setSelectedSlot(null);
		Appointment.getDoctorAvailability(doctor, appointmentDate, bufferMinutes).then((response) => {
			if (active) setAvailability(response);
		}).catch((err) => {
			if (!active) return;
			setAvailability(null);
			setSlotError(getErrorMessage(err) ?? "Unable to load slots for this day.");
		}).finally(() => {
			if (active) setIsLoadingSlots(false);
		});
		return () => {
			active = false;
		};
	}, [
		appointmentDate,
		bufferMinutes,
		doctor
	]);
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirmed, {
		onBack: () => navigate({ to: "/appointments" }),
		onBookAnother: () => {
			setDone(false);
			setStep(1);
		}
	});
	const handlePatientSearch = async (event) => {
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
			setFound((response.patients ?? []).map((patient) => ({
				...patient,
				phone: response.contact?.phone ?? phone,
				whatsappNo: response.contact?.whatsappNo,
				email: response.contact?.email
			})));
			setHasSearched(true);
		} catch (err) {
			setFound([]);
			setPatientError(getErrorMessage(err) ?? "Unable to search patients by phone.");
		} finally {
			setIsSearching(false);
		}
	};
	const handleCreatePatient = async (event) => {
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
				relation: newPatient.relation.trim() || "self"
			});
			const patient = {
				...response.patient,
				phone: response.contact?.phone ?? phone,
				whatsappNo: response.contact?.whatsappNo,
				email: response.contact?.email
			};
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
		if (!selected || !selected.contactId || !doctor || !appointmentDate || !selectedSlot) {
			setBookingError("Please complete patient, doctor, date, and slot details.");
			return;
		}
		setBookingError("");
		setIsSubmittingBooking(true);
		try {
			const checkupResponse = await CheckupService.findOrCreate({
				name: checkupName.trim(),
				specialityRequired: specialty,
				bufferTime: bufferMinutes
			});
			await Appointment.bookAppointment({
				contactId: selected.contactId,
				patientId: selected._id,
				checkupId: checkupResponse.data._id,
				doctorId: doctor,
				reasonForVisit: [reasonForVisit.trim(), clinicalNotes.trim()].filter(Boolean).join("\n\n"),
				appointmentDate,
				appointmentTime: selectedSlot.time,
				patientReminderMinutes,
				notificationChannel: notificationChannels,
				bufferMinutes
			});
			setDone(true);
		} catch (err) {
			setBookingError(getErrorMessage(err) ?? "Unable to book appointment. Please try another slot.");
			if (doctor && appointmentDate) try {
				setAvailability(await Appointment.getDoctorAvailability(doctor, appointmentDate, bufferMinutes));
				setSelectedSlot(null);
			} catch {
				setAvailability(null);
			}
		} finally {
			setIsSubmittingBooking(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [
			{
				label: "Dashboard",
				to: "/dashboard"
			},
			{
				label: "Appointments",
				to: "/appointments"
			},
			{ label: "New Appointment" }
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/appointments",
				className: "mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to Appointments"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "New Appointment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Complete the booking flow to schedule an appointment"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, { step }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 animate-in fade-in duration-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-semibold",
									children: "Patient"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Search by phone and select the patient for this appointment."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "search",
									children: "Search Patient by Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handlePatientSearch,
									className: "mt-1.5 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "search",
											type: "tel",
											value: query,
											onChange: (e) => {
												setQuery(e.target.value);
												setSelected(null);
												setHasSearched(false);
												setFound([]);
											},
											placeholder: "03001234567",
											className: "pl-9"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: isSearching || !query.trim(),
										children: isSearching ? "Searching..." : "Search"
									})]
								})] }),
								patientError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
									children: patientError
								}),
								hasSearched && found.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold",
											children: "Patient Not Found"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted-foreground",
											children: "No patient exists against this phone number. Register a patient to continue."
										})
									]
								}),
								hasSearched && found.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientForm, {
									patient: newPatient,
									setPatient: setNewPatient,
									onSubmit: handleCreatePatient,
									isSubmitting: isCreatingPatient,
									title: "Register Patient"
								}),
								found.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [found.length, " patient(s) found"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => setIsRegisteringAnother((current) => !current),
											children: isRegisteringAnother ? "Hide form" : "Register another patient"
										})]
									}), found.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setSelected(p),
										className: cn("flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all", selected?._id === p._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50 hover:bg-muted/40"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(`${p.firstName} ${p.lastName}`) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-medium",
												children: [
													p.firstName,
													" ",
													p.lastName
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													p.patientId,
													" - ",
													p.phone
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground" })]
									}, p._id))]
								}),
								hasSearched && found.length > 0 && isRegisteringAnother && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientForm, {
									patient: newPatient,
									setPatient: setNewPatient,
									onSubmit: handleCreatePatient,
									isSubmitting: isCreatingPatient,
									title: "Register Another Patient"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: !selected,
										onClick: () => setStep(2),
										children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})
								})
							]
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 animate-in fade-in duration-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-semibold",
									children: "Appointment Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Choose specialty, doctor, date, slot, buffer, and reminder."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Checkup Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1.5",
										value: checkupName,
										onChange: (event) => setCheckupName(event.target.value),
										placeholder: "General consultation",
										required: true
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Buffer Minutes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1.5",
										type: "number",
										min: "0",
										value: bufferMinutes,
										onChange: (event) => setBufferMinutes(Math.max(0, Number(event.target.value) || 0))
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Specialty" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
										value: specialty,
										onChange: (event) => {
											setSpecialty(event.target.value);
											setDoctor("");
											setAppointmentDate("");
											setSelectedSlot(null);
											setAvailability(null);
										},
										disabled: isLoadingDoctors || specialties.length === 0,
										required: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: isLoadingDoctors ? "Loading specialties..." : "Select specialty"
										}), specialties.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: item,
											children: item
										}, item))]
									}),
									doctorsError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-sm text-destructive",
										children: "Unable to load available specialties."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Doctor" }), !specialty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
									children: "Select a specialty to see doctors."
								}) : filteredDoctors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
									children: "No available doctors found for this specialty."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid gap-2 sm:grid-cols-2",
									children: filteredDoctors.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setDoctor(item._id);
											setAppointmentDate("");
											setSelectedSlot(null);
											setAvailability(null);
										},
										className: cn("flex items-center gap-3 rounded-xl border p-3 text-left transition-all", doctor === item._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700",
											children: getInitials(getDoctorName(item))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: getDoctorName(item)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: item.speciality
										})] })]
									}, item._id))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateSlotPicker, {
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
									setAvailability
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason for Visit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "mt-1.5",
									rows: 3,
									value: reasonForVisit,
									onChange: (event) => setReasonForVisit(event.target.value),
									placeholder: "Describe symptoms or reason..."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-3.5 w-3.5" }), " Reminder Timing"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-3",
									children: REMINDER_OPTIONS.map((reminder) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPatientReminderMinutes(reminder.value),
										className: cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all", patientReminderMinutes === reminder.value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: patientReminderMinutes === reminder.value,
											className: "pointer-events-none"
										}), reminder.label]
									}, reminder.value))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notification Channel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-3",
									children: [...NOTIFICATION_CHANNEL_OPTIONS, {
										value: "all",
										label: "All"
									}].map((channel) => {
										const isAll = channel.value === "all";
										const active = isAll ? notificationChannels.length === NOTIFICATION_CHANNEL_OPTIONS.length : notificationChannels.includes(channel.value);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												if (isAll) {
													setNotificationChannels(NOTIFICATION_CHANNEL_OPTIONS.map((option) => option.value));
													return;
												}
												setNotificationChannels((current) => current.includes(channel.value) ? current.length === 1 ? current : current.filter((item) => item !== channel.value) : [...current, channel.value]);
											},
											className: cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all", active ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked: active,
												className: "pointer-events-none"
											}), channel.label]
										}, channel.value);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Clinical Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "mt-1.5",
									value: clinicalNotes,
									onChange: (event) => setClinicalNotes(event.target.value),
									placeholder: "Add clinical notes...",
									rows: 3
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => setStep(1),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Go Back"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => setStep(3),
										disabled: !checkupName.trim() || !specialty || !doctor || !appointmentDate || !selectedSlot || notificationChannels.length === 0,
										children: ["Review & Confirm ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})]
								})
							]
						}),
						step === 3 && selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 animate-in fade-in duration-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-semibold",
									children: "Review & Confirm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Please review all appointment details before confirming."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewBlock, {
											icon: User,
											title: "Patient",
											items: [
												["Name", getPatientName(selected)],
												["Patient ID", selected.patientId],
												["Phone", selected.phone],
												["Age", String(selected.age)]
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewBlock, {
											icon: CalendarCheck2,
											title: "Appointment",
											items: [
												["Checkup", checkupName],
												["Specialty", specialty],
												["Doctor", selectedDoctor ? getDoctorName(selectedDoctor) : ""],
												["Date", formatDisplayDate(appointmentDate)],
												["Time", selectedSlot?.label ?? ""],
												["Buffer", `${bufferMinutes} minutes`]
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewBlock, {
											icon: Bell,
											title: "Reminders",
											items: [["Timing", getReminderLabel(patientReminderMinutes)], ["Channel", getChannelLabel(notificationChannels)]]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewBlock, {
											icon: FileText,
											title: "Notes",
											items: [["Reason", reasonForVisit.trim() || "Not specified"], ["Clinical", clinicalNotes.trim() || "None"]]
										})
									]
								}),
								bookingError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
									children: bookingError
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => setStep(2),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Go Back"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleConfirmBooking,
										disabled: isSubmittingBooking,
										children: [
											isSubmittingBooking ? "Booking..." : "Confirm Booking",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
										]
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", { children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 sticky top-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-3.5 w-3.5" }), " Patient Summary"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(getPatientName(selected)) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-semibold",
									children: getPatientName(selected)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: selected.patientId
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumRow, {
									label: "Phone",
									value: selected.phone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumRow, {
									label: "Age",
									value: String(selected.age)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumRow, {
									label: "Gender",
									value: selected.gender === "F" ? "Female" : "Male"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumRow, {
									label: "Relation",
									value: selected.relation ?? "Self"
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col items-center justify-center p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 font-medium",
							children: "No Patient Selected"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Search and select a patient to view their information."
						})
					]
				}) })]
			})
		]
	});
}
function DateSlotPicker(props) {
	const { selectedDoctor, scheduledDays, weekDates, weekOffset, weekRangeLabel, appointmentDate, availability, selectedSlot, isLoadingSlots, slotError, setWeekOffset, setAppointmentDate, setSelectedSlot, setAvailability } = props;
	const clearSlotState = () => {
		setAppointmentDate("");
		setSelectedSlot(null);
		setAvailability(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date and free slot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: weekRangeLabel
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "icon",
						disabled: weekOffset === 0,
						onClick: () => {
							setWeekOffset((current) => Math.max(0, current - 1));
							clearSlotState();
						},
						"aria-label": "Previous week",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-28 text-center text-xs font-medium text-muted-foreground",
						children: weekOffset === 0 ? "Next 7 days" : `Week ${weekOffset + 1}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "icon",
						disabled: weekOffset === MAX_BOOKING_WEEK_OFFSET,
						onClick: () => {
							setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1));
							clearSlotState();
						},
						"aria-label": "Next week",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
					})
				]
			})]
		}), !selectedDoctor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
			children: "Select a doctor to see available days and slots."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-4 lg:grid-cols-7",
				children: weekDates.map((date) => {
					const hasSchedule = scheduledDays.has(date.day.toLowerCase());
					const active = appointmentDate === date.value;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: !hasSchedule || date.isPast,
						onClick: () => {
							setAppointmentDate(date.value);
							setSelectedSlot(null);
						},
						className: cn("rounded-xl border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50", active ? "border-primary bg-primary-soft ring-2 ring-primary/20" : "border-border hover:border-primary/40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium text-muted-foreground",
							children: date.day.slice(0, 3)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: date.label
						})]
					}, date.value);
				})
			}),
			!weekDates.some((date) => !date.isPast && scheduledDays.has(date.day.toLowerCase())) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "This doctor has no schedule days in this date range." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					disabled: weekOffset === MAX_BOOKING_WEEK_OFFSET,
					onClick: () => {
						setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1));
						clearSlotState();
					},
					children: ["Try later week ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				})]
			}),
			isLoadingSlots ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
				children: "Checking doctor schedule and existing appointments..."
			}) : slotError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
				children: slotError
			}) : availability?.schedule === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900",
				children: [availability.message, ". Please change the day or week."]
			}) : availability && availability.slots.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-3 lg:grid-cols-5",
				children: availability.slots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !slot.available,
					onClick: () => setSelectedSlot(slot),
					className: cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground", selectedSlot?.time === slot.time ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"),
					children: slot.label
				}, slot.time))
			}) : availability ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900",
				children: "No free slots are available for this day. Please change the date/day."
			}) : null
		] })]
	});
}
function PatientForm({ patient, setPatient, onSubmit, isSubmitting, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-4 rounded-xl border border-border p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "WhatsApp Number",
					type: "tel",
					value: patient.whatsappNo,
					onChange: (whatsappNo) => setPatient({
						...patient,
						whatsappNo
					}),
					placeholder: "03001234567"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					type: "email",
					value: patient.email,
					onChange: (email) => setPatient({
						...patient,
						email
					}),
					placeholder: "patient@example.com"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "First name",
					value: patient.firstName,
					onChange: (firstName) => setPatient({
						...patient,
						firstName
					}),
					required: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Last name",
					value: patient.lastName,
					onChange: (lastName) => setPatient({
						...patient,
						lastName
					}),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Age",
					type: "number",
					min: "0",
					value: patient.age,
					onChange: (age) => setPatient({
						...patient,
						age
					}),
					required: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "City",
					value: patient.city,
					onChange: (city) => setPatient({
						...patient,
						city
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gender" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 grid grid-cols-2 gap-2",
					children: [["M", "Male"], ["F", "Female"]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPatient({
							...patient,
							gender: value
						}),
						className: cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all", patient.gender === value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40"),
						children: label
					}, value))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationField, {
					value: patient.relation,
					onChange: (relation) => setPatient({
						...patient,
						relation
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: isSubmitting,
				children: isSubmitting ? "Registering..." : "Register and select patient"
			})
		]
	});
}
function getEmptyPatientForm() {
	return {
		firstName: "",
		lastName: "",
		age: "",
		city: "",
		gender: "M",
		relation: "self",
		whatsappNo: "",
		email: ""
	};
}
function Stepper({ step }) {
	const steps = [
		"Patient",
		"Details",
		"Confirm"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-2",
		children: steps.map((s, i) => {
			const n = i + 1;
			const active = n === step;
			const done = n < step;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all", done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"),
						children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }) : n
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("text-sm font-medium", active || done ? "text-foreground" : "text-muted-foreground"),
						children: s
					}),
					i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("mx-2 h-px flex-1", done ? "bg-primary" : "bg-border") })
				]
			}, s);
		})
	});
}
function ReviewBlock({ icon: Icon, title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-2 text-sm font-semibold",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }),
				" ",
				title
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "space-y-1.5 text-sm",
			children: items.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-muted-foreground",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "font-medium text-right",
					children: v
				})]
			}, k))
		})]
	});
}
function SumRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: value
		})]
	});
}
function getPatientName(patient) {
	return [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}
function getDoctorName(doctor) {
	const user = typeof doctor.userId === "object" ? doctor.userId : void 0;
	return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
}
function getInitials(name) {
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT";
}
function getReminderLabel(value) {
	return REMINDER_OPTIONS.find((option) => option.value === value)?.label ?? `${value} Minutes Before`;
}
function getChannelLabel(values) {
	if (values.length === NOTIFICATION_CHANNEL_OPTIONS.length) return "All";
	return values.map((value) => NOTIFICATION_CHANNEL_OPTIONS.find((option) => option.value === value)?.label ?? value).join(", ");
}
function buildWeekDates(offset) {
	const today = /* @__PURE__ */ new Date();
	const start = new Date(today);
	start.setDate(today.getDate() + offset * 7);
	return Array.from({ length: 7 }, (_, index) => {
		const date = new Date(start);
		date.setDate(start.getDate() + index);
		const value = toDateInputValue(date);
		return {
			value,
			day: getWeekday(value),
			label: date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric"
			}),
			isPast: false
		};
	});
}
function getWeekRangeLabel(dates) {
	const first = dates[0]?.value;
	const last = dates[dates.length - 1]?.value;
	if (!first || !last) return "";
	return `${formatShortDate(first)} - ${formatShortDate(last)}`;
}
function formatShortDate(value) {
	return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function toDateInputValue(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function getWeekday(value) {
	return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("en-US", { weekday: "long" });
}
function formatDisplayDate(value) {
	if (!value) return "";
	return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	});
}
function getErrorMessage(err) {
	if (typeof err === "object" && err && "response" in err) {
		const message = err.response?.data?.message;
		return Array.isArray(message) ? message.join(", ") : message;
	}
}
function Field({ label, value, onChange, type = "text", required, min, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		className: "mt-1.5",
		type,
		min,
		value,
		onChange: (event) => onChange(event.target.value),
		required,
		placeholder
	})] });
}
function RelationField({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Relation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1.5 flex flex-wrap gap-2",
		children: RELATION_OPTIONS.map((relation) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(relation.value),
			className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", value === relation.value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"),
			children: relation.label
		}, relation.value))
	})] });
}
function Confirmed({ onBack, onBookAnother }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		breadcrumbs: [
			{
				label: "Dashboard",
				to: "/dashboard"
			},
			{
				label: "Appointments",
				to: "/appointments"
			},
			{ label: "Confirmation" }
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-8 text-center animate-in zoom-in-95 duration-300",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "Appointment Booked!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "The appointment has been successfully scheduled."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: onBack,
							children: "View Appointments"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: onBookAnother,
							children: "Book Another"
						})]
					})
				]
			})
		})
	});
}
//#endregion
export { NewAppointmentPage as component };
