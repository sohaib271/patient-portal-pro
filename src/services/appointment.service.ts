import { api } from "./api";

export type AppointmentSlot = {
    time: string;
    label: string;
    startsAt: string;
    turnNumber: number;
    available: boolean;
};

export type DoctorAvailability = {
    success: boolean;
    date: string;
    dayName: string;
    schedule: { day: string; startTime: string; endTime: string } | null;
    slotMinutes?: number;
    slots: AppointmentSlot[];
    message?: string;
};

export type AppointmentStatus = "pending" | "booked" | "in_progress" | "completed" | "cancelled" | "delayed";

export type BookAppointmentPayload = {
    contactId: string;
    patientId: string;
    checkupId: string;
    doctorId: string;
    reasonForVisit?: string;
    appointmentDate: string;
    appointmentTime: string;
    patientReminderMinutes: number;
    notificationChannel?: string[];
    bufferMinutes?: number;
};

export type AppointmentPatient = {
    _id: string;
    firstName?: string;
    lastName?: string;
    patientId?: string;
    age?: number;
    gender?: string;
};

export type AppointmentRecord = {
    _id: string;
    patientId?: string | AppointmentPatient;
    contactId?: string | { _id: string; phone?: string; whatsappNo?: string; email?: string };
    doctorId?: string | {
        _id: string;
        speciality?: string;
        userId?: string | { _id: string; firstName?: string; lastName?: string };
    };
    checkupId?: string | { _id: string; name?: string; specialityRequired?: string };
    reasonForVisit?: string;
    appointmentDate: string;
    estimatedTurnTime?: string;
    status?: string;
    createdByRole?: string;
    turnNumber?: number;
    patientReminderMinutes?: number;
    bufferMinutes?: number;
    notificationChannel?: string[];
};

export type UpdateAppointmentPayload = {
    doctorId?: string;
    checkupId?: string;
    reasonForVisit?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    status?: AppointmentStatus;
    patientReminderMinutes?: number;
    notificationChannel?: string[];
    bufferMinutes?: number;
};

export class Appointment{
    static async getDoctorAppointments(doctorId:string,date?:string){
        const res = await api.get(`/appointment/doctor/${doctorId}`,{params:{date}});
        return res.data as { success:boolean; message?:string; appointments:AppointmentRecord[] };
    }

    static async getDoctorAvailability(doctorId:string,date:string,bufferMinutes?:number,excludeAppointmentId?:string){
        const res = await api.get(`/appointment/doctor/${doctorId}/availability`,{params:{date,bufferMinutes,excludeAppointmentId}});
        return res.data as DoctorAvailability;
    }

    static async bookAppointment(data:BookAppointmentPayload){
        const res = await api.post("/appointment/book", data);
        return res.data;
    }
    static async getMyAppointments(date?:string){
        const res=await api.get("/appointment/my-appointments",{params:{date}});
        return res.data as { success:boolean; date?:string; count:number; appointments:AppointmentRecord[] };
    }
    static async getAppointments(date?:string){
        const res=await api.get("/appointment",{params:{date}});
        return res.data as { success:boolean; date?:string; count:number; appointments:AppointmentRecord[] };
    }
    static async updateAppointment(appointmentId:string,data:UpdateAppointmentPayload){
        const res=await api.patch(`/appointment/${appointmentId}`,data);
        return res.data as { success:boolean; message:string; appointment:AppointmentRecord };
    }
}
