import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { SeverityBadge } from '../components/Badge';
import { RefreshCw, Activity, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Governance() {
    const { dqIssues, fetchDQIssues, syncDQIssues } = useAppStore();
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        fetchDQIssues();
    }, [fetchDQIssues]);

    const handleSync = async () => {
        setIsSyncing(true);
        await syncDQIssues();
        setTimeout(() => setIsSyncing(false), 800); // UI feel
    };

    const overallScore = dqIssues.length > 0 ? (100 - dqIssues.length * 1.5).toFixed(1) : 100;

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
                <div className="bg-white rounded-xl p-6 shadow-sm border border-l-4 border-gray-100 border-l-green-500 flex items-center group hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600 mr-5 group-hover:scale-110 transition-transform">
                        <Activity size={28} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-1">Overall Data Quality</h3>
                        <span className="text-4xl font-black text-gray-900">{overallScore}%</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-l-4 border-gray-100 border-l-orange-500 flex items-center group hover:shadow-md transition-shadow">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600 mr-5 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={28} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-1">Active Anomalies</h3>
                        <span className="text-4xl font-black text-gray-900">{dqIssues.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-l-4 border-gray-100 border-l-blue-500 flex items-center group hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mr-5 group-hover:scale-110 transition-transform">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-1">Validation Rules Active</h3>
                        <span className="text-4xl font-black text-gray-900">12</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center space-x-2 bg-amber-50/50">
                    <AlertTriangle size={20} className="text-amber-500" />
                    <h2 className="text-lg font-bold text-gray-800">Detected Data Anomalies</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Issue ID</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Severity</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Entity / EMP</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider w-[40%]">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {dqIssues.map((issue) => (
                                <tr key={issue.id} className="bg-white hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{issue.id}</td>
                                    <td className="px-6 py-4"><SeverityBadge severity={issue.severity} /></td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">{issue.type}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900 block">{issue.entity}</span>
                                        <span className="text-xs text-gray-500">{issue.employee}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{issue.description}</td>
                                </tr>
                            ))}

                            {dqIssues.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center bg-gray-50">
                                        <div className="flex justify-center items-center space-x-3 text-green-600">
                                            <CheckCircle2 size={32} />
                                            <span className="font-medium text-lg">No anomalies found. Data quality is optimal!</span>
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
