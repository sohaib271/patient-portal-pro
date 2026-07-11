import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as SlidersHorizontal, d as Search, p as Plus } from "../_libs/lucide-react.mjs";
import { c as useDoctorProfile, d as useUser, n as Avatar, t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { n as useDoctorAppointments } from "./useAppointments-Cr5jdskI.mjs";
import { t as Patient } from "./patient.service-CCdChYiv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patients-Znjkzlrn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PatientsLayout() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/patients") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientsList, {});
}
function PatientsList() {
	const [query, setQuery] = (0, import_react.useState)("");
	const { user, isLoading: isLoadingUser } = useUser();
	const isDoctor = user?.role === "doctor";
	const { data: doctorProfile, isLoading: isLoadingDoctorProfile } = useDoctorProfile(isDoctor ? user?._id : void 0);
	const { data: doctorAppointments = [], isLoading, isError, refetch } = useDoctorAppointments(doctorProfile?._id, void 0, Boolean(user && isDoctor && doctorProfile?._id));
	const adminPatientsQuery = useQuery({
		queryKey: ["admin-patients"],
		queryFn: () => Patient.getAllPatients(),
		enabled: Boolean(user && !isDoctor)
	});
	const doctorPatients = (0, import_react.useMemo)(() => buildDoctorPatients(doctorAppointments), [doctorAppointments]);
	const adminPatients = adminPatientsQuery.data?.patients ?? [];
	const normalizedQuery = query.trim().toLowerCase();
	const filteredDoctorPatients = (0, import_react.useMemo)(() => {
		return doctorPatients.filter((patient) => {
			const text = [
				patient.name,
				patient.patientId,
				patient.phone,
				patient.email
			].join(" ").toLowerCase();
			return !normalizedQuery || text.includes(normalizedQuery);
		});
	}, [doctorPatients, normalizedQuery]);
	const filteredAdminPatients = (0, import_react.useMemo)(() => {
		return adminPatients.filter((patient) => {
			const contact = getPatientContact(patient);
			const text = [
				patient.patientId,
				patient.firstName,
				patient.lastName,
				contact?.phone,
				contact?.whatsappNo,
				contact?.email
			].join(" ").toLowerCase();
			return !normalizedQuery || text.includes(normalizedQuery);
		});
	}, [adminPatients, normalizedQuery]);
	if (isDoctor) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: "My Patients" }],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "My Patients"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [doctorPatients.length, " patients have booked appointments with you"]
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[220px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search by name, ID, phone, or email...",
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
								children: "Patient ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Age"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Gender"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Phone Number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Last Visit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Appointments"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: isLoadingUser || isLoadingDoctorProfile || isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "py-8 text-center text-muted-foreground",
							children: "Loading patients..."
						}) }) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "py-8 text-center text-destructive",
							children: "Unable to load your patients."
						}) }) : filteredDoctorPatients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "py-8 text-center text-muted-foreground",
							children: "No patients found."
						}) }) : filteredDoctorPatients.map((patient) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/40 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 font-medium text-primary",
									children: patient.patientId
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(patient.name) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: patient.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: patient.email
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: patient.age ?? "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: formatGender(patient.gender)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: patient.phone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: formatDisplayDate(patient.lastVisit)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: patient.appointmentCount
								})
							]
						}, patient._id))
					})]
				})
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: "Patients" }],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Patients"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [adminPatients.length, " registered patients"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/register",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Register Patient"]
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
						placeholder: "Search by name, ID, phone, or email...",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => adminPatientsQuery.refetch(),
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
								children: "Patient ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Age"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Gender"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Phone Number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Last Visit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-3 pr-4" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: adminPatientsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "py-8 text-center text-muted-foreground",
							children: "Loading patients..."
						}) }) : adminPatientsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "py-8 text-center text-destructive",
							children: "Unable to load patients."
						}) }) : filteredAdminPatients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "py-8 text-center text-muted-foreground",
							children: "No patients found."
						}) }) : filteredAdminPatients.map((patient) => {
							const contact = getPatientContact(patient);
							const name = getPatientName(patient);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 font-medium text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/patients/$id",
											params: { id: patient._id },
											children: patient.patientId
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(name) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: contact?.email || "-"
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: patient.age ?? "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: formatGender(patient.gender ?? void 0)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: contact?.phone || contact?.whatsappNo || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-muted-foreground",
										children: "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/appointments/new",
											className: "text-sm font-medium text-primary hover:underline",
											children: "Book Appointment"
										})
									})
								]
							}, patient._id);
						})
					})]
				})
			})]
		})]
	});
}
function getPatientContact(patient) {
	return typeof patient.contactId === "object" ? patient.contactId : void 0;
}
function getPatientName(patient) {
	return [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}
function buildDoctorPatients(appointments) {
	const patientsById = /* @__PURE__ */ new Map();
	appointments.forEach((appointment) => {
		const patient = typeof appointment.patientId === "object" ? appointment.patientId : void 0;
		if (!patient?._id) return;
		const contact = typeof appointment.contactId === "object" ? appointment.contactId : void 0;
		const existing = patientsById.get(patient._id);
		const lastVisit = appointment.estimatedTurnTime ?? appointment.appointmentDate;
		const row = existing ?? {
			_id: patient._id,
			patientId: patient.patientId ?? "No patient ID",
			name: [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient",
			age: patient.age,
			gender: patient.gender,
			phone: contact?.phone ?? contact?.whatsappNo ?? "-",
			email: contact?.email ?? "-",
			lastVisit,
			appointmentCount: 0
		};
		row.appointmentCount += 1;
		if (lastVisit && (!row.lastVisit || new Date(lastVisit) > new Date(row.lastVisit))) row.lastVisit = lastVisit;
		patientsById.set(patient._id, row);
	});
	return Array.from(patientsById.values()).sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
}
function getInitials(name) {
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT";
}
function formatGender(value) {
	if (value === "F") return "Female";
	if (value === "M") return "Male";
	return value ?? "-";
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
//#endregion
export { PatientsLayout as component };
