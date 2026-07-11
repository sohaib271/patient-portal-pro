import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn } from "./api-CC38_k8-.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Clock, m as Phone, y as Mail, z as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as Avatar, o as StatusBadge, t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as Route } from "./doctors._id-CHjNd7bX.mjs";
import { t as doctors } from "./mock-data-DZ3Nliz9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctors._id-CrrhpVGe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DoctorProfile() {
	const { id } = Route.useParams();
	const d = doctors.find((x) => x.id === id) ?? doctors[0];
	const [tab, setTab] = (0, import_react.useState)("Overview");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [
			{
				label: "Dashboard",
				to: "/dashboard"
			},
			{
				label: "Doctors",
				to: "/doctors"
			},
			{ label: "Doctor Profile" }
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/doctors",
				className: "mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to Doctors"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Doctor Profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Check doctor details and appointments"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: d.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-semibold",
										children: d.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: d.specialty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }), " +1 (555) 900-1102"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
												" ",
												d.id.toLowerCase(),
												"@clinic.com"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
												" Next: ",
												d.next
											]
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: d.todays
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Today's appointments"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-1 border-b border-border",
				children: [
					"Overview",
					"Schedule",
					"Availability"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(t),
					className: cn("relative px-4 py-2 text-sm font-medium", tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"),
					children: [t, tab === t && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" })]
				}, t))
			}),
			tab === "Overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold",
							children: "Biography"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								d.name,
								" specializes in ",
								d.specialty.toLowerCase(),
								" with a focus on patient-centered care and modern diagnostic methods."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 mb-2 text-sm font-semibold",
							children: "Qualifications"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-1.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "•"
									}), " MD, University of Pennsylvania"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "•"
									}), " Residency — UCSF Medical Center"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "•"
									}), " Board Certified"]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Recent Appointments"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "text-xs font-medium text-primary hover:underline",
							href: "#",
							children: "View all"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: [
							{
								n: "Jennifer Brooks",
								d: "2026-06-11 · 10:30 AM",
								s: "Scheduled"
							},
							{
								n: "Bessie Cooper",
								d: "2026-06-10 · 10:00 AM",
								s: "Confirmed"
							},
							{
								n: "Savannah Nguyen",
								d: "2026-06-08 · 09:30 AM",
								s: "Confirmed"
							},
							{
								n: "Darlene Robertson",
								d: "2026-06-04 · 09:00 AM",
								s: "Confirmed"
							}
						].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border p-3 hover:border-primary/40 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: a.n
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: a.d
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: a.s })]
						}, a.n))
					})]
				})]
			}),
			tab !== "Overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-semibold",
					children: "Weekly Availability"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: [
						[
							"Monday",
							"9:00 AM",
							"10:00 AM",
							"11:00 AM",
							"2:00 PM",
							"3:00 PM"
						],
						[
							"Tuesday",
							"9:00 AM",
							"10:00 AM",
							"2:00 PM",
							"4:00 PM"
						],
						[
							"Wednesday",
							"10:00 AM",
							"11:00 AM",
							"3:00 PM"
						],
						[
							"Thursday",
							"9:00 AM",
							"11:00 AM",
							"2:00 PM",
							"3:00 PM"
						],
						[
							"Friday",
							"9:00 AM",
							"10:00 AM"
						]
					].map(([day, ...slots]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[120px_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: day
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: slots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary",
								children: s
							}, s))
						})]
					}, day))
				})]
			})
		]
	});
}
//#endregion
export { DoctorProfile as component };
