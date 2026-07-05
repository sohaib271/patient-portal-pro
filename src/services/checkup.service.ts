import { api } from "./api";

export type CheckupRecord = {
  _id: string;
  name: string;
  specialityRequired: string;
  estimatedDuration?: number;
  bufferTime?: number;
  isActive?: boolean;
};

export type FindOrCreateCheckupPayload = {
  name: string;
  specialityRequired: string;
  estimatedDuration?: number;
  bufferTime?: number;
};

export class CheckupService {
  static async findOrCreate(data: FindOrCreateCheckupPayload) {
    const res = await api.post("/checkups/find-or-create", data);
    return res.data as { success: boolean; message: string; data: CheckupRecord };
  }
}
