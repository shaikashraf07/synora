import { Eye, ShieldCheck } from "lucide-react";
import PatientSummaryCard from "../components/PatientSummaryCard";
import { MedicalRecordCard, PrivateRecordCard } from "../components/MedicalRecordCard";
import type { Patient } from "../data/mockData";

export default function TimelineScreen({
  patient,
  role,
  onConsentChange,
  pending,
}: {
  patient: Patient;
  role: "PATIENT" | "DOCTOR";
  onConsentChange: (hospital: string, visible: boolean) => void;
  pending: boolean;
}) {
  const isPatient = role === "PATIENT";
  const sharedCount = patient.records.filter((r) => r.visible).length;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          {isPatient ? "Your Medical Timeline" : "Patient Record"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isPatient
            ? "One view of your health records across providers."
            : "Only records approved by the patient are shown below."}
        </p>
      </header>

      <PatientSummaryCard
        patient={patient}
        variant={isPatient ? "hero" : "light"}
        footnote={
          isPatient
            ? `${sharedCount} of ${patient.records.length} records currently shared with your care team.`
            : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="space-y-3" aria-label="Medical timeline">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Timeline
          </h2>
          {patient.records.length === 0 ? (
            <p className="surface p-6 text-sm text-muted-foreground">
              No medical records available yet.
            </p>
          ) : (
            patient.records.map((record) =>
              !isPatient && !record.visible ? (
                <PrivateRecordCard key={record.hospital} hospital={record.hospital} />
              ) : (
                <MedicalRecordCard
                  key={record.hospital}
                  record={record}
                  editable={isPatient}
                  pending={pending}
                  onConsentChange={onConsentChange}
                />
              ),
            )
          )}
        </section>

        <aside className="space-y-4">
          <div className="surface p-5">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              Patient-controlled access
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Only records approved by the patient are visible in Doctor View.
            </p>
          </div>

          {isPatient ? (
            <div className="rounded-xl border border-accent/25 bg-secondary/70 p-5">
              <p className="text-xs font-semibold tracking-wider text-secondary-foreground uppercase">
                Feature 1
              </p>
              <p className="mt-1 text-base font-semibold tracking-tight text-primary">
                You control your record
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                You control which records your care team can see. Switch Doctor access off to keep a
                record private.
              </p>
            </div>
          ) : (
            <div className="surface p-5">
              <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Eye className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                Visible records
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {sharedCount} of {patient.records.length} records shared. Private records can be
                requested from the patient.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
