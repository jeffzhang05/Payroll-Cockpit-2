import type { PayrollRun, AuditLog, DQIssue, OrgUnit } from '../types';

const BASE_URL = '/api';

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
        const data = await res.json();
        return data.value !== undefined ? data.value : data;
    }

    // Connection
    async checkConnection(): Promise<{ connected: boolean; system: string }> {
        return this.fetch('/connectionStatus()');
    }

    // Payroll Runs
    async getPayrollRuns(month?: string): Promise<PayrollRun[]> {
        const filter = month ? `$filter=month eq '${month}'&` : '';
        return this.fetch(`/PayrollRun?${filter}$orderby=lastUpdated desc`);
    }

    async updatePayrollStatus(id: string, action: string): Promise<PayrollRun> {
        return this.fetch(`/changePayrollStatus`, {
            method: 'POST',
            body: JSON.stringify({ id, action }),
        });
    }

    // Audit Logs
    async getAuditLogs(): Promise<AuditLog[]> {
        return this.fetch(`/AuditLog?$orderby=id desc`);
    }

    // DQ Issues
    async getDQIssues(): Promise<DQIssue[]> {
        return this.fetch('/DQIssue');
    }

    async syncDQIssues(): Promise<{ message: string; count: number }> {
        return this.fetch('/syncDQIssues', { method: 'POST' });
    }

    // Org Units
    async getOrgUnits(): Promise<OrgUnit[]> {
        return this.fetch('/OrgUnit');
    }

    async createOrgUnit(data: Partial<OrgUnit>): Promise<OrgUnit> {
        return this.fetch('/OrgUnit', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deactivateOrgUnit(id: number): Promise<OrgUnit> {
        return this.fetch(`/deactivateOrgUnit`, { 
            method: 'POST',
            body: JSON.stringify({ id })
        });
    }
}

export const api = new ApiClient();
