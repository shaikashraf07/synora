import { Clock, Eye, HeartPulse, Pill } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { nextMedication, riskFromMissedDoses, type Patient } from "../data/mockData";

export default function PatientHomeScreen({
  patient,
  onNavigate,
}: {
  patient: Patient;
  onNavigate: (tab: string) => void;
}) {
  const risk = riskFromMissedDoses(patient.missedDoses);
  const shared = patient.records.filter((r) => r.visible).length;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          Good morning, {patient.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Your health records, medications and care access — all in one place.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface animate-rise-in p-5">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <HeartPulse className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Overall risk
          </p>
          <div className="mt-3">
            <RiskBadge level={risk} />
          </div>
        </div>

        <div className="surface animate-rise-in p-5">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Medication adherence
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{patient.missedDoses}</p>
          <p className="text-sm text-muted-foreground">missed doses this week</p>
        </div>

        <div className="surface animate-rise-in p-5">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Pill className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Next medication
          </p>
          <p className="mt-3 text-base font-medium">
            {nextMedication.name} {nextMedication.dose}
          </p>
          <p className="text-sm text-muted-foreground">Today at {nextMedication.time}</p>
        </div>

        <button
          onClick={() => onNavigate("timeline")}
          className="surface animate-rise-in p-5 text-left transition-shadow hover:shadow-lift"
        >
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Records shared with doctors
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {shared}
            <span className="text-base font-normal text-muted-foreground"> / {patient.records.length}</span>
          </p>
          <p className="text-sm text-muted-foreground">Manage in your medical timeline</p>
        </button>
      </div>
    </div>
  );
}
