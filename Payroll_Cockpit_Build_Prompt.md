# Payroll Cockpit — Full Build Prompt for Antigravity

## Project Overview

Build **"Your Payroll Cockpit"** — a centralized, enterprise-grade web application for global payroll governance. It is a SAP BTP Extension that connects to SAP SuccessFactors Employee Central (EC) Payroll. The app enables payroll managers to validate data quality, manage approval workflows, maintain an audit trail, and administer organizational hierarchy — all in one interface.

The target user is a **Global Payroll Admin** (e.g., "Jane Doe") managing payroll runs across multiple legal entities in regions including Americas, EMEA, and APAC.

---

## 1. UI Design Specifications

### 1.1 Visual Language

- **Theme:** Dark sidebar + light main content. Professional enterprise SaaS aesthetic.
- **Sidebar background:** `#0f1623` (near-black navy)
- **Main content background:** `#f5f7fa` (off-white)
- **Card/panel background:** `#ffffff`
- **Primary accent (interactive):** `#2563eb` (blue)
- **Success/approved:** `#16a34a` (green)
- **Warning/in-progress:** `#f97316` (orange)
- **Danger/critical:** `#dc2626` (red)
- **Neutral/terminal:** `#6b7280` (grey)
- **Typography:** Use a clean, modern sans-serif (e.g., `DM Sans` or `Plus Jakarta Sans`) — NOT Inter or Arial.
- **Border radius:** 8px on cards/panels, 6px on buttons and inputs
- **Shadows:** Subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` on cards

### 1.2 Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│ [Sidebar 260px]  │  [Main Content Area — flexible]       │
│                  │  ┌─────────────────────────────────┐  │
│  🔷 Logo          │  │ Top Header (breadcrumb + badge)  │  │
│  ─────────────   │  └─────────────────────────────────┘  │
│  📊 Approval Dash │  │                                    │
│  🕐 Historical Log │  │  Page Content                     │
│  🛡 Data Governance│  │                                    │
│  ⚙️ Configuration │  │                                    │
│                  │  └─────────────────────────────────┘  │
│  [User Avatar]   │                                        │
└──────────────────────────────────────────────────────────┘
```

**Sidebar:**
- App branding at top: bold app name + "SAP BTP EXTENSION" subtitle in muted smaller text
- Navigation items with icon + label. Active item has blue highlight pill + right chevron
- Bottom: user avatar circle (initials) + name + role label

**Top Header:**
- Left: Breadcrumb (`Your Payroll Cockpit > [Module Name]`)
- Right: Green pulsing dot + "Connected to EC Payroll" status chip

---

## 2. Core Modules & Features

### Module 1 — Payroll Approval Dashboard (`/dashboard`)

**Purpose:** Primary landing page. Shows all payroll runs for a given period.

**UI Elements:**
- Page title: "Payroll Approval Dashboard" + subtitle: "Track and manage payroll approvals across all entities."
- Top-right: Period filter dropdown (options: rolling 9 months — e.g., July 2025 → March 2026). Default: current month.

**KPI Summary Cards (4 cards, horizontal row):**

| Card | Icon | Color | Count | Label |
|------|------|-------|-------|-------|
| Draft & data quality check | Clock/info icon | Blue | Dynamic | "Draft & data quality check" |
| Approval in progress | Refresh/cycle icon | Orange | Dynamic | "Approval in progress" |
| Payroll approved | Checkmark icon | Green | Dynamic | "Payroll approved" |
| Submission of payment | Database icon | Grey | Dynamic | "Submission of payment" |

Card counts are derived from the current data for the selected period.

**Entity Approval Status Table:**
- Search input: "Search entity..." (filters by company name, client-side)
- Columns: `RUN ID` (blue link), `COMPANY` (with building icon), `EMPLOYEES`, `TOTAL AMOUNT`, `STATUS` (color-coded badge), `ACTIONS` (contextual button)

**Status Badges:**
- `Draft & data quality check` → Blue pill
- `Approval in progress` → Orange pill with refresh icon
- `Payroll approved` → Green pill with checkmark icon
- `Submission of payment` → Grey pill

