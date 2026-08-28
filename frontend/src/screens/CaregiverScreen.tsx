import { Activity, BellRing, HeartHandshake, ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle, Users, Sparkles } from "lucide-react";
import PatientSummaryCard from "../components/PatientSummaryCard";
import RiskBadge from "../components/RiskBadge";
import MedicationCard from "../components/MedicationCard";
import AlertBanner from "../components/AlertBanner";
import { riskFromMissedDoses, type Patient } from "../data/mockData";

const weekDays = [
  { day: "Mon", full: "Monday" },
  { day: "Tue", full: "Tuesday" },
  { day: "Wed", full: "Wednesday" },
  { day: "Thu", full: "Thursday" },
  { day: "Fri", full: "Friday" },
  { day: "Sat", full: "Saturday" },
  { day: "Sun", full: "Sunday" },
];

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
  const firstName = patient.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Caregiver Patient Summary Card */}
      <PatientSummaryCard
        patient={patient}
        variant="hero"
        footnote={`Caregiver view active for ${patient.caregiver.name} (${patient.caregiver.relation}). Live adherence metrics synced with patient device.`}
      />

      {/* High-Risk Urgent Alert Banner */}
      {risk === "RED" && (
        <AlertBanner
          tone="danger"
          severity="Urgent Action Required"
          title={`Adherence Safety Breach for ${firstName}`}
          footer={
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onNotify}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-95"
              >
                <BellRing className="h-4 w-4" aria-hidden="true" />
                Trigger Caregiver Emergency Alert
              </button>
              <span className="text-xs font-medium text-rose-900">
                Simulated Push Notification & SMS will be dispatched to {patient.caregiver.name}
              </span>
            </div>
          }
        >
          <p className="text-xs leading-relaxed text-rose-950">
            {firstName} has missed <span className="font-bold">{patient.missedDoses} doses</span> this week, surpassing the safety threshold. High probability of therapeutic lapse for chronic conditions.
          </p>
        </AlertBanner>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Main Adherence Console */}
        <section className="surface p-6 shadow-soft space-y-5" aria-label="Medication adherence tracker">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
                <Activity className="h-5 w-5 text-teal-600" aria-hidden="true" />
                7-Day Compliance Tracker
              </h2>
              <p className="text-xs text-muted-foreground">
                Weekly dose administration log and escalation scoring.
              </p>
            </div>
            <RiskBadge level={risk} size="md" showSublabel />
          </div>

          {/* 7-Day Pill Timeline Grid */}
          <div className="rounded-2xl border border-border/70 bg-slate-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Daily Dose Status (Current Week)
            </p>
            <ul className="grid grid-cols-7 gap-2 sm:gap-3" aria-label="Weekly adherence breakdown">
              {weekDays.map((item, index) => {
                const missed = index < patient.missedDoses;
                return (
                  <li key={item.day} className="flex flex-col items-center text-center">
                    <div
                      aria-hidden="true"
                      className={`relative grid h-14 w-full place-items-center rounded-xl border-2 transition-all duration-300 ${
                        missed
                          ? "border-rose-400 bg-rose-50 text-rose-700 shadow-xs"
                          : "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-xs"
                      }`}
                    >
                      {missed ? (
                        <XCircle className="h-6 w-6 stroke-[2.5]" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
                      )}
                      <span className="absolute bottom-1 text-[9px] font-bold uppercase">
                        {missed ? "Missed" : "Taken"}
                      </span>
                    </div>
                    <p className="mt-1.5 font-mono text-xs font-bold text-foreground">{item.day}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Adherence Tier Explanation */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div
              className={`rounded-xl border p-2.5 transition-all ${
                risk === "GREEN"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-950 font-bold shadow-xs"
                  : "border-border/60 bg-muted/40 text-muted-foreground"
              }`}
            >
              <span className="block font-mono text-sm">0 – 2 Missed</span>
              <span className="text-[10px]">Low Risk</span>
            </div>
            <div
              className={`rounded-xl border p-2.5 transition-all ${
                risk === "YELLOW"
                  ? "border-amber-400 bg-amber-50 text-amber-950 font-bold shadow-xs"
                  : "border-border/60 bg-muted/40 text-muted-foreground"
              }`}
            >
              <span className="block font-mono text-sm">3 – 5 Missed</span>
              <span className="text-[10px]">Attention Needed</span>
            </div>
            <div
              className={`rounded-xl border p-2.5 transition-all ${
                risk === "RED"
                  ? "border-rose-400 bg-rose-50 text-rose-950 font-bold shadow-xs"
                  : "border-border/60 bg-muted/40 text-muted-foreground"
              }`}
            >
              <span className="block font-mono text-sm">&gt; 5 Missed</span>
              <span className="text-[10px]">High Risk (Alert)</span>
            </div>
          </div>

          {/* Demo Trigger Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground">Interactive Demo Control</span>
              <p className="text-[11px] text-muted-foreground">
                Click to simulate missed doses and test dynamic risk escalation.
              </p>
            </div>
            <button
              type="button"
              onClick={onMissedDose}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
            >
              <Clock className="h-4 w-4 text-teal-400" />
              Simulate Missed Dose (+1)
            </button>
          </div>
        </section>

        {/* Sidebar Info */}
        <aside className="space-y-4">
          {/* Linked Caregiver Card */}
          <div className="surface p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
              <HeartHandshake className="h-5 w-5 text-teal-600" aria-hidden="true" />
              Designated Caregiver
            </div>
            <div className="rounded-xl border border-border/80 bg-slate-50/70 p-3.5 space-y-1">
              <p className="text-sm font-bold text-foreground">{patient.caregiver.name}</p>
              <p className="text-xs font-medium text-muted-foreground">
                Relation: <span className="font-semibold text-foreground">{patient.caregiver.relation}</span>
              </p>
              <p className="text-[11px] text-teal-700 font-semibold pt-1">
                Authorized for Emergency Alerts & Adherence Escalations
              </p>
            </div>
          </div>

          {/* Caregiver Feature Guide */}
          <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-50/80 via-slate-50 to-emerald-50/80 p-5 shadow-xs">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              Caregiver Proactive Safety
            </p>
            <p className="mt-1 text-sm font-bold tracking-tight text-foreground">
              Real-time Risk Guard
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              When an elderly or dependent patient misses multiple doses, risk escalates from Green to Yellow to Red, immediately notifying their linked care network.
            </p>
          </div>

          {/* Active Medications Preview */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Monitored Medications ({patient.medications.length})
            </h3>
            {patient.medications.map((med) => (
              <MedicationCard key={med} name={med} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
