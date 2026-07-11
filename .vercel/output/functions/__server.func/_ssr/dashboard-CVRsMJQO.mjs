import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input } from "./api-CC38_k8-.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as CalendarRange, F as CalendarCheck, M as CalendarDays, W as ClipboardPenLine, a as TrendingUp, d as Search, i as UserPlus, j as CalendarPlus, n as Users, p as Plus, s as Stethoscope } from "../_libs/lucide-react.mjs";
import { c as useDoctorProfile, d as useUser, n as Avatar, o as StatusBadge, t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { n as useDoctorAppointments, t as useAppointments } from "./useAppointments-Cr5jdskI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CVRsMJQO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { user } = useUser();
	if (user?.role === "doctor") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorDashboard, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {});
}
function AdminDashboard() {
	const { user } = useUser();
	const [appointmentQuery, setAppointmentQuery] = (0, import_react.useState)("");
	const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Staff";
	const today = (0, import_react.useMemo)(() => getPakistanTodayValue(), []);
	const todayLabel = (0, import_react.useMemo)(() => formatLongDate(today), [today]);
	const { data: todayAppointments = [], isLoading: isLoadingTodayAppointments, isError: todayAppointmentsError } = useAppointments(today);
	const normalizedAppointmentQuery = appointmentQuery.trim().toLowerCase();
	const filteredTodayAppointments = (0, import_react.useMemo)(() => {
		return todayAppointments.filter((appointment) => {
			const text = [
				getPatientName(appointment),
				getPatientCode(appointment),
				getDoctorName(appointment),
				getSpecialty(appointment),
				appointment._id
			].join(" ").toLowerCase();
			return !normalizedAppointmentQuery || text.includes(normalizedAppointmentQuery);
		});
	}, [normalizedAppointmentQuery, todayAppointments]);
	const doctorStats = (0, import_react.useMemo)(() => buildDoctorStats(todayAppointments), [todayAppointments]);
	const completedToday = todayAppointments.filter((appointment) => appointment.status === "completed").length;
	const remainingToday = todayAppointments.filter((appointment) => !["completed", "cancelled"].includes(appointment.status ?? "")).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{ label: "Dashboard" }],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: ["Good morning, ", displayName]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [todayLabel, " - Here's what's happening today."]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-sm font-semibold text-foreground",
						children: "Quick Actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/appointments/new",
								className: "group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-sky-500 p-4 text-primary-foreground transition-transform hover:-translate-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mb-6 h-6 w-6" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: "Book a New Appointment"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs opacity-90",
										children: [todayAppointments.length, " appointments scheduled for today"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "absolute -right-2 -bottom-2 h-20 w-20 opacity-10" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/patients",
								className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Register New Patient"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/doctors",
								className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "View Doctor Schedules"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/follow-ups/new",
								className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Create Follow-up"
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between gap-3 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: "Today's Appointments"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [todayAppointments.length, " appointments scheduled"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: appointmentQuery,
									onChange: (event) => setAppointmentQuery(event.target.value),
									placeholder: "Search by name or ID...",
									className: "pl-9 h-9 w-56"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 flex flex-wrap gap-2",
							children: doctorStats.map((doctor, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${doctor.tone}`,
								children: [
									doctor.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "opacity-70",
										children: doctor.count
									})
								]
							}, index))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border",
							children: isLoadingTodayAppointments ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "Loading today's appointments..."
							}) : todayAppointmentsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-destructive",
								children: "Unable to load today's appointments."
							}) : filteredTodayAppointments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "No appointments found for today."
							}) : filteredTodayAppointments.slice(0, 6).map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium text-muted-foreground",
										children: getAppointmentTimeLabel(appointment)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-semibold",
											children: getPatientName(appointment)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												getPatientCode(appointment),
												" - ",
												getDoctorName(appointment),
												" - ",
												getSpecialty(appointment)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: formatStatus(appointment.status) })
								]
							}, appointment._id))
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: CalendarCheck,
						title: "Today's Appointments",
						value: todayAppointments.length,
						a: {
							label: "Completed",
							value: completedToday
						},
						b: {
							label: "Remaining",
							value: remainingToday
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Users,
						title: "Patients",
						value: 1740,
						a: {
							label: "Registered this Month",
							value: 140
						},
						b: {
							label: "Older than 1 month",
							value: 1600
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Stethoscope,
						title: "Doctors",
						value: 15,
						a: {
							label: "Available Today",
							value: 14
						},
						b: {
							label: "Unavailable",
							value: "01"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: TrendingUp,
						title: "Follow-up Checkups",
						value: "82%",
						a: {
							label: "Expected",
							value: 100
						},
						b: {
							label: "Confirmed",
							value: 82
						}
					})
				]
			})]
		})]
	});
}
function DoctorDashboard() {
	const { user } = useUser();
	const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Savannah";
	const today = (0, import_react.useMemo)(() => getPakistanTodayValue(), []);
	const todayLabel = (0, import_react.useMemo)(() => formatLongDate(today), [today]);
	const { data: doctorProfile, isLoading: isLoadingDoctorProfile } = useDoctorProfile(user?.role === "doctor" ? user?._id : void 0);
	const doctorProfileId = doctorProfile?._id;
	const { data: rawTodayAppointments = [], isLoading: isLoadingTodayAppointments, isError: todayAppointmentsError } = useDoctorAppointments(doctorProfileId, today, Boolean(user && user.role === "doctor" && doctorProfileId));
	const { data: myAppointments = [], isLoading: isLoadingMyAppointments, isError: myAppointmentsError } = useDoctorAppointments(doctorProfileId, void 0, Boolean(user && user.role === "doctor" && doctorProfileId));
	const todayAppointments = (0, import_react.useMemo)(() => rawTodayAppointments.filter((appointment) => getAppointmentDateValue(appointment) === today), [rawTodayAppointments, today]);
	const upcomingAppointments = (0, import_react.useMemo)(() => {
		const nextSevenDaysEnd = (/* @__PURE__ */ new Date(`${today}T00:00:00+05:00`)).getTime() + 11520 * 60 * 1e3;
		return myAppointments.filter((appointment) => {
			if ([
				"completed",
				"cancelled",
				"delayed"
			].includes(appointment.status ?? "")) return false;
			const appointmentTime = new Date(appointment.estimatedTurnTime ?? appointment.appointmentDate).getTime();
			return appointmentTime >= Date.now() && appointmentTime < nextSevenDaysEnd;
		}).sort((a, b) => new Date(a.estimatedTurnTime ?? a.appointmentDate).getTime() - new Date(b.estimatedTurnTime ?? b.appointmentDate).getTime());
	}, [myAppointments, today]);
	const completedToday = todayAppointments.filter((appointment) => appointment.status === "completed").length;
	const remainingToday = todayAppointments.filter((appointment) => !["completed", "cancelled"].includes(appointment.status ?? "")).length;
	const activePatientCount = new Set(myAppointments.map((appointment) => getPatientObject(appointment)?._id).filter(Boolean)).size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{ label: "Dashboard" }],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: ["Good morning, Dr. ", displayName]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [todayLabel, " - Here's what's happening today."]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "overflow-hidden p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold text-foreground",
							children: "Quick Actions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.9fr)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/doctors",
								className: "group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-sky-500 p-4 text-primary-foreground transition-transform hover:-translate-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPenLine, { className: "mb-6 h-6 w-6" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: "Edit Your Schedule"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs opacity-90",
										children: "Click here to update your schedule"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "absolute -right-2 -bottom-2 h-20 w-20 opacity-10" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/appointments/new",
										className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: "Book a New Appointment"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/patients",
										className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: "Register a New Patient"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/follow-ups/new",
										className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: "Create Follow-up"
										})]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: "Today's Patients"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [todayAppointments.length, " visited clinic today"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border",
							children: isLoadingDoctorProfile || isLoadingTodayAppointments ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "Loading today's patients..."
							}) : todayAppointmentsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-destructive",
								children: "Unable to load today's patients."
							}) : todayAppointments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "No patients visited today."
							}) : todayAppointments.map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 py-3 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-14 rounded-lg bg-muted px-2 py-1.5 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-bold leading-tight",
											children: getAppointmentTimeParts(appointment).time
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: getAppointmentTimeParts(appointment).period
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(getPatientName(appointment)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium leading-tight",
													children: getPatientName(appointment)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "truncate text-xs text-muted-foreground",
													children: [
														getPatientCode(appointment),
														" - ",
														getCheckupName(appointment)
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 truncate text-xs text-muted-foreground",
													children: getPatientContact(appointment)
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 sm:flex-col sm:items-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: formatStatus(appointment.status) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/patients",
											className: "text-xs font-medium text-primary hover:underline",
											children: "View Details"
										})]
									})
								]
							}, appointment._id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: "Upcoming Appointments"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Next 7 days"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border",
							children: isLoadingDoctorProfile || isLoadingMyAppointments ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "Loading upcoming appointments..."
							}) : myAppointmentsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-destructive",
								children: "Unable to load upcoming appointments."
							}) : upcomingAppointments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "No upcoming appointments found."
							}) : upcomingAppointments.slice(0, 6).map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg bg-primary-soft px-2 py-1 text-center text-xs font-semibold text-primary",
										children: getShortDateLabel(appointment)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-medium",
											children: getPatientName(appointment)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												getAppointmentTimeLabel(appointment),
												" - ",
												getSpecialty(appointment)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: formatStatus(appointment.status) })
								]
							}, appointment._id))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: CalendarDays,
						title: "Today's Appointments",
						value: todayAppointments.length,
						a: {
							label: "Completed",
							value: completedToday
						},
						b: {
							label: "Remaining",
							value: remainingToday
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Users,
						title: "Patients",
						value: activePatientCount,
						a: {
							label: "Visited Today",
							value: todayAppointments.length
						},
						b: {
							label: "With Appointments",
							value: activePatientCount
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: CalendarCheck,
						title: "Expected Appointments",
						value: upcomingAppointments.length,
						a: {
							label: "Expected Today",
							value: remainingToday
						},
						b: {
							label: "Next 7 Days",
							value: upcomingAppointments.length
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold",
							children: "Today's Patient Alerts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: todayAppointments.filter((appointment) => appointment.status === "delayed" || appointment.status === "cancelled").length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground",
								children: "No appointment alerts for today."
							}) : todayAppointments.filter((appointment) => appointment.status === "delayed" || appointment.status === "cancelled").map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-amber-200 bg-amber-50 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold text-amber-900",
									children: getPatientName(appointment)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs leading-relaxed text-amber-800",
									children: [
										"Appointment is ",
										formatStatus(appointment.status).toLowerCase(),
										"."
									]
								})]
							}, appointment._id))
						})]
					})
				]
			})]
		})]
	});
}
function buildDoctorStats(appointments) {
	const tones = [
		"bg-amber-50 text-amber-700 ring-amber-200",
		"bg-rose-50 text-rose-700 ring-rose-200",
		"bg-emerald-50 text-emerald-700 ring-emerald-200",
		"bg-sky-50 text-sky-700 ring-sky-200",
		"bg-violet-50 text-violet-700 ring-violet-200"
	];
	const counts = /* @__PURE__ */ new Map();
	appointments.forEach((appointment) => {
		const doctorId = getDoctorId(appointment) || getDoctorName(appointment);
		const current = counts.get(doctorId) ?? {
			name: getDoctorName(appointment),
			total: 0,
			completed: 0
		};
		current.total += 1;
		if (appointment.status === "completed") current.completed += 1;
		counts.set(doctorId, current);
	});
	return Array.from(counts.values()).sort((a, b) => b.total - a.total).slice(0, 5).map((item, index) => ({
		name: item.name,
		count: `${item.completed} / ${item.total}`,
		tone: tones[index % tones.length]
	}));
}
function getPatientName(appointment) {
	const patient = getPatientObject(appointment);
	return [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}
function getPatientCode(appointment) {
	return getPatientObject(appointment)?.patientId ?? appointment._id.slice(-6).toUpperCase();
}
function getPatientObject(appointment) {
	return typeof appointment.patientId === "object" ? appointment.patientId : void 0;
}
function getDoctorId(appointment) {
	return typeof appointment.doctorId === "object" ? appointment.doctorId._id : appointment.doctorId ?? "";
}
function getDoctorName(appointment) {
	const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : void 0;
	const doctorUser = typeof doctor?.userId === "object" ? doctor.userId : void 0;
	const name = [doctorUser?.firstName, doctorUser?.lastName].filter(Boolean).join(" ");
	return name ? `Dr. ${name}` : "Unassigned Doctor";
}
function getSpecialty(appointment) {
	const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : void 0;
	const checkup = typeof appointment.checkupId === "object" ? appointment.checkupId : void 0;
	return doctor?.speciality ?? checkup?.specialityRequired ?? "No specialty";
}
function getCheckupName(appointment) {
	return (typeof appointment.checkupId === "object" ? appointment.checkupId : void 0)?.name ?? getSpecialty(appointment);
}
function getPatientContact(appointment) {
	const contact = typeof appointment.contactId === "object" ? appointment.contactId : void 0;
	return contact?.phone || contact?.whatsappNo || contact?.email || "No contact saved";
}
function getAppointmentTimeLabel(appointment) {
	if (appointment.status === "delayed") return "N/A";
	if (!appointment.estimatedTurnTime) return "-";
	return new Date(appointment.estimatedTurnTime).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		timeZone: "Asia/Karachi"
	});
}
function getAppointmentTimeParts(appointment) {
	const [time = "-", period = ""] = getAppointmentTimeLabel(appointment).split(" ");
	return {
		time,
		period
	};
}
function getShortDateLabel(appointment) {
	return new Date(appointment.estimatedTurnTime ?? appointment.appointmentDate).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		timeZone: "Asia/Karachi"
	});
}
function getAppointmentDateValue(appointment) {
	const value = appointment.estimatedTurnTime ?? appointment.appointmentDate;
	const parts = new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone: "Asia/Karachi"
	}).formatToParts(new Date(value));
	return `${parts.find((part) => part.type === "year")?.value ?? ""}-${parts.find((part) => part.type === "month")?.value ?? ""}-${parts.find((part) => part.type === "day")?.value ?? ""}`;
}
function getInitials(name) {
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT";
}
function formatStatus(status) {
	if (!status) return "Pending";
	return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function getPakistanTodayValue() {
	const parts = new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone: "Asia/Karachi"
	}).formatToParts(/* @__PURE__ */ new Date());
	return `${parts.find((part) => part.type === "year")?.value ?? ""}-${parts.find((part) => part.type === "month")?.value ?? ""}-${parts.find((part) => part.type === "day")?.value ?? ""}`;
}
function formatLongDate(value) {
	return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	});
}
function StatCard({ icon: Icon, title, value, a, b }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 hover:shadow-md transition-shadow",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium text-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-3xl font-bold tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-muted-foreground",
					children: a.label
				}), a.value !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold text-foreground",
					children: a.value
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: b.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold text-foreground",
						children: b.value
					})]
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
