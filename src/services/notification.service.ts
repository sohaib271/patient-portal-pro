import { api } from "./api";

export type NotificationStatus =
  | "scheduled"
  | "pending"
  | "processing"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "not-configured"
  | "cancelled";
export type NotificationStatusFilter = NotificationStatus | "upcoming" | "sent-group";
export type NotificationChannel = "whatsapp" | "sms" | "email";
export type NotificationMessageType =
  | "appointment-confirmation"
  | "appointment-18h-reminder"
  | "appointment-custom-reminder"
  | "follow-up-confirmation"
  | "follow-up-18h-reminder"
  | "follow-up-custom-reminder";

export type NotificationItem = {
  id: string;
  sourceType: "appointment" | "follow-up";
  sourceId: string;
  patientId: string;
  patientName: string;
  handlerName: string;
  messageType: NotificationMessageType;
  channel: NotificationChannel;
  destination: string;
  status: NotificationStatus;
  scheduledFor: string;
  appointmentAt: string;
  message: string;
  providerMessageId?: string;
  attempts: number;
  lastAttemptAt?: string;
  sentAt?: string;
  error?: string;
};

export type NotificationsResponse = {
  notifications: NotificationItem[];
  counts: Record<NotificationStatus, number> & { all: number; upcoming: number; sentTotal: number };
  channelCounts: Record<NotificationChannel, number>;
  pagination: { page: number; limit: number; total: number; deliveryTotal: number; pages: number };
};

export type NotificationFilters = {
  status?: NotificationStatusFilter;
  channel?: NotificationChannel;
  messageType?: NotificationMessageType;
  search?: string;
  page: number;
  limit?: number;
  groupBySource?: boolean;
};

export class NotificationService {
  static async getNotifications(filters: NotificationFilters) {
    const response = await api.get<NotificationsResponse>("/notifications", { params: filters });
    return response.data;
  }

  static async retry(notificationId: string) {
    const response = await api.post(`/notifications/${notificationId}/retry`);
    return response.data;
  }

  static async getPatientNotifications(patientId: string) {
    const response = await api.get<{ success: boolean; notifications: NotificationItem[] }>(
      `/notifications/patient/${patientId}`,
    );
    return response.data.notifications;
  }

  static async getSourceNotifications(
    sourceType: NotificationItem["sourceType"],
    sourceId: string,
  ) {
    const response = await api.get<{ success: boolean; notifications: NotificationItem[] }>(
      "/notifications/source/" + sourceType + "/" + sourceId,
    );
    return response.data.notifications;
  }
}
