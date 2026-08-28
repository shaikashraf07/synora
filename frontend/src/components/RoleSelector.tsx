import { HeartPulse, Stethoscope, Users } from "lucide-react";

export type Role = "PATIENT" | "DOCTOR" | "CAREGIVER";

const roles: { id: Role; label: string; Icon: typeof HeartPulse }[] = [
  { id: "PATIENT", label: "Patient", Icon: HeartPulse },
  { id: "DOCTOR", label: "Doctor", Icon: Stethoscope },
  { id: "CAREGIVER", label: "Caregiver", Icon: Users },
];

export default function RoleSelector({
  role,
  onChange,
}: {
  role: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Demo role"
        className="flex w-full min-w-0 rounded-lg border border-border bg-muted p-1"
      >
        {roles.map(({ id, label, Icon }) => {
          const active = role === id;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(id)}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                active
                  ? "bg-card text-primary shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
      <span className="hidden shrink-0 rounded-full border border-accent/30 bg-secondary px-2.5 py-1 text-[11px] font-medium tracking-wide text-secondary-foreground uppercase sm:inline">
        Demo Mode
      </span>
    </div>
  );
}
