import type {
  DrugInteraction,
  HiddenRecordRule,
  MedicalRecord,
} from "./data";

export type RiskLevel = "Green" | "Yellow" | "Red";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function riskLevel(missedDoses: number): RiskLevel {
  if (missedDoses < 3) return "Green";
  if (missedDoses <= 5) return "Yellow";
  return "Red";
}

export interface InteractionAlert {
  risk: string;
  conflictingDrug: string;
}

export function checkInteraction(
  newDrug: string,
  currentMeds: readonly string[],
  interactionTable: readonly DrugInteraction[],
): InteractionAlert | null {
  const normalizedDrug = normalize(newDrug);

  for (const interaction of interactionTable) {
    const [first, second] = interaction.pair;
    const normalizedFirst = normalize(first);
    const normalizedSecond = normalize(second);
    const newDrugMatchesFirst = normalizedDrug === normalizedFirst;
    const newDrugMatchesSecond = normalizedDrug === normalizedSecond;

    if (!newDrugMatchesFirst && !newDrugMatchesSecond) continue;

    const currentMedicationMatches = currentMeds.some((medication) => {
      const normalizedMedication = normalize(medication);
      return (
        (newDrugMatchesFirst && normalizedMedication === normalizedSecond) ||
        (newDrugMatchesSecond && normalizedMedication === normalizedFirst)
      );
    });

    if (currentMedicationMatches) {
      const conflictingDrug = newDrugMatchesFirst ? second : first;
      return { risk: interaction.risk, conflictingDrug };
    }
  }

  return null;
}

export interface HiddenRecordAlert {
  message: string;
  hospital: string;
}

export function checkHiddenRecordRelevance(
  newDrug: string,
  records: readonly MedicalRecord[],
  rules: readonly HiddenRecordRule[],
): HiddenRecordAlert | null {
  const normalizedDrug = normalize(newDrug);

  for (const record of records) {
    if (record.visible) continue;

    const matchingRule = rules.find(
      (rule) =>
        normalize(rule.drug) === normalizedDrug &&
        rule.diagnosisKeywords.some((keyword) =>
          normalize(record.diagnosis).includes(normalize(keyword)),
        ),
    );

    if (matchingRule) {
      return {
        message: `${matchingRule.message} Request consent to review the record held by ${record.hospital}.`,
        hospital: record.hospital,
      };
    }
  }

  return null;
}

export function normalizeMedicationName(drug: string): string {
  return drug
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}