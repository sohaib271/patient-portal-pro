import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as SlidersHorizontal, d as Search, j as CalendarPlus } from "../_libs/lucide-react.mjs";
import { d as useUser, n as Avatar, o as StatusBadge, t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { i as useMyFollowUps, r as useFollowUps } from "./useAppointments-Cr5jdskI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/follow-ups-fe15Y26Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var handlerLabels = {
	doctor: "Doctor",
	nurse: "Nurse",
	self: "Self"
};
var reasonLabels = {
	planned_revisit: "Planned Revisit",
	emergency_revisit: "Emergency Revisit",
	test_only: "Test Only",
	prescription_pickup: "Prescription Pickup",
	other: "Other"
};
function FollowUpsPage() {
	const { user, isLoading: isLoadingUser } = useUser();
	const isDoctor = user?.role === "doctor";
	const [query, setQuery] = (0, import_react.useState)("");
	const adminFollowUps = useFollowUps(void 0, Boolean(user && !isDoctor));
	const doctorFollowUps = useMyFollowUps(void 0, Boolean(user && isDoctor));
	const { data: followUps = [], isLoading, isError, refetch } = isDoctor ? doctorFollowUps : adminFollowUps;
	const normalizedQuery = query.trim().toLowerCase();
	const visibleFollowUps = (0, import_react.useMemo)(() => {
		if (!isDoctor) return followUps;
		return followUps.filter(isScheduledDoctorFollowUp);
	}, [followUps, isDoctor]);
	const filtered = (0, import_react.useMemo)(() => {
		return visibleFollowUps.filter((followUp) => {
			const text = [
				getPatientName(followUp),
				getPatientCode(followUp),
				getDoctorName(followUp),
				getReasonLabel(followUp.reason),
				followUp.reasonNote,
				followUp.handlerType,
				followUp.status
			].join(" ").toLowerCase();
			return !normalizedQuery || text.includes(normalizedQuery);
		});
	}, [normalizedQuery, visibleFollowUps]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: isDoctor ? "My Scheduled Follow-ups" : "Follow-ups" }],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: isDoctor ? "My Scheduled Follow-ups" : "Follow-ups"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					visibleFollowUps.length,
					" ",
					isDoctor ? "scheduled follow-ups" : "follow-ups created"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/follow-ups/new",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-4 w-4" }), " New Follow-up"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[220px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search patient, reason, handler, doctor...",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => refetch(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4" }), " Refresh"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Patient"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Handler"
							}),
							!isDoctor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Doctor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Reason"
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
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: isLoadingUser || isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: isDoctor ? 6 : 7,
							className: "py-8 text-center text-muted-foreground",
							children: "Loading follow-ups..."
						}) }) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: isDoctor ? 6 : 7,
							className: "py-8 text-center text-destructive",
							children: "Unable to load follow-ups."
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: isDoctor ? 6 : 7,
							className: "py-8 text-center text-muted-foreground",
							children: "No follow-ups found."
						}) }) : filtered.map((followUp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/40 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(getPatientName(followUp)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: getPatientName(followUp)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: getPatientCode(followUp)
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: handlerLabels[followUp.handlerType] ?? followUp.handlerType
								}),
								!isDoctor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: getDoctorName(followUp)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3 pr-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: getReasonLabel(followUp.reason)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "max-w-xs truncate text-xs text-muted-foreground",
										children: followUp.reasonNote || "-"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: formatDisplayDate(followUp.followUpDate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: formatDisplayTime(followUp.estimatedTurnTime ?? followUp.followUpDate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: formatStatus(followUp.status) })
								})
							]
						}, followUp._id))
					})]
				})
			})]
		})]
	});
}
function getPatientName(followUp) {
	const patient = typeof followUp.patientId === "object" ? followUp.patientId : void 0;
	return [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}
function getPatientCode(followUp) {
	return (typeof followUp.patientId === "object" ? followUp.patientId : void 0)?.patientId ?? "-";
}
function getDoctorName(followUp) {
	const doctor = typeof followUp.doctorId === "object" && followUp.doctorId ? followUp.doctorId : void 0;
	const doctorUser = typeof doctor?.userId === "object" ? doctor.userId : void 0;
	const name = [doctorUser?.firstName, doctorUser?.lastName].filter(Boolean).join(" ");
	return name ? `Dr. ${name}` : followUp.handlerType === "doctor" ? "Doctor" : "-";
}
function getReasonLabel(reason) {
	return reason ? reasonLabels[reason] ?? reason : "-";
}
function isScheduledDoctorFollowUp(followUp) {
	if (followUp.handlerType !== "doctor") return false;
	if (["completed", "cancelled"].includes(followUp.status ?? "")) return false;
	return getPakistanDateValue(followUp.estimatedTurnTime ?? followUp.followUpDate) >= getPakistanDateValue((/* @__PURE__ */ new Date()).toISOString());
}
function formatStatus(status) {
	if (!status) return "Pending";
	return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function formatDisplayDate(value) {
	if (!value) return "-";
	return new Date(value).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "Asia/Karachi"
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
function getPakistanDateValue(value) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone: "Asia/Karachi"
	}).formatToParts(new Date(value));
	return `${parts.find((part) => part.type === "year")?.value ?? ""}-${parts.find((part) => part.type === "month")?.value ?? ""}-${parts.find((part) => part.type === "day")?.value ?? ""}`;
}
function getInitials(name) {
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "FU";
}
//#endregion
export { FollowUpsPage as component };
