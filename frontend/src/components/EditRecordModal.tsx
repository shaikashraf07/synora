import { useState, useEffect } from "react";
import { X, Building2, Calendar, FileText, Save, Trash2, ShieldCheck, Lock, Unlock } from "lucide-react";
import type { MedicalRecord } from "../data/mockData";

export default function EditRecordModal({
  record,
  isNew = false,
  onSave,
  onDelete,
  onClose,
}: {
  record?: MedicalRecord | undefined;
  isNew?: boolean;
  onSave: (record: MedicalRecord, originalHospital?: string) => void;
  onDelete?: (hospital: string) => void;
  onClose: () => void;
}) {
  const [hospital, setHospital] = useState(record?.hospital ?? "");
  const [date, setDate] = useState(record?.date ?? new Date().toISOString().split("T")[0]);
  const [diagnosis, setDiagnosis] = useState(record?.diagnosis ?? "");
  const [visible, setVisible] = useState(record?.visible ?? true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setHospital(record.hospital);
      setDate(record.date);
      setDiagnosis(record.diagnosis);
      setVisible(record.visible);
    }
  }, [record]);

  async function handleSave() {
    if (!hospital.trim() || !diagnosis.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    onSave(
      {
        hospital: hospital.trim(),
        date: date.trim(),
        diagnosis: diagnosis.trim(),
        visible,
      },
      record?.hospital,
    );
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? "Add medical record" : "Edit medical record"}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md animate-rise-in overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-lift sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-600 text-white shadow-xs">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isNew ? "Add Hospital Record" : "Edit Medical Record"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isNew
                  ? "Record a new hospital visit or clinical encounter."
                  : "Update hospital details, diagnosis, or consent status."}
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
            <label htmlFor="record-hospital" className="block text-xs font-bold text-foreground">
              Hospital / Clinic Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="record-hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="e.g. Max Super Specialty Hospital"
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="record-date" className="block text-xs font-bold text-foreground">
              Encounter Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="record-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. Aug 14, 2026 or 2026-08-14"
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="record-diagnosis" className="block text-xs font-bold text-foreground">
              Diagnosis / Clinical Findings <span className="text-rose-500">*</span>
            </label>
            <input
              id="record-diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Type 2 Diabetes, Hypertension"
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="rounded-2xl border border-border/80 bg-slate-50/70 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {visible ? (
                  <Unlock className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Lock className="h-4 w-4 text-amber-600" />
                )}
                <div>
                  <span className="block text-xs font-bold text-foreground">Doctor Access</span>
                  <span className="text-[11px] text-muted-foreground">
                    {visible ? "Visible to clinicians" : "Encrypted & Private"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  visible ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    visible ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/80 pt-4">
          {!isNew && onDelete && record ? (
            <button
              type="button"
              onClick={() => {
                onDelete(record.hospital);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
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
              disabled={saving || !hospital.trim() || !diagnosis.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : isNew ? "Add Record" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
