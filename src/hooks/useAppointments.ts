import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Appointment, type AppointmentRecord, type UpdateAppointmentPayload } from "@/services/appointment.service";

export const appointmentsQueryKey = (date?: string) => ["appointments", date ?? "all"] as const;

export const doctorAppointmentsQueryKey = (doctorId?: string, date?: string) => ["doctor-appointments", doctorId ?? "none", date ?? "all"] as const;
export const myAppointmentsQueryKey = (date?: string) => ["my-appointments", date ?? "all"] as const;

export function useAppointments(date?: string, enabled = true) {
  return useQuery({
    queryKey: appointmentsQueryKey(date),
    queryFn: async () => {
      const response = await Appointment.getAppointments(date);
      return Array.isArray(response?.appointments) ? response.appointments : [];
    },
    enabled,
  });
}

export function useDoctorAppointments(doctorId?: string, date?: string, enabled = true) {
  return useQuery({
    queryKey: doctorAppointmentsQueryKey(doctorId, date),
    queryFn: async () => {
      if (!doctorId) return [];
      const response = await Appointment.getDoctorAppointments(doctorId, date);
      return Array.isArray(response?.appointments) ? response.appointments as AppointmentRecord[] : [];
    },
    enabled: Boolean(enabled && doctorId),
  });
}

export function useMyAppointments(date?: string, enabled = true) {
  return useQuery({
    queryKey: myAppointmentsQueryKey(date),
    queryFn: async () => {
      const response = await Appointment.getMyAppointments(date);
      return Array.isArray(response?.appointments) ? response.appointments : [];
    },
    enabled,
  });
}

export function useUpdateAppointment(date?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, data }: { appointmentId: string; data: UpdateAppointmentPayload }) =>
      Appointment.updateAppointment(appointmentId, data),
    onSuccess: ({ appointment }) => {
      queryClient.setQueryData<AppointmentRecord[]>(appointmentsQueryKey(date), (current = []) =>
        current.map((item) => (item._id === appointment._id ? appointment : item)),
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
  });
}
