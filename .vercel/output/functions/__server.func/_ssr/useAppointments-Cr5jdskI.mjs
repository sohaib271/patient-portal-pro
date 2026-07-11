import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Appointment } from "./appointment.service-Cx5LZS-H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAppointments-Cr5jdskI.js
var appointmentsQueryKey = (date) => ["appointments", date ?? "all"];
var doctorAppointmentsQueryKey = (doctorId, date) => [
	"doctor-appointments",
	doctorId ?? "none",
	date ?? "all"
];
var followUpsQueryKey = (date) => ["follow-ups", date ?? "all"];
var myFollowUpsQueryKey = (date) => ["my-follow-ups", date ?? "all"];
function useAppointments(date, enabled = true) {
	return useQuery({
		queryKey: appointmentsQueryKey(date),
		queryFn: async () => {
			const response = await Appointment.getAppointments(date);
			return Array.isArray(response?.appointments) ? response.appointments : [];
		},
		enabled
	});
}
function useDoctorAppointments(doctorId, date, enabled = true) {
	return useQuery({
		queryKey: doctorAppointmentsQueryKey(doctorId, date),
		queryFn: async () => {
			if (!doctorId) return [];
			const response = await Appointment.getDoctorAppointments(doctorId, date);
			return Array.isArray(response?.appointments) ? response.appointments : [];
		},
		enabled: Boolean(enabled && doctorId)
	});
}
function useFollowUps(date, enabled = true) {
	return useQuery({
		queryKey: followUpsQueryKey(date),
		queryFn: async () => {
			const response = await Appointment.getFollowUps(date);
			return Array.isArray(response?.followUps) ? response.followUps : [];
		},
		enabled
	});
}
function useMyFollowUps(date, enabled = true) {
	return useQuery({
		queryKey: myFollowUpsQueryKey(date),
		queryFn: async () => {
			const response = await Appointment.getMyFollowUps(date);
			return Array.isArray(response?.followUps) ? response.followUps : [];
		},
		enabled
	});
}
function useUpdateAppointment(date) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ appointmentId, data }) => Appointment.updateAppointment(appointmentId, data),
		onSuccess: ({ appointment }) => {
			queryClient.setQueryData(appointmentsQueryKey(date), (current = []) => current.map((item) => item._id === appointment._id ? appointment : item));
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
			queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
			queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
		}
	});
}
//#endregion
export { useUpdateAppointment as a, useMyFollowUps as i, useDoctorAppointments as n, useFollowUps as r, useAppointments as t };
