import { useState } from "react";
import { Minus, Sparkles, Check, Clock, X, Pill } from "lucide-react";
import type { ScheduledMedication } from "./EditNextMedicationModal";

/**
 * Medi — friendly clinical companion and medication reminder assistant.
 */
export default function MediAssistant({
  patientName,
  nextMed,
  onToast,
}: {
  patientName: string;
  nextMed: ScheduledMedication;
  onToast: (message: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const firstName = patientName.split(" ")[0];

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Medi medication assistant"
        className="animate-medi-float fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2.5 rounded-full bg-slate-900 px-4 text-white shadow-lift ring-4 ring-teal-500/20 transition-all hover:scale-105 hover:bg-slate-800"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-500" />
        </span>
        <MediFace className="h-6 w-6 text-teal-300" />
        <span className="text-xs font-bold tracking-wide">Medi Assistant</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Medi medication reminder widget"
      className="surface-glass animate-rise-in fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm p-4 shadow-lift border border-teal-500/30 sm:bottom-6 sm:right-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-slate-900 via-teal-950 to-teal-800 text-teal-300 shadow-sm">
            <MediFace className="h-6 w-6" />
          </span>
          <div className="min-w-0 space-y-0.5">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
              Medi Companion
              <Sparkles className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
            </p>
            <p className="text-sm font-bold text-foreground">
              Medication Due: {firstName}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Minimise assistant"
          className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-teal-500/20 bg-teal-50/60 p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-bold text-teal-950">
            <Pill className="h-3.5 w-3.5 text-teal-600" />
            {nextMed.name}
          </span>
          <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-teal-800 border border-teal-200">
            {nextMed.dose}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-teal-900/80">
          Scheduled for <span className="font-semibold">{nextMed.time}</span> today with water.
        </p>
      </div>

      <div className="mt-3.5 flex gap-2">
        <button
          type="button"
          onClick={() => {
            onToast(`Recorded: ${nextMed.name} taken.`);
            setOpen(false);
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white shadow-xs transition-transform hover:bg-teal-700 active:scale-95"
        >
          <Check className="h-3.5 w-3.5" /> Taken
        </button>
        <button
          type="button"
          onClick={() => {
            onToast("Reminder snoozed for 15 minutes.");
            setOpen(false);
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-slate-50"
        >
          <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Remind Later
        </button>
        <button
          type="button"
          onClick={() => {
            onToast("Dose skipped — logged in adherence record.");
            setDismissed(true);
          }}
          className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
          title="Dismiss reminder"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

function MediFace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="7" fill="currentColor" opacity="0.2" />
      <circle cx="9.2" cy="11" r="1.3" fill="currentColor" />
      <circle cx="14.8" cy="11" r="1.3" fill="currentColor" />
      <path
        d="M9.5 14.6c1.5 1.2 3.5 1.2 5 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 2.6v2M10.8 3.6h2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
