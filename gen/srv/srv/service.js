const cds = require('@sap/cds');

module.exports = function (srv) {
    const { PayrollRun, AuditLog, DQIssue, OrgUnit } = srv.entities;

    srv.on('connectionStatus', () => {
        return { connected: true, system: 'Database (SQLite via SAP CAP)' };
    });

    srv.before('CREATE', 'OrgUnit', async (req) => {
        if (req.data.id === null || req.data.id === undefined) {
            const query = SELECT.one.from(OrgUnit).columns('max(id) as maxId');
            const res = await cds.run(query);
            req.data.id = (res?.maxId || 0) + 1;
        }
        if (req.data.active === undefined) {
            req.data.active = true;
        }
    });

    srv.before('READ', 'OrgUnit', async (req) => {
        if (!req.query.SELECT) return;
        if (req.query.SELECT.where) {
            req.query.where(`and active = true`);
        } else {
            req.query.where({ active: true });
        }
    });

    srv.on('changePayrollStatus', async (req) => {
        const { id, action } = req.data;

        const run = await SELECT.one.from(PayrollRun).where({ id });
        if (!run) return req.error(404, 'Not found');

        let newStatus = run.status;
        if (action === 'request_approval' && run.status === 'draft') newStatus = 'approval_in_progress';
        else if (action === 'approve' && run.status === 'approval_in_progress') newStatus = 'approved';
        else if (action === 'force_approve' && run.status === 'approval_in_progress') newStatus = 'approved';
        else if (action === 'release' && run.status === 'approved') newStatus = 'submitted';
        else if (action === 'reject' && run.status === 'approval_in_progress') newStatus = 'draft';

        // Update run
        const now = new Date().toISOString();
        const updated = await UPDATE(PayrollRun, id).with({ status: newStatus, lastUpdated: now });
        if (!updated) return req.error(500, 'Update failed');

        // Auto-log
        const logQuery = SELECT.one.from(AuditLog).columns('max(id) as maxId');
        const maxLog = await cds.run(logQuery);
        const nextLogId = (maxLog?.maxId || 0) + 1;

        await INSERT.into(AuditLog).entries({
            id: nextLogId,
            date: now,
            user: 'system@mock.local',
            entity: run.company,
            month: run.month,
            action: 'Status Change',
            details: `Triggered action: ${action}`
        });

        return await SELECT.one.from(PayrollRun).where({ id });
    });

    srv.on('syncDQIssues', async (req) => {
        const issues = await SELECT.from(DQIssue);
        return { message: 'Sync successful', count: issues.length };
    });

    srv.on('deactivateOrgUnit', async (req) => {
        const { id } = req.data;
        const result = await UPDATE(OrgUnit, id).with({ active: false });
        if (!result) return req.error(404, 'Not found');
        return await SELECT.one.from(OrgUnit).where({ id });
    });
};
