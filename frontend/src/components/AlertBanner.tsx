import type { ReactNode } from "react";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from "lucide-react";

type Tone = "danger" | "warning" | "success" | "info";

const tones: Record<Tone, { className: string; Icon: typeof Info }> = {
  danger: {
    className: "border-danger/35 bg-danger-soft text-danger",
    Icon: AlertOctagon,
  },
  warning: {
    className: "border-warning/45 bg-warning-soft text-warning-foreground",
    Icon: AlertTriangle,
  },
  success: {
    className: "border-success/35 bg-success-soft text-success",
    Icon: CheckCircle2,
  },
  info: {
    className: "border-accent/30 bg-secondary text-secondary-foreground",
    Icon: Info,
  },
};

export default function AlertBanner({
  tone,
  severity,
  title,
  children,
  footer,
}: {
  tone: Tone;
  severity?: string | undefined;
  title: string;
  children?: ReactNode | undefined;
  footer?: ReactNode | undefined;
}) {
  const { className, Icon } = tones[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={`animate-alert-in rounded-xl border p-5 ${className}`}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            {severity ? (
              <span className="rounded-full border border-current/30 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase">
                {severity}
              </span>
            ) : null}
          </div>
          <div className="mt-2 space-y-2 text-sm text-foreground/80">{children}</div>
          {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
