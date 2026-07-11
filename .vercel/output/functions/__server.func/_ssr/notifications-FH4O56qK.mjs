import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, t as Button } from "./api-CC38_k8-.mjs";
import { E as Clock, G as CircleX, K as CircleCheck, V as TriangleAlert, f as RotateCw, g as MessageSquare, y as Mail } from "../_libs/lucide-react.mjs";
import { o as StatusBadge, t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { n as notifications } from "./mock-data-DZ3Nliz9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-FH4O56qK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tabs = [
	"All",
	"Sent",
	"Pending",
	"Scheduled",
	"Failed"
];
function NotificationsPage() {
	const [tab, setTab] = (0, import_react.useState)("All");
	const list = tab === "All" ? notifications : notifications.filter((n) => n.status === tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: "Notifications" }],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Notifications"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Appointment reminders and notification log"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " 2 failed deliveries require attention"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1 border-b border-border",
				children: tabs.map((t) => {
					const count = t === "All" ? notifications.length : notifications.filter((n) => n.status === t).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setTab(t),
						className: cn("relative px-3 py-2 text-sm font-medium", tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"),
						children: [
							t,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-xs opacity-70",
								children: count
							}),
							tab === t && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" })
						]
					}, t);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 divide-y divide-border",
				children: list.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", n.status === "Sent" && "bg-emerald-100 text-emerald-700", n.status === "Pending" && "bg-amber-100 text-amber-700", n.status === "Failed" && "bg-rose-100 text-rose-700", n.status === "Scheduled" && "bg-sky-100 text-sky-700"),
						children: [
							n.status === "Sent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
							n.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
							n.status === "Failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }),
							n.status === "Scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: n.patient
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3 w-3 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: n.status }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs text-muted-foreground",
										children: n.ts
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									n.doctor,
									" · ",
									n.date,
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: n.timing
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: n.body
							}),
							n.status === "Failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-3.5 w-3.5" }), " Retry"]
								})
							})
						]
					})]
				}, n.id))
			})]
		})]
	});
}
//#endregion
export { NotificationsPage as component };
