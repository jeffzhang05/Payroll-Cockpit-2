namespace sappro.payroll;

entity PayrollRun {
    key id          : String(50);
        company     : String(100);
        month       : String(50);
        employees   : Integer;
        totalAmount : String(50);
        status      : String(50); // draft | approval_in_progress | approved | submitted
        lastUpdated : String(50); // Storing as String to match exact Prisma schema/payload
}

entity AuditLog {
    key id      : Integer;
        date    : String(50);
        user    : String(100);
        action  : String(100);
        details : String(255);
        entity  : String(100);
        month   : String(50);
}

entity DQIssue {
    key id          : String(50);
        type        : String(100);
        severity    : String(50); // Critical | High | Medium | Low
        employee    : String(100);
        entity      : String(100);
        description : String(255);
        rule        : String(50) default 'RUL-GEN';
}

entity OrgUnit {
    key id            : Integer;
        region        : String(50); // Americas | EMEA | APAC
        country       : String(100);
        legalEntity   : String(100);
        reportingUnit : String(100);
        active        : Boolean default true;
}

entity ValidationRule {
    key id       : String(50);
        field    : String(100);
        operator : String(50);
        value    : String(100);
        isActive : Boolean default true;
}
