# SAP SuccessFactors & Employee Central (EC) OData Data Models Reference

This document serves as an architectural index of the standard Data Models and Entities provided by the SAP SuccessFactors Employee Central OData API. These entity definitions are critical for aligning custom BTP extensions (like the Payroll Cockpit) with the actual SAP backend `System of Record`.

---

## 1. Employee Profile & Personal Data 
These entities handle the core identity and personal details of a worker.

### `PerPerson` (Person Level)
- **Description**: The absolute root entity representing an individual in the system. Everything ties back to `personIdExternal`. It holds non-effective dated identifying information.
- **Key Fields**: `personIdExternal`, `dateOfBirth`, `countryOfBirth`.

### `PerPersonal` (Personal Info)
- **Description**: Effective-dated personal information for the person. Since names and marital statuses change, this is effective-dated.
- **Key Fields**: `personIdExternal`, `startDate`, `firstName`, `lastName`, `gender`, `maritalStatus`.

---

## 2. Employment & Job Information
These entities map an individual to their actual work assignments and compensation limits.

### `EmpEmployment` (Employment Level)
- **Description**: Represents a specific work contract/employment for a Person. A single `PerPerson` can have multiple `EmpEmployment` records (e.g., rehires or global assignments).
- **Key Fields**: `personIdExternal`, `userId`, `employmentId`, `startDate`, `endDate`, `assignmentClass`.

### `EmpJob` (Job Information)
- **Description**: Effective-dated job details linked to an employment. This dictates the employee's title, manager, payroll grouping, and organizational placement.
- **Key Fields**: `seqNumber`, `startDate`, `userId`, `managerId`, `department`, `location`, `jobCode`, `payGrade`.

---

## 3. Organizational Foundation Objects (OM)
These entities represent the company's structural taxonomy. They are prefixed with `FO` (Foundation Object).

### `FOCompany` (Legal Entity)
- **Description**: Represents the Legal Entity or company code. It dictates legal compliance and high-level financial reporting.
- **Key Fields**: `externalCode`, `name`, `country`, `startDate`, `status`.

### `FODepartment` (Department)
- **Description**: Represents a specific organizational department. It is often linked to a parent `FOCompany` or `FOBusinessUnit`.
- **Key Fields**: `externalCode`, `name`, `parentDepartment`, `costCenter`.

### `FOLocation` (Location)
- **Description**: The physical location where the employee is based.
- **Key Fields**: `externalCode`, `name`, `addressLine1`, `city`, `zipCode`.

---

## 4. EC Payroll Operations (ECP)
These entities bridge the HR system with the Gross-to-Net payroll calculations engine.

### `EmployeePayrollRunResults` (Payroll Header)
- **Description**: Non-effective dated grouping for an executed payroll run for an individual.
- **Key Fields**: `externalCode`, `employmentId`, `payDate`, `currency`, `startDateWhenPaid`, `endDateWhenPaid`.

### `EmployeePayrollRunResultsItems` (Payroll Line Items)
- **Description**: The granular line-items assigned to a `EmployeePayrollRunResults` header. Contains the actual wage types and amounts.
- **Key Fields**: `externalCode` (Header ID mapping), `wageType`, `amount`, `quantity`.

---

## Technical Notes for BTP Extensions
1. **OData Prefix**: In CAP/BTP extensions targeting these models, you query via the V2 API structure (e.g. `/odata/v2/EmpEmployment`).
2. **Navigation Properties**: OData inherently supports expanding child data. For instance, querying `EmpEmployment?$expand=personNav` will fetch the `EmpEmployment` block and intelligently embed the associated `PerPerson` details.
3. **Effective Dating**: Entities like `EmpJob` and `PerPersonal` use `startDate` and `endDate` fields. Queries will require `$filter=startDate le datetime'...' and endDate ge datetime'...'` to find the currently active time slice.
