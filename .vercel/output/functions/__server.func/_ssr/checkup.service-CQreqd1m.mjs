import { r as api } from "./api-CC38_k8-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkup.service-CQreqd1m.js
var CheckupService = class {
	static async findOrCreate(data) {
		return (await api.post("/checkups/find-or-create", data)).data;
	}
};
//#endregion
export { CheckupService as t };
