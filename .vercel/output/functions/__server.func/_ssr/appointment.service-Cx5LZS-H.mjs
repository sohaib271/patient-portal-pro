import { r as api } from "./api-CC38_k8-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/appointment.service-Cx5LZS-H.js
var Appointment = class {
	static async getDoctorAppointments(doctorId, date) {
		return (await api.get(`/appointment/doctor/${doctorId}`, { params: { date } })).data;
	}
	static async getDoctorAvailability(doctorId, date, bufferMinutes, excludeAppointmentId) {
		return (await api.get(`/appointment/doctor/${doctorId}/availability`, { params: {
			date,
			bufferMinutes,
			excludeAppointmentId
		} })).data;
	}
	static async bookAppointment(data) {
		return (await api.post("/appointment/book", data)).data;
	}
	static async getMyAppointments(date) {
		return (await api.get("/appointment/my-appointments", { params: { date } })).data;
	}
	static async getAppointments(date) {
		return (await api.get("/appointment", { params: { date } })).data;
	}
	static async getAppointmentById(appointmentId) {
		return (await api.get(`/appointment/${appointmentId}`)).data;
	}
	static async createFollowUp(data) {
		return (await api.post("/appointment/follow-up", data)).data;
	}
	static async getFollowUps(date) {
		return (await api.get("/appointment/get-follow-up", { params: { date } })).data;
	}
	static async getMyFollowUps(date) {
		return (await api.get("/appointment/my-follow-ups", { params: { date } })).data;
	}
	static async updateAppointment(appointmentId, data) {
		return (await api.patch(`/appointment/${appointmentId}`, data)).data;
	}
};
//#endregion
export { Appointment as t };
