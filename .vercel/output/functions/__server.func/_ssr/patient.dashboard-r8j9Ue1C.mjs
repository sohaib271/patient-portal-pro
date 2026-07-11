import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./api-CC38_k8-.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as CalendarCheck, p as Plus, s as Stethoscope } from "../_libs/lucide-react.mjs";
import { d as useUser, o as StatusBadge } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as PatientShell } from "./patient-Cx5i6qGo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.dashboard-r8j9Ue1C.js
var import_jsx_runtime = require_jsx_runtime();
function PatientDashboard() {
	const { user } = useUser();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PatientShell, {
		breadcrumbs: [{ label: "Dashboard" }],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: ["Welcome back, ", [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Patient"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Here is a summary of your health portal today."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground",
						children: [
							user?.patientId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-md border border-border px-2 py-1",
								children: ["Patient ID: ", user.patientId]
							}),
							user?.age && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-md border border-border px-2 py-1",
								children: ["Age: ", user.age]
							}),
							user?.city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-md border border-border px-2 py-1",
								children: ["City: ", user.city]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Quick Actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/patient/book",
							className: "group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-sky-500 p-5 text-primary-foreground transition-transform hover:-translate-y-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mb-6 h-6 w-6" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: "Book a New Appointment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs opacity-90",
									children: "For yourself or a relative"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "absolute -right-2 -bottom-2 h-20 w-20 opacity-10" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/patient/doctors",
							className: "flex items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: "View My Doctors"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Your care team"
							})] })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Upcoming"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-lg bg-primary-soft p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-primary",
								children: "Tomorrow · 10:00 AM"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Dr. Wilson · Cardiology"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "mt-3 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/patient/appointments",
								children: "View all"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold mb-3",
					children: "My Appointments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-xs uppercase text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Appt ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Doctor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Reason"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: [{
								id: "APT-5001",
								d: "Dr. Sarah Jenkins · Cardiology",
								r: "Quarterly cardiology follow-up",
								dt: "Jul 24, 2026",
								tm: "10:30 AM",
								s: "Confirmed"
							}, {
								id: "APT-5002",
								d: "Dr. James John · General Practice",
								r: "Medication review",
								dt: "Aug 02, 2026",
								tm: "4:30 PM",
								s: "Confirmed"
							}].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 font-medium text-primary",
										children: a.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4",
										children: a.d
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: a.r
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: a.dt
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: a.tm
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: a.s })
									})
								]
							}, a.id))
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { PatientDashboard as component };
