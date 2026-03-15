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
- **System Startup (Backend API + Database)**: `npx cds watch` (Run in root directory)
- **Frontend Startup**: `cd app/frontend && npm run dev`
- **Port Definitions**: Frontend via Vite (`http://localhost:5173`), CAP Backend (`http://localhost:4004`)

### 2. Architecture Enforcements (A.N.T.)
- **Layer 1 (Architecture)**: All logic and layouts are strictly mapped in `architecture/01_frontend_sops.md`. Any future modifications to component structures or workflows **must** explicitly update this SOP file first.
- **Layer 2 (Navigation)**: Do not mutate React state directly inside UI blocks. All data-driven payloads flow through `frontend/src/store/index.ts` via Zustand. Wait for the `await` completion of store actions before firing a `Toast`.
- **Layer 3 (Tools)**: `api/client.ts` enforces strongly-typed `RequestInit` promises to `http://localhost:3000`. Wait for the Promise array before pushing data. The `tools/verify_link.py` script is available to auto-audit connectivity to SAP SuccessFactors (EC Payroll) mock server.

### 3. Future Implementations (Post-MVP)
- Implement actual `@sap/cloud-sdk-vdm-ec-payroll-service` using the BTP Cloud SDK.
- Switch `backend/prisma/schema.prisma` from SQLite to a real PostgreSQL connection (`.env` keys required) for enterprise deployment.
- Augment `useAuditStore` with pagination if Historical Log scales beyond MVP scope.
- Enforce full RBAC (Role-Based Access Control) across SAP xsuaa tokens before removing `mock` labels.
