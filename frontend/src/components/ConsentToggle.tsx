import { Lock, Unlock } from "lucide-react";

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
      <div className="flex min-w-0 items-center gap-2">
        {visible ? (
          <Unlock className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
        ) : (
          <Lock className="h-4 w-4 shrink-0 text-warning-foreground" aria-hidden="true" />
        )}
        <span className="truncate text-sm font-medium">Doctor access</span>
        <span
          className={`truncate text-sm ${visible ? "text-success" : "text-muted-foreground"}`}
        >
          · {visible ? "Visible to doctors" : "Private"}
        </span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={visible}
        disabled={disabled}
        aria-label={`Doctor access for ${recordLabel}`}
        onClick={() => onToggle(!visible)}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300 disabled:opacity-50 ${
          visible ? "border-accent bg-accent" : "border-border bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full bg-card shadow-soft transition-transform duration-300 ${
            visible ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
