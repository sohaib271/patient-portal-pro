import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as UserRound, D as ChevronRight, K as CircleCheck, O as ChevronLeft, d as Search, z as ArrowLeft } from "../_libs/lucide-react.mjs";
import { l as useDoctors, n as Avatar, t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as Label } from "./label-BuKBvabm.mjs";
import { t as Textarea } from "./textarea-BCF4nEK2.mjs";
import { t as Appointment } from "./appointment.service-Cx5LZS-H.mjs";
import { t as Patient } from "./patient.service-CCdChYiv.mjs";
import { t as CheckupService } from "./checkup.service-CQreqd1m.mjs";
import { t as Route } from "./follow-ups.new-DcPj2ZVA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/follow-ups.new-Cpbo5qqm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_BOOKING_WEEK_OFFSET = 7;
var REASONS = [
	{
		value: "planned_revisit",
		label: "Planned Revisit"
	},
	{
		value: "emergency_revisit",
		label: "Emergency Revisit"
	},
	{
		value: "test_only",
		label: "Test Only"
	},
	{
		value: "prescription_pickup",
		label: "Prescription Pickup"
	},
	{
		value: "other",
		label: "Other"
	}
];
function NewFollowUpPage() {
	const navigate = useNavigate();
	const { appointmentId } = Route.useSearch();
	const [parentAppointment, setParentAppointment] = (0, import_react.useState)(null);
	const [patient, setPatient] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [found, setFound] = (0, import_react.useState)([]);
	const [hasSearched, setHasSearched] = (0, import_react.useState)(false);
	const [isSearching, setIsSearching] = (0, import_react.useState)(false);
	const [isLoadingParent, setIsLoadingParent] = (0, import_react.useState)(Boolean(appointmentId));
	const [handlerType, setHandlerType] = (0, import_react.useState)("doctor");
	const [reason, setReason] = (0, import_react.useState)("planned_revisit");
	const [reasonNote, setReasonNote] = (0, import_react.useState)("");
	const [followUpDate, setFollowUpDate] = (0, import_react.useState)(getTodayValue());
	const [followUpTime, setFollowUpTime] = (0, import_react.useState)("");
	const [specialty, setSpecialty] = (0, import_react.useState)("");
	const [doctorId, setDoctorId] = (0, import_react.useState)("");
	const [checkupName, setCheckupName] = (0, import_react.useState)("Follow-up");
	const [weekOffset, setWeekOffset] = (0, import_react.useState)(0);
	const [availability, setAvailability] = (0, import_react.useState)(null);
	const [selectedSlot, setSelectedSlot] = (0, import_react.useState)(null);
	const [bufferMinutes, setBufferMinutes] = (0, import_react.useState)(5);
	const [patientReminderMinutes, setPatientReminderMinutes] = (0, import_react.useState)(60);
	const [isLoadingSlots, setIsLoadingSlots] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(false);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const { data: doctors = [], isLoading: isLoadingDoctors } = useDoctors();
	const availableDoctors = doctors.filter((doctor) => doctor.isAvailable !== false);
	const specialties = Array.from(new Set(availableDoctors.map((doctor) => doctor.speciality).filter(Boolean))).sort();
	const filteredDoctors = specialty ? availableDoctors.filter((doctor) => doctor.speciality === specialty) : [];
	const selectedDoctor = availableDoctors.find((doctor) => doctor._id === doctorId);
	const scheduledDays = (0, import_react.useMemo)(() => new Set((selectedDoctor?.schedule ?? []).map((slot) => slot.day.toLowerCase())), [selectedDoctor]);
	const weekDates = (0, import_react.useMemo)(() => buildWeekDates(weekOffset), [weekOffset]);
	const needsDoctorSchedule = handlerType === "doctor";
	(0, import_react.useEffect)(() => {
		if (!appointmentId) return;
		let active = true;
		setIsLoadingParent(true);
		Appointment.getAppointmentById(appointmentId).then((response) => {
			if (!active) return;
			const appointment = response.appointment;
			setParentAppointment(appointment);
			const appointmentPatient = typeof appointment.patientId === "object" ? appointment.patientId : void 0;
			const contact = typeof appointment.contactId === "object" ? appointment.contactId : void 0;
			if (appointmentPatient) setPatient({
				...appointmentPatient,
				phone: contact?.phone,
				whatsappNo: contact?.whatsappNo,
				email: contact?.email
			});
			const appointmentDoctor = typeof appointment.doctorId === "object" ? appointment.doctorId : void 0;
			const appointmentCheckup = typeof appointment.checkupId === "object" ? appointment.checkupId : void 0;
			if (appointmentDoctor?._id) setDoctorId(appointmentDoctor._id);
			if (appointmentDoctor?.speciality) setSpecialty(appointmentDoctor.speciality);
			if (appointmentCheckup?.name) setCheckupName(appointmentCheckup.name);
		}).catch((err) => setError(getErrorMessage(err) ?? "Unable to load appointment details.")).finally(() => active && setIsLoadingParent(false));
		return () => {
			active = false;
		};
	}, [appointmentId]);
	(0, import_react.useEffect)(() => {
		if (!needsDoctorSchedule || !doctorId || !followUpDate) {
			setAvailability(null);
			setSelectedSlot(null);
			return;
		}
		let active = true;
		setIsLoadingSlots(true);
		setSelectedSlot(null);
		Appointment.getDoctorAvailability(doctorId, followUpDate, bufferMinutes).then((response) => active && setAvailability(response)).catch((err) => active && setError(getErrorMessage(err) ?? "Unable to load doctor slots.")).finally(() => active && setIsLoadingSlots(false));
		return () => {
			active = false;
		};
	}, [
		bufferMinutes,
		doctorId,
		followUpDate,
		needsDoctorSchedule
	]);
	const handlePatientSearch = async (event) => {
		event.preventDefault();
		const phone = query.trim();
		if (!phone) return;
		setIsSearching(true);
		setHasSearched(false);
		setFound([]);
		setError("");
		try {
			const response = await Patient.searchByPhone(phone);
			setFound((response.patients ?? []).map((item) => ({
				...item,
				phone: response.contact?.phone ?? phone,
				whatsappNo: response.contact?.whatsappNo,
				email: response.contact?.email
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
			const checkupId = (typeof parentAppointment?.checkupId === "object" ? parentAppointment.checkupId : void 0)?._id || (handlerType === "doctor" ? (await CheckupService.findOrCreate({
				name: checkupName.trim() || "Follow-up",
				specialityRequired: specialty || "General",
				bufferTime: bufferMinutes
			})).data._id : void 0);
			await Appointment.createFollowUp({
				patientId: patient._id,
				handlerType,
				doctorId: handlerType === "doctor" ? doctorId : void 0,
				followUpDate,
				followUpTime: handlerType === "doctor" ? selectedSlot?.time : followUpTime,
				reason,
				reasonNote: reasonNote.trim(),
				parentAppointmentId: parentAppointment?._id,
				checkupId,
				patientReminderMinutes: handlerType === "doctor" ? patientReminderMinutes : void 0,
				bufferMinutes
			});
			setDone(true);
		} catch (err) {
			setError(getErrorMessage(err) ?? "Unable to create follow-up.");
		} finally {
			setIsSubmitting(false);
		}
	};
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: "Follow-up" }],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "Follow-up Created"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "The follow-up has been saved successfully."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-5",
						onClick: () => navigate({ to: "/dashboard" }),
						children: "Back to Dashboard"
					})
				]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: "New Follow-up" }],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard",
				className: "mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to Dashboard"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "New Follow-up"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Schedule a doctor follow-up or create a nurse follow-up visit."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "space-y-5 p-6",
					children: isLoadingParent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
						children: "Loading appointment..."
					}) : !patient ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientSearch, {
						query,
						setQuery,
						found,
						hasSearched,
						isSearching,
						onSearch: handlePatientSearch,
						onSelect: setPatient
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Handler"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid gap-2 sm:grid-cols-2",
							children: ["doctor", "nurse"].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setHandlerType(value);
									setSelectedSlot(null);
								},
								className: cn("rounded-lg border px-3 py-3 text-left text-sm font-medium capitalize transition-all", handlerType === value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40"),
								children: value
							}, value))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
								value: reason,
								onChange: (event) => setReason(event.target.value),
								children: REASONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.value,
									children: item.label
								}, item.value))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Buffer Minutes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1.5",
								type: "number",
								min: "0",
								value: bufferMinutes,
								onChange: (event) => setBufferMinutes(Math.max(0, Number(event.target.value) || 0))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-1.5",
							rows: 3,
							value: reasonNote,
							onChange: (event) => setReasonNote(event.target.value),
							placeholder: "Add required follow-up details..."
						})] }),
						handlerType === "nurse" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1.5",
								type: "date",
								value: followUpDate,
								min: getTodayValue(),
								onChange: (event) => setFollowUpDate(event.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1.5",
								type: "time",
								value: followUpTime,
								onChange: (event) => setFollowUpTime(event.target.value)
							})] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorScheduleForm, {
							doctors: availableDoctors,
							isLoadingDoctors,
							specialties,
							filteredDoctors,
							specialty,
							setSpecialty,
							doctorId,
							setDoctorId,
							selectedDoctor,
							scheduledDays,
							weekDates,
							weekOffset,
							setWeekOffset,
							followUpDate,
							setFollowUpDate,
							availability,
							selectedSlot,
							setSelectedSlot,
							isLoadingSlots,
							checkupName,
							setCheckupName,
							patientReminderMinutes,
							setPatientReminderMinutes
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleSubmit,
								disabled: isSubmitting,
								children: isSubmitting ? "Creating..." : "Create Follow-up"
							})
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "sticky top-20 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-3.5 w-3.5" }), " Patient"]
					}), patient ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(getPatientName(patient)) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-semibold",
								children: getPatientName(patient)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: patient.patientId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 text-xs text-muted-foreground",
								children: patient.phone || patient.whatsappNo || patient.email || "No contact saved"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Select a patient to continue."
					})]
				}) })]
			})
		]
	});
}
function PatientSearch(props) {
	const { query, setQuery, found, hasSearched, isSearching, onSearch, onSelect } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold",
				children: "Patient"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Search by phone and select a patient for this follow-up."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onSearch,
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "tel",
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "03001234567",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: isSearching || !query.trim(),
					children: isSearching ? "Searching..." : "Search"
				})]
			}),
			hasSearched && found.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground",
				children: "No patient found."
			}),
			found.map((patient) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(patient),
				className: "flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-all hover:border-primary/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(getPatientName(patient)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: getPatientName(patient)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						patient.patientId,
						" - ",
						patient.phone
					]
				})] })]
			}, patient._id))
		]
	});
}
function DoctorScheduleForm(props) {
	const { isLoadingDoctors, specialties, filteredDoctors, specialty, setSpecialty, doctorId, setDoctorId, selectedDoctor, scheduledDays, weekDates, weekOffset, setWeekOffset, followUpDate, setFollowUpDate, availability, selectedSlot, setSelectedSlot, isLoadingSlots, checkupName, setCheckupName, patientReminderMinutes, setPatientReminderMinutes } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Checkup Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-1.5",
				value: checkupName,
				onChange: (event) => setCheckupName(event.target.value),
				placeholder: "Follow-up"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Specialty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
				value: specialty,
				onChange: (event) => {
					setSpecialty(event.target.value);
					setDoctorId("");
					setSelectedSlot(null);
				},
				disabled: isLoadingDoctors,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: isLoadingDoctors ? "Loading specialties..." : "Select specialty"
				}), specialties.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: item,
					children: item
				}, item))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Doctor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid gap-2 sm:grid-cols-2",
				children: filteredDoctors.map((doctor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setDoctorId(doctor._id);
						setSelectedSlot(null);
					},
					className: cn("rounded-lg border p-3 text-left transition-all", doctorId === doctor._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: getDoctorName(doctor)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: doctor.speciality
					})]
				}, doctor._id))
			})] }),
			selectedDoctor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date and Slot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							disabled: weekOffset === 0,
							onClick: () => setWeekOffset((current) => Math.max(0, current - 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							disabled: weekOffset === MAX_BOOKING_WEEK_OFFSET,
							onClick: () => setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-4 lg:grid-cols-7",
					children: weekDates.map((date) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !scheduledDays.has(date.day.toLowerCase()),
							onClick: () => {
								setFollowUpDate(date.value);
								setSelectedSlot(null);
							},
							className: cn("rounded-lg border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50", followUpDate === date.value ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: date.day.slice(0, 3)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: date.label
							})]
						}, date.value);
					})
				}),
				isLoadingSlots ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
					children: "Checking slots..."
				}) : availability?.slots?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
					children: "No free slots are available for this day."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Patient Reminder Minutes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1.5",
					type: "number",
					min: "0",
					value: patientReminderMinutes,
					onChange: (event) => setPatientReminderMinutes(Math.max(0, Number(event.target.value) || 0))
				})] })
			] })
		]
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
			})
		};
	});
}
function getTodayValue() {
	return toDateInputValue(/* @__PURE__ */ new Date());
}
function toDateInputValue(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function getWeekday(value) {
	return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("en-US", { weekday: "long" });
}
function getErrorMessage(err) {
	if (typeof err === "object" && err && "response" in err) {
		const message = err.response?.data?.message;
		return Array.isArray(message) ? message.join(", ") : message;
	}
	if (err instanceof Error) return err.message;
}
//#endregion
export { NewFollowUpPage as component };
