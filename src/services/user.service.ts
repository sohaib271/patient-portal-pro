import { api } from "./api";

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  city: string;
  gender?: string;
  image?: string;
  address: string;
  email: string;
  phone: string;
  password: string;
};

export class UserService {
  static async createUser(data: CreateUserPayload) {
    const res = await api.post("/user/add", data);
    return res.data;
  }

  static async deleteUser(userId: string) {
    const res = await api.delete(`/user/delete/${userId}`);
    return res.data;
  }
}
