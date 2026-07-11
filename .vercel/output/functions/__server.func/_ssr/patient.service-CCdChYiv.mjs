import { r as api } from "./api-CC38_k8-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.service-CCdChYiv.js
var Patient = class {
	static async getAllPatients() {
		return (await api.get("/patient/get-all")).data;
	}
	static async searchByPhone(phone) {
		return (await api.post("/patient/get-by-phone", { phone })).data;
	}
	static async createPatientByPhone(data) {
		return (await api.post("/patient/create-patient-by-phone", data)).data;
	}
	static async addOrSearchContact(data) {
		return (await api.post("/patient/contact", data)).data;
	}
	static async selfRegister(data) {
		return (await api.post("/patient/patient-register", data)).data;
	}
	static async setPassword(patientId, contactId, password) {
		return (await api.patch("/patient/set-password", { password }, { params: {
			patientId,
			contactId
		} })).data;
	}
};
//#endregion
export { Patient as t };
