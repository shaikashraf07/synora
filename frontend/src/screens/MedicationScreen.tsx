import { useState, type FormEvent } from "react";
import { ShieldPlus, ShieldAlert, Sparkles, Check, AlertTriangle, Pill, ArrowRight, Zap } from "lucide-react";
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
  onAddMedication?: ((drug: string) => Promise<AddMedicationResult | null>) | undefined;
  onRequestConsent?: ((hospital: string) => void) | undefined;
  readOnly: boolean;
}) {
  const [value, setValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<AddMedicationResult | null>(null);

  async function handleAdd(drugName: string) {
    const trimmed = drugName.trim();
    if (!trimmed || !onAddMedication) return;
    setValue(trimmed);
    setChecking(true);
    setResult(null);
    const outcome = await onAddMedication(trimmed);
    setResult(outcome);
    setChecking(false);
    if (outcome?.status === "added") setValue("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim()) return;
    await handleAdd(value);
  }

  return (
    <div className="space-y-6">
      {/* Patient Header Summary */}
      <PatientSummaryCard
        patient={patient}
        variant={readOnly ? "hero" : "light"}
        footnote={
          readOnly
            ? `Viewing active medication list for ${patient.name}. Contact clinician before adjusting doses.`
            : `Prescribing station: Active medication safety engine scanning for interactions and cross-record alerts.`
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Medications List */}
        <section className="space-y-3" aria-label="Current medications">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Current Active Medications
            </h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
              {patient.medications.length} Prescriptions
            </span>
          </div>

          {patient.medications.length === 0 ? (
            <div className="surface p-8 text-center text-sm text-muted-foreground">
              <Pill className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 font-medium">No medications recorded</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {patient.medications.map((med) => (
                <MedicationCard key={med} name={med} />
              ))}
            </div>
          )}
        </section>

        {/* Doctor Prescribing Console */}
        {!readOnly && (
          <section className="space-y-4" aria-label="Add medication">
            <div className="surface relative overflow-hidden p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
                  <ShieldPlus className="h-5 w-5 text-teal-600" aria-hidden="true" />
                  Prescribe New Medication
                </h2>
                <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200">
                  <Zap className="h-2.5 w-2.5" /> Live Safety Scan
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Enter a medication name. The system checks active drugs and encrypted private records before committing.
              </p>

              {/* Quick simulation buttons */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Quick Demo Test Cases:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdd("Aspirin")}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/60 px-2.5 py-1 text-xs font-semibold text-rose-800 transition-all hover:bg-rose-100 active:scale-95"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Test Aspirin (Interaction)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdd("Metformin")}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/60 px-2.5 py-1 text-xs font-semibold text-amber-900 transition-all hover:bg-amber-100 active:scale-95"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Test Metformin (Private Record)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdd("Paracetamol")}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50/60 px-2.5 py-1 text-xs font-semibold text-emerald-900 transition-all hover:bg-emerald-100 active:scale-95"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Test Paracetamol (Safe)
                  </button>
                </div>
              </div>

              {/* Prescription Input Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div className="space-y-1">
                  <label htmlFor="medication" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Medication Name
                  </label>
                  <input
                    id="medication"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g. Aspirin, Metformin, Atorvastatin"
                    className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={checking || !value.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50"
                >
                  {checking ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Running Cross-Record Safety Analysis…
                    </>
                  ) : (
                    <>
                      <ShieldPlus className="h-4 w-4 text-teal-400" />
                      Run Safety Check & Prescribe
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Interaction Alert Banner */}
            {result?.status === "interaction" && (
              <AlertBanner
                tone="danger"
                severity="High Clinical Risk"
                title="Critical Drug-to-Drug Interaction Detected"
                footer={
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                    <ShieldAlert className="h-4 w-4" />
                    Prescription paused. Clinician review required before administration.
                  </div>
                }
              >
                <div className="rounded-xl border border-rose-300/80 bg-white/70 p-3 text-xs space-y-1">
                  <p className="font-bold text-rose-950">
                    Conflict: <span className="underline">{result.drug}</span> +{" "}
                    <span className="underline">{result.interactionWith}</span>
                  </p>
                  <p className="text-rose-900">{result.risk}</p>
                </div>
              </AlertBanner>
            )}

            {/* Hidden Record Alert Banner */}
            {result?.status === "hidden-record" && result.hiddenRecord && (
              <AlertBanner
                tone="warning"
                severity="Consent Required"
                title="Relevant Diagnosis Found in Encrypted Private Record"
                footer={
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onRequestConsent?.(result.hiddenRecord!.hospital)}
                      className="rounded-xl border border-amber-400 bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-transform hover:bg-amber-700 active:scale-95"
                    >
                      Request Patient Consent for {result.hiddenRecord.hospital}
                    </button>
                    <span className="text-[11px] text-amber-900 font-medium">
                      Notification will be sent to patient's portal
                    </span>
                  </div>
                }
              >
                <p className="text-xs leading-relaxed text-amber-950">
                  The safety engine detected an encrypted record from{" "}
                  <span className="font-bold">{result.hiddenRecord.hospital}</span> with clinical relevance to{" "}
                  <span className="font-bold">{result.drug}</span>. Details remain private until patient grants access.
                </p>
              </AlertBanner>
            )}

            {/* Success Added Banner */}
            {result?.status === "added" && (
              <AlertBanner
                tone="success"
                severity="Cleared"
                title="Medication Successfully Added"
              >
                <p className="text-xs text-emerald-950">
                  <span className="font-bold">{result.drug}</span> passed all interaction and cross-record safety checks. Added to patient's active prescription list.
                </p>
              </AlertBanner>
            )}

            {/* Initial Guidance Card */}
            {!result && !checking && (
              <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-slate-50 via-teal-50/40 to-indigo-50/40 p-5 shadow-xs">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  Active Prescribing Intelligence
                </p>
                <p className="mt-1 text-sm font-bold tracking-tight text-foreground">
                  Cross-Hospital Safety Guard
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Try clicking the test buttons above to demo how doctors are protected from dangerous interactions even when past diagnostic records are kept confidential by the patient.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
