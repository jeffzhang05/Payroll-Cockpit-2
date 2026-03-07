import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, ShieldAlert, Settings } from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { to: '/dashboard', label: 'Approval Dash', icon: LayoutDashboard },
        { to: '/history', label: 'Historical Log', icon: History },
        { to: '/governance', label: 'Data Governance', icon: ShieldAlert },
        { to: '/config', label: 'Configuration', icon: Settings },
    ];

    return (
        <aside className="w-[260px] bg-[#0f1623] text-white flex flex-col h-full shadow-lg">
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <LayoutDashboard size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Payroll Cockpit</h2>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-semibold ml-10">SAP BTP Extension</p>
            </div>

            <nav className="flex-1 py-6 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                                ? 'bg-[#1a2332] text-white border-r-4 border-blue-500'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-[#161f2e]'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-gray-800 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                    JD
                </div>
                <div>
                    <p className="text-sm font-medium">Jane Doe</p>
                    <p className="text-xs text-gray-400">Global Payroll Admin</p>
                </div>
            </div>
        </aside>
    );
}
