import { useState } from "react";
import { Minus, Sparkles } from "lucide-react";
import { nextMedication } from "../data/mockData";

/**
 * Medi — friendly on-screen medication reminder companion.
 * Frontend demo behaviour only; a future backend reminder service could
 * drive `open` and the reminder payload through props.
 */
export default function MediAssistant({
  patientName,
  onToast,
}: {
  patientName: string;
  onToast: (message: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const firstName = patientName.split(" ")[0];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Medi medication reminder"
        className="animate-medi-float fixed right-4 bottom-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-hero text-primary-foreground shadow-lift transition-transform hover:scale-105 sm:h-14 sm:w-14"
      >
        <MediFace className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>
    );
  }

  return (
    <aside
      aria-label="Medi medication reminder"
      className="surface animate-rise-in fixed right-3 bottom-3 z-40 w-[calc(100vw-1.5rem)] max-w-xs p-4 shadow-lift sm:right-5 sm:bottom-5"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <span className="animate-medi-float grid h-10 w-10 shrink-0 place-items-center rounded-full bg-hero text-primary-foreground">
          <MediFace className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
            Medi
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Hi {firstName} 👋 It's time for your medication.
          </p>
          <p className="mt-1 text-sm font-medium">
            {nextMedication.name} {nextMedication.dose}
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Minimise Medi"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            onToast("Medication marked as taken.");
            setOpen(false);
          }}
          className="flex-1 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-transform hover:opacity-95 active:scale-[0.98]"
        >
          Taken
        </button>
        <button
          onClick={() => {
            onToast("I'll remind you again later.");
            setOpen(false);
          }}
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Remind me later
        </button>
        <button
          onClick={() => {
            onToast("Dose skipped — noted in your demo record.");
            setDismissed(true);
          }}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          Skip
        </button>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">Demo reminder · not a real notification</p>
    </aside>
  );
}

function MediFace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="7" fill="currentColor" opacity="0.16" />
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
