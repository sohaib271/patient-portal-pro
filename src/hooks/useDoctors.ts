import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DoctorService, type Doctor, type DoctorSchedule, type UpdateDoctorPayload } from "@/services/doctor.service";
import { UserService, type CreateUserPayload, type UpdateUserPayload } from "@/services/user.service";

const doctorsQueryKey = ["doctors"] as const;
const doctorQueryKey = (userId: string) => ["doctor", userId] as const;

type CreateDoctorInput = {
  user: CreateUserPayload;
  doctor: {
    speciality: string;
    averageCheckUpTime: number;
    schedule?: DoctorSchedule[];
    isAvailable?: boolean;
    biography?: string;
    qualifications?: string[];
  };
};

type UpdateDoctorInput = {
  userId: string;
  data: UpdateDoctorPayload;
  schedule?: DoctorSchedule[];
  userData?: UpdateUserPayload;
};

function replaceDoctor(doctors: Doctor[] | undefined, updatedDoctor: Doctor) {
  return (doctors ?? []).map((doctor) => (doctor._id === updatedDoctor._id ? updatedDoctor : doctor));
}

export function useDoctors() {
  return useQuery({
    queryKey: doctorsQueryKey,
    queryFn: async () => {
      const response = await DoctorService.getDoctors();
      return Array.isArray(response?.doctors) ? response.doctors as Doctor[] : [];
    },
  });
}

export function useDoctorProfile(userId?: string) {
  return useQuery({
    queryKey: userId ? doctorQueryKey(userId) : ["doctor", "me"],
    queryFn: async () => {
      if (!userId) return null;
      const response = await DoctorService.getDoctorById(userId);
      return response.doctor as Doctor;
    },
    enabled: Boolean(userId),
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, doctor }: CreateDoctorInput) => {
      let createdUserId = "";

      try {
        const userResponse = await UserService.createUser(user);
        createdUserId = userResponse.user?._id;
        if (!createdUserId) throw new Error("User created, but no user id was returned.");

        await DoctorService.createDoctor({
          userId: createdUserId,
          ...doctor,
        });

        const doctorResponse = await DoctorService.getDoctorById(createdUserId);
        return doctorResponse.doctor as Doctor;
      } catch (error) {
        if (createdUserId) await UserService.deleteUser(createdUserId);
        throw error;
      }
    },
    onSuccess: (doctor) => {
      queryClient.setQueryData<Doctor[]>(doctorsQueryKey, (current = []) => [doctor, ...current]);
      queryClient.setQueryData(doctorQueryKey(getDoctorUserId(doctor)), doctor);
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data, schedule, userData }: UpdateDoctorInput) => {
      await Promise.all([
        DoctorService.updateDoctor(userId, data),
        userData && Object.keys(userData).length ? UserService.updateUser(userId, userData) : Promise.resolve(),
      ]);
      if (schedule) await DoctorService.updateSchedule(userId, schedule);
      const response = await DoctorService.getDoctorById(userId);
      return response.doctor as Doctor;
    },
    onSuccess: (doctor) => {
      queryClient.setQueryData<Doctor[]>(doctorsQueryKey, (current) => replaceDoctor(current, doctor));
      queryClient.setQueryData(doctorQueryKey(getDoctorUserId(doctor)), doctor);
    },
  });
}

function getDoctorUserId(doctor: Doctor) {
  return typeof doctor.userId === "object" ? doctor.userId._id : doctor.userId;
}
