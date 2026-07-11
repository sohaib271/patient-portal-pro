import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as ChevronRight, K as CircleCheck, L as Bell, O as ChevronLeft, R as ArrowRight, S as HeartHandshake, n as Users, r as User, z as ArrowLeft } from "../_libs/lucide-react.mjs";
import { d as useUser, l as useDoctors } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as Label } from "./label-BuKBvabm.mjs";
import { t as Textarea } from "./textarea-BCF4nEK2.mjs";
import { t as Appointment } from "./appointment.service-Cx5LZS-H.mjs";
import { t as Checkbox } from "./checkbox-BejW3u6J.mjs";
import { t as Patient } from "./patient.service-CCdChYiv.mjs";
import { t as CheckupService } from "./checkup.service-CQreqd1m.mjs";
import { t as PatientShell } from "./patient-Cx5i6qGo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.book-B9mZymf8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function usePatientRelatives(phone, currentPatientId) {
	return useQuery({
		queryKey: [
			"patient-relatives",
			phone,
			currentPatientId
		],
		enabled: Boolean(phone && currentPatientId),
		queryFn: async () => {
			const response = await Patient.searchByPhone(phone);
			return (response.patients ?? []).filter((patient) => patient._id !== currentPatientId).map((patient) => ({
				...patient,
				phone: response.contact?.phone ?? phone
			}));
		}
	});
}
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
function PatientBook() {
	const navigate = useNavigate();
	const { user } = useUser();
	const [step, setStep] = (0, import_react.useState)(1);
	const [who, setWho] = (0, import_react.useState)("Self");
	const [selectedRelative, setSelectedRelative] = (0, import_react.useState)(null);
	const [addedRelatives, setAddedRelatives] = (0, import_react.useState)([]);
	const [showAddRelative, setShowAddRelative] = (0, import_react.useState)(false);
	const [isCreatingRelative, setIsCreatingRelative] = (0, import_react.useState)(false);
	const [relativeError, setRelativeError] = (0, import_react.useState)("");
	const [newRelative, setNewRelative] = (0, import_react.useState)({
		firstName: "",
		lastName: "",
		age: "",
		city: "",
		gender: "M",
		relation: "Other"
	});
	const [checkupName, setCheckupName] = (0, import_react.useState)("");
	const [specialty, setSpecialty] = (0, import_react.useState)("");
	const [doctor, setDoctor] = (0, import_react.useState)("");
	const [reasonForVisit, setReasonForVisit] = (0, import_react.useState)("");
	const [weekOffset, setWeekOffset] = (0, import_react.useState)(0);
	const [appointmentDate, setAppointmentDate] = (0, import_react.useState)("");
	const [availability, setAvailability] = (0, import_react.useState)(null);
	const [selectedSlot, setSelectedSlot] = (0, import_react.useState)(null);
	const [patientReminderMinutes, setPatientReminderMinutes] = (0, import_react.useState)(60);
	const [notificationChannels, setNotificationChannels] = (0, import_react.useState)(["whatsapp"]);
	const [isLoadingSlots, setIsLoadingSlots] = (0, import_react.useState)(false);
	const [slotError, setSlotError] = (0, import_react.useState)("");
	const [bookingError, setBookingError] = (0, import_react.useState)("");
	const [isSubmittingBooking, setIsSubmittingBooking] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const contact = getContact(user);
	const contactPhone = contact?.phone;
	const { data: relatives = [], isLoading: isLoadingRelatives, isError: relativesError } = usePatientRelatives(contactPhone, user?._id);
	const { data: doctors = [], isLoading: isLoadingDoctors, isError: doctorsError } = useDoctors();
	const availableDoctors = doctors.filter((item) => item.isAvailable !== false);
	const specialties = Array.from(new Set(availableDoctors.map((item) => item.speciality).filter(Boolean))).sort();
	const filteredDoctors = specialty ? availableDoctors.filter((item) => item.speciality === specialty) : [];
	const selectedDoctor = availableDoctors.find((item) => item._id === doctor);
	const weekDates = (0, import_react.useMemo)(() => buildWeekDates(weekOffset), [weekOffset]);
	const weekRangeLabel = (0, import_react.useMemo)(() => getWeekRangeLabel(weekDates), [weekDates]);
	const scheduledDays = (0, import_react.useMemo)(() => new Set((selectedDoctor?.schedule ?? []).map((slot) => slot.day.toLowerCase())), [selectedDoctor]);
	const allRelatives = [...addedRelatives, ...relatives.filter((patient) => !addedRelatives.some((added) => added._id === patient._id))];
	const selectedPatientName = who === "Self" ? "you" : selectedRelative ? getPatientName(selectedRelative) : "your relative";
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
		Appointment.getDoctorAvailability(doctor, appointmentDate).then((response) => {
			if (!active) return;
			setAvailability(response);
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
	}, [appointmentDate, doctor]);
	const handleCreateRelative = async (event) => {
		event.preventDefault();
		if (!contactPhone) return;
		setRelativeError("");
		setIsCreatingRelative(true);
		try {
			const patient = {
				...(await Patient.createPatientByPhone({
					phone: contactPhone,
					whatsappNo: contact.whatsappNo,
					email: contact.email,
					firstName: newRelative.firstName.trim(),
					lastName: newRelative.lastName.trim(),
					age: Number(newRelative.age),
					city: newRelative.city.trim(),
					gender: newRelative.gender,
					relation: newRelative.relation.trim().toLowerCase() || "other"
				})).patient,
				phone: contactPhone
			};
			setAddedRelatives((current) => [patient, ...current.filter((item) => item._id !== patient._id)]);
			setSelectedRelative(patient);
			setShowAddRelative(false);
			setNewRelative({
				firstName: "",
				lastName: "",
				age: "",
				city: "",
				gender: "M",
				relation: "Other"
			});
		} catch (err) {
			setRelativeError(getErrorMessage(err) ?? "Unable to add patient.");
		} finally {
			setIsCreatingRelative(false);
		}
	};
	const handleConfirmBooking = async () => {
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
				specialityRequired: specialty
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
				bufferMinutes: 5
			});
			setDone(true);
		} catch (err) {
			setBookingError(getErrorMessage(err) ?? "Unable to book appointment. Please try another slot.");
			if (doctor && appointmentDate) try {
				setAvailability(await Appointment.getDoctorAvailability(doctor, appointmentDate));
				setSelectedSlot(null);
			} catch {
				setAvailability(null);
			}
		} finally {
			setIsSubmittingBooking(false);
		}
	};
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientShell, {
		breadcrumbs: [
			{
				label: "Dashboard",
				to: "/patient/dashboard"
			},
			{ label: "Book" },
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
						children: "Appointment Confirmed!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"We've scheduled your appointment for ",
							selectedPatientName,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => navigate({ to: "/patient/appointments" }),
							children: "View Appointments"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								setDone(false);
								setStep(1);
							},
							children: "Book Another"
						})]
					})
				]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PatientShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/patient/dashboard"
		}, { label: "Book Appointment" }],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Book Appointment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Schedule a visit in a few quick steps"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex items-center gap-2",
				children: [
					1,
					2,
					3
				].map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all", n < step ? "bg-primary text-primary-foreground" : n === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"),
							children: n < step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }) : n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("text-sm font-medium", n <= step ? "text-foreground" : "text-muted-foreground"),
							children: [
								"For Whom",
								"Details",
								"Confirm"
							][i]
						}),
						i < 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("mx-2 h-px flex-1", n < step ? "bg-primary" : "bg-border") })
					]
				}, n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [
					step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 animate-in fade-in duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold",
								children: "Who is this appointment for?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Choose whether this booking is for you or a relative."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [{
									v: "Self",
									icon: User,
									t: "For Myself",
									d: "Use your existing patient profile"
								}, {
									v: "Relative",
									icon: HeartHandshake,
									t: "For a Relative",
									d: "Choose another patient on your phone number"
								}].map((o) => {
									const Icon = o.icon;
									const active = who === o.v;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setWho(o.v);
											if (o.v === "Self") setSelectedRelative(null);
										},
										className: cn("group relative rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5", active ? "border-primary bg-primary-soft ring-2 ring-primary/20" : "border-border hover:border-primary/40"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cn("grid h-10 w-10 place-items-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 font-semibold",
												children: o.t
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: o.d
											}),
											active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "absolute top-3 right-3 h-4 w-4 text-primary" })
										]
									}, o.v);
								})
							}),
							who === "Relative" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/30 p-5 animate-in fade-in slide-in-from-top-2 duration-300",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center gap-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), " Existing Patients on Your Phone Number"]
									}),
									!contactPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900",
										children: "No phone number is linked to your profile."
									}) : isLoadingRelatives ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-background px-3 py-3 text-sm text-muted-foreground",
										children: "Loading relatives..."
									}) : relativesError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
										children: "Unable to load patients against this phone number."
									}) : allRelatives.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-background px-3 py-3 text-sm text-muted-foreground",
										children: "No other patients are registered against this phone number."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2",
										children: allRelatives.map((patient) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setSelectedRelative(patient),
											className: cn("flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all", selectedRelative?._id === patient._id ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/40"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold",
												children: getPatientName(patient)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													patient.patientId,
													" - ",
													patient.age,
													" years - ",
													patient.gender === "F" ? "Female" : "Male"
												]
											})] }), selectedRelative?._id === patient._id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" })]
										}, patient._id))
									}),
									relativeError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
										children: relativeError
									}),
									contactPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => setShowAddRelative((current) => !current),
											children: showAddRelative ? "Hide form" : "Add another patient"
										})
									}),
									contactPhone && showAddRelative && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleCreateRelative,
										className: "mt-4 space-y-4 rounded-xl border border-border bg-background p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold",
												children: "Add Patient Against This Phone"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-3 sm:grid-cols-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "First name",
													value: newRelative.firstName,
													onChange: (firstName) => setNewRelative({
														...newRelative,
														firstName
													}),
													required: true
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "Last name",
													value: newRelative.lastName,
													onChange: (lastName) => setNewRelative({
														...newRelative,
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
													value: newRelative.age,
													onChange: (age) => setNewRelative({
														...newRelative,
														age
													}),
													required: true
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "City",
													value: newRelative.city,
													onChange: (city) => setNewRelative({
														...newRelative,
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
														onClick: () => setNewRelative({
															...newRelative,
															gender: value
														}),
														className: cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all", newRelative.gender === value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40"),
														children: label
													}, value))
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Relation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1.5 flex flex-wrap gap-2",
													children: [
														"Parent",
														"Spouse",
														"Child",
														"Sibling",
														"Other"
													].map((relation) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setNewRelative({
															...newRelative,
															relation
														}),
														className: cn("rounded-full border px-3 py-1.5 text-xs font-medium", newRelative.relation === relation ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"),
														children: relation
													}, relation))
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "submit",
												disabled: isCreatingRelative,
												children: isCreatingRelative ? "Adding..." : "Add and select patient"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setStep(2),
									disabled: who === "Relative" && !selectedRelative,
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
								children: "Choose specialty, doctor, time, and reminder"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Checkup Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1.5",
								value: checkupName,
								onChange: (event) => setCheckupName(event.target.value),
								placeholder: "General consultation",
								required: true
							})] }),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
													setAppointmentDate("");
													setSelectedSlot(null);
													setAvailability(null);
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
													setAppointmentDate("");
													setSelectedSlot(null);
													setAvailability(null);
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
												setAppointmentDate("");
												setSelectedSlot(null);
												setAvailability(null);
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
									}) : null,
									availability && availability.slots.length > 0 && !availability.slots.some((slot) => slot.available) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"All slots are already booked for this doctor on ",
											formatDisplayDate(appointmentDate),
											". Please choose another day."
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											disabled: weekOffset === MAX_BOOKING_WEEK_OFFSET,
											onClick: () => {
												setWeekOffset((current) => Math.min(MAX_BOOKING_WEEK_OFFSET, current + 1));
												setAppointmentDate("");
												setSelectedSlot(null);
												setAvailability(null);
											},
											children: ["Try later week ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
										})]
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason for Visit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1.5",
								rows: 3,
								value: reasonForVisit,
								onChange: (event) => setReasonForVisit(event.target.value),
								placeholder: "Describe your symptoms or reason..."
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
											setNotificationChannels((current) => {
												if (current.includes(channel.value)) return current.length === 1 ? current : current.filter((item) => item !== channel.value);
												return [...current, channel.value];
											});
										},
										className: cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all", active ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: active,
											className: "pointer-events-none"
										}), channel.label]
									}, channel.value);
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => setStep(1),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setStep(3),
									disabled: !checkupName.trim() || !specialty || !doctor || !appointmentDate || !selectedSlot || notificationChannels.length === 0,
									children: ["Review & Confirm ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})]
							})
						]
					}),
					step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 animate-in fade-in duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold",
								children: "Review & Confirm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Please verify the details before submitting"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
									title: "Patient",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "For",
										v: who
									}), who === "Relative" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Name",
											v: selectedRelative ? getPatientName(selectedRelative) : ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Age / Gender",
											v: selectedRelative ? `${selectedRelative.age} - ${selectedRelative.gender === "F" ? "Female" : "Male"}` : ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Patient ID",
											v: selectedRelative?.patientId ?? ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Relation",
											v: selectedRelative?.relation ?? ""
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Name",
										v: "Jacob Jones"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Patient ID",
										v: "P-10051"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
									title: "Appointment",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Checkup",
											v: checkupName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Specialty",
											v: specialty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Doctor",
											v: selectedDoctor ? getDoctorName(selectedDoctor) : ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Date",
											v: formatDisplayDate(appointmentDate)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Time",
											v: selectedSlot?.label ?? ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Reminder",
											v: getReminderLabel(patientReminderMinutes)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Channel",
											v: getChannelLabel(notificationChannels)
										}),
										reasonForVisit.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Reason",
											v: reasonForVisit.trim()
										})
									]
								})]
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
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
			})
		]
	});
}
function Block({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 text-sm font-semibold text-primary",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "space-y-1.5",
			children
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-medium text-right",
			children: v
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
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "DR";
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
function getContact(user) {
	return typeof user?.contactId === "object" ? user.contactId : void 0;
}
function getErrorMessage(err) {
	if (typeof err === "object" && err && "response" in err) {
		const message = err.response?.data?.message;
		return Array.isArray(message) ? message.join(", ") : message;
	}
}
function Field({ label, value, onChange, type = "text", required, min }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		className: "mt-1.5",
		type,
		min,
		value,
		onChange: (event) => onChange(event.target.value),
		required
	})] });
}
//#endregion
export { PatientBook as component };
