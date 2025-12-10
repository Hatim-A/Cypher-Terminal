"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useWebSocket } from '@/hooks/useWebSocket';

export const OrderBook = ({ symbol }: { symbol: string }) => {
    const [bids, setBids] = useState<[string, string][]>([]);
    const [asks, setAsks] = useState<[string, string][]>([]);

    // Subscribe to diff depth stream for live updates (simplified uses depth 20 stream)
    const stream = `${symbol.toLowerCase()}@depth20@100ms`;
    const { lastMessage } = useWebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

    useEffect(() => {
        if (lastMessage) {
            setBids(lastMessage.bids);
            setAsks(lastMessage.asks.reverse()); // Asks usually come cheap to expensive, we want expensive at top for standard vertical view? 
            // Actually typical styling is Asks (Red) on top (Expensive -> Cheap) and Bids (Green) on bottom (Expensive -> Cheap) but standard arrays are sorted by price.
            // Binance depth: bids are desc, asks are asc.
            // We want asks to be shown from header down... let's just reverse asks so the lowest ask is at the bottom (closest to spread).
        }
    }, [lastMessage]);

    return (
        <Card className="h-full border-l border-t-0 border-b-0 border-r-0 rounded-none border-border">
            <CardHeader className="py-3 px-4 border-b border-border">
                <CardTitle className="text-sm font-medium">Order Book</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs font-mono">
                <div className="grid grid-cols-3 px-4 py-2 text-muted-foreground border-b border-border/50">
                    <div>Price</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Total</div>
                </div>

                {/* Asks (Sells) - Red */}
                <div className="flex flex-col-reverse justify-end h-[200px] overflow-hidden relative">
                    {asks.map(([price, amount], i) => (
                        <div key={`ask-${i}`} className="grid grid-cols-3 px-4 py-0.5 hover:bg-white/5 relative z-10">
                            <span className="text-terminal-red">{parseFloat(price).toFixed(2)}</span>
                            <span className="text-right text-gray-400">{parseFloat(amount).toFixed(4)}</span>
                            <span className="text-right text-gray-500">{(parseFloat(price) * parseFloat(amount)).toFixed(2)}</span>
                            {/* Optional Depth Bar could go here */}
                        </div>
                    ))}
                </div>

                {/* Spread */}
                <div className="px-4 py-2 bg-white/5 border-y border-border/50 text-center font-bold text-lg">
                    {asks.length > 0 && bids.length > 0 ? (
                        <span className="text-white">
                            {((parseFloat(asks[asks.length - 1][0]) + parseFloat(bids[0][0])) / 2).toFixed(2)}
                        </span>
                    ) : '-'}
                </div>

                {/* Bids (Buys) - Green */}
                <div className="h-[200px] overflow-hidden">
                    {bids.map(([price, amount], i) => (
                        <div key={`bid-${i}`} className="grid grid-cols-3 px-4 py-0.5 hover:bg-white/5">
                            <span className="text-terminal-green">{parseFloat(price).toFixed(2)}</span>
                            <span className="text-right text-gray-400">{parseFloat(amount).toFixed(4)}</span>
                            <span className="text-right text-gray-500">{(parseFloat(price) * parseFloat(amount)).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
