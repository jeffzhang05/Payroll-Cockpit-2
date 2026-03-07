import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function Header() {
    const { isConnected, system, checkConnection } = useAppStore();
    const location = useLocation();

    useEffect(() => {
        checkConnection();
    }, [checkConnection]);

    const breadcrumbMap: Record<string, string> = {
        '/dashboard': 'Payroll Approval Dashboard',
        '/history': 'Historical Approval Log',
        '/governance': 'Data Quality Governance',
        '/config': 'Configuration Console',
    };

    const currentModule = breadcrumbMap[location.pathname] || 'Dashboard';

    return (
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-100 z-10 w-full relative">
            <div className="flex items-center text-gray-500 text-sm font-medium">
                <span className="hover:text-gray-700 cursor-pointer">Your Payroll Cockpit</span>
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-gray-900 font-semibold">{currentModule}</span>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={checkConnection}
                    className="text-gray-400 hover:text-blue-600 transition-colors mr-2"
                    title="Refresh Connection Status"
                >
                    <RefreshCw size={16} />
                </button>
                <div className={`px-3 py-1.5 rounded-full border ${isConnected ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} flex items-center shadow-sm`}>
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(22,163,74,0.5)] animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.5)]'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-wider">{isConnected ? `Connected to ${system}` : 'Disconnected'}</span>
                </div>
            </div>
        </header>
    );
}
