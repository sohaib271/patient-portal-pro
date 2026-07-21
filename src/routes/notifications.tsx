import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  RefreshCw,
  RotateCw,
  Smartphone,
  XCircle,
} from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  NotificationService,
  type NotificationChannel,
  type NotificationItem,
  type NotificationMessageType,
  type NotificationStatus,
  type NotificationStatusFilter,
} from "@/services/notification.service";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications - MediFlow" }] }),
  component: NotificationsPage,
});

const tabs: Array<{
  label: "All" | "Sent" | "Pending" | "Scheduled" | "Failed";
  value?: NotificationStatusFilter;
  countKey: "all" | "sentTotal" | NotificationStatus;
}> = [
  { label: "All", countKey: "all" },
  { label: "Sent", value: "sent-group", countKey: "sentTotal" },
  { label: "Pending", value: "pending", countKey: "pending" },
  { label: "Scheduled", value: "scheduled", countKey: "scheduled" },
  { label: "Failed", value: "failed", countKey: "failed" },
];

type TabLabel = (typeof tabs)[number]["label"];
type SelectedNotification = Pick<
  NotificationItem,
  "id" | "patientName" | "sourceType" | "sourceId" | "appointmentAt"
>;

function NotificationsPage() {
  const [tab, setTab] = useState<TabLabel>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SelectedNotification | null>(null);
  const queryClient = useQueryClient();
  const activeTab = tabs.find((item) => item.label === tab)!;
  const query = useQuery({
    queryKey: ["notifications", "feed", activeTab.value, page],
    queryFn: () =>
      NotificationService.getNotifications({
        status: activeTab.value,
        page,
        limit: 20,
        groupBySource: true,
      }),
    refetchInterval: 30_000,
  });
  const retry = useMutation({
    mutationFn: NotificationService.retry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const notifications = query.data?.notifications ?? [];
  const counts = query.data?.counts;
  const failedCount = counts?.failed ?? 0;

  const changeTab = (nextTab: TabLabel) => {
    setTab(nextTab);
    setPage(1);
  };

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Notifications" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Appointment reminders and notification log
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {failedCount > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
              <AlertTriangle className="h-3.5 w-3.5" /> {failedCount} failed{" "}
              {failedCount === 1 ? "delivery requires" : "deliveries require"} attention
            </div>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", query.isFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap gap-1 border-b border-border">
          {tabs.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => changeTab(item.label)}
              className={cn(
                "relative px-3 py-2 text-sm font-medium",
                tab === item.label ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}{" "}
              <span className="ml-1 text-xs opacity-70">{counts?.[item.countKey] ?? 0}</span>
              {tab === item.label && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {query.isLoading ? (
          <FeedState text="Loading notifications..." />
        ) : query.isError ? (
          <FeedState text="Unable to load notifications." error onRetry={() => query.refetch()} />
        ) : notifications.length ? (
          <div className="mt-4 divide-y divide-border">
            {notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                retrying={retry.isPending && retry.variables === notification.id}
                onRetry={() => retry.mutate(notification.id)}
                onOpen={() =>
                  setSelected({
                    id: notification.id,
                    patientName: notification.patientName,
                    sourceType: notification.sourceType,
                    sourceId: notification.sourceId,
                    appointmentAt: notification.appointmentAt,
                  })
                }
              />
            ))}
          </div>
        ) : (
          <FeedState text={"No " + tab.toLowerCase() + " notifications found."} />
        )}

        {query.data && query.data.pagination.pages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Page {page} of {query.data.pagination.pages} - {query.data.pagination.total}{" "}
              notifications
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= query.data.pagination.pages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <NotificationDetailsDialog
        selected={selected}
        onClose={() => setSelected(null)}
        retry={retry}
      />
    </AppShell>
  );
}

function NotificationRow({
  notification,
  retrying,
  onRetry,
  onOpen,
}: {
  notification: NotificationItem;
  retrying: boolean;
  onRetry: () => void;
  onOpen: () => void;
}) {
  const status = statusPresentation(notification.status);
  const ChannelIcon = getChannelIcon(notification.channel);
  const timestamp = isSuccessful(notification.status)
    ? (notification.sentAt ?? notification.scheduledFor)
    : notification.scheduledFor;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen();
      }}
      className="flex cursor-pointer gap-3 py-4 outline-none transition-colors hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", status.iconTone)}>
        {status.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{notification.patientName}</span>
          <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <StatusBadge status={status.label} />
          <span className="ml-auto text-xs text-muted-foreground">{formatDate(timestamp)}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {notification.handlerName} - {formatDate(notification.appointmentAt)} -{" "}
          <span className="font-medium text-foreground">
            {messageTypeLabel(notification.messageType)}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
        <div className="mt-1 text-xs text-muted-foreground">
          {channelLabel(notification.channel)} to{" "}
          {notification.destination || "no destination saved"}
        </div>
        {notification.error && (
          <p className="mt-1 text-xs text-destructive">{notification.error}</p>
        )}
        {notification.status === "failed" &&
          notification.channel === "whatsapp" &&
          notification.destination && (
            <div className="mt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={retrying}
                onClick={(event) => {
                  event.stopPropagation();
                  onRetry();
                }}
              >
                <RotateCw className={cn("h-3.5 w-3.5", retrying && "animate-spin")} />
                {retrying ? "Retrying" : "Retry"}
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}

function NotificationDetailsDialog({
  selected,
  onClose,
  retry,
}: {
  selected: SelectedNotification | null;
  onClose: () => void;
  retry: { isPending: boolean; variables?: string; mutate: (id: string) => void };
}) {
  const query = useQuery({
    queryKey: ["notifications", "source", selected?.sourceType, selected?.sourceId],
    queryFn: () =>
      NotificationService.getSourceNotifications(selected!.sourceType, selected!.sourceId),
    enabled: Boolean(selected),
  });
  const history = query.data ?? [];

  return (
    <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-2xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-5 pr-12">
          <DialogTitle>{selected?.patientName ?? "Notification details"}</DialogTitle>
          <DialogDescription>
            {selected?.sourceType === "follow-up" ? "Follow-up" : "Appointment"} on{" "}
            {formatDate(selected?.appointmentAt)} - confirmation and reminder history.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-6 pb-6">
          {query.isLoading ? (
            <FeedState text="Loading notification history..." />
          ) : query.isError ? (
            <FeedState
              text="Unable to load notification history."
              error
              onRetry={() => query.refetch()}
            />
          ) : history.length ? (
            <div className="relative mt-5 space-y-3 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-border">
              {history.map((item) => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  highlighted={item.id === selected?.id}
                  retrying={retry.isPending && retry.variables === item.id}
                  onRetry={() => retry.mutate(item.id)}
                />
              ))}
            </div>
          ) : (
            <FeedState text="No notification history found." />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HistoryItem({
  item,
  highlighted,
  retrying,
  onRetry,
}: {
  item: NotificationItem;
  highlighted: boolean;
  retrying: boolean;
  onRetry: () => void;
}) {
  const status = statusPresentation(item.status);
  const ChannelIcon = getChannelIcon(item.channel);
  const timestamp = isSuccessful(item.status)
    ? (item.sentAt ?? item.scheduledFor)
    : item.scheduledFor;

  return (
    <div className="relative flex gap-3">
      <div
        className={cn(
          "z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-background",
          status.iconTone,
        )}
      >
        {status.icon}
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 rounded-lg border p-3",
          highlighted ? "border-primary/50 bg-primary/5" : "border-border",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{messageTypeLabel(item.messageType)}</span>
          <StatusBadge status={status.label} />
          <span className="ml-auto text-xs text-muted-foreground">{formatDate(timestamp)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {item.handlerName} - Visit {formatDate(item.appointmentAt)}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ChannelIcon className="h-3.5 w-3.5" /> {channelLabel(item.channel)}
          </span>
          <span>{item.destination || "No destination"}</span>
          <span>
            {item.attempts} {item.attempts === 1 ? "attempt" : "attempts"}
          </span>
        </div>
        {item.error && <p className="mt-2 text-xs text-destructive">{item.error}</p>}
        {item.status === "failed" && item.channel === "whatsapp" && item.destination && (
          <Button
            className="mt-2"
            size="sm"
            variant="outline"
            disabled={retrying}
            onClick={onRetry}
          >
            <RotateCw className={cn("h-3.5 w-3.5", retrying && "animate-spin")} />
            {retrying ? "Retrying" : "Retry"}
          </Button>
        )}
      </div>
    </div>
  );
}

function FeedState({
  text,
  error,
  onRetry,
}: {
  text: string;
  error?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div
      className={cn(
        "py-12 text-center text-sm",
        error ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {text}
      {onRetry && (
        <div>
          <Button className="mt-3" size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

function statusPresentation(status: NotificationStatus): {
  label: string;
  iconTone: string;
  icon: ReactNode;
} {
  const values: Record<NotificationStatus, { label: string; iconTone: string; icon: ReactNode }> = {
    sent: {
      label: "Sent",
      iconTone: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    delivered: {
      label: "Sent",
      iconTone: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    read: {
      label: "Sent",
      iconTone: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    pending: {
      label: "Pending",
      iconTone: "bg-amber-100 text-amber-700",
      icon: <Clock className="h-4 w-4" />,
    },
    processing: {
      label: "Pending",
      iconTone: "bg-amber-100 text-amber-700",
      icon: <RefreshCw className="h-4 w-4 animate-spin" />,
    },
    scheduled: {
      label: "Scheduled",
      iconTone: "bg-sky-100 text-sky-700",
      icon: <Clock className="h-4 w-4" />,
    },
    failed: {
      label: "Failed",
      iconTone: "bg-rose-100 text-rose-700",
      icon: <XCircle className="h-4 w-4" />,
    },
    "not-configured": {
      label: "Not configured",
      iconTone: "bg-amber-100 text-amber-700",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    cancelled: {
      label: "Cancelled",
      iconTone: "bg-slate-100 text-slate-600",
      icon: <XCircle className="h-4 w-4" />,
    },
  };
  return values[status];
}

function messageTypeLabel(type: NotificationMessageType) {
  const labels: Record<NotificationMessageType, string> = {
    "appointment-confirmation": "Appointment confirmation",
    "appointment-18h-reminder": "Appointment 18-hour reminder",
    "appointment-custom-reminder": "Appointment custom reminder",
    "follow-up-confirmation": "Follow-up confirmation",
    "follow-up-18h-reminder": "Follow-up 18-hour reminder",
    "follow-up-custom-reminder": "Follow-up custom reminder",
  };
  return labels[type];
}

function getChannelIcon(channel: NotificationChannel) {
  return channel === "whatsapp" ? MessageSquare : channel === "email" ? Mail : Smartphone;
}

function channelLabel(channel: NotificationChannel) {
  return channel === "whatsapp" ? "WhatsApp" : channel.toUpperCase();
}

function isSuccessful(status: NotificationStatus) {
  return ["sent", "delivered", "read"].includes(status);
}

function formatDate(value?: string) {
  if (!value) return "Time unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";
  return date.toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
