export type PayrollStatus = 'draft' | 'approval_in_progress' | 'approved' | 'submitted';

export interface PayrollRun {
    id: string;
    company: string;
    month: string;
    employees: number;
    totalAmount: string;
    status: PayrollStatus;
    lastUpdated: string;
}

export type AuditAction =
    | 'Data Import'
    | 'Approved Payroll'
    | 'Status Change'
    | 'Initiated Email Approval'
    | 'Released for Payment'
    | 'Rejected Payroll';

export interface AuditLog {
    id: number;
    date: string;
    user: string;
    action: AuditAction;
    details: string;
    entity: string;
    month: string;
}

export type DQSseverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface DQIssue {
    id: string;
    type: string;
    severity: DQSseverity;
    employee: string;
    entity: string;
    description: string;
    rule: string;
}

export type Region = 'Americas' | 'EMEA' | 'APAC';

export interface OrgUnit {
    id: number;
    region: Region;
    country: string;
    legalEntity: string;
    reportingUnit: string;
    active: boolean;
}
