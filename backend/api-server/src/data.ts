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
  records: MedicalRecord[];
  medications: string[];
  missedDoses: number;
  caregiver: Caregiver;
}

export interface DrugInteraction {
  pair: readonly [string, string];
  risk: string;
}

export interface HiddenRecordRule {
  diagnosisKeywords: readonly string[];
  drug: string;
  message: string;
}

export const patients: Record<string, Patient> = {
  "pat-001": {
    id: "pat-001",
    name: "Ananya Rao",
    records: [
      {
        hospital: "Apollo Care Centre",
        date: "2026-08-14",
        diagnosis: "Type 2 Diabetes",
        visible: false, // hidden — triggers Metformin hidden-record alert in demo
      },
      {
        hospital: "Sunrise Multispeciality Hospital",
        date: "2026-06-21",
        diagnosis: "Hypertension",
        visible: true,
      },
      {
        hospital: "City Heart Clinic",
        date: "2026-03-04",
        diagnosis: "Hyperlipidemia",
        visible: true,
      },
    ],
    medications: ["Warfarin", "Amlodipine"],
    missedDoses: 1,
    caregiver: {
      name: "Rahul Rao",
      relation: "Son",
    },
  },
};

export const interactionTable: readonly DrugInteraction[] = [
  {
    pair: ["Warfarin", "Aspirin"],
    risk: "Increased bleeding risk when Aspirin is combined with Warfarin.",
  },
  {
    pair: ["Warfarin", "Ibuprofen"],
    risk: "Increased risk of gastrointestinal bleeding when Ibuprofen is combined with Warfarin.",
  },
  {
    pair: ["Amlodipine", "Simvastatin"],
    risk: "Amlodipine can increase Simvastatin exposure and muscle toxicity risk.",
  },
];

export const hiddenRecordRules: readonly HiddenRecordRule[] = [
  {
    diagnosisKeywords: ["diabetes"],
    drug: "Metformin",
    message: "The hidden record indicates diabetes; Metformin may be clinically relevant.",
  },
  {
    diagnosisKeywords: ["asthma"],
    drug: "Propranolol",
    message: "The hidden record indicates asthma; Propranolol may worsen bronchospasm.",
  },
  {
    diagnosisKeywords: ["kidney disease", "renal"],
    drug: "Ibuprofen",
    message: "The hidden record indicates kidney disease; Ibuprofen may worsen renal function.",
  },
];