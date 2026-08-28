import { CalendarClock, IdCard, Pill, ShieldCheck, UserCheck } from "lucide-react";
import RiskBadge from "./RiskBadge";
import { riskFromMissedDoses, type Patient } from "../data/mockData";

export default function PatientSummaryCard({
  patient,
  variant = "light",
  footnote,
}: {
  patient: Patient;
  variant?: "light" | "hero" | undefined;
  footnote?: string | undefined;
}) {
  const risk = riskFromMissedDoses(patient.missedDoses);
  const hero = variant === "hero";

  const initials = patient.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      className={`animate-rise-in relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
        hero
          ? "border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-lift"
          : "surface border-border/80 hover:shadow-lift"
      }`}
    >
      {/* Decorative accent element in hero mode */}
      {hero && (
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-teal-500/10 blur-2xl" />
      )}

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            aria-hidden="true"
            className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-mono text-base font-bold shadow-md transition-transform hover:scale-105 ${
              hero
                ? "bg-gradient-to-tr from-teal-600 to-cyan-500 text-white"
                : "bg-gradient-to-tr from-slate-800 to-slate-700 text-white"
            }`}
          >
            {initials}
            <div className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-card bg-emerald-500 text-white">
              <UserCheck className="h-3 w-3" />
            </div>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
                {patient.name}
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                  hero
                    ? "bg-white/10 text-teal-200 border border-white/15"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <IdCard className="h-3 w-3" />
                {patient.id}
              </span>
            </div>

            <p className={`text-xs font-medium ${hero ? "text-slate-300" : "text-muted-foreground"}`}>
              {patient.age} yrs · {patient.gender} · Caregiver:{" "}
              <span className="font-semibold">{patient.caregiver.name}</span> ({patient.caregiver.relation})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <RiskBadge level={risk} size="md" showSublabel />
        </div>
      </div>

      <dl className="relative z-10 mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <Stat
          hero={hero}
          Icon={Pill}
          label="Active Medications"
          value={`${patient.medications.length} Prescriptions`}
          detail={patient.medications.join(", ")}
        />
        <Stat
          hero={hero}
          Icon={CalendarClock}
          label="Weekly Adherence"
          value={`${patient.missedDoses} missed doses`}
          detail={patient.missedDoses === 0 ? "100% compliant" : "Action suggested"}
        />
        <Stat
          hero={hero}
          Icon={ShieldCheck}
          label="Consent Status"
          value={`${patient.records.filter((r) => r.visible).length} of ${patient.records.length} Shared`}
          detail="Doctor access active"
        />
      </dl>

      {footnote && (
        <div
          className={`mt-4 flex items-center gap-2 border-t pt-3 text-xs ${
            hero
              ? "border-white/10 text-slate-300"
              : "border-border/60 text-muted-foreground"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-teal-500 shrink-0" />
          <span>{footnote}</span>
        </div>
      )}
    </section>
  );
}

function Stat({
  Icon,
  label,
  value,
  detail,
  hero,
}: {
  Icon: typeof IdCard;
  label: string;
  value: string;
  detail?: string;
  hero: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border p-3.5 transition-all duration-200 hover:scale-[1.01] ${
        hero
          ? "border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xs"
          : "border-border/70 bg-slate-50/60 hover:bg-slate-50"
      }`}
    >
      <dt
        className={`flex items-center gap-1.5 text-xs font-medium ${
          hero ? "text-slate-300" : "text-muted-foreground"
        }`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-teal-500" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-bold tracking-tight">{value}</dd>
      {detail && (
        <p
          className={`mt-0.5 truncate text-[11px] ${
            hero ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {detail}
        </p>
      )}
    </div>
  );
}
