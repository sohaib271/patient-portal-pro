import { api } from "./api";

export type PatientContact = {
    _id?: string;
    phone: string;
    whatsappNo: string;
    email: string;
};

export type PatientRecord = {
    _id: string;
    contactId: string | PatientContact;
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

export type PatientWithPhone = PatientRecord & {
    phone: string;
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

export type AppointmentPatientRegistration = {
    phone: string;
    whatsappNo?: string;
    email?: string;
    firstName: string;
    lastName: string;
    age: number;
    city?: string;
    gender?: string;
    relation?: string;
};

export class Patient{
    static async getAllPatients(page?: number, limit = 6){
        const res=await api.get("/patient/get-all", { params: { page, limit } });
        return res.data as { success:boolean; patients:PatientRecord[]; count?:number; page?:number; limit?:number; totalPages?:number };
    }

    static async searchByPhone(phone:string){
        const res=await api.post("/patient/get-by-phone",{ phone });
        return res.data;
    }

    static async createPatientByPhone(data:AppointmentPatientRegistration){
        const res=await api.post("/patient/create-patient-by-phone",data);
        return res.data;
    }

    static async addOrSearchContact(data:PatientContact){
        const res=await api.post("/patient/contact",data);
        return res.data;
    }
    static async getMyDoctors(){
        const res=await api.get("/patient/my-doctors");
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
