import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Avatar } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as doctors } from "./mock-data-DZ3Nliz9.mjs";
import { t as PatientShell } from "./patient-Cx5i6qGo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.doctors-D1fQ9wIG.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PatientShell, {
	breadcrumbs: [{
		label: "Dashboard",
		to: "/patient/dashboard"
	}, { label: "My Doctors" }],
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-1 text-2xl font-bold tracking-tight",
			children: "My Doctors"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-6 text-sm text-muted-foreground",
			children: "Your care team"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: doctors.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 hover:border-primary/40 hover:shadow-md transition-all",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: d.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: d.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: d.specialty
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 text-xs text-muted-foreground",
					children: ["Next available: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: d.next
					})]
				})]
			}, d.id))
		})
	]
});
//#endregion
export { SplitComponent as component };
