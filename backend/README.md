# Intelligent Patient EHR Backend

Express backend for the Intelligent Patient-Centric EHR and Medication Management System.

## Run in the original Replit workspace

```bash
pnpm --filter @workspace/api-server run dev
```

The API is served under `/api`.

## Main endpoints

- `GET /api/healthz`
- `GET /api/patient/pat-001`
- `GET /api/patient/pat-001?role=doctor`
- `POST /api/patient/pat-001/consent`
- `POST /api/patient/pat-001/medication`
- `POST /api/patient/pat-001/missed-dose`

The backend uses in-memory demo data, so state resets when the server restarts. It does not require a database, authentication service, or external API.
