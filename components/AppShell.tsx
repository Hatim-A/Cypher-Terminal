"use client";
import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { wsManager } from '@/lib/websocketManager';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const { updatePrices } = useStore();

    // Global WebSocket Handler
    useEffect(() => {
        const unsubscribe = wsManager.subscribe((data) => {
            if (Array.isArray(data)) {
                updatePrices(data);
            }
        });
        return () => unsubscribe();
    }, [updatePrices]);

    return (
        <div className="flex h-screen w-full bg-[#0c0c0c] text-[#eaeaea] font-sans overflow-hidden">
            {/* Sidebar REMOVED as per refinement plan */}

            {/* Main Content Area */}
            <main className="flex-1 flex min-w-0 h-full overflow-hidden">
                {children}
            </main>
        </div>
    );
};
