import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../store';
import type { PayrollRun } from '../types';
import { StatusBadge } from '../components/Badge';
import ApprovalModal from '../components/ApprovalModal';
import { Info, RefreshCw, CheckCircle2, Database, Building2, Search, Mail, Eye } from 'lucide-react';

export default function Dashboard() {
    const { currentMonth, setMonth, payrollRuns, fetchPayrollRuns } = useAppStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);

    useEffect(() => {
        fetchPayrollRuns();
    }, [currentMonth, fetchPayrollRuns]);

    const filteredRuns = useMemo(() => {
        return payrollRuns.filter(run => {
            const matchesSearch = run.company.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter ? run.status === statusFilter : true;
            return matchesSearch && matchesStatus;
        });
    }, [payrollRuns, search, statusFilter]);

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
                    <option value="October 2025">October 2025</option>
                    <option value="November 2025">November 2025</option>
                    <option value="December 2025">December 2025</option>
                    <option value="January 2026">January 2026</option>
                    <option value="February 2026">February 2026</option>
                    <option value="March 2026">March 2026</option>
                </select>
            </div>

            <nav aria-label="Progress" className="mb-8 animate-in slide-in-from-bottom-4 duration-700">
                <ol role="list" className="divide-y divide-gray-100 rounded-2xl border border-gray-100 md:flex md:divide-y-0 shadow-sm bg-white overflow-hidden">

                    {/* Stage 1: Draft */}
                    <li
                        onClick={() => setStatusFilter(statusFilter === 'draft' ? null : 'draft')}
                        className={`relative md:flex md:flex-1 transition-all cursor-pointer group ${statusFilter === 'draft' ? 'bg-blue-50/80 shadow-inner' : 'hover:bg-blue-50/40'} ${statusFilter && statusFilter !== 'draft' ? 'opacity-40 grayscale' : ''}`}
                    >
                        <div className="flex items-center px-6 py-5 w-full">
                            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all shadow-sm duration-300 ${statusFilter === 'draft' ? 'bg-blue-600 text-white scale-110' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white'}`}>
                                <Info size={24} />
                            </div>
                            <div className="ml-4 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-0.5">
                                    <span className={`text-sm tracking-wide uppercase ${statusFilter === 'draft' ? 'font-black text-blue-900' : 'font-bold text-gray-900'}`}>Draft & DQ</span>
                                    <span className={`border py-0.5 px-3 rounded-full text-sm font-black shadow-sm transition-colors ${statusFilter === 'draft' ? 'bg-blue-100 border-blue-200 text-blue-800' : 'bg-white border-gray-200 text-gray-800 group-hover:border-blue-200 group-hover:text-blue-700'}`}>{stats.draft}</span>
                                </div>
                                <span className={`text-xs font-medium ${statusFilter === 'draft' ? 'text-blue-700' : 'text-gray-500'}`}>Initial Validation</span>
                            </div>
                        </div>
                        {/* Arrow separator */}
                        <div className="absolute top-0 right-0 hidden h-full w-6 md:block">
                            <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                                <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeWidth={2} strokeLinejoin="round" />
                            </svg>
                        </div>
                    </li>

                    {/* Stage 2: Approval In Progress */}
                    <li
                        onClick={() => setStatusFilter(statusFilter === 'approval_in_progress' ? null : 'approval_in_progress')}
                        className={`relative md:flex md:flex-1 transition-all cursor-pointer group ${statusFilter === 'approval_in_progress' ? 'bg-orange-50/80 shadow-inner' : 'hover:bg-orange-50/40'} ${statusFilter && statusFilter !== 'approval_in_progress' ? 'opacity-40 grayscale' : ''}`}
                    >
                        <div className="flex items-center px-6 py-5 w-full">
                            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all shadow-sm duration-300 ${statusFilter === 'approval_in_progress' ? 'bg-orange-500 text-white scale-110' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-400 group-hover:text-white'}`}>
                                <RefreshCw size={24} className={statusFilter === 'approval_in_progress' ? 'animate-spin-slow' : 'group-hover:rotate-180 transition-transform duration-500'} />
                            </div>
                            <div className="ml-4 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-0.5">
                                    <span className={`text-sm tracking-wide uppercase ${statusFilter === 'approval_in_progress' ? 'font-black text-orange-900' : 'font-bold text-gray-900'}`}>Approvals</span>
                                    <span className={`border py-0.5 px-3 rounded-full text-sm font-black shadow-sm transition-colors ${statusFilter === 'approval_in_progress' ? 'bg-orange-100 border-orange-200 text-orange-800' : 'bg-white border-gray-200 text-gray-800 group-hover:border-orange-200 group-hover:text-orange-700'}`}>{stats.approval_in_progress}</span>
                                </div>
                                <span className={`text-xs font-medium ${statusFilter === 'approval_in_progress' ? 'text-orange-700' : 'text-gray-500'}`}>Pending Sign-off</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 hidden h-full w-6 md:block">
                            <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                                <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeWidth={2} strokeLinejoin="round" />
                            </svg>
                        </div>
                    </li>

                    {/* Stage 3: Approved */}
                    <li
                        onClick={() => setStatusFilter(statusFilter === 'approved' ? null : 'approved')}
                        className={`relative md:flex md:flex-1 transition-all cursor-pointer group ${statusFilter === 'approved' ? 'bg-green-50/80 shadow-inner' : 'hover:bg-green-50/40'} ${statusFilter && statusFilter !== 'approved' ? 'opacity-40 grayscale' : ''}`}
                    >
                        <div className="flex items-center px-6 py-5 w-full">
                            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all shadow-sm duration-300 ${statusFilter === 'approved' ? 'bg-green-600 text-white scale-110' : 'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white'}`}>
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="ml-4 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-0.5">
                                    <span className={`text-sm tracking-wide uppercase ${statusFilter === 'approved' ? 'font-black text-green-900' : 'font-bold text-gray-900'}`}>Approved</span>
                                    <span className={`border py-0.5 px-3 rounded-full text-sm font-black shadow-sm transition-colors ${statusFilter === 'approved' ? 'bg-green-100 border-green-200 text-green-800' : 'bg-white border-gray-200 text-gray-800 group-hover:border-green-200 group-hover:text-green-700'}`}>{stats.approved}</span>
                                </div>
                                <span className={`text-xs font-medium ${statusFilter === 'approved' ? 'text-green-700' : 'text-gray-500'}`}>Ready for Release</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 hidden h-full w-6 md:block">
                            <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                                <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeWidth={2} strokeLinejoin="round" />
                            </svg>
                        </div>
                    </li>

                    {/* Stage 4: Submitted */}
                    <li
                        onClick={() => setStatusFilter(statusFilter === 'submitted' ? null : 'submitted')}
                        className={`relative md:flex md:flex-1 transition-all cursor-pointer group ${statusFilter === 'submitted' ? 'bg-gray-100/80 shadow-inner' : 'hover:bg-gray-50/40'} ${statusFilter && statusFilter !== 'submitted' ? 'opacity-40 grayscale' : ''}`}
                    >
                        <div className="flex items-center px-6 py-5 w-full">
                            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all shadow-sm duration-300 ${statusFilter === 'submitted' ? 'bg-gray-700 text-white scale-110' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-600 group-hover:text-white'}`}>
                                <Database size={24} />
                            </div>
                            <div className="ml-4 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-0.5">
                                    <span className={`text-sm tracking-wide uppercase ${statusFilter === 'submitted' ? 'font-black text-gray-900' : 'font-bold text-gray-900'}`}>Submitted</span>
                                    <span className={`border py-0.5 px-3 rounded-full text-sm font-black shadow-sm transition-colors ${statusFilter === 'submitted' ? 'bg-gray-200 border-gray-300 text-gray-900' : 'bg-white border-gray-200 text-gray-800 group-hover:border-gray-300 group-hover:text-gray-900'}`}>{stats.submitted}</span>
                                </div>
                                <span className={`text-xs font-medium ${statusFilter === 'submitted' ? 'text-gray-700' : 'text-gray-500'}`}>Sent to Banking</span>
                            </div>
                        </div>
                    </li>

                </ol>
            </nav>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800">Entity Approval Status</h2>
                        {statusFilter && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 animate-in fade-in zoom-in duration-300">
                                Filtered by: {statusFilter.replace(/_/g, ' ').toUpperCase()}
                                <button onClick={() => setStatusFilter(null)} className="hover:text-red-500 hover:bg-blue-100 rounded-full p-0.5 transition-colors">
                                    <Search size={12} className="hidden" /> {/* just a trick for spacing if needed, let's use a clear X */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </span>
                        )}
                    </div>
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
