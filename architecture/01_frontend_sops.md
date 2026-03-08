# Frontend Technical SOP

## 1. Application Architecture

- **Framework**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State Management**: Zustand
- **Icons**: Lucide React

## 2. Directory Structure (`frontend/src/`)

- `api/`: API client configurations and service wrappers (fetching functions).
- `components/`: Reusable UI elements (buttons, modals, badges, layout components).
- `pages/`: Route-level components mapping to specific URLs (`/dashboard`, `/history`, etc.).
- `store/`: Zustand state stores for managing global application state (e.g., active module, payroll data cache).
- `types/`: Global TypeScript interfaces mapping exactly to schemas defined in `gemini.md`.

## 3. State Management (Zustand)

Global state is strictly used for data that spans multiple modules or requires caching.
- `usePayrollStore`: Manages payroll runs, selected period filter, and loading states.
- `useAuditStore`: Manages the historical audit log.
- `useConfigStore`: Manages the organizational unit hierarchy.
- `useDQStore`: Manages the data quality issues and sync status.

## 4. Component Rules

- Components must be strictly typed.
- Favor functional components and hooks.
- Use explicit data shapes defined in `src/types/index.ts`.
- Follow the visual language explicitly outlined in the project prompt (e.g., specific color hex codes).
- "Smart" components (Pages) handle data fetching via API services, while "Dumb" components (UI) rely strictly on props.

## 5. API Interaction

- All API calls must route through the centralized `api/client.ts` service which interacts with our Express backend running on `http://localhost:3000`.
- API responses must be strongly typed and handle `try/catch` errors deterministically.

## 6. The "No-Guess" Rule

- If an API shape changes, update `gemini.md` -> `types/index.ts` -> `store/` -> `components/` in that precise order. Do not guess on intermediate states.

## 7. Current Layout Paradigms (Strict)

- **Dashboard**: Uses a connected, sequential `Stepper` component for payroll status progression (Draft -> Approval -> Approved -> Submitted). Clicking a stepper element acts as a visual filter on the Entities table.
- **Config**: Settings are divided into visual sections. Both `Org Unit` and `Validation Rules` must use identical theming (Indigo icons, solid buttons, clear header separation). Rule creation leverages floating Modals (`showRuleModal`), not page redirects.
- **Data Governance**: The top-level Key Metrics section uses premium solid glassmorphic cards with respective themes (`Emerald` for quality score, `Amber` for active anomalies, and `Indigo` for rule metadata). The anomaly table must include complex filtering headers and a linked `rule` ID badge with hover tooltips (`title` attribute) referencing the root validation rule.
