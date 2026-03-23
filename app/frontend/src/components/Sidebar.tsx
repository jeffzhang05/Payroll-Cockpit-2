import { SideNavigation, SideNavigationItem } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/home.js';
import '@ui5/webcomponents-icons/dist/history.js';
import '@ui5/webcomponents-icons/dist/shield.js';
import '@ui5/webcomponents-icons/dist/action-settings.js';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <SideNavigation
            onSelectionChange={(e) => {
                const target = e.detail.item.dataset.route;
                if (target) navigate(target);
            }}
        >
            <SideNavigationItem
                text="Approval Dash"
                icon="home"
                data-route="/dashboard"
                selected={location.pathname.startsWith('/dashboard')}
            />
            <SideNavigationItem
                text="Historical Log"
                icon="history"
                data-route="/history"
                selected={location.pathname.startsWith('/history')}
            />
            <SideNavigationItem
                text="Data Governance"
                icon="shield"
                data-route="/governance"
                selected={location.pathname.startsWith('/governance')}
            />
            <SideNavigationItem
                text="Configuration"
                icon="action-settings"
                data-route="/config"
                selected={location.pathname.startsWith('/config')}
            />
        </SideNavigation>
    );
}
