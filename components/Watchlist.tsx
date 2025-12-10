"use client";
import React from 'react';
import { Asset } from '@/lib/cryptoApi';
import { useStore } from '@/lib/store';
import { clsx } from 'clsx';
import { ClientOnly } from './ClientOnly';

interface WatchlistProps {
    assets: Asset[];
}

export const Watchlist = ({ assets }: WatchlistProps) => {
    const { priceMap, activeSymbol, setActiveSymbol, searchQuery } = useStore();

    // Filter assets
    const filteredAssets = assets.filter(a =>
        a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-dark-bg border-r border-[#1a1a1a] w-[320px] shrink-0">
            {/* Header / Stats - Search input REMOVED in favor of Global Search */}
            <div className="h-8 border-b border-[#1a1a1a] flex items-center justify-between px-4 bg-dark-bg">
                <span className="text-[10px] text-[#666] font-bold uppercase tracking-wider">Watchlist</span>
                <span className="text-xxs text-[#444]">{filteredAssets.length} Assets</span>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold text-[#888] border-b border-[#1a1a1a] uppercase tracking-wider">
                <div className="col-span-4">Ticker</div>
                <div className="col-span-4 text-right">Price</div>
                <div className="col-span-4 text-right">24h %</div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <ClientOnly fallback={<div className="p-4 text-xs text-[#444]">Loading Assets...</div>}>
                    {filteredAssets.map((asset) => {
                        const tickerKey = `${asset.symbol.toUpperCase()}USDT`;
                        const liveData = priceMap[tickerKey];

                        const currentPrice = liveData ? parseFloat(liveData.c) : asset.current_price;

                        let percentChange = asset.price_change_percentage_24h;
                        if (liveData) {
                            const open = parseFloat(liveData.o || liveData.c); // Fallback if o missing 
                            const close = parseFloat(liveData.c);
                            if (open > 0) percentChange = ((close - open) / open) * 100;
                        }

                        const isUp = percentChange >= 0;
                        const isActive = activeSymbol === asset.id;

                        return (
                            <div
                                key={asset.id}
                                onClick={() => setActiveSymbol(asset.id, asset.symbol)}
                                className={clsx(
                                    "grid grid-cols-12 gap-2 px-4 py-2 items-center border-b border-[#1a1a1a] cursor-pointer hover:bg-[#1a1a1a] transition-colors group",
                                    isActive && "bg-[#1a1a1a] border-l-2 border-l-accent-purple -ml-[2px]"
                                )}
                            >
                                <div className="col-span-4 flex flex-col">
                                    <span className={clsx("text-xs font-bold font-mono", isActive ? "text-white" : "text-[#eaeaea]")}>
                                        {asset.symbol.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] text-[#444] group-hover:text-[#666]">USDT</span>
                                </div>

                                <div className="col-span-4 text-right">
                                    <span className={clsx("text-xs font-mono tracking-tight", isActive ? "text-white" : "text-[#eaeaea]")}>
                                        {currentPrice < 1 ? currentPrice.toFixed(6) : currentPrice.toFixed(2)}
                                    </span>
                                </div>

                                <div className={clsx("col-span-4 text-right text-xs font-mono font-bold", isUp ? "text-accent-purple" : "text-neon-red")}>
                                    {isUp ? '+' : ''}{(percentChange || 0).toFixed(2)}%
                                </div>
                            </div>
                        );
                    })}
                </ClientOnly>
            </div>
        </div>
    );
};
