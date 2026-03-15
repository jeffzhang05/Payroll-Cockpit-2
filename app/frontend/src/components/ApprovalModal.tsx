import { useState } from 'react';
import type { PayrollRun } from '../types';
import { StatusBadge } from './Badge';
import { X, Building2, CalendarDays, Users, DollarSign, CheckCircle2, RefreshCw, Send, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store';

interface Props {
    run: PayrollRun;
    isOpen: boolean;
    onClose: () => void;
}

export default function ApprovalModal({ run, isOpen, onClose }: Props) {
    const { updatePayrollStatus } = useAppStore();
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleAction = async (action: string) => {
        setIsSubmitting(true);
        await updatePayrollStatus(run.id, action);
        setComment('');
        setIsSubmitting(false);
        onClose();
    };

    const getActionButtons = () => {
        switch (run.status) {
            case 'draft':
                return (
                    <>
                        <button onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancel</button>
                        <button onClick={() => handleAction('request_approval')} disabled={isSubmitting} className="px-5 py-2 ms-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center transition-colors">
                            <Send size={16} className="mr-2" /> Request Email Approval
                        </button>
                    </>
                );
            case 'approval_in_progress':
                return (
                    <>
                        <button onClick={() => handleAction('reject')} disabled={isSubmitting} className="px-5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors">Reject / Re-run</button>
                        <div className="flex-1"></div>
                        <button onClick={() => handleAction('force_approve')} disabled={isSubmitting} className="px-5 py-2 ms-3 text-white bg-orange-500 hover:bg-orange-600 shadow-sm rounded-lg font-medium flex items-center transition-colors">
                            <CheckCircle2 size={16} className="mr-2" /> Force Approve
                        </button>
                    </>
                );
            case 'approved':
                return (
                    <>
                        <button onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancel</button>
                        <button onClick={() => handleAction('release')} disabled={isSubmitting} className="px-5 py-2 ms-3 text-white bg-green-600 hover:bg-green-700 shadow-sm rounded-lg font-medium flex items-center transition-colors">
                            Release for Payment
                        </button>
                    </>
                )
            default:
                return <button onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Close View</button>;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10"><Building2 size={120} /></div>
                    <div className="relative z-10 w-full">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-blue-600 tracking-wide">{run.id}</span>
                            <button onClick={onClose} title="Close modal" className="text-gray-400 hover:text-gray-900 rounded-full p-1 bg-white shadow-sm border border-gray-100"><X size={20} /></button>
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#0f1623] mb-3">{run.company}</h2>
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="flex items-center text-gray-500 text-sm"><CalendarDays size={16} className="mr-1.5" />{run.month}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-xs text-gray-400 font-medium">Updated: {new Date(run.lastUpdated).toLocaleString()}</span>
                        </div>
                        <StatusBadge status={run.status} />
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">

                    {/* KPIs */}
                    <div className="grid grid-cols-4 gap-4 mb-10">
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col shadow-sm">
                            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center"><Users size={12} className="mr-1" /> Headcount</span>
                            <span className="text-2xl font-bold text-gray-900">{run.employees.toLocaleString()}</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col shadow-sm">
                            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center"><DollarSign size={12} className="mr-1" /> Total Payout</span>
                            <span className="text-2xl font-bold text-gray-900">{run.totalAmount}</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col shadow-sm">
                            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center"><RefreshCw size={12} className="mr-1" /> MoM Var</span>
                            <span className="text-2xl font-bold text-green-600">+1.2%</span>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col shadow-sm">
                            <span className="text-red-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center"><AlertTriangle size={12} className="mr-1" /> DQ Issues</span>
                            <span className="text-2xl font-bold text-red-700">0</span>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Financial Summary</h3>
                    <table className="w-full text-left mb-8 text-sm">
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors"><td className="py-3 px-2 text-gray-600">Base Salary</td><td className="py-3 px-2 text-right font-medium">$3,840,000</td></tr>
                            <tr className="hover:bg-gray-50 transition-colors"><td className="py-3 px-2 text-gray-600">Overtime & Bonuses</td><td className="py-3 px-2 text-right font-medium">$450,000</td></tr>
                            <tr className="hover:bg-gray-50 transition-colors"><td className="py-3 px-2 text-gray-600">Employer Taxes</td><td className="py-3 px-2 text-right font-medium">$600,000</td></tr>
                            <tr className="hover:bg-gray-50 transition-colors"><td className="py-3 px-2 text-gray-600">Benefits & Contributions</td><td className="py-3 px-2 text-right font-medium">$350,000</td></tr>
                            <tr className="bg-gray-50"><td className="py-4 px-3 font-bold text-gray-900 rounded-l-lg">Total Run Value</td><td className="py-4 px-3 text-right font-bold text-gray-900 text-lg rounded-r-lg">{run.totalAmount}</td></tr>
                        </tbody>
                    </table>

                    {run.status !== 'submitted' && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Audit Notes / Justification</label>
                            <textarea
                                className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm resize-none bg-gray-50 focus:bg-white"
                                rows={4}
                                placeholder="Enter justification for this action to be recorded in the audit log..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-slate-50 flex items-center justify-end shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
                    {getActionButtons()}
                </div>

            </div>
        </div>
    );
}
