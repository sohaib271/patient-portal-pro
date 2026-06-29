import { createFileRoute } from "@tanstack/react-router";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Clock, MessageSquare, Mail as MailIcon, RotateCw, XCircle } from "lucide-react";
import { notifications } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — MediFlow" }] }),
  component: NotificationsPage,
});

const tabs = ["All", "Sent", "Pending", "Scheduled", "Failed"] as const;

function NotificationsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const list = tab === "All" ? notifications : notifications.filter((n) => n.status === tab);
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Notifications" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">Appointment reminders and notification log</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
          <AlertTriangle className="h-3.5 w-3.5" /> 2 failed deliveries require attention
        </div>
      </div>
      <Card className="p-5">
        <div className="flex flex-wrap gap-1 border-b border-border">
          {tabs.map((t) => {
            const count = t === "All" ? notifications.length : notifications.filter((n) => n.status === t).length;
            return (
              <button key={t} onClick={() => setTab(t)} className={cn("relative px-3 py-2 text-sm font-medium", tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                {t} <span className="ml-1 text-xs opacity-70">{count}</span>
                {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
        <div className="mt-4 divide-y divide-border">
          {list.map((n) => (
            <div key={n.id} className="flex gap-3 py-4">
              <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full",
                n.status === "Sent" && "bg-emerald-100 text-emerald-700",
                n.status === "Pending" && "bg-amber-100 text-amber-700",
                n.status === "Failed" && "bg-rose-100 text-rose-700",
                n.status === "Scheduled" && "bg-sky-100 text-sky-700")}>
                {n.status === "Sent" && <CheckCircle2 className="h-4 w-4" />}
                {n.status === "Pending" && <Clock className="h-4 w-4" />}
                {n.status === "Failed" && <XCircle className="h-4 w-4" />}
                {n.status === "Scheduled" && <Clock className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{n.patient}</span>
                  <MessageSquare className="h-3 w-3 text-muted-foreground" />
                  <MailIcon className="h-3 w-3 text-muted-foreground" />
                  <StatusBadge status={n.status} />
                  <span className="ml-auto text-xs text-muted-foreground">{n.ts}</span>
                </div>
                <div className="text-xs text-muted-foreground">{n.doctor} · {n.date} · <span className="font-medium text-foreground">{n.timing}</span></div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                {n.status === "Failed" && (
                  <div className="mt-2"><Button size="sm" variant="outline"><RotateCw className="h-3.5 w-3.5" /> Retry</Button></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}