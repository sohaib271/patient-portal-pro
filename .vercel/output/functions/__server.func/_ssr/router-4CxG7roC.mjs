import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { F as useRouter, O as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$16 } from "./doctors._id-CHjNd7bX.mjs";
import { t as Route$17 } from "./follow-ups.new-DcPj2ZVA.mjs";
import { n as Route$18 } from "./patient-Cx5i6qGo.mjs";
import { t as Route$19 } from "./patients._id-BcawOKO2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-4CxG7roC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-B-o3S9IA.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$13 = () => import("./settings-DZe3D_mZ.mjs");
var Route$14 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./register-y4Tm3IBI.mjs");
var Route$13 = createFileRoute("/register")({
	head: () => ({ meta: [{ title: "Register - MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./patients-Znjkzlrn.mjs");
var Route$12 = createFileRoute("/patients")({
	head: () => ({ meta: [{ title: "Patients — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./notifications-FH4O56qK.mjs");
var Route$11 = createFileRoute("/notifications")({
	head: () => ({ meta: [{ title: "Notifications — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./login-Bnbl0JkD.mjs");
var Route$10 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./follow-ups-fe15Y26Z.mjs");
var Route$9 = createFileRoute("/follow-ups")({
	head: () => ({ meta: [{ title: "Follow-ups - MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./doctors-B-6UQwF6.mjs");
var Route$8 = createFileRoute("/doctors")({
	head: () => ({ meta: [{ title: "Doctors — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard-CVRsMJQO.mjs");
var Route$7 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard - MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./appointments-CLUxGfGr.mjs");
var Route$6 = createFileRoute("/appointments")({
	head: () => ({ meta: [{ title: "Appointments - MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var Route$5 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/login" });
} });
var $$splitComponentImporter$4 = () => import("./patient.doctors-D1fQ9wIG.mjs");
var Route$4 = createFileRoute("/patient/doctors")({
	head: () => ({ meta: [{ title: "My Doctors — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./patient.dashboard-r8j9Ue1C.mjs");
var Route$3 = createFileRoute("/patient/dashboard")({
	head: () => ({ meta: [{ title: "My Portal — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./patient.book-B9mZymf8.mjs");
var Route$2 = createFileRoute("/patient/book")({
	head: () => ({ meta: [{ title: "Book Appointment — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./patient.appointments-Dw-O673U.mjs");
var Route$1 = createFileRoute("/patient/appointments")({
	head: () => ({ meta: [{ title: "My Appointments — MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./appointments.new-C8CLr-u_.mjs");
var Route = createFileRoute("/appointments/new")({
	head: () => ({ meta: [{ title: "New Appointment - MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var SettingsRoute = Route$14.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$15
});
var RegisterRoute = Route$13.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$15
});
var PatientsRoute = Route$12.update({
	id: "/patients",
	path: "/patients",
	getParentRoute: () => Route$15
});
var PatientRoute = Route$18.update({
	id: "/patient",
	path: "/patient",
	getParentRoute: () => Route$15
});
var NotificationsRoute = Route$11.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => Route$15
});
var LoginRoute = Route$10.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$15
});
var FollowUpsRoute = Route$9.update({
	id: "/follow-ups",
	path: "/follow-ups",
	getParentRoute: () => Route$15
});
var DoctorsRoute = Route$8.update({
	id: "/doctors",
	path: "/doctors",
	getParentRoute: () => Route$15
});
var DashboardRoute = Route$7.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$15
});
var AppointmentsRoute = Route$6.update({
	id: "/appointments",
	path: "/appointments",
	getParentRoute: () => Route$15
});
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var PatientsIdRoute = Route$19.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => PatientsRoute
});
var PatientDoctorsRoute = Route$4.update({
	id: "/doctors",
	path: "/doctors",
	getParentRoute: () => PatientRoute
});
var PatientDashboardRoute = Route$3.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => PatientRoute
});
var PatientBookRoute = Route$2.update({
	id: "/book",
	path: "/book",
	getParentRoute: () => PatientRoute
});
var PatientAppointmentsRoute = Route$1.update({
	id: "/appointments",
	path: "/appointments",
	getParentRoute: () => PatientRoute
});
var FollowUpsNewRoute = Route$17.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => FollowUpsRoute
});
var DoctorsIdRoute = Route$16.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => DoctorsRoute
});
var AppointmentsRouteChildren = { AppointmentsNewRoute: Route.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AppointmentsRoute
}) };
var AppointmentsRouteWithChildren = AppointmentsRoute._addFileChildren(AppointmentsRouteChildren);
var DoctorsRouteChildren = { DoctorsIdRoute };
var DoctorsRouteWithChildren = DoctorsRoute._addFileChildren(DoctorsRouteChildren);
var FollowUpsRouteChildren = { FollowUpsNewRoute };
var FollowUpsRouteWithChildren = FollowUpsRoute._addFileChildren(FollowUpsRouteChildren);
var PatientRouteChildren = {
	PatientAppointmentsRoute,
	PatientBookRoute,
	PatientDashboardRoute,
	PatientDoctorsRoute
};
var PatientRouteWithChildren = PatientRoute._addFileChildren(PatientRouteChildren);
var PatientsRouteChildren = { PatientsIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AppointmentsRoute: AppointmentsRouteWithChildren,
	DashboardRoute,
	DoctorsRoute: DoctorsRouteWithChildren,
	FollowUpsRoute: FollowUpsRouteWithChildren,
	LoginRoute,
	NotificationsRoute,
	PatientRoute: PatientRouteWithChildren,
	PatientsRoute: PatientsRoute._addFileChildren(PatientsRouteChildren),
	RegisterRoute,
	SettingsRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
