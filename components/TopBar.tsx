"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { ClientOnly } from './ClientOnly';
import { useStore } from '@/lib/store';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 text-xs font-mono">
            <span>{format(time, "HH:mm:ss")}</span>
            <span className="text-[#666]">UTC</span>
        </div>
    );
};

export const TopBar = () => {
    const { searchQuery, setSearchQuery } = useStore();
    // Assuming ticker and currentPrice are available from a store or props,
    // for this example, we'll mock them to ensure the code is syntactically correct.
    const ticker = "BTCUSDT";
    const currentPrice = 65000.50;

    return (
        <header className="h-10 bg-dark-bg border-b border-dark-border flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-6">
                {/* Simplified Branding */}
                <div className="text-sm font-medium text-white tracking-wide">
                    Cipher Terminal
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                    <input
                        type="text"
                        placeholder="Search Ticker..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#111] border border-[#1a1a1a] rounded-sm pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-[#333] transition-colors w-64 h-7 placeholder:text-[#444]"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ClientOnly>
                    <Clock />
                </ClientOnly>
            </div>
        </header>
    );
};
