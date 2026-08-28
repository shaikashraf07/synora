import { Activity, Bell, ShieldCheck, Stethoscope, Users, HeartPulse } from "lucide-react";
import RoleSelector, { type Role } from "./RoleSelector";

export default function Header({
  role,
  onRoleChange,
  tabs,
  activeTab,
  onTabChange,
  initials = "AR",
  onAvatarClick,
}: {
  role: Role;
  onRoleChange: (role: Role) => void;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  initials?: string;
  onAvatarClick?: () => void;
}) {
  const roleMeta = {
    PATIENT: {
      tag: "Patient Portal",
      desc: "Consent & Health Control",
      icon: HeartPulse,
      badgeColor: "bg-teal-500/10 text-teal-700 border-teal-500/20",
    },
    DOCTOR: {
      tag: "Clinical Station",
      desc: "Prescribing & Consented Records",
      icon: Stethoscope,
      badgeColor: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    },
    CAREGIVER: {
      tag: "Caregiver Console",
      desc: "Dependent Adherence Watch",
      icon: Users,
      badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    },
  }[role];

  const RoleIcon = roleMeta.icon;

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-card/90 backdrop-blur-md transition-colors">
      {/* Top micro status bar */}
      <div className="border-b border-border/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-1 text-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-[11px] font-medium tracking-wide sm:px-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Intelligent EHR & Medication Safety Engine · Active</span>
          </div>
          <div className="hidden items-center gap-2 text-slate-400 sm:flex">
            <span className="flex items-center gap-1 font-mono text-[10px] text-slate-300">
              <ShieldCheck className="h-3 w-3 text-teal-400" /> End-to-End Consent Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 sm:py-3.5">
          {/* Logo & perspective banner */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-hero text-white shadow-soft">
              <Activity className="h-5 w-5 animate-pulse-subtle" aria-hidden="true" />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-teal-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-foreground text-lg">
                  Synora <span className="text-teal-600 font-medium">EHR</span>
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${roleMeta.badgeColor}`}>
                  <RoleIcon className="h-2.5 w-2.5" />
                  {roleMeta.tag}
                </span>
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {roleMeta.desc}
              </p>
            </div>
          </div>

          {/* Right utility buttons */}
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-xl border border-border/80 bg-secondary/50 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
            </button>

            {/* Avatar — clickable to open profile editor */}
            <button
              type="button"
              aria-label="Edit patient profile"
              onClick={onAvatarClick}
              title="Click to edit patient profile"
              className="group relative flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-secondary/70 pl-2 pr-2.5 text-xs font-semibold text-foreground transition-all hover:border-teal-500/50 hover:bg-teal-50/50 hover:shadow-soft active:scale-95"
            >
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-teal-600 font-mono text-[11px] text-white shadow-sm transition-transform group-hover:scale-105">
                {initials}
              </span>
              <span className="hidden font-medium text-muted-foreground group-hover:text-foreground md:inline">
                Profile
              </span>
            </button>
          </div>
        </div>

        {/* Role perspective selector */}
        <div className="pb-3 pt-1">
          <RoleSelector role={role} onChange={onRoleChange} />
        </div>

        {/* Role view tab bar */}
        <nav aria-label={`${role} views`} className="-mb-px flex gap-1.5 overflow-x-auto pb-0.5">
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={active ? "page" : undefined}
                className={`relative shrink-0 rounded-t-lg border-b-2 px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "border-teal-600 text-teal-900 bg-teal-50/40 shadow-xs"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/40"
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
