import { HeartPulse, Stethoscope, Users, Eye } from "lucide-react";

export type Role = "PATIENT" | "DOCTOR" | "CAREGIVER";

const roles: {
  id: Role;
  label: string;
  sublabel: string;
  Icon: typeof HeartPulse;
  accentClass: string;
}[] = [
  {
    id: "PATIENT",
    label: "Patient View",
    sublabel: "Full consent control",
    Icon: HeartPulse,
    accentClass: "data-[active=true]:text-teal-900 data-[active=true]:bg-white data-[active=true]:shadow-sm data-[active=true]:border-teal-500/30",
  },
  {
    id: "DOCTOR",
    label: "Doctor View",
    sublabel: "Consented records & safety checks",
    Icon: Stethoscope,
    accentClass: "data-[active=true]:text-indigo-950 data-[active=true]:bg-white data-[active=true]:shadow-sm data-[active=true]:border-indigo-500/30",
  },
  {
    id: "CAREGIVER",
    label: "Caregiver View",
    sublabel: "Adherence monitor & alerts",
    Icon: Users,
    accentClass: "data-[active=true]:text-emerald-950 data-[active=true]:bg-white data-[active=true]:shadow-sm data-[active=true]:border-emerald-500/30",
  },
];

export default function RoleSelector({
  role,
  onChange,
}: {
  role: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-slate-50/80 p-1.5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
      <div
        role="radiogroup"
        aria-label="Select role perspective"
        className="grid w-full grid-cols-3 gap-1"
      >
        {roles.map(({ id, label, Icon, accentClass }) => {
          const active = role === id;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={active}
              data-active={active}
              onClick={() => onChange(id)}
              className={`flex min-w-0 items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-[0.98] ${
                active
                  ? `${accentClass} font-bold text-foreground`
                  : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform ${
                  active ? "scale-110" : "opacity-70"
                }`}
                aria-hidden="true"
              />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 pr-2 text-[11px] font-medium text-muted-foreground lg:flex">
        <Eye className="h-3 w-3 text-teal-600" />
        <span>Switch perspectives to test access control</span>
      </div>
    </div>
  );
}
