import { Activity, Bell } from "lucide-react";
import RoleSelector, { type Role } from "./RoleSelector";

export default function Header({
  role,
  onRoleChange,
  tabs,
  activeTab,
  onTabChange,
}: {
  role: Role;
  onRoleChange: (role: Role) => void;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
      <div className="border-b border-border/70 bg-secondary/50">
        <p className="mx-auto max-w-6xl px-4 py-1.5 text-center text-[11px] tracking-wide text-secondary-foreground sm:px-6">
          Synthetic Demo Environment · This application contains fictional data
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-hero text-primary-foreground">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-primary">
                MediCareAI
              </p>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                Your health record. Your consent. Your safety.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
            >
              AR
            </span>
          </div>
        </div>

        <div className="pb-3">
          <RoleSelector role={role} onChange={onRoleChange} />
        </div>

        <nav aria-label={`${role} navigation`} className="-mb-px flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-accent text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
