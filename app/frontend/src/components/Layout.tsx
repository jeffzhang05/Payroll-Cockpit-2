import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <Sidebar />
                <main style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', backgroundColor: 'var(--sapBackgroundColor)' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
