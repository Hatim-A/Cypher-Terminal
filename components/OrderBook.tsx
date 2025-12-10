"use client";
import React from 'react';
import { useStore } from '@/lib/store';

// Helper to render bars
const DepthRow = ({ price, size, total, type }: { price: number, size: number, total: number, type: 'bid' | 'ask' }) => {
    const widthPercentage = Math.min((size / total) * 100, 100);

    return (
        <div className="flex justify-between items-center relative h-[18px] px-2 text-[10px] font-mono group hover:bg-[#1a1a1a] cursor-pointer">
            {/* Visual Bar Background */}
            <div
                className={`absolute top-0 bottom-0 opacity-10 ${type === 'bid' ? 'right-0 bg-accent-purple' : 'left-0 bg-soft-red'}`}
                style={{ width: `${widthPercentage}%` }}
            />

            {/* Context */}
            {type === 'bid' ? (
                <>
                    <span className="z-10 text-[#666]">{size.toFixed(4)}</span>
                    <span className="z-10 text-accent-purple">{price.toFixed(2)}</span>
                </>
            ) : (
                <>
                    <span className="z-10 text-soft-red">{price.toFixed(2)}</span>
                    <span className="z-10 text-[#666]">{size.toFixed(4)}</span>
                </>
            )}
        </div>
    );
}

export const OrderBook = () => {
    const { activeTicker, priceMap } = useStore();
    const tickerKey = `${activeTicker.toUpperCase()}USDT`;
    const live = priceMap[tickerKey];

    // Default safe price for SSR
    const price = live ? parseFloat(live.c) : 42000;

    // Hydration Fix: Use state to ensure random data is Client-side only
    const [depth, setDepth] = React.useState<{ bids: any[], asks: any[], maxVol: number } | null>(null);

    React.useEffect(() => {
        // Generate random depth on client only to match "random" nature without mismatch
        // Ideally this comes from WS
        const spread = price * 0.0005;
        const bids = [...Array(15)].map((_, i) => ({
            price: price - spread - (i * spread),
            size: Math.random() * 2 + 0.1
        }));
        const asks = [...Array(15)].map((_, i) => ({
            price: price + spread + (i * spread),
            size: Math.random() * 2 + 0.1
        }));
        const maxVol = Math.max(...bids.map(b => b.size), ...asks.map(a => a.size)) * 1.5;

        setDepth({ bids, asks, maxVol });
    }, [price]); // Re-generate when price changes significantly? 
    // Actually, triggering this on every price update might be too jittery. 
    // But user asked for "smooth updates".
    // For now, let's keep it simple: fix hydration first.

    if (!depth) return <div className="flex-1 bg-[#111111] animate-pulse"></div>;

    const { bids, asks, maxVol } = depth;

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-dark-bg">
            {/* Header */}
            <div className="h-8 border-b border-dark-border flex items-center px-4 justify-between bg-dark-bg">
                <span className="text-[10px] text-[#666] font-bold uppercase">Order Book</span>
                <span className="text-[10px] text-[#444]">Spread: 0.02%</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex min-h-0 min-w-0">
                {/* Bids Side */}
                <div className="flex-1 flex flex-col border-r border-[#1a1a1a]">
                    <div className="px-2 py-1 text-[9px] text-[#444] font-bold uppercase text-right border-b border-[#1a1a1a] flex justify-between">
                        <span>Size</span>
                        <span>Bid</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {bids.map((b, i) => (
                            <DepthRow key={i} price={b.price} size={b.size} total={maxVol} type="bid" />
                        ))}
                    </div>
                </div>

                {/* Asks Side */}
                <div className="flex-1 flex flex-col">
                    <div className="px-2 py-1 text-[9px] text-[#444] font-bold uppercase text-left border-b border-[#1a1a1a] flex justify-between">
                        <span>Ask</span>
                        <span>Size</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {asks.map((a, i) => (
                            <DepthRow key={i} price={a.price} size={a.size} total={maxVol} type="ask" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
