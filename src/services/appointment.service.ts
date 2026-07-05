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

export type BookAppointmentPayload = {
    contactId: string;
    patientId: string;
    checkupId: string;
    doctorId: string;
    reasonForVisit?: string;
    appointmentDate: string;
    appointmentTime: string;
    patientReminderMinutes: number;
    bufferMinutes?: number;
};

export type AppointmentRecord = {
    _id: string;
    patientId?: string | { _id: string; firstName?: string; lastName?: string; patientId?: string };
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
    turnNumber?: number;
};

export class Appointment{
    static async getDoctorAppointments(doctorId:string,date?:string){
        const res = await api.get(`/appointment/doctor/${doctorId}`,{params:{date}});
        return res.data;
    }

    static async getDoctorAvailability(doctorId:string,date:string){
        const res = await api.get(`/appointment/doctor/${doctorId}/availability`,{params:{date}});
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
}
