import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { SeverityBadge } from '../components/Badge';
import { RefreshCw, Activity, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Search, SlidersHorizontal, ArrowUpDown, X, ListFilter } from 'lucide-react';


export default function Governance() {
    const { dqIssues, fetchDQIssues, syncDQIssues } = useAppStore();
    const [isSyncing, setIsSyncing] = useState(false);

    // Table State
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // UI State
    const [showRulesModal, setShowRulesModal] = useState(false);

    // Rule Name Mapping Helper
    const getRuleName = (ruleId: string) => {
        const rulesMap: Record<string, string> = {
            'RUL-001': 'Net Pay < 0',
            'RUL-002': 'Overtime Hours > 50',
            'RUL-003': 'Bank Details Missing',
            'RUL-004': 'Gross Pay > 100,000',
            'RUL-005': 'Deductions Exceed Gross Pay',
        };
        return rulesMap[ruleId] || ruleId;
    };

    const staticRulesList = [
        { id: 'RUL-001', field: 'Net Pay', operator: '<', value: '0' },
        { id: 'RUL-002', field: 'Overtime Hours', operator: '>', value: '50' },
        { id: 'RUL-003', field: 'Bank Details', operator: 'Missing', value: 'N/A' },
        { id: 'RUL-004', field: 'Gross Pay', operator: '>', value: '100,000' },
        { id: 'RUL-005', field: 'Deductions', operator: 'Exceed', value: 'Gross Pay' }
    ];

    useEffect(() => {
        fetchDQIssues();
    }, [fetchDQIssues]);

    const handleSync = async () => {
        setIsSyncing(true);
        await syncDQIssues();
        setTimeout(() => setIsSyncing(false), 800); // UI feel
    };

    const overallScore = dqIssues.length > 0 ? (100 - dqIssues.length * 1.5).toFixed(1) : 100;

    const filteredAndSortedIssues = [...dqIssues]
        .filter(issue => severityFilter === 'All' || issue.severity === severityFilter)
        .filter(issue =>
            issue.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.rule.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // Sort by severity weight
            const weight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            const valA = weight[a.severity] || 0;
            const valB = weight[b.severity] || 0;
            return sortOrder === 'desc' ? valB - valA : valA - valB;
        });

    return (
        <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#0f1623] tracking-tight">Data Quality Governance</h1>
                    <p className="text-gray-500 mt-1">Validate and govern payroll results exported from EC Payroll system.</p>
                </div>

                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg font-medium flex items-center transition-all min-w-[190px] justify-center"
                >
                    <RefreshCw size={18} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync from EC Payroll'}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="bg-emerald-600 rounded-xl p-6 shadow-md border border-emerald-500 flex items-center justify-between group hover:-translate-y-1 hover:shadow-lg transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex items-center relative z-10 text-white">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white mr-5 group-hover:rotate-12 transition-transform">
                            <Activity size={28} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-emerald-100 tracking-wide uppercase mb-1">Overall Data Quality</h3>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-4xl font-black">{overallScore}</span>
                                <span className="text-xl font-medium text-emerald-200">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-600 rounded-xl p-6 shadow-md border border-amber-500 flex items-center justify-between group hover:-translate-y-1 hover:shadow-lg transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-500 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex items-center relative z-10 text-white">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white mr-5 group-hover:rotate-12 transition-transform">
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-amber-100 tracking-wide uppercase mb-1">Active Anomalies</h3>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-black">{dqIssues.length}</span>
                                <span className="text-sm font-medium text-amber-200">Issues</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setShowRulesModal(true)}
                    className="bg-indigo-600 rounded-xl p-6 shadow-md border border-indigo-500 flex items-center justify-between group hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex items-center relative z-10 text-white">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white mr-5 group-hover:rotate-12 transition-transform">
                            <ShieldAlert size={28} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-indigo-100 tracking-wide uppercase mb-1">Validation Rules Active</h3>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-black">5</span>
                                <span className="text-sm font-medium text-indigo-200">Rules</span>
                            </div>
                        </div>
                    </div>
                    <ArrowRight size={24} className="text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all relative z-10" />
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle size={20} className="text-amber-500" />
                        <h2 className="text-lg font-bold text-gray-800">Detected Data Anomalies</h2>
                        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2">{filteredAndSortedIssues.length}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search entity, type, or rule..."
                                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="px-3 py-1.5 bg-gray-50 border-r border-gray-200 text-gray-500 flex items-center">
                                <SlidersHorizontal size={14} />
                            </div>
                            <select
                                className="px-3 py-1.5 text-sm outline-none font-medium text-gray-700 bg-transparent"
                                value={severityFilter}
                                title="Severity Filter"
                                onChange={(e) => setSeverityFilter(e.target.value)}
                            >
                                <option value="All">All Severities</option>
                                <option value="Critical">Critical Only</option>
                                <option value="High">High Only</option>
                                <option value="Medium">Medium Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Issue ID</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                                    <div className="flex items-center">Severity <ArrowUpDown size={12} className="ml-1" /></div>
                                </th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Violated Rule</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Entity / EMP</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider w-[35%]">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAndSortedIssues.map((issue) => (
                                <tr key={issue.id} className="bg-white hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{issue.id}</td>
                                    <td className="px-6 py-4"><SeverityBadge severity={issue.severity} /></td>
                                    <td className="px-6 py-4">
                                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded shadow-sm text-xs" title={`Rule Name: ${getRuleName(issue.rule)}`}>
                                            {issue.rule}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">{issue.type}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900 block">{issue.entity}</span>
                                        <span className="text-xs text-gray-500">{issue.employee}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{issue.description}</td>
                                </tr>
                            ))}

                            {filteredAndSortedIssues.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center bg-gray-50">
                                        <div className="flex flex-col justify-center items-center text-gray-500 space-y-2">
                                            {dqIssues.length === 0 ? (
                                                <>
                                                    <CheckCircle2 size={32} className="text-green-500" />
                                                    <span className="font-medium text-lg text-green-700">No anomalies found. Data quality is optimal!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Search size={32} className="text-gray-300" />
                                                    <span className="font-medium">No results match your search or filter configuration.</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Validation Rules Preview Modal */}
            {showRulesModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
                            <div className="flex items-center space-x-3">
                                <ListFilter className="text-indigo-600" size={24} />
                                <h2 className="text-xl font-bold text-gray-900">Active Validation Rules</h2>
                            </div>
                            <button title="Close Rules Preview" onClick={() => setShowRulesModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <p className="text-sm text-gray-500 mb-6">
                                The following data quality checking constraints are currently active on incoming payroll runs.
                                <br />Note: To edit or deactivate these rules, please visit the <b>Configuration Console</b>.
                            </p>

                            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">Rule ID</th>
                                            <th className="px-5 py-3 font-semibold">Validation Condition</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {staticRulesList.map((rule) => (
                                            <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3.5 font-bold text-indigo-700">{rule.id}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">{rule.field}</span>
                                                        <span className="text-indigo-600 font-bold">{rule.operator}</span>
                                                        <span className="font-semibold text-gray-800 bg-amber-50 border border-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">{rule.value}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setShowRulesModal(false)} className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
