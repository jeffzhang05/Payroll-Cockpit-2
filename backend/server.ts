import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
app.use(express.json());

// Root Route (Sanity Check)
app.get('/', (req, res) => {
    res.json({ message: 'Payroll Cockpit Backend API is running! 🚀' });
});

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

// Connection Check
app.get('/api/connection-status', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ connected: true, system: 'Database (SQLite via Prisma)' });
    } catch (e) {
        res.status(500).json({ connected: false, system: 'Database Offline' });
    }
});

// APIs
app.get('/api/payroll-runs', async (req, res) => {
    const { month } = req.query;
    const runs = await prisma.payrollRun.findMany({
        where: month ? { month: month.toString() } : undefined,
        orderBy: { lastUpdated: 'desc' }
    });
    res.json(runs);
});

app.get('/api/payroll-runs/:id', async (req, res) => {
    const run = await prisma.payrollRun.findUnique({ where: { id: req.params.id } });
    if (!run) return res.status(404).json({ error: 'Not found' });
    res.json(run);
});

app.patch('/api/payroll-runs/:id/status', async (req, res) => {
    const { action } = req.body;

    const run = await prisma.payrollRun.findUnique({ where: { id: req.params.id } });
    if (!run) return res.status(404).json({ error: 'Not found' });

    let newStatus = run.status;
    if (action === 'request_approval' && run.status === 'draft') newStatus = 'approval_in_progress';
    else if (action === 'approve' && run.status === 'approval_in_progress') newStatus = 'approved';
    else if (action === 'force_approve' && run.status === 'approval_in_progress') newStatus = 'approved';
    else if (action === 'release' && run.status === 'approved') newStatus = 'submitted';
    else if (action === 'reject' && run.status === 'approval_in_progress') newStatus = 'draft';

    const updatedRun = await prisma.payrollRun.update({
        where: { id: req.params.id },
        data: { status: newStatus, lastUpdated: new Date().toISOString() }
    });

    // Auto-log
    await prisma.auditLog.create({
        data: {
            date: new Date().toISOString(),
            user: 'system@mock.local',
            entity: run.company,
            month: run.month,
            action: 'Status Change',
            details: `Triggered action: ${action}`
        }
    });

    res.json(updatedRun);
});

app.get('/api/audit-log', async (req, res) => {
    const logs = await prisma.auditLog.findMany({ orderBy: { id: 'desc' } });
    res.json(logs);
});

app.get('/api/dq-issues', async (req, res) => {
    const issues = await prisma.dQIssue.findMany();
    res.json(issues);
});

app.post('/api/dq-issues/sync', async (req, res) => {
    const count = await prisma.dQIssue.count();
    res.json({ message: 'Sync successful', count });
});

app.get('/api/org-units', async (req, res) => {
    const units = await prisma.orgUnit.findMany({ where: { active: true } });
    res.json(units);
});

app.post('/api/org-units', async (req, res) => {
    const newUnit = await prisma.orgUnit.create({
        data: { ...req.body, active: true }
    });
    res.json(newUnit);
});

app.patch('/api/org-units/:id/deactivate', async (req, res) => {
    try {
        const unit = await prisma.orgUnit.update({
            where: { id: parseInt(req.params.id) },
            data: { active: false }
        });
        res.json(unit);
    } catch {
        res.status(404).json({ error: 'Not found' });
    }
});

app.listen(PORT, () => console.log(`[Link Phase] Mock Server running on http://localhost:${PORT}`));
