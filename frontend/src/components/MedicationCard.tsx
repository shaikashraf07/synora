import { Pill } from "lucide-react";

export default function MedicationCard({
  name,
  note = "Active",
  highlight,
}: {
  name: string;
  note?: string | undefined;
  highlight?: boolean | undefined;
}) {
  return (
    <div
      className={`surface animate-rise-in flex min-w-0 items-center gap-3 p-4 transition-shadow duration-300 hover:shadow-lift ${
        highlight ? "border-accent/50" : ""
      }`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
        <Pill className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{note}</p>
      </div>
      <span className="ml-auto shrink-0 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">
        Active
      </span>
    </div>
  );
}
