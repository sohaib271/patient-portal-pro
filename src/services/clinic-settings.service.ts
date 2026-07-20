import { api } from "./api";

export type ClinicSettingsRecord = {
  _id?: string;
  clinicName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  website?: string;
  address?: string;
  logoUrl?: string;
};

export class ClinicSettingsService {
  static async getSettings() {
    const res = await api.get("/clinic-settings");
    return res.data as { success: boolean; settings: ClinicSettingsRecord };
  }

  static async updateSettings(payload: Record<string, string>, image?: File) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
    if (image) {
      formData.append("image", image);
    }
    const res = await api.patch("/clinic-settings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as { success: boolean; settings: ClinicSettingsRecord };
  }
}
