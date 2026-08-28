import { Activity, BellRing, HeartHandshake } from "lucide-react";
import PatientSummaryCard from "../components/PatientSummaryCard";
import RiskBadge from "../components/RiskBadge";
import MedicationCard from "../components/MedicationCard";
import AlertBanner from "../components/AlertBanner";
import { riskFromMissedDoses, type Patient } from "../data/mockData";

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CaregiverScreen({
  patient,
  onMissedDose,
  onNotify,
  pending,
}: {
  patient: Patient;
  onMissedDose: () => void;
  onNotify: () => void;
  pending: boolean;
}) {
  const risk = riskFromMissedDoses(patient.missedDoses);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          Caregiver Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Read-only view for {patient.caregiver.name} ({patient.caregiver.relation}) supporting{" "}
          {patient.name}.
        </p>
      </header>

      <PatientSummaryCard patient={patient} variant="hero" />

      {risk === "RED" && (
        <AlertBanner
          tone="danger"
          severity="Urgent"
          title="Caregiver attention recommended"
          footer={
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onNotify}
                className="inline-flex items-center gap-2 rounded-md bg-danger px-3 py-2 text-sm font-medium text-danger-foreground transition-transform active:scale-[0.98]"
              >
                <BellRing className="h-4 w-4" aria-hidden="true" />
                Notify caregiver
              </button>
              <span className="text-xs text-muted-foreground">Demo notification</span>
            </div>
          }
        >
          <p>Medication adherence risk is high. Please check in with {patient.name.split(" ")[0]}.</p>
        </AlertBanner>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="surface p-5" aria-label="Medication adherence">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                <Activity className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                Medication Adherence
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Missed doses: <span className="font-medium text-foreground">{patient.missedDoses}</span>
              </p>
            </div>
            <RiskBadge level={risk} />
          </div>

          <ul className="mt-5 grid grid-cols-7 gap-2" aria-label="Weekly adherence">
            {week.map((day, index) => {
              const missed = index < patient.missedDoses;
              return (
                <li key={day} className="min-w-0 text-center">
                  <div
                    aria-hidden="true"
                    className={`h-12 rounded-md border transition-colors duration-500 ${
                      missed
                        ? "border-danger/30 bg-danger-soft"
                        : "border-success/25 bg-success-soft"
                    }`}
                  />
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">{day}</p>
                  <span className="sr-only">{missed ? "Dose missed" : "Dose taken"}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <button
              onClick={onMissedDose}
              disabled={pending}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted active:scale-[0.98] disabled:opacity-50"
            >
              Mark dose missed
            </button>
            <span className="text-xs text-muted-foreground">
              Demo control · under 3 low, 3–5 attention, over 5 high risk
            </span>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="surface p-5">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <HeartHandshake className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              Caregiver
            </p>
            <p className="mt-2 text-base font-medium">{patient.caregiver.name}</p>
            <p className="text-sm text-muted-foreground">{patient.caregiver.relation}</p>
          </div>

          <div className="rounded-xl border border-accent/25 bg-secondary/70 p-5">
            <p className="text-xs font-semibold tracking-wider text-secondary-foreground uppercase">
              Feature 3
            </p>
            <p className="mt-1 text-base font-semibold tracking-tight text-primary">
              Your care team can see when you need help
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Adherence risk rises with missed doses and triggers an early caregiver alert.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Current medications
            </h2>
            {patient.medications.map((med) => (
              <MedicationCard key={med} name={med} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
