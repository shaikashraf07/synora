# Intelligent Patient EHR Backend

An in-memory Express API for consent-controlled patient records, medication safety checks, and adherence risk tracking.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- No database or external API is required; the demo data is intentionally held in memory.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `artifacts/api-server/src/data.ts` — seed patient, interaction table, and hidden-record rules
- `artifacts/api-server/src/logic.ts` — risk, interaction, and hidden-record business logic
- `artifacts/api-server/src/routes/patients.ts` — patient API routes

## Architecture decisions

- The data store is in-memory by design, matching the hackathon PRD and avoiding external network dependencies during demos.
- `riskLevel` is derived from `missedDoses` on every patient response rather than stored as a second source of truth.
- Patient reads default to the full record set; passing `role=doctor` or `role=caregiver` filters out non-consented records server-side.
- Medication safety checks are deterministic and case-insensitive so the frontend can demonstrate both Warfarin/Aspirin and hidden Diabetes/Metformin paths.

## Product

- Serves patient timeline data with consent flags and role-aware visibility.
- Updates per-record consent.
- Adds medications while returning current-medication and hidden-record safety alerts.
- Tracks missed doses and computes Green/Yellow/Red adherence risk.

## User preferences

No additional preferences recorded.

## Gotchas

- State resets whenever the API process restarts because persistence is explicitly out of scope.
- The API is mounted under `/api`, so the patient endpoint is `/api/patient/:id`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
