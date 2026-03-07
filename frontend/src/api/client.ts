import type { PayrollRun, AuditLog, DQIssue, OrgUnit } from '../types';

const BASE_URL = 'http://localhost:3000/api';

class ApiClient {
    private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        if (!res.ok) {
            throw new Error(`API error: ${res.statusText}`);
        }
        return res.json();
    }

    // Connection
    async checkConnection(): Promise<{ connected: boolean; system: string }> {
        return this.fetch('/connection-status');
    }

    // Payroll Runs
    async getPayrollRuns(month?: string): Promise<PayrollRun[]> {
        const query = month ? `?month=${encodeURIComponent(month)}` : '';
        return this.fetch(`/payroll-runs${query}`);
    }

    async updatePayrollStatus(id: string, action: string): Promise<PayrollRun> {
        return this.fetch(`/payroll-runs/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ action }),
        });
    }

    // Audit Logs
    async getAuditLogs(): Promise<AuditLog[]> {
        return this.fetch('/audit-log');
    }

    // DQ Issues
    async getDQIssues(): Promise<DQIssue[]> {
        return this.fetch('/dq-issues');
    }

    async syncDQIssues(): Promise<{ message: string; count: number }> {
        return this.fetch('/dq-issues/sync', { method: 'POST' });
    }

    // Org Units
    async getOrgUnits(): Promise<OrgUnit[]> {
        return this.fetch('/org-units');
    }

    async createOrgUnit(data: Partial<OrgUnit>): Promise<OrgUnit> {
        return this.fetch('/org-units', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deactivateOrgUnit(id: number): Promise<OrgUnit> {
        return this.fetch(`/org-units/${id}/deactivate`, { method: 'PATCH' });
    }
}

export const api = new ApiClient();
