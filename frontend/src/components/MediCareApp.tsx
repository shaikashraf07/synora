import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Header from "./Header";
import type { Role } from "./RoleSelector";
import MediAssistant from "./MediAssistant";
import TimelineScreen from "../screens/TimelineScreen";
import MedicationScreen from "../screens/MedicationScreen";
import CaregiverScreen from "../screens/CaregiverScreen";
import PatientHomeScreen from "../screens/PatientHomeScreen";
import { initialPatient, PATIENT_ID, type Patient } from "../data/mockData";
import { addMedication, getPatient, markMissedDose, updateConsent } from "../api";

const tabsByRole: Record<Role, { id: string; label: string }[]> = {
  PATIENT: [
    { id: "home", label: "My Health" },
    { id: "timeline", label: "Medical Timeline" },
    { id: "medications", label: "Medications" },
  ],
  DOCTOR: [
    { id: "timeline", label: "Patient Record" },
    { id: "medications", label: "Medications" },
  ],
  CAREGIVER: [
    { id: "home", label: "Patient Overview" },
    { id: "medications", label: "Medications" },
    { id: "adherence", label: "Adherence" },
  ],
};

export default function MediCareApp() {
  const [role, setRole] = useState<Role>("PATIENT");
  const [tab, setTab] = useState("home");
  const [patient, setPatient] = useState<Patient>(initialPatient);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    getPatient(PATIENT_ID).then((data) => {
      if (active) setPatient(data);
    });
    return () => {
      active = false;
    };
  }, []);

  function changeRole(next: Role) {
    setRole(next);
    setTab(tabsByRole[next][0]!.id);
  }

  async function handleConsentChange(hospital: string, visible: boolean) {
    // Optimistic update, then reconcile with the API boundary.
    setPatient((prev) => ({
      ...prev,
      records: prev.records.map((r) => (r.hospital === hospital ? { ...r, visible } : r)),
    }));
    toast.success(visible ? "Doctor access enabled" : "Record is now private");
    setPending(true);
    const updated = await updateConsent(PATIENT_ID, hospital, visible);
    setPatient(updated);
    setPending(false);
  }

  async function handleAddMedication(drug: string) {
    const result = await addMedication(PATIENT_ID, drug);
    setPatient(result.patient);
    if (result.status === "added") toast.success(`${result.drug} added to medications`);
    if (result.status === "interaction") toast.error("Potential medication interaction found");
    if (result.status === "hidden-record") toast("Private record may be relevant");
    return result;
  }

  async function handleMissedDose() {
    setPending(true);
    const updated = await markMissedDose(PATIENT_ID);
    setPatient(updated);
    setPending(false);
    toast("Dose marked as missed");
  }

  const tabs = tabsByRole[role];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header
        role={role}
        onRoleChange={changeRole}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {role === "PATIENT" && tab === "home" && (
          <PatientHomeScreen patient={patient} onNavigate={setTab} />
        )}
        {role === "PATIENT" && tab === "timeline" && (
          <TimelineScreen
            patient={patient}
            role="PATIENT"
            pending={pending}
            onConsentChange={handleConsentChange}
          />
        )}
        {role === "PATIENT" && tab === "medications" && (
          <MedicationScreen patient={patient} readOnly />
        )}

        {role === "DOCTOR" && tab === "timeline" && (
          <TimelineScreen
            patient={patient}
            role="DOCTOR"
            pending={pending}
            onConsentChange={handleConsentChange}
          />
        )}
        {role === "DOCTOR" && tab === "medications" && (
          <MedicationScreen
            patient={patient}
            readOnly={false}
            onAddMedication={handleAddMedication}
            onRequestConsent={(hospital) =>
              toast("Consent request sent to patient", {
                description: `Demo request · ${hospital}`,
              })
            }
          />
        )}

        {role === "CAREGIVER" && tab === "home" && (
          <CaregiverScreen
            patient={patient}
            pending={pending}
            onMissedDose={handleMissedDose}
            onNotify={() =>
              toast.success("Caregiver notification simulated.", {
                description: "Demo notification · no SMS or push was sent.",
              })
            }
          />
        )}
        {role === "CAREGIVER" && tab === "medications" && (
          <MedicationScreen patient={patient} readOnly />
        )}
        {role === "CAREGIVER" && tab === "adherence" && (
          <CaregiverScreen
            patient={patient}
            pending={pending}
            onMissedDose={handleMissedDose}
            onNotify={() =>
              toast.success("Caregiver notification simulated.", {
                description: "Demo notification · no SMS or push was sent.",
              })
            }
          />
        )}
      </main>

      {role === "PATIENT" && (
        <MediAssistant patientName={patient.name} onToast={(message) => toast(message)} />
      )}

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
