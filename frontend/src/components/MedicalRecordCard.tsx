import { Building2, CalendarDays, Lock } from "lucide-react";
import ConsentToggle from "./ConsentToggle";
import type { MedicalRecord } from "../data/mockData";

export function MedicalRecordCard({
  record,
  editable,
  onConsentChange,
  pending,
}: {
  record: MedicalRecord;
  editable: boolean;
  onConsentChange?: ((hospital: string, visible: boolean) => void) | undefined;
  pending?: boolean | undefined;
}) {
  return (
    <article className="surface animate-rise-in p-5 transition-shadow duration-300 hover:shadow-lift">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
          <Building2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold tracking-tight">{record.hospital}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {record.date}
          </p>
          <p className="mt-3 text-sm text-foreground">{record.diagnosis}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        {editable ? (
          <ConsentToggle
            visible={record.visible}
            recordLabel={`${record.hospital}, ${record.date}`}
            disabled={pending}
            onToggle={(next) => onConsentChange?.(record.hospital, next)}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {record.visible ? "Visible to doctors" : "Private"}
          </p>
        )}
      </div>
    </article>
  );
}

export function PrivateRecordCard({ hospital }: { hospital: string }) {
  return (
    <article className="animate-rise-in rounded-xl border border-dashed border-warning/50 bg-warning-soft/60 p-5">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-warning/40 bg-card text-warning-foreground">
          <Lock className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-warning-foreground">
            Private medical record
          </h3>
          <p className="mt-1 text-sm text-warning-foreground/80">
            Access not granted by patient.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Source: {hospital}</p>
        </div>
      </div>
    </article>
  );
}
