import { Eye, ShieldCheck, Lock, Building2, Sparkles, Filter } from "lucide-react";
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
      {/* Patient Summary Header */}
      <PatientSummaryCard
        patient={patient}
        variant={isPatient ? "hero" : "light"}
        footnote={
          isPatient
            ? `${sharedCount} of ${patient.records.length} records currently authorized for doctor review.`
            : `Viewing consented patient health records under patient authorization.`
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Main Timeline Section */}
        <section className="space-y-4" aria-label="Medical timeline">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Unified Medical Timeline
              </h2>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
                {patient.records.length} Events
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Chronological Order · Most Recent First
            </span>
          </div>

          {patient.records.length === 0 ? (
            <div className="surface p-8 text-center">
              <Building2 className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-semibold text-foreground">No medical records available</p>
              <p className="text-xs text-muted-foreground">Records linked through ABDM/ABHA will appear here.</p>
            </div>
          ) : (
            <div className="relative space-y-4 pl-4 before:absolute before:bottom-3 before:left-1 before:top-3 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-slate-300 before:to-slate-200 sm:pl-6">
              {patient.records.map((record, index) => (
                <div key={record.hospital} className="relative">
                  {/* Timeline bullet dot */}
                  <div
                    aria-hidden="true"
                    className={`absolute -left-[21px] top-6 h-3.5 w-3.5 rounded-full border-2 border-white shadow-xs transition-all sm:-left-[29px] ${
                      record.visible
                        ? "bg-teal-600 ring-4 ring-teal-100"
                        : "bg-amber-500 ring-4 ring-amber-100"
                    }`}
                  />

                  {!isPatient && !record.visible ? (
                    <PrivateRecordCard hospital={record.hospital} />
                  ) : (
                    <MedicalRecordCard
                      record={record}
                      editable={isPatient}
                      pending={pending}
                      onConsentChange={onConsentChange}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar Guidance Cards */}
        <aside className="space-y-4">
          <div className="surface p-5">
            <p className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
              <ShieldCheck className="h-4 w-4 text-teal-600" aria-hidden="true" />
              Consent Architecture
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {isPatient
                ? "You hold complete sovereign ownership of your health record. Toggling a hospital off instantly prevents doctors from reading that diagnosis."
                : "Doctors only have access to records explicitly consented by the patient. Concealed records protect patient privacy while safety engines scan them in the background."}
            </p>
          </div>

          {isPatient ? (
            <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-50/80 via-slate-50 to-teal-50/40 p-5 shadow-xs">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                Active Consent Feature
              </p>
              <p className="mt-1 text-sm font-bold tracking-tight text-foreground">
                Instant Privacy Toggle
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Try toggling the <span className="font-semibold text-foreground">Apollo Care Centre</span> record on or off, then switch to <span className="font-semibold text-indigo-700">Doctor View</span> at the top to see the real-time access restriction in action.
              </p>
            </div>
          ) : (
            <div className="surface p-5">
              <p className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
                <Eye className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                Doctor Record Visibility
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Currently showing <span className="font-bold text-foreground">{sharedCount}</span> of{" "}
                <span className="font-bold text-foreground">{patient.records.length}</span> records.
                If safety checks detect potential interactions involving private records, you can request patient authorization.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
