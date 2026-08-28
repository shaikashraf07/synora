import { CalendarClock, IdCard, Pill } from "lucide-react";
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

  return (
    <section
      className={`animate-rise-in overflow-hidden rounded-xl border p-5 sm:p-6 ${
        hero
          ? "border-transparent bg-hero text-primary-foreground shadow-lift"
          : "surface"
      }`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-base font-semibold ${
              hero ? "bg-primary-foreground/15" : "bg-secondary text-secondary-foreground"
            }`}
          >
            AR
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {patient.name}
            </h2>
            <p className={`truncate text-sm ${hero ? "opacity-80" : "text-muted-foreground"}`}>
              {patient.age} · {patient.gender}
            </p>
          </div>
        </div>
        <RiskBadge level={risk} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat hero={hero} Icon={IdCard} label="Patient ID" value={patient.id} />
        <Stat
          hero={hero}
          Icon={CalendarClock}
          label="Missed doses"
          value={`${patient.missedDoses} this week`}
        />
        <Stat
          hero={hero}
          Icon={Pill}
          label="Active medications"
          value={`${patient.medications.length} medicines`}
        />
      </dl>

      {footnote ? (
        <p className={`mt-4 text-xs ${hero ? "opacity-75" : "text-muted-foreground"}`}>
          {footnote}
        </p>
      ) : null}
    </section>
  );
}

function Stat({
  Icon,
  label,
  value,
  hero,
}: {
  Icon: typeof IdCard;
  label: string;
  value: string;
  hero: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border px-3 py-2.5 ${
        hero ? "border-primary-foreground/15 bg-primary-foreground/10" : "border-border bg-muted/60"
      }`}
    >
      <dt
        className={`flex items-center gap-1.5 text-xs ${
          hero ? "opacity-80" : "text-muted-foreground"
        }`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-medium">{value}</dd>
    </div>
  );
}
