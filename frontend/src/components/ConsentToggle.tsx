import { Lock, Unlock, Check, Shield } from "lucide-react";

export default function ConsentToggle({
  visible,
  onToggle,
  recordLabel,
  disabled,
}: {
  visible: boolean;
  onToggle: (next: boolean) => void;
  recordLabel: string;
  disabled?: boolean | undefined;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-semibold ${
            visible
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {visible ? (
            <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">
            Doctor & Care Team Visibility
          </span>
          <span
            className={`text-[11px] font-medium ${
              visible ? "text-emerald-700" : "text-amber-800"
            }`}
          >
            {visible ? "Shared with authorized clinicians" : "Kept private / consent revoked"}
          </span>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={visible}
        disabled={disabled}
        aria-label={`Toggle doctor access for ${recordLabel}`}
        onClick={() => onToggle(!visible)}
        className={`group relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          visible
            ? "border-teal-600 bg-teal-600 shadow-xs"
            : "border-slate-300 bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
            visible ? "translate-x-5 text-teal-700" : "translate-x-0 text-slate-400"
          }`}
        >
          {visible ? (
            <Check className="h-3 w-3 stroke-[3]" />
          ) : (
            <Lock className="h-2.5 w-2.5" />
          )}
        </span>
      </button>
    </div>
  );
}
