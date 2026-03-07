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
  "description": "string"
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

## Maintenance Log
(To be updated during long-term stability)
