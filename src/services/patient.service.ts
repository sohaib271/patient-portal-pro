import { api } from "./api";

export type PatientContact = {
    phone: string;
    whatsappNo: string;
    email: string;
};

export type PatientRecord = {
    _id: string;
    contactId: string;
    patientId: string;
    firstName: string;
    lastName: string;
    age: number;
    city?: string | null;
    gender?: string | null;
    relation?: string | null;
    role?: string;
    hasPassword?: boolean;
};

export type PatientRegistration = {
    contactId: string;
    firstName: string;
    lastName: string;
    age: number;
    city?: string;
    gender?: string;
    relation?: string;
    password: string;
};

export class Patient{
    static async addOrSearchContact(data:PatientContact){
        const res=await api.post("/patient/contact",data);
        return res.data;
    }

    static async selfRegister(data:PatientRegistration){
        const res=await api.post("/patient/patient-register",data);
        return res.data;
    }

    static async setPassword(patientId:string, contactId:string, password:string){
        const res=await api.patch("/patient/set-password", { password }, { params: { patientId, contactId } });
        return res.data;
    }
}
