# SAP BTP & CAP Migration Plan

## Objective
Migrate the existing **Payroll Cockpit** (currently running on Node.js/Express, Prisma SQLite, and React/Vite) into an enterprise-ready **SAP Cloud Application Programming Model (CAP)** architecture deployed on the **SAP Business Technology Platform (SAP BTP)**.

We will systematically replace the Prisma ORM and Express routers with **Core Data Services (CDS)**, and transition the local persistence to **SAP HANA Cloud**. The React frontend will be served via the **SAP Approuter**.

---

## Phase 1: CAP Foundation & Workspace Initialization
**Goal:** Restructure the project to align with SAP CAP standards.

1. **Initialize CAP Project:**
   - Run `cds init` in the root (or create a new parallel folder) to generate the standard CAP scaffold (`app/`, `srv/`, `db/`).
   - Add necessary SAP modules: `npm install @sap/cds express` and `npm install -D sqlite3`.
2. **Restructure Directories:**
   - Map the current `backend` logic into the CAP `srv/` and `db/` folders.
   - Move the current Vite React `frontend` into the CAP `app/` folder.
3. **Configure the Approuter:**
   - Create an `approuter` module to serve as the single entry point.
   - Configure `xs-app.json` to define routing:
     - `/api/*` -> Routes to the CAP Node.js Service (srv).
     - `/*` -> Serves the static assets of the Vite React Frontend.

---

## Phase 2: Data Modeling Migration (Prisma to CDS)
**Goal:** Translate your `schema.prisma` definitions into SAP CDS DSL (`schema.cds`).

1. **Define the Namespace and Entities:**
   - Create `db/schema.cds` with namespace e.g., `sappro.payroll`.
2. **Revise Data Model:**
   - Adapt current custom entities to align with the **SAP Standard Data Model** (e.g., formatting to map cleanly to SuccessFactors Employee Central VDM entities or SAP Master Data types).
3. **Translate Models:**
   - **PayrollRun**: Map `id`, `company`, `month`, `employees`, `totalAmount`, `status`, `lastUpdated`. 
   - **AuditLog**: Map ID (as auto-incremented or UUID `cds.UUID`), date, user, action, etc.
   - **DQIssue**: Map ID, severity, rule, etc.
   - **OrgUnit**: Map hierarchical data.
4. **Seed Data Migration:**
   - Convert the Prisma `seed.ts` logic into standard CAP CSV files located in `db/data/` (e.g., `sappro.payroll-PayrollRun.csv`), which CAP auto-deploys via `cds deploy`.

---

## Phase 3: Service Layer Migration (Express to CAP OData)
**Goal:** Replace manual Express.js REST endpoints with CAP Service Definitions.

1. **Define Services (`srv/service.cds`):**
   - Expose the CDS entities as a service, for example: `PayrollService`.
   - Leverage CAP's built-in rapid prototyping (automatic CRUD generation) to replace the boilerplate Express GET/POST routes.
2. **Custom Handlers (`srv/service.js` or `.ts`):**
   - Migrate complex backend business logic (like the `action` logic that parses `approve`, `reject`, and auto-generates an Audit Log) into CAP event handlers (`srv.on('UPDATE', 'PayrollRun', (req) => {...})` or custom bound actions).
3. **OData vs REST:**
   - Optionally expose endpoints as plain REST via `@rest` annotations, or upgrade the React frontend to consume the vastly superior OData v4 payloads natively provided by CAP.

---

## Phase 4: BTP Cloud Environment & Persistence Configuration
**Goal:** Prepare the local CAP app for BTP Cloud Deployment.

1. **Replace SQLite with SAP HANA Cloud:**
   - Add `npm install @cap-js/hana`.
   - Provision an SAP HANA Cloud HDI container instance in your BTP subaccount.
   - Configure `.cdsrc.json` to use HANA for production and SQLite for local development (`cds watch`).
2. **Destination & Cloud SDK Integration (Future-proofing):**
   - Provision an instance of the Destination Service in BTP.
   - Ensure the app is ready to inject the BTP Cloud SDK to eventually replace the mock payroll datasets with actual calls to the `EC Payroll` SuccessFactors APIs.

---

## Phase 5: Security & Deployment (MTA)
**Goal:** Secure the application with XSUAA and deploy it as a Multi-Target Application.

