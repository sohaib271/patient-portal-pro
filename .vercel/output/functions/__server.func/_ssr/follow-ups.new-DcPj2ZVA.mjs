import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/follow-ups.new-DcPj2ZVA.js
var $$splitComponentImporter = () => import("./follow-ups.new-Cpbo5qqm.mjs");
var Route = createFileRoute("/follow-ups/new")({
	validateSearch: (search) => ({ appointmentId: typeof search.appointmentId === "string" ? search.appointmentId : void 0 }),
	head: () => ({ meta: [{ title: "New Follow-up - MediFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
