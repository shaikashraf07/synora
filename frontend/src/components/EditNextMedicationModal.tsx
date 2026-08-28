import { useState } from "react";
import { X, Pill, Clock, Save } from "lucide-react";

export interface ScheduledMedication {
  name: string;
  dose: string;
  time: string;
}

export default function EditNextMedicationModal({
  current,
  onSave,
  onClose,
}: {
  current: ScheduledMedication;
  onSave: (updated: ScheduledMedication) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(current.name);
  const [dose, setDose] = useState(current.dose);
  const [time, setTime] = useState(current.time);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim() || !dose.trim() || !time.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    onSave({
      name: name.trim(),
      dose: dose.trim(),
      time: time.trim(),
    });
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit next scheduled medication"
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md animate-rise-in overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-lift sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-600 text-white shadow-xs">
              <Pill className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Edit Next Scheduled Dose
              </h2>
              <p className="text-xs text-muted-foreground">
                Customize the upcoming dose reminder and administration time.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="space-y-1">
            <label htmlFor="next-med-name" className="block text-xs font-bold text-foreground">
              Medication Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="next-med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metformin, Atorvastatin"
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="next-med-dose" className="block text-xs font-bold text-foreground">
              Dosage <span className="text-rose-500">*</span>
            </label>
            <input
              id="next-med-dose"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="e.g. 500 mg, 10 mg"
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="next-med-time" className="block text-xs font-bold text-foreground">
              Scheduled Time <span className="text-rose-500">*</span>
            </label>
            <input
              id="next-med-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 8:00 PM, 9:00 AM"
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-border/80 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-foreground shadow-xs transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !name.trim() || !dose.trim() || !time.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving…" : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
