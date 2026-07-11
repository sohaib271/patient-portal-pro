import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { P as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as ChevronRight, O as ChevronLeft, c as SlidersHorizontal, d as Search, h as Pencil, p as Plus, w as Eye } from "../_libs/lucide-react.mjs";
import { c as useDoctorProfile, d as useUser, l as useDoctors, n as Avatar, o as StatusBadge, t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as Label } from "./label-BuKBvabm.mjs";
import { t as Textarea } from "./textarea-BCF4nEK2.mjs";
import { t as Appointment } from "./appointment.service-Cx5LZS-H.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-n4sYgwkN.mjs";
import { a as useUpdateAppointment, n as useDoctorAppointments, t as useAppointments } from "./useAppointments-Cr5jdskI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/appointments-CLUxGfGr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_BOOKING_WEEK_OFFSET = 7;
var statuses = [
	{
		value: "All",
		label: "All"
	},
	{
		value: "pending",
		label: "Pending"
	},
	{
		value: "booked",
		label: "Booked"
	},
	{
		value: "in_progress",
		label: "In Progress"
	},
	{
		value: "completed",
		label: "Completed"
	},
	{
		value: "delayed",
		label: "Delayed"
	},
	{
		value: "cancelled",
		label: "Cancelled"
	}
];
function AppointmentsLayout() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/appointments") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentsList, {});
}
function AppointmentsList() {
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("All");
	const [query, setQuery] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const { user, isLoading: isLoadingUser } = useUser();
	const isDoctor = user?.role === "doctor";
	const { data: doctorProfile, isLoading: isLoadingDoctorProfile } = useDoctorProfile(isDoctor ? user?._id : void 0);
	const adminAppointments = useAppointments(void 0, Boolean(user && !isDoctor));
	const doctorAppointments = useDoctorAppointments(doctorProfile?._id, void 0, Boolean(user && isDoctor && doctorProfile?._id));
	const { data: appointments = [], isLoading, isError, refetch } = isDoctor ? doctorAppointments : adminAppointments;
	const isLoadingAppointments = isLoadingUser || isDoctor && isLoadingDoctorProfile || isLoading;
	const normalizedQuery = query.trim().toLowerCase();
	const filtered = (0, import_react.useMemo)(() => {
		return appointments.filter((appointment) => {
			const statusMatch = tab === "All" || appointment.status === tab;
			const text = [
				getPatientName(appointment),
				getPatientCode(appointment),
				getDoctorName(appointment),
				getSpecialty(appointment)
			].join(" ").toLowerCase();
			return statusMatch && (!normalizedQuery || text.includes(normalizedQuery));
		});
	}, [
		appointments,
		normalizedQuery,
		tab
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: isDoctor ? "My Appointments" : "Appointments" }],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: isDoctor ? "My Appointments" : "Appointments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [appointments.length, " total appointments"]
				})] }), !isDoctor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/appointments/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Appointment"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 min-w-[220px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "Search by patient, ID, doctor, or specialty...",
								className: "pl-9"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => refetch(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4" }), " Refresh"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-1 border-b border-border",
						children: statuses.map((status) => {
							const count = status.value === "All" ? appointments.length : appointments.filter((appointment) => appointment.status === status.value).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setTab(status.value),
								className: cn("relative px-3 py-2 text-sm font-medium transition-colors", tab === status.value ? "text-primary" : "text-muted-foreground hover:text-foreground"),
								children: [
									status.label,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1 text-xs opacity-70",
										children: count
									}),
									tab === status.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" })
								]
							}, status.value);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "APT ID"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Patient"
									}),
									!isDoctor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Doctor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Specialty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Time"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Created By"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4 text-right",
										children: "Actions"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border",
								children: isLoadingAppointments ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: isDoctor ? 8 : 9,
									className: "py-8 text-center text-muted-foreground",
									children: "Loading appointments..."
								}) }) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: isDoctor ? 8 : 9,
									className: "py-8 text-center text-destructive",
									children: "Unable to load appointments."
								}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: isDoctor ? 8 : 9,
									className: "py-8 text-center text-muted-foreground",
									children: "No appointments found."
								}) }) : filtered.map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "group hover:bg-muted/40 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4 font-medium text-primary",
											children: appointment._id.slice(-6).toUpperCase()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(getPatientName(appointment)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: getPatientName(appointment)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: getPatientCode(appointment)
												})] })]
											})
										}),
										!isDoctor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: getDoctorName(appointment)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4 text-muted-foreground",
											children: getSpecialty(appointment)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4 text-muted-foreground",
											children: getAppointmentDateLabel(appointment)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4 text-muted-foreground",
											children: getAppointmentTimeLabel(appointment)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatorRoleBadge, { role: appointment.createdByRole })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: formatStatus(appointment.status) })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-end gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => setViewing(appointment),
													"aria-label": "View appointment",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => setEditing(appointment),
													"aria-label": "Update appointment",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
												})]
											})
										})
									]
								}, appointment._id))
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDetails, {
				appointment: viewing,
				open: Boolean(viewing),
				onOpenChange: (open) => !open && setViewing(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentEditor, {
				appointment: editing,
				open: Boolean(editing),
				onOpenChange: (open) => !open && setEditing(null),
				lockSchedule: isDoctor,
				onCreateFollowUp: (appointment) => {
					setEditing(null);
					navigate({
						to: "/follow-ups/new",
						search: { appointmentId: appointment._id }
					});
				}
			})
		]
	});
}
function AppointmentEditor({ appointment, open, onOpenChange, lockSchedule = false, onCreateFollowUp }) {
	const [status, setStatus] = (0, import_react.useState)("pending");
	const [specialty, setSpecialty] = (0, import_react.useState)("");
	const [doctorId, setDoctorId] = (0, import_react.useState)("");
	const [weekOffset, setWeekOffset] = (0, import_react.useState)(0);
	const [appointmentDate, setAppointmentDate] = (0, import_react.useState)("");
	const [selectedSlot, setSelectedSlot] = (0, import_react.useState)(null);
	const [reasonForVisit, setReasonForVisit] = (0, import_react.useState)("");
	const [bufferMinutes, setBufferMinutes] = (0, import_react.useState)(5);
	const [error, setError] = (0, import_react.useState)("");
	const { data: doctors = [], isLoading: isLoadingDoctors } = useDoctors();
	const updateAppointment = useUpdateAppointment();
	const availableDoctors = (0, import_react.useMemo)(() => doctors.filter((doctor) => doctor.isAvailable !== false), [doctors]);
	const specialties = (0, import_react.useMemo)(() => Array.from(new Set(availableDoctors.map((doctor) => doctor.speciality).filter(Boolean))).sort(), [availableDoctors]);
	const filteredDoctors = (0, import_react.useMemo)(() => availableDoctors.filter((doctor) => !specialty || doctor.speciality === specialty), [availableDoctors, specialty]);
	const selectedDoctor = availableDoctors.find((doctor) => doctor._id === doctorId);
	const weekDates = (0, import_react.useMemo)(() => buildWeekDates(weekOffset), [weekOffset]);
	const scheduledDays = (0, import_react.useMemo)(() => new Set((selectedDoctor?.schedule ?? []).map((slot) => slot.day.toLowerCase())), [selectedDoctor]);
	const isCompleted = appointment?.status === "completed";
	const isDelayedStatus = status === "delayed";
	const canEditSchedule = !lockSchedule && !isDelayedStatus && !isCompleted;
	const isReadOnly = isCompleted;
	const originalDoctorId = appointment ? getDoctorId(appointment) : "";
	const originalDate = appointment ? getDateValue(appointment) : "";
	const originalTime = appointment ? getTimeValue(appointment.estimatedTurnTime) : "";
	const originalBufferMinutes = appointment?.bufferMinutes ?? 5;
	const scheduleFieldsChanged = canEditSchedule && Boolean(appointment) && (doctorId !== originalDoctorId || appointmentDate !== originalDate || bufferMinutes !== originalBufferMinutes);
	const excludeAppointmentId = appointment && doctorId === originalDoctorId && appointmentDate === originalDate ? appointment._id : void 0;
	const availabilityQuery = useQuery({
		queryKey: [
			"doctor-availability",
			doctorId,
			appointmentDate,
			bufferMinutes,
			excludeAppointmentId
		],
		queryFn: () => Appointment.getDoctorAvailability(doctorId, appointmentDate, bufferMinutes, excludeAppointmentId),
		enabled: Boolean(open && canEditSchedule && doctorId && appointmentDate)
	});
	(0, import_react.useEffect)(() => {
		if (!appointment || !open) return;
		const currentSpecialty = getSpecialty(appointment);
		setStatus(appointment.status ?? "pending");
		setSpecialty(currentSpecialty);
		setDoctorId(getDoctorId(appointment));
		setAppointmentDate(getDateValue(appointment));
		setSelectedSlot(null);
		setReasonForVisit(appointment.reasonForVisit ?? "");
		setBufferMinutes(appointment.bufferMinutes ?? 5);
		setWeekOffset(0);
		setError("");
	}, [appointment, open]);
	(0, import_react.useEffect)(() => {
		if (!open || !selectedDoctor || !canEditSchedule) return;
		if (appointmentDate && scheduledDays.has(getWeekday(appointmentDate).toLowerCase())) return;
		setAppointmentDate(weekDates.find((date) => scheduledDays.has(date.day.toLowerCase()))?.value ?? "");
	}, [
		appointmentDate,
		open,
		scheduledDays,
		selectedDoctor,
		weekDates,
		canEditSchedule
	]);
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!appointment || isReadOnly) return;
		const time = selectedSlot?.time ?? originalTime;
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
			const data = lockSchedule || isDelayedStatus ? {
				status,
				reasonForVisit
			} : {
				status,
				doctorId,
				appointmentDate,
				appointmentTime: time,
				reasonForVisit,
				bufferMinutes,
				patientReminderMinutes: appointment.patientReminderMinutes ?? 60,
				notificationChannel: appointment.notificationChannel
			};
			await updateAppointment.mutateAsync({
				appointmentId: appointment._id,
				data
			});
			onOpenChange(false);
		} catch (err) {
			setError(getErrorMessage(err) ?? "Unable to update appointment.");
			availabilityQuery.refetch();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: isCompleted ? "Appointment (Completed)" : "Update Appointment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: isCompleted ? "This appointment is completed and can no longer be edited. You can schedule a follow-up instead." : "Change status, doctor, date, slot, or visit notes." })] }),
				isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900",
					children: [
						"Completed appointments are locked. Need to see the patient again?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "font-medium underline underline-offset-2",
							onClick: () => appointment && onCreateFollowUp?.(appointment),
							children: "Schedule a follow-up"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							disabled: isReadOnly,
							className: "space-y-5 disabled:opacity-60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
											value: status,
											onChange: (event) => setStatus(event.target.value),
											disabled: isReadOnly,
											children: statuses.filter((item) => item.value !== "All").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: item.value,
												children: item.label
											}, item.value))
										}),
										status === "delayed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: "Delayed appointments are ignored by the scheduling system."
										})
									] }), !lockSchedule && !isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Buffer Minutes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1.5",
										type: "number",
										min: "0",
										value: bufferMinutes,
										onChange: (event) => {
											setBufferMinutes(Math.max(0, Number(event.target.value) || 0));
											setSelectedSlot(null);
										}
									})] })]
								}),
								canEditSchedule && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Specialty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
										value: specialty,
										onChange: (event) => {
											setSpecialty(event.target.value);
											setDoctorId("");
											setAppointmentDate("");
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Doctor" }), !specialty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
										children: "Select a specialty to see doctors."
									}) : filteredDoctors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
										children: "No available doctors found for this specialty."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 grid gap-2 sm:grid-cols-2",
										children: filteredDoctors.map((doctor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setDoctorId(doctor._id);
												setAppointmentDate("");
												setSelectedSlot(null);
											},
											className: cn("flex items-center gap-3 rounded-lg border p-3 text-left transition-all", doctorId === doctor._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(getDoctorDisplayName(doctor)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium",
												children: getDoctorDisplayName(doctor)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: doctor.speciality
											})] })]
										}, doctor._id))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateSlotPicker, {
										selectedDoctor,
										weekDates,
										weekOffset,
										appointmentDate,
										scheduledDays,
										selectedSlot,
										availability: availabilityQuery.data,
										isLoadingSlots: availabilityQuery.isLoading || availabilityQuery.isFetching,
										slotError: availabilityQuery.isError ? getErrorMessage(availabilityQuery.error) ?? "Unable to load slots." : "",
										setWeekOffset,
										setAppointmentDate,
										setSelectedSlot
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason for Visit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "mt-1.5",
									rows: 3,
									value: reasonForVisit,
									onChange: (event) => setReasonForVisit(event.target.value),
									disabled: isReadOnly
								})] })
							]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Close"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => appointment && onCreateFollowUp?.(appointment),
							children: "Schedule Follow-up"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: updateAppointment.isPending || canEditSchedule && (!doctorId || !appointmentDate || scheduleFieldsChanged && !selectedSlot),
							children: updateAppointment.isPending ? "Saving..." : "Save Changes"
						})] }) })
					]
				})
			]
		})
	});
}
function DateSlotPicker(props) {
	const { selectedDoctor, weekDates, weekOffset, appointmentDate, scheduledDays, selectedSlot, availability, isLoadingSlots, slotError, setWeekOffset, setAppointmentDate, setSelectedSlot } = props;
	const clearSelection = () => {
		setAppointmentDate("");
		setSelectedSlot(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date and Slot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "icon",
						disabled: weekOffset === 0,
						onClick: () => {
							setWeekOffset((current) => Math.max(0, current - 1));
							clearSelection();
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
							clearSelection();
						},
						"aria-label": "Next week",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
					})
				]
			})]
		}), !selectedDoctor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
			children: "Select a doctor to see available days and slots."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2 sm:grid-cols-4 lg:grid-cols-7",
			children: weekDates.map((date) => {
				const hasSchedule = scheduledDays.has(date.day.toLowerCase());
				const active = appointmentDate === date.value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: !hasSchedule,
					onClick: () => {
						setAppointmentDate(date.value);
						setSelectedSlot(null);
					},
					className: cn("rounded-lg border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50", active ? "border-primary bg-primary-soft ring-2 ring-primary/20" : "border-border hover:border-primary/40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium text-muted-foreground",
						children: date.day.slice(0, 3)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: date.label
					})]
				}, date.value);
			})
		}), isLoadingSlots ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
			children: "Checking doctor schedule and existing appointments..."
		}) : slotError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
			children: slotError
		}) : availability?.schedule === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900",
			children: availability.message
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
			children: "No free slots are available for this day."
		}) : null] })]
	});
}
function AppointmentDetails({ appointment, open, onOpenChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Appointment Details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: appointment ? appointment._id : "" })] }), appointment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "grid gap-3 text-sm sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					label: "Patient",
					value: `${getPatientName(appointment)} (${getPatientCode(appointment)})`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					label: "Doctor",
					value: getDoctorName(appointment)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					label: "Specialty",
					value: getSpecialty(appointment)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					label: "Checkup",
					value: getCheckupName(appointment)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					label: "Date",
					value: getAppointmentDateLabel(appointment)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					label: "Time",
					value: getAppointmentTimeLabel(appointment)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					label: "Turn",
					value: isDelayedAppointment(appointment) ? "N/A" : appointment.turnNumber ? String(appointment.turnNumber) : "-"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					label: "Status",
					value: formatStatus(appointment.status)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
						label: "Reason",
						value: appointment.reasonForVisit || "Not specified"
					})
				})
			]
		})] })
	});
}
function Detail({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-medium",
			children: value
		})]
	});
}
function CreatorRoleBadge({ role }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", {
			admin: "border-sky-200 bg-sky-50 text-sky-700",
			doctor: "border-emerald-200 bg-emerald-50 text-emerald-700",
			patient: "border-amber-200 bg-amber-50 text-amber-700",
			user: "border-slate-200 bg-slate-50 text-slate-700",
			unknown: "border-slate-200 bg-slate-50 text-slate-600"
		}[(role || "unknown").toLowerCase()] ?? "border-slate-200 bg-slate-50 text-slate-600"),
		children: formatCreatorRole(role)
	});
}
function getPatientName(appointment) {
	const patient = typeof appointment.patientId === "object" ? appointment.patientId : void 0;
	return [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}
function getPatientCode(appointment) {
	return (typeof appointment.patientId === "object" ? appointment.patientId : void 0)?.patientId ?? "No patient ID";
}
function getDoctorName(appointment) {
	const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : void 0;
	const user = typeof doctor?.userId === "object" ? doctor.userId : void 0;
	return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unassigned Doctor";
}
function getDoctorDisplayName(doctor) {
	const user = typeof doctor.userId === "object" ? doctor.userId : void 0;
	return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
}
function getDoctorId(appointment) {
	return typeof appointment.doctorId === "object" ? appointment.doctorId._id : appointment.doctorId ?? "";
}
function getSpecialty(appointment) {
	const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : void 0;
	const checkup = typeof appointment.checkupId === "object" ? appointment.checkupId : void 0;
	return doctor?.speciality ?? checkup?.specialityRequired ?? "";
}
function getCheckupName(appointment) {
	return (typeof appointment.checkupId === "object" ? appointment.checkupId : void 0)?.name ?? "Not specified";
}
function getDateValue(appointment) {
	return getPakistanDateValue(appointment.appointmentDate);
}
function isDelayedAppointment(appointment) {
	return appointment.status === "delayed";
}
function getAppointmentDateLabel(appointment) {
	if (isDelayedAppointment(appointment)) return "N/A";
	return formatDisplayDate(getDateValue(appointment));
}
function getAppointmentTimeLabel(appointment) {
	if (isDelayedAppointment(appointment)) return "N/A";
	return formatDisplayTime(appointment.estimatedTurnTime);
}
function getTimeValue(value) {
	if (!value) return "";
	return new Date(value).toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "Asia/Karachi"
	});
}
function getInitials(name) {
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AP";
}
function formatStatus(status) {
	return statuses.find((item) => item.value === status)?.label ?? "Pending";
}
function formatCreatorRole(role) {
	if (!role) return "Unknown";
	return role.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function formatDisplayDate(value) {
	if (!value) return "-";
	return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function formatDisplayTime(value) {
	if (!value) return "-";
	return new Date(value).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		timeZone: "Asia/Karachi"
	});
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
function toDateInputValue(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function getPakistanDateValue(value) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone: "Asia/Karachi"
	}).formatToParts(new Date(value));
	return `${parts.find((part) => part.type === "year")?.value ?? ""}-${parts.find((part) => part.type === "month")?.value ?? ""}-${parts.find((part) => part.type === "day")?.value ?? ""}`;
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
export { AppointmentsLayout as component };