**Actions Column (context-sensitive):**
- Draft → `Req. Approval` button (email icon, blue)
- Approval in progress → `Force Approve` button (checkmark, orange)
- Payroll approved → `Release for Payment` button (green)
- Submission of payment → `View Details` only

**In-Page Approval Modal (triggered by any action button):**
Opens a right-side drawer or centered modal with:
- Header: Company name, Run ID, last updated timestamp, status badge
- KPI row (4 metrics): Headcount | Total Payout | MoM Variance (%) | Data Quality Issues
- Financial Summary table:
  - Rows: Base Salary, Overtime & Bonuses, Employer Taxes, Benefits & Contributions, **Total Run Value** (bold)
- Reviewer Comments: `<textarea>` labeled "Audit notes / justification"
- Footer action buttons: Primary (advance status) + Secondary (reject/cancel)

---

### Module 2 — Historical Approval Log (`/history`)

**Purpose:** Immutable audit trail for compliance. Read-only.

**UI Elements:**
- Page title: "Historical Approval Log" + subtitle: "Immutable record of all payroll actions for audit and compliance."
- Top toolbar: `Filter` button (popover) + `Export CSV` button

**Filter Popover:**
- Period dropdown (month selector)
- Entity dropdown (legal entity name)
- "Clear Filters" link

**Audit Table (columns):**
| Column | Notes |
|--------|-------|
| TIMESTAMP | `YYYY-MM-DD HH:MM AM/PM` format |
| USER / SYSTEM | Email or system ID (e.g., `system_ec_sync`) |
| ENTITY & PERIOD | Company name (bold) + period below it |
| ACTION TYPE | Pill/badge (e.g., `Data Import`, `Approved Payroll`, `Status Change`, `Initiated Email Approval`) |
| DETAILS | Full-sentence narrative |

No row actions. Rows are sortable by Timestamp (default: most recent first).

---

### Module 3 — Data Quality Governance (`/governance`)

**Purpose:** Detect and surface payroll anomalies from EC Payroll before approval.

**UI Elements:**
- Page title: "Data Quality Governance" + subtitle: "Validate and govern payroll results exported from EC Payroll system."
- Top-right action: `🔄 Sync from EC Payroll` button (blue, prominent)

**KPI Cards (3):**
| Metric | Color | Example |
|--------|-------|---------|
| Overall Data Quality | Green | 98.5% |
| Active Anomalies | Orange | 3 |
| Validation Rules Active | Blue | 12 |

**Detected Data Anomalies Table:**
- Section title with orange warning icon: "Detected Data Anomalies"
- Columns: `ISSUE ID`, `SEVERITY`, `TYPE`, `ENTITY / EMP`, `DESCRIPTION`

**Severity Badges:**
- `Critical` → Red outlined pill
- `High` → Orange outlined pill
- `Medium` → Yellow outlined pill
- `Low` → Grey outlined pill

**Sample data:**
```
DQ-101 | High     | Missing Bank Details | Acme EMEA / E10452      | IBAN missing for new hire
DQ-102 | Critical | Negative Net Pay     | Global Tech Corp / E09381 | Deductions exceed gross pay
DQ-103 | Medium   | Unusual Overtime     | Acme APAC / E11200      | Overtime > 50% of standard hours
```

---

### Module 4 — Configuration Console (`/config`)

**Purpose:** Admin screen to manage organizational hierarchy (Region > Country > Legal Entity > Reporting Unit).

**UI Elements:**
- Page title: "Configuration Console" + subtitle: "Manage organizational hierarchy and structural setup."
- Top-right: `+ Add Org Unit` button (dark/black, prominent)

**Filters Row:**
- `FILTER BY REGION` — dropdown (All Regions, Americas, EMEA, APAC)
- `SEARCH LEGAL ENTITY` — text input with placeholder "Type to search..."

**Org Unit Table (columns):**
`REGION` | `COUNTRY` | `LEGAL ENTITY` (with building icon) | `REPORTING UNIT` | `ACTIONS`

**Actions per row:** `Edit` (blue link) | `Deactivate` (red link)

