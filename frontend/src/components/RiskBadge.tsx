import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { RiskLevel } from "../data/mockData";

const config = {
  GREEN: {
    label: "Low Risk",
    Icon: ShieldCheck,
    className: "bg-success-soft text-success border-success/30",
  },
  YELLOW: {
    label: "Attention Needed",
    Icon: AlertTriangle,
    className: "bg-warning-soft text-warning-foreground border-warning/40",
  },
  RED: {
    label: "High Risk",
    Icon: ShieldAlert,
    className: "bg-danger-soft text-danger border-danger/35",
  },
} as const;

export default function RiskBadge({
  level,
  size = "md",
}: {
  level: RiskLevel;
  size?: "sm" | "md" | undefined;
}) {
  const { label, Icon, className } = config[level];
  return (
    <span
      role="status"
      aria-label={`Risk level: ${label}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium transition-colors duration-300 ${className} ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
      {label}
    </span>
  );
}
