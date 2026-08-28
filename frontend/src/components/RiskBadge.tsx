import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { RiskLevel } from "../data/mockData";

const config = {
  GREEN: {
    label: "Low Risk",
    sublabel: "Adherence Optimal",
    Icon: ShieldCheck,
    className: "bg-emerald-50 text-emerald-700 border-emerald-300/80 shadow-xs",
    dotClass: "bg-emerald-500",
  },
  YELLOW: {
    label: "Attention Needed",
    sublabel: "Adherence Alert",
    Icon: AlertTriangle,
    className: "bg-amber-50 text-amber-800 border-amber-300/80 shadow-xs",
    dotClass: "bg-amber-500",
  },
  RED: {
    label: "High Risk",
    sublabel: "Caregiver Action Required",
    Icon: ShieldAlert,
    className: "bg-rose-50 text-rose-800 border-rose-400 shadow-glow-danger animate-pulse-subtle",
    dotClass: "bg-rose-500 animate-ping",
  },
} as const;

export default function RiskBadge({
  level,
  size = "md",
  showSublabel = false,
}: {
  level: RiskLevel;
  size?: "sm" | "md" | "lg" | undefined;
  showSublabel?: boolean;
}) {
  const { label, sublabel, Icon, className, dotClass } = config[level];

  return (
    <div
      role="status"
      aria-label={`Adherence risk: ${label}`}
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl border font-semibold transition-all duration-300 ${className} ${
        size === "sm"
          ? "px-2.5 py-1 text-xs"
          : size === "lg"
          ? "px-4 py-2 text-sm"
          : "px-3 py-1.5 text-xs"
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dotClass}`} />
      </span>
      <Icon
        className={size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-4.5 w-4.5" : "h-4 w-4"}
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <span>{label}</span>
        {showSublabel && (
          <span className="text-[10px] font-normal opacity-80">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
