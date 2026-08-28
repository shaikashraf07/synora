import { Pill, CheckCircle2, Clock } from "lucide-react";

export default function MedicationCard({
  name,
  note = "Active Prescription",
  highlight,
}: {
  name: string;
  note?: string | undefined;
  highlight?: boolean | undefined;
}) {
  return (
    <div
      className={`animate-rise-in surface relative flex min-w-0 items-center justify-between gap-3 p-4 transition-all duration-300 hover:border-teal-500/40 hover:shadow-lift ${
        highlight ? "border-teal-500 bg-teal-50/30" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white shadow-xs">
          <Pill className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm font-bold tracking-tight text-foreground">
            {name}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 text-teal-600" />
            <span className="truncate">{note}</span>
          </div>
        </div>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 shadow-xs">
        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
        Active
      </span>
    </div>
  );
}
