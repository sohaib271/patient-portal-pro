import { api } from "./api";

export type DoctorSchedule = {
  day: string;
  startTime: string;
  endTime: string;
};

export type CreateDoctorPayload = {
  userId: string;
  speciality: string;
  averageCheckUpTime: number;
  schedule?: DoctorSchedule[];
  isAvailable?: boolean;
};

export type DoctorUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  gender?: string;
  image?: string;
  phone?: string;
  address?: string;
};

export type Doctor = {
  _id: string;
  userId: string | DoctorUser;
  speciality: string;
  averageCheckupTime: number;
  schedule?: DoctorSchedule[];
  isAvailable?: boolean;
};

export type UpdateDoctorPayload = {
  speciality?: string;
  averageCheckUpTime?: number;
  isAvailable?: boolean;
};

export class DoctorService {
  static async getDoctors() {
    const res = await api.get("/doctor");
    return res.data;
  }

  static async getDoctorById(userId: string) {
    const res = await api.get(`/doctor/${userId}`);
    return res.data;
  }

  static async createDoctor(data: CreateDoctorPayload) {
    const res = await api.post("/doctor/create", data);
    return res.data;
  }

  static async updateDoctor(userId: string, data: UpdateDoctorPayload) {
    const res = await api.patch(`/doctor/update/${userId}`, data);
    return res.data;
  }

  static async updateSchedule(userId: string, schedule: DoctorSchedule[]) {
    const res = await api.patch(`/doctor/${userId}/schedule`, { schedule });
    return res.data;
  }
}