**Add / Edit Org Unit Modal:**
- Fields: Region (dropdown), Country (text input), Legal Entity (text input), Reporting Unit (text input)
- Validation: all fields required before Save is enabled
- Buttons: `Save` (primary) + `Cancel`

---

## 3. Workflow & State Transitions

Payroll runs follow a strict linear state machine:

```
[Draft & data quality check]
        ↓  "Req. Approval" 
[Approval in progress]
        ↓  "Force Approve" / "Approve Payroll"     ↺ "Reject/Re-run" → back to Draft
[Payroll approved]
        ↓  "Release for Payment"
[Submission of payment]  ← Terminal state (View Only)
```

**Every state transition must:**
1. Update the status badge in the dashboard table immediately (optimistic UI)
2. Append a new entry to the Historical Audit Log with: timestamp, user email, entity, action type, and details narrative
3. Close the modal and show a brief toast notification confirming the action

---

## 4. Data Models

### `PayrollRun`
```typescript
{
  id: string;          // "PAY-001"
  company: string;     // "Global Tech Corp"
  month: string;       // "February 2026"
  employees: number;   // 1250
  totalAmount: string; // "$5,240,000"
  status: "draft" | "approval_in_progress" | "approved" | "submitted";
  lastUpdated: string; // "2 hours ago"
}
```

### `AuditLog`
```typescript
{
  id: number;
  date: string;        // "2026-02-27 10:30 AM"
  user: string;        // "jane.doe@company.com" or "system_ec_sync"
  action: "Data Import" | "Approved Payroll" | "Status Change" | 
          "Initiated Email Approval" | "Released for Payment" | "Rejected Payroll";
  details: string;     // Human-readable narrative
  entity: string;
  month: string;
}
```

### `DQIssue`
```typescript
{
  id: string;          // "DQ-101"
  type: string;        // "Missing Bank Details"
  severity: "Critical" | "High" | "Medium" | "Low";
  employee: string;    // "E10452"
  entity: string;      // "Acme EMEA"
  description: string;
}
```

### `OrgUnit`
```typescript
{
  id: number;
  region: "Americas" | "EMEA" | "APAC";
  country: string;
  legalEntity: string;
  reportingUnit: string;
  active: boolean;
}
```

---

## 5. Seed / Mock Data

### Payroll Runs (February 2026):
```
PAY-001 | Global Tech Corp  | 1,250 employees | $5,240,000  | approval_in_progress
PAY-002 | Acme EMEA         | 840 employees   | €3,100,000  | draft
PAY-003 | Acme APAC         | 2,100 employees | $4,800,000  | approved
PAY-005 | Wayne Enterprises | 320 employees   | $1,500,000  | draft
```

### Org Units:
```
Americas | United States | Global Tech US LLC | US-East Operations
Americas | United States | Global Tech US LLC | US-West Operations
EMEA     | Germany       | Acme GmbH          | Berlin HQ
APAC     | Singapore     | Acme APAC Pte Ltd  | SG Sales
```

### Audit Log (pre-seeded, reverse chronological):
```
2026-02-27 10:30 AM | jane.doe@company.com | Acme APAC / Feb 2026 | Initiated Email Approval | Sent approval request to Finance Director
2026-02-26 04:15 PM | system_ec_sync       | Acme APAC / Feb 2026 | Data Import              | Synced 2100 employee records from EC Payroll
2026-02-26 11:20 AM | john.smith@company.com | Stark Industries / Jan 2026 | Status Change  | Changed status to Submission of payment
2026-02-25 09:00 AM | jane.doe@company.com | Global Tech Corp / Jan 2026 | Approved Payroll | Approved Global Tech Corp (Jan 2026) payroll run
2026-02-27 01:15 PM | system_ec_sync       | Acme EMEA / Feb 2026 | Data Import              | Initial data pull from EC Payroll
```

---

## 6. Backend Architecture

### Tech Stack (Recommended)
- **Frontend:** React + TypeScript, Tailwind CSS, React Router, Zustand (state management)
- **Backend:** Node.js + Express (or Next.js API routes)
- **Database:** PostgreSQL (production) / SQLite (local dev)
- **ORM:** Prisma
- **Auth:** Session-based or JWT; role: `GlobalPayrollAdmin`

