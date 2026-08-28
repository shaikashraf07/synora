export interface MedicalRecord {
  hospital: string;
  date: string;
  diagnosis: string;
  visible: boolean;
}

export interface Caregiver {
  name: string;
  relation: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  records: MedicalRecord[];
  medications: string[];
  missedDoses: number;
  caregiver: Caregiver;
}

export interface DrugInteraction {
  pair: [string, string];
  risk: string;
}

export const PATIENT_ID = "pat-001";

export const initialPatient: Patient = {
  id: PATIENT_ID,
  name: "Ananya Rao",
  age: 46,
  gender: "Female",
  records: [
    {
      hospital: "Apollo Care Centre",
      date: "Aug 14, 2026",
      diagnosis: "Type 2 Diabetes",
      visible: false, // hidden — triggers Metformin hidden-record alert in demo
    },
    {
      hospital: "Sunrise Multispeciality Hospital",
      date: "Jun 21, 2026",
      diagnosis: "Hypertension",
      visible: true,
    },
    {
      hospital: "City Heart Clinic",
      date: "Mar 04, 2026",
      diagnosis: "Hyperlipidemia",
      visible: true,
    },
  ],
  medications: ["Warfarin", "Amlodipine"],
  missedDoses: 1,
  caregiver: { name: "Rahul Rao", relation: "Son" },
};

export const drugInteractions: DrugInteraction[] = [
  {
    pair: ["Aspirin", "Warfarin"],
    risk: "Potential increased bleeding risk when these medicines are used together.",
  },
  {
    pair: ["Ibuprofen", "Warfarin"],
    risk: "Potential increased bleeding risk when these medicines are used together.",
  },
];

/** Keywords that link a medication to a condition found in a medical record. */
export const medicationRecordKeywords: Record<string, string[]> = {
  metformin: ["diabetes"],
  glimepiride: ["diabetes"],
  amlodipine: ["hypertension"],
  atorvastatin: ["hyperlipidemia"],
};

export const nextMedication = {
  name: "Metformin",
  dose: "500 mg",
  time: "8:00 PM",
};

export type RiskLevel = "GREEN" | "YELLOW" | "RED";

export function riskFromMissedDoses(missed: number): RiskLevel {
  if (missed < 3) return "GREEN";
  if (missed <= 5) return "YELLOW";
  return "RED";
}
