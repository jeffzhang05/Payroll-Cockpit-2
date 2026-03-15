import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <Header />
                <div className="flex-1 overflow-y-auto w-full p-8 relative scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}
