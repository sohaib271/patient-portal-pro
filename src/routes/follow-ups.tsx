import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell, Avatar, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import type { FollowUpRecord } from "@/services/appointment.service";
import { Appointment } from "@/services/appointment.service";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/follow-ups")({
  head: () => ({ meta: [{ title: "Follow-ups - MediFlow" }] }),
  component: FollowUpsLayout,
});

function FollowUpsLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/follow-ups") return <Outlet />;
  return <FollowUpsPage />;
}

const handlerLabels: Record<string, string> = {
  doctor: "Doctor",
  nurse: "Nurse",
  self: "Self",
};

const reasonLabels: Record<string, string> = {
  planned_revisit: "Planned Revisit",
  emergency_revisit: "Emergency Revisit",
  test_only: "Test Only",
  prescription_pickup: "Prescription Pickup",
  other: "Other",
};

function FollowUpsPage() {
  const { user, isLoading: isLoadingUser } = useUser();
  const isDoctor = user?.role === "doctor";
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const adminFollowUpsQuery = useQuery({
    queryKey: ["admin-follow-ups-page", page],
    queryFn: () => Appointment.getFollowUps(undefined, page, 6),
    enabled: Boolean(user && !isDoctor),
  });
  const doctorFollowUpsQuery = useQuery({
    queryKey: ["doctor-follow-ups-page", page],
    queryFn: () => Appointment.getMyFollowUps(undefined, page, 6),
    enabled: Boolean(user && isDoctor),
  });
  const activeQuery = isDoctor ? doctorFollowUpsQuery : adminFollowUpsQuery;
  const { data: followUpsResponse, isLoading, isError, refetch } = activeQuery;
  const followUps = followUpsResponse?.followUps ?? [];
  const totalPages = Math.max(1, followUpsResponse?.totalPages ?? 1);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleFollowUps = useMemo(() => {
    if (!isDoctor) return followUps;
    return followUps.filter(isScheduledDoctorFollowUp);
  }, [followUps, isDoctor]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const filtered = useMemo(() => {
    return visibleFollowUps.filter((followUp) => {
      const text = [
        getPatientName(followUp),
        getPatientCode(followUp),
        getDoctorName(followUp),
        getReasonLabel(followUp.reason),
        followUp.reasonNote,
        followUp.handlerType,
        followUp.status,
      ].join(" ").toLowerCase();
      return !normalizedQuery || text.includes(normalizedQuery);
    });
  }, [normalizedQuery, visibleFollowUps]);

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: isDoctor ? "My Scheduled Follow-ups" : "Follow-ups" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isDoctor ? "My Scheduled Follow-ups" : "Follow-ups"}</h1>
          <p className="text-sm text-muted-foreground">{visibleFollowUps.length} {isDoctor ? "scheduled follow-ups" : "follow-ups created"}</p>
        </div>
        <Button asChild>
          <Link to="/follow-ups/new"><CalendarPlus className="h-4 w-4" /> New Follow-up</Link>
        </Button>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patient, reason, handler, doctor..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}><SlidersHorizontal className="h-4 w-4" /> Refresh</Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Patient</th>
                <th className="py-3 pr-4">Handler</th>
                {!isDoctor && <th className="py-3 pr-4">Doctor</th>}
                <th className="py-3 pr-4">Reason</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Time</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoadingUser || isLoading ? (
                <tr><td colSpan={isDoctor ? 6 : 7} className="py-8 text-center text-muted-foreground">Loading follow-ups...</td></tr>
              ) : isError ? (
                <tr><td colSpan={isDoctor ? 6 : 7} className="py-8 text-center text-destructive">Unable to load follow-ups.</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={isDoctor ? 6 : 7} className="py-8 text-center text-muted-foreground">No follow-ups found.</td></tr>
              ) : filtered.map((followUp) => (
                <tr key={followUp._id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={getInitials(getPatientName(followUp))} />
                      <div>
                        <div className="font-medium">{getPatientName(followUp)}</div>
                        <div className="text-xs text-muted-foreground">{getPatientCode(followUp)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{handlerLabels[followUp.handlerType] ?? followUp.handlerType}</td>
                  {!isDoctor && <td className="py-3 pr-4 text-muted-foreground">{getDoctorName(followUp)}</td>}
                  <td className="py-3 pr-4">
                    <div className="font-medium">{getReasonLabel(followUp.reason)}</div>
                    <div className="max-w-xs truncate text-xs text-muted-foreground">{followUp.reasonNote || "-"}</div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatDisplayDate(followUp.followUpDate)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatDisplayTime(followUp.estimatedTurnTime ?? followUp.followUpDate)}</td>
                  <td className="py-3 pr-4"><StatusBadge status={formatStatus(followUp.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </AppShell>
  );
}

function getPatientName(followUp: FollowUpRecord) {
  const patient = typeof followUp.patientId === "object" ? followUp.patientId : undefined;
  return [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}

function getPatientCode(followUp: FollowUpRecord) {
  const patient = typeof followUp.patientId === "object" ? followUp.patientId : undefined;
  return patient?.patientId ?? "-";
}

function getDoctorName(followUp: FollowUpRecord) {
  const doctor = typeof followUp.doctorId === "object" && followUp.doctorId ? followUp.doctorId : undefined;
  const doctorUser = typeof doctor?.userId === "object" ? doctor.userId : undefined;
  const name = [doctorUser?.firstName, doctorUser?.lastName].filter(Boolean).join(" ");
  return name ? `Dr. ${name}` : followUp.handlerType === "doctor" ? "Doctor" : "-";
}

function getReasonLabel(reason?: string) {
  return reason ? reasonLabels[reason] ?? reason : "-";
}

function isScheduledDoctorFollowUp(followUp: FollowUpRecord) {
  if (followUp.handlerType !== "doctor") return false;
  if (["completed", "cancelled"].includes(followUp.status ?? "")) return false;
  const scheduledTime = followUp.estimatedTurnTime ?? followUp.followUpDate;
  return getPakistanDateValue(scheduledTime) >= getPakistanDateValue(new Date().toISOString());
}

function formatStatus(status?: string) {
  if (!status) return "Pending";
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDisplayDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Karachi" });
}

function formatDisplayTime(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Karachi" });
}

function getPakistanDateValue(value: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Karachi",
  }).formatToParts(new Date(value));
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "FU";
}
