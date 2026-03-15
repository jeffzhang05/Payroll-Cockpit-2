using sappro.payroll from '../db/schema';

service PayrollService @(path: '/api', requires: 'PayrollAdmin') {
    function connectionStatus() returns { connected: Boolean; system: String };

    @path: 'payroll-runs'
    entity PayrollRun as projection on payroll.PayrollRun;

    @path: 'audit-log'
    entity AuditLog as projection on payroll.AuditLog;

    @path: 'dq-issues'
    entity DQIssue as projection on payroll.DQIssue;

    @path: 'org-units'
    entity OrgUnit as projection on payroll.OrgUnit;

    action changePayrollStatus(id: String, action: String) returns PayrollRun;
    action syncDQIssues() returns { message: String; count: Integer };
    action deactivateOrgUnit(id: Integer) returns OrgUnit;
}
