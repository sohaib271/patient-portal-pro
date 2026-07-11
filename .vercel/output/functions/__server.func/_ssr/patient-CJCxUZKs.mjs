import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as PanelLeftOpen, L as Bell, M as CalendarDays, d as Search, p as Plus, s as Stethoscope, u as Settings, x as LayoutGrid } from "../_libs/lucide-react.mjs";
import { a as LogoutConfirmButton, d as useUser, i as Logo, r as Breadcrumbs } from "./app-shell-BJX_0vmy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient-CJCxUZKs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/patient/dashboard",
		label: "Dashboard",
		icon: LayoutGrid
	},
	{
		to: "/patient/appointments",
		label: "My Appointments",
		icon: CalendarDays
	},
	{
		to: "/patient/book",
		label: "Book Appointment",
		icon: Plus
	},
	{
		to: "/patient/doctors",
		label: "My Doctors",
		icon: Stethoscope
	}
];
function PatientLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
function PatientShell({ children, breadcrumbs }) {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user } = useUser();
	const patientName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Patient";
	const initials = patientName.split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase();
	const gender = user?.gender === "F" ? "Female" : user?.gender === "M" ? "Male" : "Patient";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar transition-transform", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 px-3 space-y-1",
						children: nav.map((n) => {
							const Icon = n.icon;
							const active = pathname === n.to;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: n.to,
								onClick: () => setMobileOpen(false),
								className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-muted/60"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-[18px] w-[18px]", active && "text-primary") }),
									" ",
									n.label
								]
							}, n.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-sidebar-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 px-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground",
								children: "PATIENT PORTAL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-sky-400 text-xs font-bold text-primary-foreground",
									children: initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: patientName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: gender
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoutConfirmButton, {})
						]
					})
				]
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
				onClick: () => setMobileOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-1 flex-col lg:pl-[260px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileOpen(true),
							className: "grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1",
							children: breadcrumbs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: breadcrumbs })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative hidden sm:block w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search...",
								className: "pl-9 h-9 bg-muted/50 border-transparent"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoutConfirmButton, { iconOnly: true })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 lg:px-8 lg:py-8 animate-in fade-in duration-300",
					children
				})]
			})
		]
	});
}
//#endregion
export { PatientShell, PatientLayout as component };
