"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTopSymbols } from '@/lib/binance';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useBinanceMultiTicker } from '@/hooks/useWebSocket';

export const MarketOverview = () => {
    const [data, setData] = useState<any[]>([]);

    // Initial fetch
    useEffect(() => {
        getTopSymbols(30).then(setData);
    }, []);

    // Live Updates
    const symbols = data.map(d => d.symbol);
    const liveItems = useBinanceMultiTicker(symbols); // Returns { stream, data }

    useEffect(() => {
        if (liveItems && liveItems.data) {
            const ticker = liveItems.data;
            setData(prev => prev.map(item => {
                if (item.symbol === ticker.s) {
                    return {
                        ...item,
                        lastPrice: ticker.c,
                        priceChangePercent: ticker.P,
                    }
                }
                return item;
            }))
        }
    }, [liveItems]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((item) => (
                <Link href={`/symbol/${item.symbol}`} key={item.symbol}>
                    <Card className="hover:border-terminal-accent/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-lg group-hover:text-terminal-accent">{item.symbol}</div>
                                    <div className="text-xs text-muted-foreground">Vol {formatNumber(item.quoteVolume)}</div>
                                </div>
                                <Badge variant={parseFloat(item.priceChangePercent) >= 0 ? 'default' : 'destructive'} className="font-mono">
                                    {parseFloat(item.priceChangePercent) > 0 ? '+' : ''}{parseFloat(item.priceChangePercent).toFixed(2)}%
                                </Badge>
                            </div>
                            <div className="font-mono text-2xl font-medium tracking-tight">
                                ${parseFloat(item.lastPrice).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
};
