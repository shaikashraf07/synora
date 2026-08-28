import { useState } from "react";
import { X, User, Save, ShieldCheck, HeartHandshake } from "lucide-react";
import type { Patient } from "../data/mockData";

interface ProfileDraft {
  name: string;
  age: string;
  gender: string;
  caregiverName: string;
  caregiverRelation: string;
}

export default function ProfileEditModal({
  patient,
  onSave,
  onClose,
}: {
  patient: Patient;
  onSave: (updates: Partial<Patient>) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ProfileDraft>({
    name: patient.name,
    age: String(patient.age),
    gender: patient.gender,
    caregiverName: patient.caregiver.name,
    caregiverRelation: patient.caregiver.relation,
  });
  const [saving, setSaving] = useState(false);

  function update(field: keyof ProfileDraft, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    const name = draft.name.trim();
    const age = parseInt(draft.age, 10);
    if (!name) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 250));
    onSave({
      name,
      age: isNaN(age) ? patient.age : age,
      gender: draft.gender.trim() || patient.gender,
      caregiver: {
        name: draft.caregiverName.trim() || patient.caregiver.name,
        relation: draft.caregiverRelation.trim() || patient.caregiver.relation,
      },
    });
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit patient profile"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div className="relative z-10 w-full max-w-lg animate-rise-in overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-lift sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-600 text-white shadow-xs">
              <User className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Edit Patient Profile
              </h2>
              <p className="text-xs text-muted-foreground">
                Update patient demographics and designated caregiver details.
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

        <div className="mt-5 space-y-5">
          {/* Patient Details */}
          <div className="space-y-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              Patient Demographics
            </span>

            <Field
              id="profile-name"
              label="Full Name"
              value={draft.name}
              onChange={(v) => update("name", v)}
              placeholder="e.g. Ananya Rao"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                id="profile-age"
                label="Age (Years)"
                value={draft.age}
                onChange={(v) => update("age", v)}
                placeholder="46"
                type="number"
              />
              <div className="space-y-1">
                <label
                  htmlFor="profile-gender"
                  className="block text-xs font-bold text-foreground"
                >
                  Gender
                </label>
                <select
                  id="profile-gender"
                  value={draft.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Caregiver Details */}
          <div className="space-y-3 border-t border-border/80 pt-4">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <HeartHandshake className="h-3.5 w-3.5 text-teal-600" />
              Designated Caregiver
            </span>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                id="profile-caregiver-name"
                label="Caregiver Name"
                value={draft.caregiverName}
                onChange={(v) => update("caregiverName", v)}
                placeholder="e.g. Rahul Rao"
              />
              <Field
                id="profile-caregiver-relation"
                label="Relationship"
                value={draft.caregiverRelation}
                onChange={(v) => update("caregiverRelation", v)}
                placeholder="e.g. Son, Spouse, Sister"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 border-t border-border/80 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-bold text-foreground shadow-xs transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !draft.name.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {saving ? "Saving Changes…" : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-bold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
      />
    </div>
  );
}
