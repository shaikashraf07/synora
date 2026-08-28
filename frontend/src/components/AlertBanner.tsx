import type { ReactNode } from "react";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";

type Tone = "danger" | "warning" | "success" | "info";

const tones: Record<Tone, { className: string; iconClass: string; Icon: typeof Info }> = {
  danger: {
    className: "border-rose-400 bg-rose-50/90 text-rose-950 shadow-glow-danger",
    iconClass: "text-rose-600 bg-rose-100 border-rose-300",
    Icon: AlertOctagon,
  },
  warning: {
    className: "border-amber-400 bg-amber-50/90 text-amber-950 shadow-xs",
    iconClass: "text-amber-700 bg-amber-100 border-amber-300",
    Icon: AlertTriangle,
  },
  success: {
    className: "border-emerald-300 bg-emerald-50/90 text-emerald-950 shadow-xs",
    iconClass: "text-emerald-700 bg-emerald-100 border-emerald-300",
    Icon: CheckCircle2,
  },
  info: {
    className: "border-indigo-300 bg-indigo-50/90 text-indigo-950 shadow-xs",
    iconClass: "text-indigo-700 bg-indigo-100 border-indigo-300",
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
  const { className, iconClass, Icon } = tones[tone];

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={`animate-alert-in relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${className}`}
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border font-bold shadow-xs ${iconClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold tracking-tight">{title}</h3>
            {severity ? (
              <span className="rounded-full border border-current/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {severity}
              </span>
            ) : null}
          </div>
          <div className="mt-2 space-y-1.5 text-xs font-medium leading-relaxed opacity-90">{children}</div>
          {footer ? <div className="mt-4 pt-3 border-t border-current/15">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
