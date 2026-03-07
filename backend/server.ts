import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Mock Data
let payrollRuns = [
    { id: 'PAY-001', company: 'Global Tech Corp', month: 'February 2026', employees: 1250, totalAmount: '$5,240,000', status: 'approval_in_progress', lastUpdated: new Date().toISOString() },
    { id: 'PAY-002', company: 'Acme EMEA', month: 'February 2026', employees: 840, totalAmount: '€3,100,000', status: 'draft', lastUpdated: new Date().toISOString() },
    { id: 'PAY-003', company: 'Acme APAC', month: 'February 2026', employees: 2100, totalAmount: '$4,800,000', status: 'approved', lastUpdated: new Date().toISOString() },
    { id: 'PAY-005', company: 'Wayne Enterprises', month: 'February 2026', employees: 320, totalAmount: '$1,500,000', status: 'draft', lastUpdated: new Date().toISOString() }
];

let auditLogs = [
    { id: 1, date: '2026-02-27 10:30 AM', user: 'jane.doe@company.com', entity: 'Acme APAC', month: 'February 2026', action: 'Initiated Email Approval', details: 'Sent approval request to Finance Director' },
    { id: 2, date: '2026-02-26 04:15 PM', user: 'system_ec_sync', entity: 'Acme APAC', month: 'February 2026', action: 'Data Import', details: 'Synced 2100 employee records from EC Payroll' },
];

let dqIssues = [
    { id: 'DQ-101', type: 'Missing Bank Details', severity: 'High', employee: 'E10452', entity: 'Acme EMEA', description: 'IBAN missing for new hire' },
    { id: 'DQ-102', type: 'Negative Net Pay', severity: 'Critical', employee: 'E09381', entity: 'Global Tech Corp', description: 'Deductions exceed gross pay' },
    { id: 'DQ-103', type: 'Unusual Overtime', severity: 'Medium', employee: 'E11200', entity: 'Acme APAC', description: 'Overtime > 50% of standard hours' }
];

let orgUnits = [
    { id: 1, region: 'Americas', country: 'United States', legalEntity: 'Global Tech US LLC', reportingUnit: 'US-East Operations', active: true },
    { id: 2, region: 'Americas', country: 'United States', legalEntity: 'Global Tech US LLC', reportingUnit: 'US-West Operations', active: true },
    { id: 3, region: 'EMEA', country: 'Germany', legalEntity: 'Acme GmbH', reportingUnit: 'Berlin HQ', active: true },
    { id: 4, region: 'APAC', country: 'Singapore', legalEntity: 'Acme APAC Pte Ltd', reportingUnit: 'SG Sales', active: true },
];

// Connection Check
app.get('/api/connection-status', (req, res) => {
    res.json({ connected: true, system: 'EC Payroll (Mock)' });
});

// APIs
app.get('/api/payroll-runs', (req, res) => {
    const { month } = req.query;
    const filtered = month ? payrollRuns.filter(r => r.month === month) : payrollRuns;
    res.json(filtered);
});

app.get('/api/payroll-runs/:id', (req, res) => {
    const run = payrollRuns.find(r => r.id === req.params.id);
    if (!run) return res.status(404).json({ error: 'Not found' });
    res.json(run);
});

app.patch('/api/payroll-runs/:id/status', (req, res) => {
    const { action } = req.body;
    const idx = payrollRuns.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const run = payrollRuns[idx];
    let newStatus = run.status;

    if (action === 'request_approval' && run.status === 'draft') newStatus = 'approval_in_progress';
    else if (action === 'approve' && run.status === 'approval_in_progress') newStatus = 'approved';
    else if (action === 'force_approve' && run.status === 'approval_in_progress') newStatus = 'approved';
    else if (action === 'release' && run.status === 'approved') newStatus = 'submitted';
    else if (action === 'reject' && run.status === 'approval_in_progress') newStatus = 'draft';

    run.status = newStatus;
    run.lastUpdated = new Date().toISOString();
    // Auto-log
    auditLogs.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        user: 'system@mock.local',
        entity: run.company,
        month: run.month,
        action: 'Status Change',
        details: `Triggered action: ${action}`
    });

    res.json(run);
});

app.get('/api/audit-log', (req, res) => {
    res.json(auditLogs);
});

app.get('/api/dq-issues', (req, res) => {
    res.json(dqIssues);
});

app.post('/api/dq-issues/sync', (req, res) => {
    // Mock just resends the same issues 
    res.json({ message: 'Sync successful', count: dqIssues.length });
});

app.get('/api/org-units', (req, res) => {
    res.json(orgUnits.filter(o => o.active));
});

app.post('/api/org-units', (req, res) => {
    const newUnit = { id: Date.now(), active: true, ...req.body };
    orgUnits.push(newUnit);
    res.json(newUnit);
});

app.patch('/api/org-units/:id/deactivate', (req, res) => {
    const unit = orgUnits.find(o => o.id === parseInt(req.params.id));
    if (!unit) return res.status(404).json({ error: 'Not found' });
    unit.active = false;
    res.json(unit);
});

app.listen(PORT, () => console.log(`[Link Phase] Mock Server running on http://localhost:${PORT}`));
