import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { useEffect } from 'react';
import { ShellBar, ShellBarItem, Avatar } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/refresh.js';
import '@ui5/webcomponents-icons/dist/employee.js';

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
        <ShellBar
            primaryTitle="Payroll Cockpit"
            secondaryTitle={`${currentModule} | ${isConnected ? `Connected to ${system}` : 'Offline'}`}
            profile={<Avatar icon="employee" initials="JD" colorScheme="Accent6" />}
        >
            <ShellBarItem
                icon="refresh"
                text="Refresh Connection"
                onClick={checkConnection}
            />
        </ShellBar>
    );
}
