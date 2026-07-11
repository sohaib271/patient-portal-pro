import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn } from "./api-CC38_k8-.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as StatusBadge } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as Appointment } from "./appointment.service-Cx5LZS-H.mjs";
import { t as PatientShell } from "./patient-Cx5i6qGo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.appointments-Dw-O673U.js
var import_jsx_runtime = require_jsx_runtime();
function PatientAppointments() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["patient-appointments"],
		queryFn: () => Appointment.getMyAppointments()
	});
	const appointments = data?.appointments ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PatientShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/patient/dashboard"
		}, { label: "My Appointments" }],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-1 text-2xl font-bold tracking-tight",
				children: "My Appointments"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 text-sm text-muted-foreground",
				children: "Past and upcoming visits"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground",
					children: "Loading appointments..."
				}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: "Unable to load appointments."
				}) : appointments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground",
					children: "No appointments found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									children: "Patient"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Doctor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Checkup"
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
									children: "Created By"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: appointments.map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 font-medium text-primary",
										children: formatAppointmentId(appointment._id)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4",
										children: getPatientLabel(appointment)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4",
										children: getDoctorLabel(appointment)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: getCheckupName(appointment)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: appointment.reasonForVisit || "Not specified"
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
									})
								]
							}, appointment._id))
						})]
					})
				})
			})
		]
	});
}
function getPatientLabel(appointment) {
	const patient = typeof appointment.patientId === "object" ? appointment.patientId : void 0;
	const name = [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Patient";
	return patient?.patientId ? `${name} - ${patient.patientId}` : name;
}
function getDoctorLabel(appointment) {
	const doctor = typeof appointment.doctorId === "object" ? appointment.doctorId : void 0;
	const user = doctor && typeof doctor.userId === "object" ? doctor.userId : void 0;
	const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Doctor";
	return doctor?.speciality ? `${name} - ${doctor.speciality}` : name;
}
function getCheckupName(appointment) {
	return (typeof appointment.checkupId === "object" ? appointment.checkupId : void 0)?.name ?? "Checkup";
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
function formatAppointmentId(id) {
	return `APT-${id.slice(-5).toUpperCase()}`;
}
function formatDate(value) {
	if (!value) return "";
	return new Date(value).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function isDelayedAppointment(appointment) {
	return appointment.status === "delayed";
}
function getAppointmentDateLabel(appointment) {
	if (isDelayedAppointment(appointment)) return "N/A";
	return formatDate(appointment.appointmentDate);
}
function getAppointmentTimeLabel(appointment) {
	if (isDelayedAppointment(appointment)) return "N/A";
	return formatTime(appointment.estimatedTurnTime);
}
function formatTime(value) {
	if (!value) return "";
	return new Date(value).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	});
}
function formatStatus(status = "pending") {
	return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function formatCreatorRole(role) {
	if (!role) return "Unknown";
	return role.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
//#endregion
export { PatientAppointments as component };
