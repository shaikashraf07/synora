# Product Requirements Document (PRD)
## Intelligent Patient-Centric Electronic Health Record & Medication Management System

**Version:** 1.0
**Prepared for:** Hackathon build (5-hour scope), React + Node/Express
**Purpose of this document:** Feed directly into an AI coding assistant (Claude Code, Cursor, etc.) to scaffold and build frontend + backend.

---

## 1. Overview

### 1.1 Problem Statement
Patient medical records in India are fragmented across hospitals, clinics, and pharmacies with no interoperability. This causes duplicate diagnostic tests, dangerous drug interactions from incomplete medication visibility, and poor medication adherence — particularly among elderly and chronic-disease patients. This system unifies a patient's medical history under patient-controlled consent, and adds an intelligence layer that actively manages medication safety rather than passively storing records.

### 1.2 Goals
- G1: Give patients a single, consent-controlled view of their medical records across multiple providers.
- G2: Give doctors interaction-aware medication prescribing, limited strictly to consented records.
- G3: Proactively surface medication adherence risk and caregiver visibility for dependents.

### 1.3 Non-Goals (explicitly out of scope for this build)
- Real ABDM/ABHA production integration or certification
- Real authentication/OAuth (mock login only)
- Live third-party drug APIs (RxNorm/openFDA) — uses a static, hardcoded interaction dataset
- Real push notifications / SMS — in-app UI indicators only
- OCR / prescription image parsing
- Persistent database — in-memory data store only

---

## 2. User Roles & Personas

| Role | Description | Primary Goal |
|---|---|---|
| **Patient** | End user, owns their records | Control who sees their data; track medications |
| **Doctor** | Views consented records, prescribes medication | See relevant history; get warned before prescribing unsafely |
| **Caregiver** | Linked to a patient (e.g., adult child of elderly parent) | Monitor adherence; get alerted on risk |

No real login system — role is selected via a UI toggle (`Patient View` / `Doctor View` / `Caregiver View`). This is a deliberate scope decision (see 1.3).

---

## 3. Functional Requirements

### FR1 — Unified Patient Timeline
- Display all of a patient's records (hospital, date, diagnosis) in one chronological list.
- Each record has a `visible` boolean controlling doctor-side access.
- **Acceptance criteria:**
  - Patient View shows ALL records regardless of `visible` state, with a clear ON/OFF consent toggle per record.
  - Doctor View shows only records where `visible === true`. Hidden records render as a locked placeholder row: `🔒 1 record hidden — access not granted`.

### FR2 — Consent Management
- Patient can toggle `visible` on/off per record at any time.
- **Acceptance criteria:**
  - Toggling updates state immediately (optimistic UI) and persists via `POST /patient/:id/consent`.
  - Doctor View re-filters immediately on next fetch/refresh.

### FR3 — Add Medication with Interaction Check
- Doctor (or patient, self-reported) can add a new medication to the patient's active medication list.
- System checks the new drug against:
  a) the patient's current medication list, using a static interaction lookup table
  b) the patient's **hidden** (non-visible) records, for conditions relevant to the new drug (cross-record awareness)
- **Acceptance criteria:**
  - If (a) matches → red alert banner shown with the specific risk description.
  - If (b) matches → amber alert banned shown, recommending the doctor request consent, referencing which hospital holds the relevant record.
  - If neither matches → medication is added silently with a success confirmation.

### FR4 — Adherence Risk Scoring
- Track a `missedDoses` counter per patient.
- Compute a risk level: `<3 = Green`, `3–5 = Yellow`, `>5 = Red`.
- **Acceptance criteria:**
  - Risk badge visible on all three role views.
  - A "Mark dose missed" action (demo trigger) increments the counter and recalculates risk level live, no page reload.

### FR5 — Caregiver View
- Each patient has one linked caregiver (name + relation).
- Caregiver View shows: patient name, current risk badge, medication list, and a "Notify caregiver" alert box that appears automatically when risk level is Red.
- **Acceptance criteria:**
  - Caregiver View is read-only (no editing capability).
  - Alert box only renders conditionally when risk = Red.

---

## 4. Data Model

```ts
interface MedicalRecord {
  hospital: string;
  date: string;       // ISO format
  diagnosis: string;
  visible: boolean;    // patient consent flag
}

interface Caregiver {
  name: string;
  relation: string;
}

interface Patient {
  id: string;
  name: string;
  records: MedicalRecord[];
  medications: string[];
  missedDoses: number;
  caregiver: Caregiver;
}

interface DrugInteraction {
  pair: [string, string];
  risk: string;   // human-readable description
}
```

### Seed Data Requirement
Seed at least **one patient** with:
- 2–3 records from different hospitals, at least one with `visible: false`
- 2 existing medications, including one that will produce a positive interaction match during the demo (e.g., seed `"Warfarin"` if the demo will add `"Aspirin"`)
- A caregiver object
- `missedDoses` starting at a low number (e.g., 1) so the Yellow/Red transition can be demoed live

