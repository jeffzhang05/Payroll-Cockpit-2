import { create } from 'zustand';
import type { PayrollRun, AuditLog, DQIssue, OrgUnit } from '../types';
import { api } from '../api/client';
import toast from 'react-hot-toast';

interface AppState {
    currentMonth: string;
    setMonth: (month: string) => void;
    // Payroll State
    payrollRuns: PayrollRun[];
    fetchPayrollRuns: () => Promise<void>;
    updatePayrollStatus: (id: string, action: string) => Promise<void>;
    // Audit State
    auditLogs: AuditLog[];
    fetchAuditLogs: () => Promise<void>;
    // DQ State
    dqIssues: DQIssue[];
    fetchDQIssues: () => Promise<void>;
    syncDQIssues: () => Promise<void>;
    // Org Unit State
    orgUnits: OrgUnit[];
    fetchOrgUnits: () => Promise<void>;
    createOrgUnit: (data: Partial<OrgUnit>) => Promise<void>;
    deactivateOrgUnit: (id: number) => Promise<void>;
    // App Connection State
    isConnected: boolean;
    system: string;
    checkConnection: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    currentMonth: 'February 2026',
    setMonth: (month) => set({ currentMonth: month }, false),

    payrollRuns: [],
    fetchPayrollRuns: async () => {
        const data = await api.getPayrollRuns(get().currentMonth);
        set({ payrollRuns: data });
    },
    updatePayrollStatus: async (id, action) => {
        await api.updatePayrollStatus(id, action);
        await get().fetchPayrollRuns();
        await get().fetchAuditLogs();
        toast.success(`Run ${id} updated structure via action: ${action}`);
    },

    auditLogs: [],
    fetchAuditLogs: async () => {
        const logs = await api.getAuditLogs();
        set({ auditLogs: logs });
    },

    dqIssues: [],
    fetchDQIssues: async () => {
        const issues = await api.getDQIssues();
        set({ dqIssues: issues });
    },
    syncDQIssues: async () => {
        await api.syncDQIssues();
        await get().fetchDQIssues();
        toast.success('Governance Sync triggered successfully.');
    },

    orgUnits: [],
    fetchOrgUnits: async () => {
        const units = await api.getOrgUnits();
        set({ orgUnits: units });
    },
    createOrgUnit: async (data: Partial<OrgUnit>) => {
        await api.createOrgUnit(data);
        await get().fetchOrgUnits();
        toast.success(`Organization '${data.legalEntity}' added.`);
    },
    deactivateOrgUnit: async (id: number) => {
        await api.deactivateOrgUnit(id);
        await get().fetchOrgUnits();
        toast.success('Organization unit deactivated.');
    },

    isConnected: false,
    system: '',
    checkConnection: async () => {
        const status = await api.checkConnection();
        set({ isConnected: status.connected, system: status.system });
    }
}));
