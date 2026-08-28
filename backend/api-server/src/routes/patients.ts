import { Router, type IRouter } from "express";
import {
  AddPatientMedicationBody,
  GetPatientQueryParams,
  UpdatePatientConsentBody,
} from "@workspace/api-zod";
import { interactionTable, hiddenRecordRules, patients } from "../data";
import {
  checkHiddenRecordRelevance,
  checkInteraction,
  normalizeMedicationName,
  riskLevel,
} from "../logic";

const router: IRouter = Router();

function getPatient(id: string) {
  return patients[id];
}

function patientSnapshot(
  patient: NonNullable<ReturnType<typeof getPatient>>,
  role: "patient" | "doctor" | "caregiver",
) {
  const records =
    role === "patient"
      ? patient.records
      : patient.records.filter((record) => record.visible);

  return {
    ...patient,
    records: records.map((record) => ({ ...record })),
    medications: [...patient.medications],
    caregiver: { ...patient.caregiver },
    riskLevel: riskLevel(patient.missedDoses),
  };
}

router.get("/patient/:id", (req, res) => {
  const patient = getPatient(req.params.id);
  if (!patient) {
    res.status(404).json({ error: "Patient not found." });
    return;
  }

  const parsedQuery = GetPatientQueryParams.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({ error: "role must be patient, doctor, or caregiver." });
    return;
  }

  res.json(patientSnapshot(patient, parsedQuery.data.role ?? "patient"));
});

router.post("/patient/:id/consent", (req, res) => {
  const patient = getPatient(req.params.id);
  if (!patient) {
    res.status(404).json({ error: "Patient not found." });
    return;
  }

  const parsedBody = UpdatePatientConsentBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: "hospital and visible are required." });
    return;
  }

  const record = patient.records.find(
    (candidate) => candidate.hospital === parsedBody.data.hospital,
  );
  if (!record) {
    res.status(404).json({ error: "Medical record not found for that hospital." });
    return;
  }

  record.visible = parsedBody.data.visible;
  res.json({ success: true });
});

router.post("/patient/:id/medication", (req, res) => {
  const patient = getPatient(req.params.id);
  if (!patient) {
    res.status(404).json({ error: "Patient not found." });
    return;
  }

  const parsedBody = AddPatientMedicationBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: "drug is required and must be a non-empty string." });
    return;
  }

  const added = normalizeMedicationName(parsedBody.data.drug);
  const interaction = checkInteraction(added, patient.medications, interactionTable);
  const hiddenRecord = checkHiddenRecordRelevance(added, patient.records, hiddenRecordRules);

  if (!patient.medications.some((medication) => medication.toLowerCase() === added.toLowerCase())) {
    patient.medications.push(added);
  }

  res.json({
    added,
    // PRD-spec flat strings (kept for spec compliance)
    interactionAlert: interaction?.risk ?? null,
    hiddenRecordAlert: hiddenRecord?.message ?? null,
    // Structured extras the frontend uses for richer alert UI
    interactionWith: interaction?.conflictingDrug ?? null,
    hiddenRecordHospital: hiddenRecord?.hospital ?? null,
  });
});

router.post("/patient/:id/missed-dose", (req, res) => {
  const patient = getPatient(req.params.id);
  if (!patient) {
    res.status(404).json({ error: "Patient not found." });
    return;
  }

  patient.missedDoses += 1;
  res.json({
    missedDoses: patient.missedDoses,
    riskLevel: riskLevel(patient.missedDoses),
  });
});

export default router;