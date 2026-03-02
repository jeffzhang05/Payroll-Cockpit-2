# **Functional Specification: Your Payroll Cockpit**

**Document Version:** 1.0

**Target Platform:** SAP BTP (Business Technology Platform)

**Integration:** SAP SuccessFactors Employee Central (EC) Payroll

## **1\. Introduction**

"Your Payroll Cockpit" is a centralized web application designed to streamline, govern, and audit the global payroll approval process. Built as a modern SAP BTP extension, it connects directly to the EC Payroll system to fetch payroll results, validate data quality, manage organizational hierarchies, and provide a secure, auditable workflow for payroll release.

## **2\. Global Navigation & Layout**

The application utilizes a modern, responsive Single Page Application (SPA) layout containing:

* **Sidebar Navigation:** Persistent left-hand menu allowing users to switch between four core modules: Approval Dashboard, Historical Log, Data Governance, and Configuration. Displays the current user profile (e.g., Global Payroll Admin).  
* **Top Header:** Contextual breadcrumbs showing the current active module and a real-time system connection status indicator ("Connected to EC Payroll").  
* **Main Content Area:** A scrollable container for the active module's interface.

## **3\. Core Modules & Functionality**

### **3.1. Payroll Approval Dashboard**

The primary landing page for payroll managers to monitor and action payroll runs.

**Features & Functionality:**

* **Period Filter:** A dropdown allowing users to filter the entire dashboard by specific payroll months (e.g., July 2025 \- March 2026).  
* **KPI Summary Cards:** Four vertical cards displaying real-time counts of payroll runs grouped by their current status.  
* **Data Grid:** A tabular view of payroll runs for the selected period.  
  * *Search:* Text input to search by legal entity/company.  
  * *Columns:* Run ID, Company, Employees (Headcount), Total Amount, Status badge, Actions.  
* **In-Page Approval Session (Modal):** Triggered via action buttons in the grid. Displays detailed, read-only payroll data to assist in the approval decision.  
  * *Header:* Company Name, Run ID, Last Updated timestamp, Status Badge.  
  * *Quick KPIs:* Headcount, Total Payout, Month-over-Month Variance (%), and Data Quality Issues count.  
  * *Financial Summary:* A breakdown table showing Base Salary, Overtime & Bonuses, Employer Taxes, Benefits & Contributions, and Total Run Value.  
  * *Reviewer Comments:* A text area for the approver to enter audit notes or justifications.  
  * *Action Footer:* Contextual buttons to advance or reject the workflow based on the current state.

### **3.2. Historical Approval Log**

An immutable, read-only audit trail tracking all system and human interactions for compliance.

**Features & Functionality:**

* **Advanced Filtering:** A popover UI containing dropdowns to filter logs by Period and Entity. Includes a "Clear Filters" utility.  
* **Export:** UI button intended to export the currently filtered view to CSV format.  
* **Audit Grid:** Displays chronological events.  
  * *Columns:* Timestamp, User/System ID, Entity & Period, Action Type (e.g., 'Data Import', 'Approved Payroll', 'Released for Payment'), Details (Narrative description of the action).

### **3.3. Data Quality Governance**

A module dedicated to preemptively catching payroll anomalies exported from EC Payroll.

**Features & Functionality:**

* **Manual Sync:** A "Sync from EC Payroll" action to refresh data validation.  
* **Governance Metrics:** Three primary KPI callouts: Overall Data Quality Score (%), Active Anomalies count, and Active Validation Rules count.  
* **Anomaly Grid:** Lists specific data errors needing attention before approval.  
  * *Columns:* Issue ID, Severity (Critical, High, Medium \- color-coded), Type, Entity / Employee ID, Description of the error.

### **3.4. Configuration Console**

An administrative screen for setting up the organizational hierarchy and structural mapping.

**Features & Functionality:**

* **Adding Units:** An "Add Org Unit" button opens a modal prompting the user for Region, Country, Legal Entity, and Reporting Unit. Validates that all fields are populated before saving.  
* **Management Grid:** Displays current organizational structure.  
  * *Filters:* Dropdown filter by Region; text search for Legal Entity.  
  * *Columns:* Region, Country, Legal Entity, Reporting Unit, Actions (Edit, Deactivate).

## **4\. Workflows & State Transitions**

A payroll run progresses through a strict, color-coded status workflow. Transitions are triggered via the Dashboard Actions or the In-Page Approval Modal.

1. **Draft & data quality check** (Blue)  
   * *Trigger:* Initial data load from EC Payroll or a "Reject/Re-run" action.  
   * *Available Actions:* Request Email Approval (Moves status to Approval in progress).  
2. **Approval in progress** (Orange)  
   * *Trigger:* User requests approval. Email dispatched to designated approver.  
   * *Available Actions:* Approve Payroll (Moves status to Payroll approved), Reject / Re-run (Reverts to Draft).  
3. **Payroll approved** (Green)  
   * *Trigger:* Approver accepts the payroll figures.  
   * *Available Actions:* Release for Payment (Moves status to Submission of payment).  
4. **Submission of payment** (Grey)  
   * *Trigger:* Final financial release triggered.  
   * *Available Actions:* Terminal state. User can only View Details.

## **5\. Data Models (Mock Schema)**

### **5.1. Payroll Run Record (ApprovalData)**

* id (String): Unique identifier (e.g., 'PAY-001')  
* company (String): Legal entity name  
* month (String): Financial period (e.g., 'February 2026')  
* employees (Integer): Total headcount for the run  
* totalAmount (String/Decimal): Formatted total payout value  
* status (String): Current workflow state  
* lastUpdated (Timestamp/String): Time since last status change

### **5.2. Audit Log Record (AuditLog)**

* id (Integer/UUID): Unique sequential log identifier  
* date (Timestamp): Exact date and time of the event  
* user (String): Email of the user or system account triggering the event  
* action (String): Categorized action tag  
* details (String): Human-readable context  
* entity (String): Associated legal entity  
* month (String): Associated financial period

### **5.3. Data Quality Issue Record (DQIssue)**

* id (String): Unique issue identifier (e.g., 'DQ-101')  
* type (String): Categorization of the error (e.g., 'Missing Bank Details')  
* severity (Enum): 'Critical', 'High', 'Medium', 'Low'  
* employee (String): Affected employee ID  
* entity (String): Associated legal entity  
* description (String): Detailed explanation of the anomaly

### **5.4. Organizational Unit Record (OrgUnit)**

* id (Integer/UUID): Unique database identifier  
* region (String): Global region grouping (e.g., Americas, EMEA, APAC)  
* country (String): Specific operating country  
* legalEntity (String): Registered company name  
* reportingUnit (String): Internal business mapping unit