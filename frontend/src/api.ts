/**
 * API boundary for MediCareAI.
 *
 * All functions call the real Express backend (d:/synora/backend/api-server).
 * The Vite dev proxy forwards /api/* → http://localhost:5000/api/*.
 *
 * Endpoints (base: /api):
 *   GET    /patient/:id              → full Patient object
 *   POST   /patient/:id/consent      → { success: true }
 *   POST   /patient/:id/medication   → { added, interactionAlert, hiddenRecordAlert, interactionWith, hiddenRecordHospital }
 *   POST   /patient/:id/missed-dose  → { missedDoses, riskLevel }
 *
 * All functions that require a full Patient back (consent, missed-dose) do a
 * follow-up GET so the frontend state is always in sync with the server.
 */
import { initialPatient, type MedicalRecord, type Patient } from "./data/mockData";

export interface AddMedicationResult {
  status: "interaction" | "hidden-record" | "added";
  drug: string;
  interactionWith?: string;
  risk?: string;
  hiddenRecord?: MedicalRecord;
  patient: Patient;
}

const API_BASE = "/api";

// Display-only fields absent from the backend Patient shape.
// The backend PRD data model omits age/gender; we preserve them locally.
const PATIENT_DISPLAY_DEFAULTS: Pick<Patient, "age" | "gender"> = {
  age: initialPatient.age,
  gender: initialPatient.gender,
};

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res;
}

/** Merge backend patient data with display-only frontend fields. */
function toFrontendPatient(raw: Record<string, unknown>): Patient {
  return { ...PATIENT_DISPLAY_DEFAULTS, ...(raw as Patient) };
}

/** GET /patient/:id */
export async function getPatient(id: string): Promise<Patient> {
  const res = await apiFetch(`/patient/${id}?role=patient`);
  return toFrontendPatient(await res.json());
}

/** POST /patient/:id/consent — returns refreshed full patient */
export async function updateConsent(
  id: string,
  hospital: string,
  visible: boolean,
): Promise<Patient> {
  await apiFetch(`/patient/${id}/consent`, {
    method: "POST",
    body: JSON.stringify({ hospital, visible }),
  });
  // Backend only returns { success: true } — re-fetch for full state.
  return getPatient(id);
}

/** POST /patient/:id/medication */
export async function addMedication(
  id: string,
  drug: string,
): Promise<AddMedicationResult> {
  const res = await apiFetch(`/patient/${id}/medication`, {
    method: "POST",
    body: JSON.stringify({ drug }),
  });

  const data = (await res.json()) as {
    added: string;
    interactionAlert: string | null;
    hiddenRecordAlert: string | null;
    interactionWith: string | null;
    hiddenRecordHospital: string | null;
  };

  // Re-fetch patient so the medication list in state is up to date.
  const patient = await getPatient(id);

  if (data.interactionAlert !== null) {
    return {
      status: "interaction",
      drug: data.added,
      interactionWith: data.interactionWith ?? undefined,
      risk: data.interactionAlert,
      patient,
    };
  }

  if (data.hiddenRecordAlert !== null) {
    // Locate the full MedicalRecord from the refreshed patient state
    // (patient view includes ALL records, including hidden ones).
    const hiddenRecord = patient.records.find(
      (r) => r.hospital === data.hiddenRecordHospital,
    );
    return {
      status: "hidden-record",
      drug: data.added,
      hiddenRecord,
      patient,
    };
  }

  return { status: "added", drug: data.added, patient };
}

/** POST /patient/:id/missed-dose — returns refreshed full patient */
export async function markMissedDose(id: string): Promise<Patient> {
  await apiFetch(`/patient/${id}/missed-dose`, { method: "POST" });
  // Backend returns { missedDoses, riskLevel } — re-fetch for full state.
  return getPatient(id);
}

/** Demo-only helper: reload patient state from the server. */
export async function resetDemo(): Promise<Patient> {
  return getPatient(initialPatient.id);
}
