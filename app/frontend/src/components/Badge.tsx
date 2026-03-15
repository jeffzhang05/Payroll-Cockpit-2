import React from 'react';
import type { PayrollStatus, DQSseverity, AuditAction } from '../types';

export const StatusBadge = ({ status }: { status: PayrollStatus }) => {
    const map: Record<PayrollStatus, { label: string; bg: string; text: string; icon?: React.ReactNode }> = {
        draft: { label: 'Draft & data quality check', bg: 'bg-[#eff6ff]', text: 'text-blue-700' },
        approval_in_progress: { label: 'Approval in progress', bg: 'bg-orange-50', text: 'text-orange-700' },
        approved: { label: 'Payroll approved', bg: 'bg-green-50', text: 'text-green-700' },
        submitted: { label: 'Submission of payment', bg: 'bg-gray-100', text: 'text-gray-700' },
    };

    const state = map[status];
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${state.bg} ${state.text} flex items-center w-fit shadow-sm border border-transparent`}>
            {state.label}
        </span>
    );
};

export const SeverityBadge = ({ severity }: { severity: DQSseverity }) => {
    const map: Record<DQSseverity, { bg: string; text: string; border: string }> = {
        Critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        High: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
        Medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
        Low: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    };
    const state = map[severity];

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${state.bg} ${state.text} border ${state.border}`}>
            {severity}
        </span>
    );
}

export const ActionBadge = ({ action }: { action: AuditAction | string }) => {
    return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap">
            {action}
        </span>
    );
}
