import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { ActionBadge } from '../components/Badge';
import { Download, Filter, FileText, ChevronDown } from 'lucide-react';

export default function History() {
    const { auditLogs, fetchAuditLogs } = useAppStore();
    const [filterPeriod, setFilterPeriod] = useState('');
    const [filterEntity, setFilterEntity] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    const filteredLogs = useMemo(() => {
        return auditLogs
            .filter(log => filterPeriod ? log.month === filterPeriod : true)
            .filter(log => filterEntity ? log.entity.toLowerCase().includes(filterEntity.toLowerCase()) : true)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [auditLogs, filterPeriod, filterEntity]);

    const handleExport = () => {
        // Simple CSV export
        const headers = ['Timestamp', 'User', 'Entity & Period', 'Action Type', 'Details'];
        const rows = filteredLogs.map(log =>
            `"${log.date}","${log.user}","${log.entity} / ${log.month}","${log.action}","${log.details}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "audit_log.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#0f1623] tracking-tight">Historical Approval Log</h1>
                    <p className="text-gray-500 mt-1">Immutable record of all payroll actions for audit and compliance.</p>
                </div>

                <div className="flex space-x-3 relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 border rounded-lg font-medium flex items-center shadow-sm transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <Filter size={16} className="mr-2" /> Filter <ChevronDown size={14} className="ml-2" />
                    </button>

                    <button
                        onClick={handleExport}
                        className="px-4 py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium flex items-center shadow-sm transition-colors"
                    >
                        <Download size={16} className="mr-2" /> Export CSV
                    </button>

                    {showFilters && (
                        <div className="absolute right-[120px] top-12 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-4 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Advanced Filters</h4>

                            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                            <select className="w-full border border-gray-200 rounded-lg p-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500" value={filterPeriod} title="Period" onChange={e => setFilterPeriod(e.target.value)}>
                                <option value="">All Periods</option>
                                <option value="January 2026">January 2026</option>
                                <option value="February 2026">February 2026</option>
                                <option value="March 2026">March 2026</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
                            <input
                                type="text"
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Acme EMEA"
                                value={filterEntity}
                                onChange={e => setFilterEntity(e.target.value)}
                            />

                            <button
                                onClick={() => { setFilterPeriod(''); setFilterEntity(''); }}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors w-full text-center"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">User / System</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Entity & Period</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Action Type</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="bg-white hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                                        {new Date(log.date).toLocaleString(undefined, {
                                            year: 'numeric', month: '2-digit', day: '2-digit',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 border-x border-transparent group-hover:bg-blue-50/10 flex items-center">
                                        <span className="h-6 w-6 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-[10px] uppercase font-bold text-gray-500">{log.user.substring(0, 2)}</span>
                                        {log.user}
                                    </td>
                                    <td className="px-6 py-4 border-x border-transparent">
                                        <div className="font-bold text-gray-900">{log.entity}</div>
                                        <div className="text-xs text-gray-500">{log.month}</div>
                                    </td>
                                    <td className="px-6 py-4 border-x border-transparent">
                                        <ActionBadge action={log.action} />
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 flex items-start border-x border-transparent group-hover:bg-blue-50/10">
                                        <FileText size={16} className="text-gray-400 mr-2 mt-0.5 min-w-[16px]" />
                                        <span>{log.details}</span>
                                    </td>
                                </tr>
                            ))}

                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 bg-gray-50">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <FileText size={32} className="text-gray-300" />
                                            <span className="font-medium text-gray-600">No audit logs found matching your filters.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
