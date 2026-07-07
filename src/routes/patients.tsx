import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell, Avatar } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { useMyAppointments } from "@/hooks/useAppointments";
import type { AppointmentRecord } from "@/services/appointment.service";
import { Patient, type PatientRecord } from "@/services/patient.service";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patients — MediFlow" }] }),
  component: PatientsLayout,
});

function PatientsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/patients") return <Outlet />;
  return <PatientsList />;
}

function PatientsList() {
  const [query, setQuery] = useState("");
  const { user } = useUser();
  const isDoctor = user?.role === "doctor";
  const { data: doctorAppointments = [], isLoading, isError, refetch } = useMyAppointments(undefined, isDoctor);
  const adminPatientsQuery = useQuery({
    queryKey: ["admin-patients"],
    queryFn: () => Patient.getAllPatients(),
    enabled: !isDoctor,
  });
  const doctorPatients = useMemo(() => buildDoctorPatients(doctorAppointments), [doctorAppointments]);
  const adminPatients = adminPatientsQuery.data?.patients ?? [];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredDoctorPatients = useMemo(() => {
    return doctorPatients.filter((patient) => {
      const text = [patient.name, patient.patientId, patient.phone, patient.email].join(" ").toLowerCase();
      return !normalizedQuery || text.includes(normalizedQuery);
    });
  }, [doctorPatients, normalizedQuery]);
  const filteredAdminPatients = useMemo(() => {
    return adminPatients.filter((patient) => {
      const contact = getPatientContact(patient);
      const text = [
        patient.patientId,
        patient.firstName,
        patient.lastName,
        contact?.phone,
        contact?.whatsappNo,
        contact?.email,
      ].join(" ").toLowerCase();
      return !normalizedQuery || text.includes(normalizedQuery);
    });
  }, [adminPatients, normalizedQuery]);

  if (isDoctor) {
    return (
      <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "My Patients" }]}>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Patients</h1>
            <p className="text-sm text-muted-foreground">{doctorPatients.length} patients have booked appointments with you</p>
          </div>
        </div>
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, ID, phone, or email..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}><SlidersHorizontal className="h-4 w-4" /> Refresh</Button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 pr-4">Patient ID</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Age</th>
                  <th className="py-3 pr-4">Gender</th>
                  <th className="py-3 pr-4">Phone Number</th>
                  <th className="py-3 pr-4">Last Visit</th>
                  <th className="py-3 pr-4">Appointments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading patients...</td></tr>
                ) : isError ? (
                  <tr><td colSpan={7} className="py-8 text-center text-destructive">Unable to load your patients.</td></tr>
                ) : filteredDoctorPatients.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No patients found.</td></tr>
                ) : filteredDoctorPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-4 font-medium text-primary">{patient.patientId}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={getInitials(patient.name)} />
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">{patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{patient.age ?? "-"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatGender(patient.gender)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{patient.phone}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatDisplayDate(patient.lastVisit)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{patient.appointmentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Patients" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">{adminPatients.length} registered patients</p>
        </div>
        <Button asChild><Link to="/register"><Plus className="h-4 w-4" /> Register Patient</Link></Button>
      </div>
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, ID, phone, or email..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm" onClick={() => adminPatientsQuery.refetch()}><SlidersHorizontal className="h-4 w-4" /> Refresh</Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Patient ID</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Age</th>
                <th className="py-3 pr-4">Gender</th>
                <th className="py-3 pr-4">Phone Number</th>
                <th className="py-3 pr-4">Last Visit</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {adminPatientsQuery.isLoading ? (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading patients...</td></tr>
              ) : adminPatientsQuery.isError ? (
                <tr><td colSpan={7} className="py-8 text-center text-destructive">Unable to load patients.</td></tr>
              ) : filteredAdminPatients.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No patients found.</td></tr>
              ) : filteredAdminPatients.map((patient) => {
                const contact = getPatientContact(patient);
                const name = getPatientName(patient);
                return (
                <tr key={patient._id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4 font-medium text-primary"><Link to="/patients/$id" params={{ id: patient._id }}>{patient.patientId}</Link></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={getInitials(name)} />
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">{contact?.email || "-"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{patient.age ?? "-"}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatGender(patient.gender ?? undefined)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{contact?.phone || contact?.whatsappNo || "-"}</td>
                  <td className="py-3 pr-4 text-muted-foreground">-</td>
                  <td className="py-3 pr-4"><Link to="/appointments/new" className="text-sm font-medium text-primary hover:underline">Book Appointment</Link></td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}

type DoctorPatientRow = {
  _id: string;
  patientId: string;
  name: string;
  age?: number;
  gender?: string;
  phone: string;
  email: string;
  lastVisit: string;
  appointmentCount: number;
};

function getPatientContact(patient: PatientRecord) {
  return typeof patient.contactId === "object" ? patient.contactId : undefined;
}

function getPatientName(patient: PatientRecord) {
  return [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
}

function buildDoctorPatients(appointments: AppointmentRecord[]) {
  const patientsById = new Map<string, DoctorPatientRow>();

  appointments.forEach((appointment) => {
    const patient = typeof appointment.patientId === "object" ? appointment.patientId : undefined;
    if (!patient?._id) return;

    const contact = typeof appointment.contactId === "object" ? appointment.contactId : undefined;
    const existing = patientsById.get(patient._id);
    const lastVisit = appointment.estimatedTurnTime ?? appointment.appointmentDate;
    const row: DoctorPatientRow = existing ?? {
      _id: patient._id,
      patientId: patient.patientId ?? "No patient ID",
      name: [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient",
      age: patient.age,
      gender: patient.gender,
      phone: contact?.phone ?? contact?.whatsappNo ?? "-",
      email: contact?.email ?? "-",
      lastVisit,
      appointmentCount: 0,
    };

    row.appointmentCount += 1;
    if (lastVisit && (!row.lastVisit || new Date(lastVisit) > new Date(row.lastVisit))) {
      row.lastVisit = lastVisit;
    }
    patientsById.set(patient._id, row);
  });

  return Array.from(patientsById.values()).sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT";
}

function formatGender(value?: string) {
  if (value === "F") return "Female";
  if (value === "M") return "Male";
  return value ?? "-";
}

function formatDisplayDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Karachi" });
}