1. **Integrate SAP XSUAA (Authentication/Authorization):**
   - Define roles (e.g., `PayrollAdmin`, `PayrollViewer`) inside `xs-security.json`.
   - Annotate the CDS logic with `@requires: 'PayrollAdmin'`.
   - Upgrade the React frontend to handle JWT tokens and Approuter login flow.
2. **Build the MTA (`mta.yaml`):**
   - Create the `mta.yaml` file natively orchestrating the deployment of:
     - The Approuter.
     - The CAP Node.js API Service.
     - The HANA Deployer (HDI container).
     - The XSUAA service.
3. **MTA Build & Cloud Foundry Push:**
   - Build the `.mtar` archive using the Cloud MTA Build Tool (`mbt build`).
   - Run `cf deploy` mapping the application onto your SAP BTP Cloud Foundry space.

### Coworking Next Steps
All 5 Phases are now **COMPLETE**. The application is live on SAP BTP. Next steps are post-MVP enhancements listed in `gemini.md`.

---

## Phase 5 Completion — BTP Cloud Deployment (Executed: March 15, 2026)

### Pre-Requisites Installed
| Tool | Version | Install Method |
| :--- | :--- | :--- |
| `btp` CLI | v2.97.0 | Manual download from `tools.hana.ondemand.com` → moved to `~/.local/bin/btp` |
| `cf` CLI | v8.18.0 | Downloaded from `packages.cloudfoundry.org` → moved to `~/.local/bin/cf` |
| MultiApps CF Plugin | v3.10.0 | `cf install-plugin multiapps -r CF-Community -f` |

> **PATH Note**: Both `btp` and `cf` are in `~/.local/bin/`. Run `sudo sh -c 'echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> ~/.zshrc' && source ~/.zshrc` to make them globally accessible.

---

### Step-by-Step Deployment Procedure

#### 1. Log into BTP CLI
```bash
~/.local/bin/btp login
# CLI server URL: https://cli.btp.cloud.sap
# User: jianfeng.zhang2@zf.com
# Current target: 48784fe5trial (global account)
# Subaccount ID: 8d704fd7-47ee-4e7c-8726-7b32a2039dfe
```

#### 2. Log into Cloud Foundry (Application Runtime)
```bash
~/.local/bin/cf login -a https://api.cf.us10-001.hana.ondemand.com --sso
# Select Org: 48784fe5trial
# Select Space: dev
```

#### 3. Build the MTA Archive
```bash
npx mbt build
# Output: mta_archives/payroll-cockpit_1.0.0.mtar
```

#### 4. Deploy to BTP Cloud Foundry
```bash
~/.local/bin/cf deploy mta_archives/payroll-cockpit_1.0.0.mtar
```

---

### Errors Encountered & Root Causes

#### Error 1 — `hdi-shared` Service Failed to Create
- **Symptom**: `Couldn't create an instance of service 'SAP HANA Schemas & HDI Containers' with plan 'hdi-shared'`
- **Root Cause**: No running SAP HANA Cloud instance existed in the `dev` space. The entitlement (`hana: hdi-shared`) was already assigned, but the physical database was never provisioned.
- **Fix**: Manually created an SAP HANA Cloud Database instance via BTP Cockpit → Subaccount → Space → SAP HANA Cloud → Create (plan: `hana-free`). Waited ~10 minutes for status to turn green.

#### Error 2 — `payroll-cockpit-srv` Crash Loop (`npm error Missing script: "start"`)
- **Symptom**: App deployed but immediately crashed on every start attempt with `npm error Missing script: "start"`.
- **Root Cause**: The root `package.json` had no `"scripts"` section. Cloud Foundry always boots Node.js apps by running `npm start`, which requires a `start` script.
- **Fix**: Added the following to `package.json`:
  ```json
  "scripts": {
    "start": "cds-serve"
  }
  ```
  Then rebuilt the archive with `npx mbt build` and redeployed.

---

### Live Deployment URLs (Production — BTP Trial)

| Module | URL |
| :--- | :--- |
| **Frontend (Approuter)** | `https://48784fe5trial-dev-payroll-cockpit.cfapps.us10-001.hana.ondemand.com` |
| **CAP API (srv)** | `https://48784fe5trial-dev-payroll-cockpit-srv.cfapps.us10-001.hana.ondemand.com` |

### Active BTP Services
| Service Name | Type | Plan |
| :--- | :--- | :--- |
| `payroll-cockpit-auth` | XSUAA | application |
| `payroll-cockpit-db` | HANA HDI Container | hdi-shared |
| `payroll-cockpit-destination` | Destination Service | lite |

