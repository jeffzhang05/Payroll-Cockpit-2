import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../store';
import type { PayrollRun } from '../types';
import { StatusBadge } from '../components/Badge';
import ApprovalModal from '../components/ApprovalModal';
import { Info, RefreshCw, CheckCircle2, Database, Building2, Search, Mail, Eye } from 'lucide-react';

export default function Dashboard() {
    const { currentMonth, setMonth, payrollRuns, fetchPayrollRuns } = useAppStore();
    const [search, setSearch] = useState('');
    const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);

    useEffect(() => {
        fetchPayrollRuns();
    }, [currentMonth, fetchPayrollRuns]);

    const filteredRuns = useMemo(() => {
        return payrollRuns.filter(run =>
            run.company.toLowerCase().includes(search.toLowerCase())
        );
    }, [payrollRuns, search]);

    const stats = useMemo(() => ({
        draft: payrollRuns.filter(r => r.status === 'draft').length,
        approval_in_progress: payrollRuns.filter(r => r.status === 'approval_in_progress').length,
        approved: payrollRuns.filter(r => r.status === 'approved').length,
        submitted: payrollRuns.filter(r => r.status === 'submitted').length,
    }), [payrollRuns]);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#0f1623] tracking-tight">Payroll Approval Dashboard</h1>
                    <p className="text-gray-500 mt-1">Track and manage payroll approvals across all entities.</p>
                </div>
                <select
                    value={currentMonth}
                    title="Period Filter"
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm font-medium w-48"
                >
                    <option value="January 2026">January 2026</option>
                    <option value="February 2026">February 2026</option>
                    <option value="March 2026">March 2026</option>
                </select>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-l-4 border-gray-100 border-l-blue-500 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Draft & DQ Check</span>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Info size={20} /></div>
                    </div>
                    <span className="text-4xl font-black text-gray-900">{stats.draft}</span>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-l-4 border-gray-100 border-l-orange-500 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase w-2/3 leading-tight">Approval In Progress</span>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><RefreshCw size={20} /></div>
                    </div>
                    <span className="text-4xl font-black text-gray-900">{stats.approval_in_progress}</span>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-l-4 border-gray-100 border-l-green-500 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Payroll Approved</span>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle2 size={20} /></div>
                    </div>
                    <span className="text-4xl font-black text-gray-900">{stats.approved}</span>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-l-4 border-gray-100 border-l-gray-500 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase w-2/3 leading-tight">Submission of Payment</span>
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><Database size={20} /></div>
                    </div>
                    <span className="text-4xl font-black text-gray-900">{stats.submitted}</span>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Entity Approval Status</h2>
                    <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 shadow-sm transition-all outline-none"
                            placeholder="Search entity..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Run ID</th>
                                <th className="px-6 py-4 font-semibold">Company</th>
                                <th className="px-6 py-4 font-semibold text-right">Employees</th>
                                <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRuns.map((run) => (
                                <tr key={run.id} className="bg-white hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedRun(run)}>{run.id}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center"><Building2 size={16} className="text-gray-400 mr-2" /> {run.company}</td>
                                    <td className="px-6 py-4 text-right font-medium">{run.employees.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-900">{run.totalAmount}</td>
                                    <td className="px-6 py-4"><StatusBadge status={run.status} /></td>
                                    <td className="px-6 py-4 text-center">
                                        {run.status === 'draft' && <button onClick={() => setSelectedRun(run)} className="px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm font-medium flex items-center mx-auto opacity-0 group-hover:opacity-100 transition-all"><Mail size={12} className="mr-1" /> Req. Approval</button>}
                                        {run.status === 'approval_in_progress' && <button onClick={() => setSelectedRun(run)} className="px-3 py-1.5 text-xs text-white bg-orange-500 hover:bg-orange-600 rounded shadow-sm font-medium flex items-center mx-auto opacity-0 group-hover:opacity-100 transition-all"><CheckCircle2 size={12} className="mr-1" /> Force Approve</button>}
                                        {run.status === 'approved' && <button onClick={() => setSelectedRun(run)} className="px-3 py-1.5 text-xs text-white bg-green-600 hover:bg-green-700 rounded shadow-sm font-medium flex items-center mx-auto opacity-0 group-hover:opacity-100 transition-all"><Database size={12} className="mr-1" /> Release for Pmt</button>}
                                        {run.status === 'submitted' && <button onClick={() => setSelectedRun(run)} className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded font-medium flex items-center mx-auto opacity-0 group-hover:opacity-100 transition-all"><Eye size={12} className="mr-1" /> View Details</button>}
                                    </td>
                                </tr>
                            ))}
                            {filteredRuns.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-gray-50/30">
                                        No payroll runs found for this search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedRun && (
                <ApprovalModal
                    run={selectedRun}
                    isOpen={!!selectedRun}
                    onClose={() => setSelectedRun(null)}
                />
            )}
        </div>
    );
}
