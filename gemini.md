# Data Schema & Project Constitution

## Overview
This file serves as the definitive source for data boundaries, API payloads, and rigid architectural rules. Coding only begins once the payload shape is confirmed.

## Input Data Schema & Delivery Payload

### 1. Payroll Run Record (PayrollRun)
```json
{
  "id": "string",
  "company": "string",
  "month": "string",
  "employees": "number",
  "totalAmount": "string",
  "status": "draft | approval_in_progress | approved | submitted",
  "lastUpdated": "string"
}
```

### 2. Audit Log Record (AuditLog)
```json
{
  "id": "number",
  "date": "string",
  "user": "string",
  "action": "Data Import | Approved Payroll | Status Change | Initiated Email Approval | Released for Payment | Rejected Payroll",
  "details": "string",
  "entity": "string",
  "month": "string"
}
```

### 3. Data Quality Issue Record (DQIssue)
```json
{
  "id": "string",
  "type": "string",
  "severity": "Critical | High | Medium | Low",
  "employee": "string",
  "entity": "string",
  "description": "string",
  "rule": "string"
}
```

### 4. Organizational Unit Record (OrgUnit)
```json
{
  "id": "number",
  "region": "Americas | EMEA | APAC",
  "country": "string",
  "legalEntity": "string",
  "reportingUnit": "string",
  "active": "boolean"
}
```

### 5. Validation Rule Record (ValidationRule)
```json
{
  "id": "string",
  "field": "string",
  "operator": "string",
  "value": "string",
  "isActive": "boolean"
}
```

## Maintenance Log

**Project Goal**: Deterministic, self-healing automation using B.L.A.S.T protocol.
**Last Updated**: March 2026

### 1. Operations

**Local Development:**
- **System Startup (Backend API + Database)**: `npx cds watch` (Run in root directory)
- **Frontend Startup**: `cd app/frontend && npm run dev`
- **Port Definitions**: Frontend via Vite (`http://localhost:5173`), CAP Backend (`http://localhost:4004`)
- **Local Authentication (Mock Users)**:
  - **Admin**: Username `alice` / Password `<any or blank>` (Role: `PayrollAdmin`)
  - **Viewer**: Username `bob` / Password `<any or blank>` (Role: `PayrollViewer`)

**BTP Cloud Deployment (SAP Cloud Foundry):**
- **Step 1 — BTP Admin Login**: `~/.local/bin/btp login` → server: `https://cli.btp.cloud.sap`
- **Step 2 — CF Runtime Login**: `~/.local/bin/cf login -a https://api.cf.us10-001.hana.ondemand.com --sso`
- **Step 3 — Build Frontend**: `cd app/frontend && npm install && npm run build && rm -rf ../../approuter/public/* && cp -r dist/* ../../approuter/public/`
- **Step 4 — Build MTA Archive**: `npm install mbt && ./node_modules/.bin/mbt build` → outputs `mta_archives/payroll-cockpit_1.0.0.mtar`
- **Step 5 — Deploy to BTP**: `~/.local/bin/cf deploy mta_archives/payroll-cockpit_1.0.0.mtar -f`

**Live BTP URLs (Trial — us10 region):**
- **Frontend**: `https://48784fe5trial-dev-payroll-cockpit.cfapps.us10-001.hana.ondemand.com`
- **CAP API**: `https://48784fe5trial-dev-payroll-cockpit-srv.cfapps.us10-001.hana.ondemand.com`

**Waking Up BTP Trial Environment:**
SAP BTP Trial automatically suspends applications nightly. If the URLs return a 404, restart them:
1. Log into CF: `~/.local/bin/cf login -a https://api.cf.us10-001.hana.ondemand.com --sso`
2. Start Database (HANA Free instance): `~/.local/bin/cf update-service payroll-hana-free -c '{"data":{"serviceStopped":false}}'` (Wait ~5 mins until `cf service payroll-hana-free` shows 'update succeeded')
3. Start API Server: `~/.local/bin/cf start payroll-cockpit-srv`
4. Start Approuter: `~/.local/bin/cf start payroll-cockpit`

*(Note: The database is an SAP HANA Free tier instance mapped as `payroll-hana-free` in CF. It MUST be officially running before deploying (`db-deployer` will fail) or manually starting nodes. The UI uses Vite, so `npm run build` must be run locally first before packaging into the MTA!)*

**CLI Tool Locations** (stored in `~/.local/bin/`, not on system PATH by default):
- `~/.local/bin/btp` — SAP BTP CLI v2.97.0
- `~/.local/bin/cf` — Cloud Foundry CLI v8.18.0 (with MultiApps plugin v3.10.0)

### 2. Architecture Enforcements (A.N.T.)
- **Layer 1 (Architecture)**: All logic and layouts are strictly mapped in `architecture/01_frontend_sops.md`. Any future modifications to component structures or workflows **must** explicitly update this SOP file first.
- **Layer 2 (Navigation)**: Do not mutate React state directly inside UI blocks. All data-driven payloads flow through `frontend/src/store/index.ts` via Zustand. Wait for the `await` completion of store actions before firing a `Toast`.
- **Layer 3 (Tools)**: `api/client.ts` enforces strongly-typed `RequestInit` promises to `http://localhost:3000`. Wait for the Promise array before pushing data. The `tools/verify_link.py` script is available to auto-audit connectivity to SAP SuccessFactors (EC Payroll) mock server.

### 3. Future Implementations (Post-MVP)
- Implement actual `@sap/cloud-sdk-vdm-ec-payroll-service` using the BTP Cloud SDK.
- ~~Switch `backend/prisma/schema.prisma` from SQLite to a real PostgreSQL connection~~ → **DONE**: Migrated to SAP HANA Cloud HDI container via CAP (`@cap-js/hana`). Deployed and running.
- Augment `useAuditStore` with pagination if Historical Log scales beyond MVP scope.
- ~~Enforce full RBAC (Role-Based Access Control) across SAP xsuaa tokens before removing `mock` labels~~ → **DONE (MVP Level)**: XSUAA `PayrollAdmin` / `PayrollViewer` role templates enforced via `xs-security.json` and `@requires` annotations on `PayrollService`.
