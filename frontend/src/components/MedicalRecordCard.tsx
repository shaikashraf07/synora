import { Building2, CalendarDays, Lock, Unlock, ShieldCheck, CheckCircle2, Edit3, Trash2 } from "lucide-react";
import ConsentToggle from "./ConsentToggle";
import type { MedicalRecord } from "../data/mockData";

export function MedicalRecordCard({
  record,
  editable,
  onConsentChange,
  onEdit,
  pending,
}: {
  record: MedicalRecord;
  editable: boolean;
  onConsentChange?: ((hospital: string, visible: boolean) => void) | undefined;
  onEdit?: ((record: MedicalRecord) => void) | undefined;
  pending?: boolean | undefined;
}) {
  return (
    <article
      className={`animate-rise-in surface relative overflow-hidden p-5 transition-all duration-300 hover:shadow-lift ${
        record.visible ? "border-teal-500/30" : "border-amber-400/30 bg-amber-50/20"
      }`}
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-semibold shadow-xs ${
              record.visible
                ? "bg-teal-50 text-teal-700 border border-teal-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold tracking-tight text-foreground">
                {record.hospital}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                <CalendarDays className="h-3 w-3" />
                {record.date}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Diagnosis:
              </span>
              <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                {record.diagnosis}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {editable && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(record)}
              title="Edit hospital record"
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-slate-50 active:scale-95"
            >
              <Edit3 className="h-3 w-3 text-teal-600" />
              Edit
            </button>
          )}

          <span
            className={`hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
              record.visible
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {record.visible ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Consented
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 text-amber-600" /> Private
              </>
            )}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-border/80 pt-3.5">
        {editable ? (
          <ConsentToggle
            visible={record.visible}
            recordLabel={`${record.hospital}, ${record.date}`}
            disabled={pending}
            onToggle={(next) => onConsentChange?.(record.hospital, next)}
          />
        ) : (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <Unlock className="h-3.5 w-3.5" /> Doctor access authorized by patient
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">Status: Verified</span>
          </div>
        )}
      </div>
    </article>
  );
}

export function PrivateRecordCard({
  hospital,
  onRequestConsent,
}: {
  hospital: string;
  onRequestConsent?: () => void;
}) {
  return (
    <article className="animate-rise-in relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/40 p-5 shadow-xs transition-all">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-300 bg-white text-amber-700 shadow-xs">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-amber-950">
                Encrypted Medical Record
              </h3>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Access Restricted
              </span>
            </div>
            <p className="text-xs font-medium text-amber-900/80">
              The patient has marked this hospital record as private. Clinical details and diagnosis are concealed.
            </p>
            <p className="pt-1 font-mono text-[11px] text-amber-800/70">
              Origin Institution: <span className="font-semibold text-amber-950">{hospital}</span>
            </p>
          </div>
        </div>

        {onRequestConsent && (
          <button
            type="button"
            onClick={onRequestConsent}
            className="shrink-0 rounded-xl border border-amber-400 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-xs transition-all hover:bg-amber-100 active:scale-95"
          >
            Request Access
          </button>
        )}
      </div>
    </article>
  );
}
