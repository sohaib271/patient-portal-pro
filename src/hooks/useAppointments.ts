import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Appointment, type AppointmentRecord, type AppointmentStatus, type FollowUpRecord, type UpdateAppointmentPayload } from "@/services/appointment.service";

type UseAppointmentsOptions = {
  date?: string;
  status?: AppointmentStatus | readonly AppointmentStatus[];
  enabled?: boolean;
};

const statusQueryKey = (status?: AppointmentStatus | readonly AppointmentStatus[]) =>
  Array.isArray(status) ? [...status].sort().join(",") : status ?? "all";

export const appointmentsQueryKey = (date?: string, status?: AppointmentStatus | readonly AppointmentStatus[]) =>
  ["appointments", date ?? "all", statusQueryKey(status)] as const;

export const doctorAppointmentsQueryKey = (doctorId?: string, date?: string) => ["doctor-appointments", doctorId ?? "none", date ?? "all"] as const;
export const myAppointmentsQueryKey = (date?: string) => ["my-appointments", date ?? "all"] as const;
export const followUpsQueryKey = (date?: string) => ["follow-ups", date ?? "all"] as const;
export const myFollowUpsQueryKey = (date?: string) => ["my-follow-ups", date ?? "all"] as const;

export function useAppointments({ date, status, enabled = true }: UseAppointmentsOptions = {}) {
  return useQuery({
    queryKey: appointmentsQueryKey(date, status),
    queryFn: async () => {
      const response = await Appointment.getAppointments(date, status, 1, 6);
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

export function useFollowUps(date?: string, enabled = true) {
  return useQuery({
    queryKey: followUpsQueryKey(date),
    queryFn: async () => {
      const response = await Appointment.getFollowUps(date, 1, 6);
      return Array.isArray(response?.followUps) ? response.followUps as FollowUpRecord[] : [];
    },
    enabled,
  });
}

export function useMyFollowUps(date?: string, enabled = true) {
  return useQuery({
    queryKey: myFollowUpsQueryKey(date),
    queryFn: async () => {
      const response = await Appointment.getMyFollowUps(date, 1, 6);
      return Array.isArray(response?.followUps) ? response.followUps as FollowUpRecord[] : [];
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

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: AppointmentStatus }) =>
      Appointment.updateAppointmentStatus(appointmentId, status),
    onSuccess: (_response, { appointmentId, status }) => {
      const updateCachedStatus = (current: AppointmentRecord[] | undefined) =>
        current?.map((item) => (item._id === appointmentId ? { ...item, status } : item));

      queryClient.setQueriesData<AppointmentRecord[]>({ queryKey: ["appointments"] }, updateCachedStatus);
      queryClient.setQueriesData<AppointmentRecord[]>({ queryKey: ["doctor-appointments"] }, updateCachedStatus);
      queryClient.setQueriesData<AppointmentRecord[]>({ queryKey: ["my-appointments"] }, updateCachedStatus);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
  });
}