### API Endpoints

```
GET    /api/payroll-runs?month=February+2026    → List all runs for period
GET    /api/payroll-runs/:id                    → Single run detail (for modal)
PATCH  /api/payroll-runs/:id/status             → Advance or revert status
  Body: { action: "request_approval" | "approve" | "force_approve" | "release" | "reject" }

GET    /api/audit-log?period=&entity=           → Filtered audit entries
GET    /api/audit-log/export?period=&entity=    → Returns CSV file

GET    /api/dq-issues                           → All active anomalies
POST   /api/dq-issues/sync                      → Trigger re-sync from EC Payroll (mock: regenerates issues)

GET    /api/org-units?region=&search=           → Filtered org units
POST   /api/org-units                           → Create new org unit
PUT    /api/org-units/:id                       → Edit org unit
PATCH  /api/org-units/:id/deactivate            → Soft-delete

GET    /api/connection-status                   → Returns { connected: true, system: "EC Payroll" }
```

### State Transition Logic (Backend)

```
PATCH /api/payroll-runs/:id/status
  action = "request_approval"  → status: draft          → approval_in_progress
  action = "approve"           → status: approval_in_progress → approved
  action = "force_approve"     → status: approval_in_progress → approved
  action = "release"           → status: approved        → submitted
  action = "reject"            → status: approval_in_progress → draft

On every PATCH, auto-insert to audit_log:
  { user: req.user.email, entity: run.company, month: run.month, action: <mapped label>, details: <generated narrative> }
```

---

## 7. User Flows

### Flow A — Approve a Payroll Run
1. Land on Approval Dashboard (default: current month)
2. See PAY-002 (Acme EMEA) in "Draft" status
3. Click `Req. Approval` → modal opens showing financial summary
4. Enter reviewer comment → click `Request Email Approval`
5. Status updates to "Approval in progress", toast confirms, audit log entry added

### Flow B — Release an Approved Run for Payment
1. See PAY-003 (Acme APAC) in "Payroll approved" status
2. Click `Release for Payment`
3. Confirmation dialog: "Are you sure you want to release $4,800,000 for payment?"
4. Confirm → status moves to "Submission of payment", audit log updated

### Flow C — Investigate a Data Quality Issue
1. Navigate to Data Governance
2. Click `Sync from EC Payroll` → loading spinner → issues refresh
3. See DQ-102 (Critical, Negative Net Pay) — note the entity and employee ID
4. Navigate to Approval Dashboard → find the affected entity → block approval until resolved

### Flow D — Add a New Org Unit
1. Navigate to Configuration
2. Click `+ Add Org Unit`
3. Fill: Region = EMEA, Country = France, Legal Entity = Acme France SAS, Reporting Unit = Paris Office
4. Click Save → new row appears in table

---

## 8. Functional Requirements Checklist

- [ ] SPA with client-side routing (no full page reloads)
- [ ] Sidebar navigation with active state highlighting
- [ ] All 4 modules fully functional with live state updates
- [ ] KPI cards on dashboard update when period filter changes
- [ ] Status badges are color-coded and consistent across all views
- [ ] Modal/drawer for approval actions with financial data breakdown
- [ ] Audit log is append-only (no edit/delete UI)
- [ ] CSV export for audit log (client-side generation acceptable for MVP)
- [ ] Org unit form validates all required fields before enabling Save
- [ ] Deactivated org units are hidden from the main list (or shown with strikethrough)
- [ ] Toast notifications for all user actions
- [ ] EC Payroll connection status badge always visible in header
- [ ] Responsive layout (minimum: 1280px wide desktop)
- [ ] Loading states for any async data fetch operations

---

## 9. Out of Scope (for MVP)

- Real SAP BTP / EC Payroll API integration (use mock data)
- Email sending (log the action but don't actually send)
- Multi-user authentication / role management
- Mobile responsiveness below 1024px
- Localization / i18n

---

*End of Build Prompt — Payroll Cockpit v1.0*
