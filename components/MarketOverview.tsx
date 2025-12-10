"use client";
import React, { useState } from 'react';
import { Asset } from '@/lib/cryptoApi';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { NewsFeed } from './NewsFeed';
import { clsx } from 'clsx';

interface MarketOverviewProps {
    assets: Asset[];
}

export const MarketOverview = ({ assets }: MarketOverviewProps) => {
    const [activeTab, setActiveTab] = useState<'market' | 'news'>('market');

    // Mocks for now, eventually derived from assets logic
    // We can assume assets are sorted by market cap or we receive top movers.
    // Let's just pick random slices for visual demo, assuming assets list is populated.

    // Simple sort for gainers/losers
    const topGainers = assets.slice(0, 5).sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    const topLosers = assets.slice().sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 5);

    return (
        <div className="flex flex-col h-full bg-dark-bg border-l border-[#1a1a1a] w-[280px] shrink-0">
            {/* Tabs Header */}
            <div className="h-8 border-b border-[#1a1a1a] flex bg-dark-bg">
                <button
                    onClick={() => setActiveTab('market')}
                    className={clsx(
                        "flex-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-colors border-r border-[#1a1a1a]",
                        activeTab === 'market' ? "bg-[#1a1a1a] text-white" : "text-[#666] hover:text-[#bbb]"
                    )}
                >
                    Market
                </button>
                <button
                    onClick={() => setActiveTab('news')}
                    className={clsx(
                        "flex-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-colors",
                        activeTab === 'news' ? "bg-[#1a1a1a] text-white" : "text-[#666] hover:text-[#bbb]"
                    )}
                >
                    News
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 flex flex-col">
                {activeTab === 'market' ? (
                    <div className="flex-1 overflow-y-auto no-scrollbar p-0">
                        {/* Gainers */}
                        <div className="p-4 border-b border-[#1a1a1a]">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp size={14} className="text-accent-purple" />
                                <span className="text-xs font-bold text-white">Top Gainers</span>
                            </div>
                            <div className="space-y-2">
                                {topGainers.map(asset => (
                                    <div key={asset.id} className="flex justify-between items-center text-xs">
                                        <span className="font-mono text-[#ccc]">{asset.symbol.toUpperCase()}</span>
                                        <span className="font-mono text-accent-purple">+{asset.price_change_percentage_24h.toFixed(2)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Losers */}
                        <div className="p-4 border-b border-[#1a1a1a]">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingDown size={14} className="text-soft-red" />
                                <span className="text-xs font-bold text-white">Top Losers</span>
                            </div>
                            <div className="space-y-2">
                                {topLosers.map(asset => (
                                    <div key={asset.id} className="flex justify-between items-center text-xs">
                                        <span className="font-mono text-[#ccc]">{asset.symbol.toUpperCase()}</span>
                                        <span className="font-mono text-soft-red">{asset.price_change_percentage_24h.toFixed(2)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Volume */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Activity size={14} className="text-blue-400" />
                                <span className="text-xs font-bold text-white">High Volume</span>
                            </div>
                            <div className="space-y-2">
                                {topGainers.slice(0, 3).map(asset => (
                                    <div key={asset.id} className="flex justify-between items-center text-xs">
                                        <span className="font-mono text-[#ccc]">{asset.symbol.toUpperCase()}</span>
                                        <span className="font-mono text-[#666]">{(asset.total_volume / 1000000).toFixed(0)}M</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <NewsFeed />
                )}
            </div>
        </div>
    );
};
