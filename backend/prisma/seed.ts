import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing
    await prisma.payrollRun.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.dQIssue.deleteMany({});
    await prisma.orgUnit.deleteMany({});

    const now = new Date().toISOString();

    // Create Org Units
    await prisma.orgUnit.createMany({
        data: [
            { id: 1, region: 'Americas', country: 'United States', legalEntity: 'Global Tech US LLC', reportingUnit: 'US-East Operations', active: true },
            { id: 2, region: 'Americas', country: 'United States', legalEntity: 'Global Tech US LLC', reportingUnit: 'US-West Operations', active: true },
            { id: 3, region: 'EMEA', country: 'Germany', legalEntity: 'Acme GmbH', reportingUnit: 'Berlin HQ', active: true },
            { id: 4, region: 'APAC', country: 'Singapore', legalEntity: 'Acme APAC Pte Ltd', reportingUnit: 'SG Sales', active: true },
        ]
    });

    // Create Payroll Runs
    await prisma.payrollRun.createMany({
        data: [
            // October 2025 (Submitted)
            { id: 'PAY-OCT-001', company: 'Global Tech Corp', month: 'October 2025', employees: 1200, totalAmount: '$4,950,000', status: 'submitted', lastUpdated: '2025-10-28T10:00:00.000Z' },
            { id: 'PAY-OCT-002', company: 'Acme EMEA', month: 'October 2025', employees: 820, totalAmount: '€3,010,000', status: 'submitted', lastUpdated: '2025-10-28T11:00:00.000Z' },
            { id: 'PAY-OCT-003', company: 'Acme APAC', month: 'October 2025', employees: 2050, totalAmount: '$4,650,000', status: 'submitted', lastUpdated: '2025-10-28T09:00:00.000Z' },
            { id: 'PAY-OCT-005', company: 'Wayne Enterprises', month: 'October 2025', employees: 300, totalAmount: '$1,300,000', status: 'submitted', lastUpdated: '2025-10-28T12:00:00.000Z' },

            // November 2025 (Submitted)
            { id: 'PAY-NOV-001', company: 'Global Tech Corp', month: 'November 2025', employees: 1220, totalAmount: '$5,150,000', status: 'submitted', lastUpdated: '2025-11-28T10:00:00.000Z' },
            { id: 'PAY-NOV-002', company: 'Acme EMEA', month: 'November 2025', employees: 830, totalAmount: '€3,050,000', status: 'submitted', lastUpdated: '2025-11-28T11:00:00.000Z' },
            { id: 'PAY-NOV-003', company: 'Acme APAC', month: 'November 2025', employees: 2060, totalAmount: '$4,700,000', status: 'submitted', lastUpdated: '2025-11-28T09:00:00.000Z' },
            { id: 'PAY-NOV-005', company: 'Wayne Enterprises', month: 'November 2025', employees: 310, totalAmount: '$1,400,000', status: 'submitted', lastUpdated: '2025-11-28T12:00:00.000Z' },

            // December 2025 (Submitted)
            { id: 'PAY-DEC-001', company: 'Global Tech Corp', month: 'December 2025', employees: 1240, totalAmount: '$5,200,000', status: 'submitted', lastUpdated: '2025-12-28T10:00:00.000Z' },
            { id: 'PAY-DEC-002', company: 'Acme EMEA', month: 'December 2025', employees: 835, totalAmount: '€3,080,000', status: 'submitted', lastUpdated: '2025-12-28T11:00:00.000Z' },
            { id: 'PAY-DEC-003', company: 'Acme APAC', month: 'December 2025', employees: 2080, totalAmount: '$4,750,000', status: 'submitted', lastUpdated: '2025-12-28T09:00:00.000Z' },
            { id: 'PAY-DEC-005', company: 'Wayne Enterprises', month: 'December 2025', employees: 315, totalAmount: '$1,450,000', status: 'submitted', lastUpdated: '2025-12-28T12:00:00.000Z' },

            // January 2026 (Submitted)
            { id: 'PAY-JAN-001', company: 'Global Tech Corp', month: 'January 2026', employees: 1245, totalAmount: '$5,220,000', status: 'submitted', lastUpdated: '2026-01-29T10:00:00.000Z' },
            { id: 'PAY-JAN-002', company: 'Acme EMEA', month: 'January 2026', employees: 840, totalAmount: '€3,100,000', status: 'submitted', lastUpdated: '2026-01-29T11:00:00.000Z' },
            { id: 'PAY-JAN-003', company: 'Acme APAC', month: 'January 2026', employees: 2090, totalAmount: '$4,780,000', status: 'submitted', lastUpdated: '2026-01-29T09:00:00.000Z' },
            { id: 'PAY-JAN-005', company: 'Wayne Enterprises', month: 'January 2026', employees: 318, totalAmount: '$1,480,000', status: 'submitted', lastUpdated: '2026-01-29T12:00:00.000Z' },

            // February 2026 (Current Active)
            { id: 'PAY-001', company: 'Global Tech Corp', month: 'February 2026', employees: 1250, totalAmount: '$5,240,000', status: 'approval_in_progress', lastUpdated: now },
            { id: 'PAY-002', company: 'Acme EMEA', month: 'February 2026', employees: 840, totalAmount: '€3,100,000', status: 'draft', lastUpdated: now },
            { id: 'PAY-003', company: 'Acme APAC', month: 'February 2026', employees: 2100, totalAmount: '$4,800,000', status: 'approved', lastUpdated: now },
            { id: 'PAY-005', company: 'Wayne Enterprises', month: 'February 2026', employees: 320, totalAmount: '$1,500,000', status: 'draft', lastUpdated: now }
        ]
    });

    // Create Audit Logs
    await prisma.auditLog.createMany({
        data: [
            // October
            { id: 11, date: '2025-10-27T08:30:00.000Z', user: 'system_ec_sync', entity: 'Global Tech Corp', month: 'October 2025', action: 'Data Import', details: 'Synced 1200 employee records' },
            { id: 12, date: '2025-10-28T09:00:00.000Z', user: 'jane.doe@company.com', entity: 'Global Tech Corp', month: 'October 2025', action: 'Approved Payroll', details: 'Approved without exceptions' },
            { id: 13, date: '2025-10-28T10:00:00.000Z', user: 'jane.doe@company.com', entity: 'Acme EMEA', month: 'October 2025', action: 'Approved Payroll', details: 'Approved EMEA payroll exceptions' },
            { id: 14, date: '2025-10-28T10:30:00.000Z', user: 'jane.doe@company.com', entity: 'Acme APAC', month: 'October 2025', action: 'Approved Payroll', details: 'Approved APAC operations' },
            { id: 15, date: '2025-10-28T11:00:00.000Z', user: 'jane.doe@company.com', entity: 'Wayne Enterprises', month: 'October 2025', action: 'Approved Payroll', details: 'Approved special adjustments' },

            // November
            { id: 101, date: '2025-11-28T09:00:00.000Z', user: 'jane.doe@company.com', entity: 'Global Tech Corp', month: 'November 2025', action: 'Approved Payroll', details: 'Approved without exceptions' },
            { id: 102, date: '2025-11-28T09:30:00.000Z', user: 'jane.doe@company.com', entity: 'Acme EMEA', month: 'November 2025', action: 'Approved Payroll', details: 'Approved payroll exceptions' },
            { id: 103, date: '2025-11-28T10:00:00.000Z', user: 'jane.doe@company.com', entity: 'Acme APAC', month: 'November 2025', action: 'Approved Payroll', details: 'Approved APAC operations' },
            { id: 104, date: '2025-11-28T10:30:00.000Z', user: 'jane.doe@company.com', entity: 'Wayne Enterprises', month: 'November 2025', action: 'Approved Payroll', details: 'Approved bonuses' },

            // December
            { id: 201, date: '2025-12-28T10:00:00.000Z', user: 'system_ec_sync', entity: 'Acme EMEA', month: 'December 2025', action: 'Data Import', details: 'Synced 835 employee records' },
            { id: 202, date: '2025-12-28T13:00:00.000Z', user: 'jane.doe@company.com', entity: 'Global Tech Corp', month: 'December 2025', action: 'Approved Payroll', details: 'Approved year-end processing' },
            { id: 203, date: '2025-12-28T13:30:00.000Z', user: 'jane.doe@company.com', entity: 'Acme EMEA', month: 'December 2025', action: 'Approved Payroll', details: 'Approved year-end processing' },
            { id: 204, date: '2025-12-28T14:00:00.000Z', user: 'jane.doe@company.com', entity: 'Acme APAC', month: 'December 2025', action: 'Approved Payroll', details: 'Approved year-end processing' },
            { id: 205, date: '2025-12-28T14:30:00.000Z', user: 'jane.doe@company.com', entity: 'Wayne Enterprises', month: 'December 2025', action: 'Approved Payroll', details: 'Approved year-end processing' },

            // January
            { id: 301, date: '2026-01-29T08:30:00.000Z', user: 'system_ec_sync', entity: 'Global Tech Corp', month: 'January 2026', action: 'Data Import', details: 'Synced 1245 employee records' },
            { id: 302, date: '2026-01-29T10:00:00.000Z', user: 'jane.doe@company.com', entity: 'Global Tech Corp', month: 'January 2026', action: 'Approved Payroll', details: 'Approved standard cycle' },
            { id: 303, date: '2026-01-29T10:30:00.000Z', user: 'jane.doe@company.com', entity: 'Acme EMEA', month: 'January 2026', action: 'Approved Payroll', details: 'Approved standard cycle' },
            { id: 304, date: '2026-01-29T11:00:00.000Z', user: 'jane.doe@company.com', entity: 'Acme APAC', month: 'January 2026', action: 'Approved Payroll', details: 'Approved standard cycle' },
            { id: 305, date: '2026-01-29T11:30:00.000Z', user: 'jane.doe@company.com', entity: 'Wayne Enterprises', month: 'January 2026', action: 'Approved Payroll', details: 'Approved standard cycle' },

            // February (Current)
            { id: 401, date: '2026-02-27T10:30:00.000Z', user: 'jane.doe@company.com', entity: 'Acme APAC', month: 'February 2026', action: 'Initiated Email Approval', details: 'Sent approval request to Finance Director' },
            { id: 402, date: '2026-02-26T16:15:00.000Z', user: 'system_ec_sync', entity: 'Acme APAC', month: 'February 2026', action: 'Data Import', details: 'Synced 2100 employee records from EC Payroll' },
            { id: 403, date: '2026-02-26T17:00:00.000Z', user: 'jane.doe@company.com', entity: 'Acme APAC', month: 'February 2026', action: 'Approved Payroll', details: 'Approved current cycle' }
        ]
    });

    // Create DQ Issues
    await prisma.dQIssue.createMany({
        data: [
            { id: 'DQ-101', type: 'Missing Bank Details', severity: 'High', employee: 'E10452', entity: 'Acme EMEA', description: 'IBAN missing for new hire', rule: 'RUL-003' },
            { id: 'DQ-102', type: 'Negative Net Pay', severity: 'Critical', employee: 'E09381', entity: 'Global Tech Corp', description: 'Deductions exceed gross pay', rule: 'RUL-001' },
            { id: 'DQ-103', type: 'Unusual Overtime', severity: 'Medium', employee: 'E11200', entity: 'Acme APAC', description: 'Overtime > 50% of standard hours', rule: 'RUL-002' }
        ]
    });

    console.log('Database seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
