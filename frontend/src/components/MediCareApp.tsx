import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Header from "./Header";
import type { Role } from "./RoleSelector";
import MediAssistant from "./MediAssistant";
import ProfileEditModal from "./ProfileEditModal";
import TimelineScreen from "../screens/TimelineScreen";
import MedicationScreen from "../screens/MedicationScreen";
import CaregiverScreen from "../screens/CaregiverScreen";
import PatientHomeScreen from "../screens/PatientHomeScreen";
import { initialPatient, PATIENT_ID, nextMedication as defaultNextMed, type Patient, type MedicalRecord } from "../data/mockData";
import { addMedication, getPatient, markMissedDose, updateConsent } from "../api";
import type { ScheduledMedication } from "./EditNextMedicationModal";

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
  const [nextMed, setNextMed] = useState<ScheduledMedication>(defaultNextMed);
  const [pending, setPending] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getPatient(PATIENT_ID).then((data) => {
      if (active) {
        setPatient((prev) => ({
          ...prev,
          ...data,
          // Preserve local records if user added any custom ones
          records: data.records.length > 0 ? data.records : prev.records,
        }));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function changeRole(next: Role) {
    setRole(next);
    setTab(tabsByRole[next][0]!.id);
  }

  // --- Profile Handlers ---
  function handleProfileSave(updates: Partial<Patient>) {
    setPatient((prev) => ({ ...prev, ...updates }));
    toast.success("Patient profile updated");
  }

  // --- Consent & Records Handlers ---
  async function handleConsentChange(hospital: string, visible: boolean) {
    setPatient((prev) => ({
      ...prev,
      records: prev.records.map((r) => (r.hospital === hospital ? { ...r, visible } : r)),
    }));
    toast.success(visible ? "Doctor access enabled" : "Record is now private");
    setPending(true);
    try {
      const updated = await updateConsent(PATIENT_ID, hospital, visible);
      setPatient((prev) => ({
        ...prev,
        ...updated,
        // Retain custom added records if any
        records: prev.records.map((r) => (r.hospital === hospital ? { ...r, visible } : r)),
      }));
    } catch {
      // Keep optimistic state if local demo
    } finally {
      setPending(false);
    }
  }

  function handleAddRecord(newRecord: MedicalRecord) {
    setPatient((prev) => ({
      ...prev,
      records: [newRecord, ...prev.records.filter((r) => r.hospital !== newRecord.hospital)],
    }));
    toast.success(`Added record from ${newRecord.hospital}`);
  }

  function handleUpdateRecord(updatedRecord: MedicalRecord, originalHospital?: string) {
    setPatient((prev) => ({
      ...prev,
      records: prev.records.map((r) =>
        r.hospital === (originalHospital || updatedRecord.hospital) ? updatedRecord : r,
      ),
    }));
    toast.success(`Updated record: ${updatedRecord.hospital}`);
  }

  function handleDeleteRecord(hospital: string) {
    setPatient((prev) => ({
      ...prev,
      records: prev.records.filter((r) => r.hospital !== hospital),
    }));
    toast.info(`Removed record from ${hospital}`);
  }

  // --- Medication Handlers ---
  async function handleAddMedication(drug: string) {
    try {
      const result = await addMedication(PATIENT_ID, drug);
      setPatient((prev) => ({
        ...prev,
        ...result.patient,
        // Keep locally added records
        records: prev.records,
      }));
      if (result.status === "added") toast.success(`${result.drug} added to active medications`);
      if (result.status === "interaction") toast.error("Potential medication interaction flagged");
      if (result.status === "hidden-record") toast("Private medical record may be relevant");
      return result;
    } catch {
      // Fallback local addition if network issue
      setPatient((prev) => ({
        ...prev,
        medications: prev.medications.includes(drug) ? prev.medications : [...prev.medications, drug],
      }));
      toast.success(`${drug} added to medications`);
      return { status: "added" as const, drug, patient };
    }
  }

  function handleRemoveMedication(drugName: string) {
    setPatient((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.toLowerCase() !== drugName.toLowerCase()),
    }));
    toast.info(`Removed ${drugName} from active prescriptions`);
  }

  // --- Next Scheduled Medication Handlers ---
  function handleUpdateNextMed(updated: ScheduledMedication) {
    setNextMed(updated);
    toast.success(`Updated next dose: ${updated.name} (${updated.dose}) at ${updated.time}`);
  }

  // --- Adherence & Missed Dose Handlers ---
  async function handleMissedDose() {
    setPending(true);
    setPatient((prev) => ({ ...prev, missedDoses: prev.missedDoses + 1 }));
    try {
      await markMissedDose(PATIENT_ID);
    } catch {
      // Handled optimistically
    } finally {
      setPending(false);
      toast("Missed dose logged (+1)");
    }
  }

  function handleDecrementMissedDose() {
    setPatient((prev) => ({
      ...prev,
      missedDoses: Math.max(0, prev.missedDoses - 1),
    }));
    toast.info("Missed dose count reduced (-1)");
  }

  function handleResetMissedDoses() {
    setPatient((prev) => ({ ...prev, missedDoses: 0 }));
    toast.success("Weekly missed dose counter reset to 0");
  }

  function handleSetMissedDoses(count: number) {
    setPatient((prev) => ({ ...prev, missedDoses: Math.max(0, count) }));
    toast.info(`Missed doses set to ${count}`);
  }

  const tabs = tabsByRole[role];

  // Derive initials from current patient name
  const initials = patient.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header
        role={role}
        onRoleChange={changeRole}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        initials={initials}
        onAvatarClick={() => setProfileOpen(true)}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {role === "PATIENT" && tab === "home" && (
          <PatientHomeScreen
            patient={patient}
            nextMed={nextMed}
            onUpdateNextMed={handleUpdateNextMed}
            onNavigate={setTab}
            onEditProfile={() => setProfileOpen(true)}
            onMissedDose={handleMissedDose}
            onResetMissedDoses={handleResetMissedDoses}
          />
        )}
        {role === "PATIENT" && tab === "timeline" && (
          <TimelineScreen
            patient={patient}
            role="PATIENT"
            pending={pending}
            onConsentChange={handleConsentChange}
            onAddRecord={handleAddRecord}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )}
        {role === "PATIENT" && tab === "medications" && (
          <MedicationScreen
            patient={patient}
            readOnly={true}
            onAddMedication={handleAddMedication}
            onRemoveMedication={handleRemoveMedication}
            onEditProfile={() => setProfileOpen(true)}
          />
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
            onRemoveMedication={handleRemoveMedication}
            onEditProfile={() => setProfileOpen(true)}
            onRequestConsent={(hospital) =>
              toast("Consent request sent to patient", {
                description: `Clinician authorization request submitted for ${hospital}`,
              })
            }
          />
        )}

        {role === "CAREGIVER" && tab === "home" && (
          <CaregiverScreen
            patient={patient}
            pending={pending}
            onMissedDose={handleMissedDose}
            onDecrementMissedDose={handleDecrementMissedDose}
            onResetMissedDoses={handleResetMissedDoses}
            onSetMissedDoses={handleSetMissedDoses}
            onRemoveMedication={handleRemoveMedication}
            onEditProfile={() => setProfileOpen(true)}
            onNotify={() =>
              toast.success("Caregiver emergency alert broadcasted.", {
                description: `Notification & SMS dispatched to ${patient.caregiver.name}.`,
              })
            }
          />
        )}
        {role === "CAREGIVER" && tab === "medications" && (
          <MedicationScreen
            patient={patient}
            readOnly={true}
            onAddMedication={handleAddMedication}
            onRemoveMedication={handleRemoveMedication}
            onEditProfile={() => setProfileOpen(true)}
          />
        )}
        {role === "CAREGIVER" && tab === "adherence" && (
          <CaregiverScreen
            patient={patient}
            pending={pending}
            onMissedDose={handleMissedDose}
            onDecrementMissedDose={handleDecrementMissedDose}
            onResetMissedDoses={handleResetMissedDoses}
            onSetMissedDoses={handleSetMissedDoses}
            onRemoveMedication={handleRemoveMedication}
            onEditProfile={() => setProfileOpen(true)}
            onNotify={() =>
              toast.success("Caregiver emergency alert broadcasted.", {
                description: `Notification & SMS dispatched to ${patient.caregiver.name}.`,
              })
            }
          />
        )}
      </main>

      {role === "PATIENT" && (
        <MediAssistant
          patientName={patient.name}
          nextMed={nextMed}
          onToast={(message) => toast(message)}
        />
      )}

      {profileOpen && (
        <ProfileEditModal
          patient={patient}
          onSave={handleProfileSave}
          onClose={() => setProfileOpen(false)}
        />
      )}

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
