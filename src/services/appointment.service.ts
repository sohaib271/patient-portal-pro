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

export type FollowUpReason = "planned_revisit" | "emergency_revisit" | "test_only" | "prescription_pickup" | "other";
export type HandlerType = "doctor" | "nurse" | "self";

export type CreateFollowUpPayload = {
    patientId: string;
    handlerType: HandlerType;
    doctorId?: string;
    followUpDate: string;
    followUpTime?: string;
    reason: FollowUpReason;
    reasonNote: string;
    notificationChannel?: string[];
    parentAppointmentId?: string;
    checkupId?: string;
    patientReminderMinutes?: number;
    bufferMinutes?: number;
};

export type FollowUpRecord = {
    _id: string;
    patientId?: string | AppointmentPatient;
    doctorId?: string | {
        _id: string;
        speciality?: string;
        userId?: string | { _id: string; firstName?: string; lastName?: string };
    } | null;
    handlerType: HandlerType;
    followUpDate: string;
    reason: FollowUpReason;
    reasonNote?: string;
    parentAppointmentId?: string | { _id?: string; appointmentDate?: string; turnNumber?: number } | null;
    checkupId?: string | { _id: string; name?: string; specialityRequired?: string } | null;
    turnNumber?: number;
    estimatedTurnTime?: string;
    patientReminderMinutes?: number;
    bufferMinutes?: number;
    status?: string;
};

export class Appointment{
    static async getDoctorAppointments(doctorId:string,date?:string){
        const res = await api.get(`/appointment/doctor/${doctorId}`,{params:{date}});
        return res.data as { success:boolean; message?:string; appointments:AppointmentRecord[] };
    }

    static async getDoctorAvailability(doctorId:string,date:string,bufferMinutes?:number,excludeAppointmentId?:string,signal?:AbortSignal){
        const res = await api.get(`/appointment/doctor/${doctorId}/availability`,{
            params:{date,bufferMinutes,excludeAppointmentId},
            signal,
        });
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
    static async getAppointmentById(appointmentId:string){
        const res=await api.get(`/appointment/${appointmentId}`);
        return res.data as { success:boolean; appointment:AppointmentRecord };
    }
    static async createFollowUp(data:CreateFollowUpPayload){
        const res=await api.post("/appointment/follow-up",data);
        return res.data as { success:boolean; message:string; followUp:unknown };
    }
    static async getFollowUps(date?:string){
        const res=await api.get("/appointment/get-follow-up",{params:{date}});
        return res.data as { success:boolean; date?:string; count:number; followUps:FollowUpRecord[] };
    }
    static async getMyFollowUps(date?:string){
        const res=await api.get("/appointment/my-follow-ups",{params:{date}});
        return res.data as { success:boolean; date?:string; count:number; followUps:FollowUpRecord[] };
    }
    static async updateAppointment(appointmentId:string,data:UpdateAppointmentPayload){
        const res=await api.patch(`/appointment/${appointmentId}`,data);
        return res.data as { success:boolean; message:string; appointment:AppointmentRecord };
    }
}
