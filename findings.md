# Findings

## Research, Discoveries, and Constraints
- **North Star:** Centralized SPA for global payroll governance via SAP BTP.
- **Integrations:** MVP will mock integration with SAP SuccessFactors EC Payroll. No real APIs yet.
- **Source of Truth:** SAP SuccessFactors EC Payroll.
- **Delivery Payload:** React (SPA) + Node/Express backend with mock APIs.
- **Behavioral Rules:** 
  - Visual theme: Dark sidebar + light main content, blue accents.
  - Linear state machine: Draft -> Approval in progress -> Payroll approved -> Submission of payment.
  - System must enforce append-only Audit Log.
  - Toast notifications explicitly required for actions.