---

## 5. API Specification

Base URL: `http://localhost:5000`

| Method | Route | Body | Response |
|---|---|---|---|
| `GET` | `/patient/:id` | — | Full `Patient` object |
| `POST` | `/patient/:id/consent` | `{ hospital: string, visible: boolean }` | `{ success: true }` |
| `POST` | `/patient/:id/medication` | `{ drug: string }` | `{ added: string, interactionAlert: string \| null, hiddenRecordAlert: string \| null }` |
| `POST` | `/patient/:id/missed-dose` | — | `{ missedDoses: number, riskLevel: "Green" \| "Yellow" \| "Red" }` |

### Business Logic Notes
- `riskLevel` is computed server-side from `missedDoses`, not stored redundantly — single source of truth.
- Interaction check logic must check **both directions** of a pair (`["Warfarin","Aspirin"]` should match whether Warfarin or Aspirin is the newly-added drug).
- Hidden-record check is a simple keyword match between `diagnosis` and the added `drug` (e.g., "Diabetes" + "Metformin") — implemented as a small static rule set, not NLP.

---

## 6. Frontend Requirements

### 6.1 Tech Stack
- React (Vite recommended for fast setup over CRA)
- No React Router — use `useState` for tab/role switching to minimize setup time
- Plain CSS or a single stylesheet — no UI framework installs

### 6.2 Screens

**Global:** Role selector (Patient / Doctor / Caregiver) always visible at the top.

1. **Timeline Screen**
   - Role-aware rendering (see FR1)
   - Risk badge (color-coded) pinned at top
   - Consent toggle switches (Patient View only)

2. **Add Medication Screen** (Doctor View only)
   - Text input + Add button
   - Alert banners: red (interaction), amber (hidden-record)
   - List of current medications below the form

3. **Caregiver Screen** (Caregiver View only)
   - Patient summary card
   - Risk badge
   - "Mark dose missed" button (demo control)
   - Conditional red alert box when risk = Red

### 6.3 Component Structure (suggested)
```
src/
  App.jsx                 // role state, tab state, top-level layout
  components/
    RoleSelector.jsx
    RiskBadge.jsx
    TimelineScreen.jsx
    AddMedicationScreen.jsx
    CaregiverScreen.jsx
    RecordRow.jsx
    AlertBanner.jsx
  api.js                  // fetch wrapper functions for all 4 routes
```

---

## 7. Backend Requirements

### 7.1 Tech Stack
- Node.js + Express
- `cors` and `express.json()` middleware
- In-memory JS object as the data store (no database setup)

### 7.2 File Structure (suggested)
```
server/
  server.js         // Express app + route registration
  data.js           // seed patients object + interactions table
  logic.js          // riskLevel(), interaction-matching, hidden-record-matching functions
```

### 7.3 Key Functions to Implement
```js
function riskLevel(missedDoses) { /* returns "Green" | "Yellow" | "Red" */ }
function checkInteraction(newDrug, currentMeds, interactionTable) { /* returns string | null */ }
function checkHiddenRecordRelevance(newDrug, records) { /* returns string | null */ }
```

---

## 8. Non-Functional Requirements

- **Performance:** All responses must return in <200ms (in-memory data, no external calls — trivially achievable).
- **Reliability for demo:** Zero dependency on external network calls during live demo — this is a hard constraint, not a suggestion.
- **Code clarity:** Favor readable, demo-explainable code over premature optimization — judges may ask to see the code.

---

## 9. Build Sequence for AI-Assisted Development

Recommended order to prompt your AI coding assistant in:

1. Scaffold Express server with the 4 routes returning static/mock responses.
2. Implement `data.js` seed data exactly per Section 4's seed data requirement.
3. Implement `logic.js` functions (risk, interaction, hidden-record) with the acceptance criteria from Section 3 as test cases.
4. Wire routes to use `logic.js` functions.
5. Scaffold React app with role selector + tab switching shell (no data yet, static UI).
6. Implement `api.js` fetch functions matching Section 5 exactly.
7. Build Timeline screen, wire to `GET /patient/:id`, implement role-based filtering.
8. Build Add Medication screen, wire to `POST /patient/:id/medication`, implement alert banners.
9. Build Caregiver screen, wire to `POST /patient/:id/missed-dose`.
10. End-to-end test the full demo path from Section 8 of the solution plan (Aspirin/Warfarin interaction → Metformin hidden-record alert → missed-dose risk escalation).

---

## 10. Out-of-Scope / Future Roadmap (mention if asked, do not build)

- ABDM/ABHA sandbox integration (HIP/HIU registration flow)
- FHIR R4-compliant data storage
- Live RxNorm/openFDA interaction checking with clinical severity tiers
- OCR-based prescription digitization
- Real push notification / SMS delivery
- Persistent database (Postgres/Mongo) and real authentication
