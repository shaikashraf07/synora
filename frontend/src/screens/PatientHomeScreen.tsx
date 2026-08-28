import { Clock, Eye, HeartPulse, Pill, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import PatientSummaryCard from "../components/PatientSummaryCard";
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
  const firstName = patient.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Patient Hero Summary Card */}
      <PatientSummaryCard
        patient={patient}
        variant="hero"
        footnote={`${shared} of ${patient.records.length} records currently visible to your healthcare team.`}
      />

      {/* Quick Status Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Health Overview & Safety Metrics
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time status of your cross-hospital medical consent and medication plan.
          </p>
        </div>
      </div>

      {/* 4 Interactive KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Risk Card */}
        <div className="surface group relative overflow-hidden p-5 transition-all duration-300 hover:border-teal-500/40 hover:shadow-lift">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HeartPulse className="h-4 w-4 text-teal-600" aria-hidden="true" />
              Adherence Safety Score
            </p>
            <RiskBadge level={risk} size="sm" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold tracking-tight text-foreground">
              {risk === "GREEN" ? "Optimal" : risk === "YELLOW" ? "Attention Needed" : "High Risk"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {risk === "GREEN"
                ? "Your medication schedule is on track with minimal missed doses."
                : risk === "YELLOW"
                ? "Missed doses have increased. Stay consistent to prevent complications."
                : "Caregiver alert active. Please review missed doses with your family or doctor."}
            </p>
          </div>
        </div>

        {/* Adherence Card */}
        <div className="surface group relative overflow-hidden p-5 transition-all duration-300 hover:border-teal-500/40 hover:shadow-lift">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-4 w-4 text-teal-600" aria-hidden="true" />
              Missed Doses (This Week)
            </p>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
              Week 34
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {patient.missedDoses}
            </span>
            <span className="text-xs text-muted-foreground">doses missed out of 14</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                risk === "GREEN"
                  ? "bg-emerald-500"
                  : risk === "YELLOW"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{
                width: `${Math.min(100, Math.max(8, (patient.missedDoses / 7) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Next Dose Card */}
        <div className="surface group relative overflow-hidden p-5 transition-all duration-300 hover:border-teal-500/40 hover:shadow-lift">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Pill className="h-4 w-4 text-teal-600" aria-hidden="true" />
              Next Scheduled Dose
            </p>
            <span className="flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 border border-teal-200">
              <Sparkles className="h-3 w-3" /> Upcoming
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xl font-bold tracking-tight text-foreground">
              {nextMedication.name} <span className="font-mono text-sm font-normal text-muted-foreground">({nextMedication.dose})</span>
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              Scheduled for today at <span className="font-semibold text-foreground">{nextMedication.time}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("medications")}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            View all medications <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Consent Card */}
        <button
          type="button"
          onClick={() => onNavigate("timeline")}
          className="surface group relative overflow-hidden p-5 text-left transition-all duration-300 hover:border-teal-500/50 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Eye className="h-4 w-4 text-teal-600" aria-hidden="true" />
              Doctor Access Consent
            </p>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
              {shared}/{patient.records.length} Shared
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
              {shared} <span className="text-base font-normal text-muted-foreground">of {patient.records.length} records shared</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              You maintain granular permission over which hospital visits doctors can review.
            </p>
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 group-hover:text-teal-800 transition-colors">
            Manage consent toggles <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </div>

      {/* Feature Explainer Banner */}
      <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-r from-teal-50/70 via-slate-50 to-indigo-50/70 p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-600 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                How MediCareAI Protects You
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                When a doctor prescribes a new medicine, our system automatically checks both your active medicines and your private records for cross-diagnosis safety risks.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("timeline")}
            className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-transform hover:bg-slate-800 active:scale-95"
          >
            Review Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
