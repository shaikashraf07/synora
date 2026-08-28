import { useState, type FormEvent } from "react";
import { ShieldPlus } from "lucide-react";
import PatientSummaryCard from "../components/PatientSummaryCard";
import MedicationCard from "../components/MedicationCard";
import AlertBanner from "../components/AlertBanner";
import type { AddMedicationResult } from "../api";
import type { Patient } from "../data/mockData";

export default function MedicationScreen({
  patient,
  readOnly,
  onAddMedication,
  onRequestConsent,
}: {
  patient: Patient;
  readOnly: boolean;
  onAddMedication?: ((drug: string) => Promise<AddMedicationResult | null>) | undefined;
  onRequestConsent?: ((hospital: string) => void) | undefined;
}) {
  const [value, setValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<AddMedicationResult | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim() || !onAddMedication) return;
    setChecking(true);
    setResult(null);
    const outcome = await onAddMedication(value.trim());
    setResult(outcome);
    setChecking(false);
    if (outcome?.status === "added") setValue("");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          {readOnly ? "Medications" : "Medication Safety"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {readOnly
            ? "Current medicines for Ananya, view only."
            : "Review current medications before adding a new prescription."}
        </p>
      </header>

      <PatientSummaryCard patient={patient} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3" aria-label="Current medications">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Current medications
          </h2>
          {patient.medications.length === 0 ? (
            <p className="surface p-6 text-sm text-muted-foreground">No medications recorded.</p>
          ) : (
            patient.medications.map((med) => <MedicationCard key={med} name={med} />)
          )}
        </section>

        {!readOnly && (
          <section className="space-y-4" aria-label="Add medication">
            <div className="surface p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                <ShieldPlus className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                Add medication
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The system checks current medicines and record relevance before the medication is
                added.
              </p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <label htmlFor="medication" className="block text-sm font-medium">
                  Medication name
                </label>
                <input
                  id="medication"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. Aspirin"
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={checking || !value.trim()}
                  className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                >
                  {checking ? "Checking…" : "Check & Add Medication"}
                </button>
              </form>
            </div>

            {result?.status === "interaction" && (
              <AlertBanner
                tone="danger"
                severity="High"
                title="Potential medication interaction"
                footer={
                  <span className="inline-flex rounded-md border border-danger/40 px-3 py-1.5 text-sm font-medium">
                    Review before prescribing
                  </span>
                }
              >
                <p className="font-medium">
                  {result.drug} + {result.interactionWith}
                </p>
                <p>{result.risk}</p>
                <p>Clinician review recommended.</p>
              </AlertBanner>
            )}

            {result?.status === "hidden-record" && result.hiddenRecord && (
              <AlertBanner
                tone="warning"
                severity="Consent"
                title="Relevant information may exist in a private record"
                footer={
                  <button
                    onClick={() => onRequestConsent?.(result.hiddenRecord!.hospital)}
                    className="rounded-md border border-warning/50 bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-warning-soft"
                  >
                    Request patient consent
                  </button>
                }
              >
                <p>
                  A patient record from {result.hiddenRecord.hospital} contains information
                  potentially relevant to {result.drug}.
                </p>
                <p>Request patient consent to review the relevant record.</p>
              </AlertBanner>
            )}

            {result?.status === "added" && (
              <AlertBanner tone="success" title="Medication added">
                <p>
                  {result.drug} was added to the current medication list. No potential interaction
                  was identified in the available records.
                </p>
              </AlertBanner>
            )}

            {!result && !checking && (
              <div className="rounded-xl border border-accent/25 bg-secondary/70 p-5">
                <p className="text-xs font-semibold tracking-wider text-secondary-foreground uppercase">
                  Feature 2
                </p>
                <p className="mt-1 text-base font-semibold tracking-tight text-primary">
                  Your doctor sees safety risks
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try <span className="font-medium">Aspirin</span> for an interaction alert, or{" "}
                  <span className="font-medium">Metformin</span> for a private-record relevance
                  alert.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
