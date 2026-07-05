import { useQuery } from "@tanstack/react-query";
import { Patient, type PatientRecord, type PatientWithPhone } from "@/services/patient.service";

export function usePatientRelatives(phone?: string, currentPatientId?: string) {
  return useQuery({
    queryKey: ["patient-relatives", phone, currentPatientId],
    enabled: Boolean(phone && currentPatientId),
    queryFn: async () => {
      const response = await Patient.searchByPhone(phone as string);
      return ((response.patients ?? []) as PatientRecord[])
        .filter((patient) => patient._id !== currentPatientId)
        .map((patient) => ({
          ...patient,
          phone: response.contact?.phone ?? phone,
        })) as PatientWithPhone[];
    },
  });
}
