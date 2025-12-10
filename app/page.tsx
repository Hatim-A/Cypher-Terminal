"use client";
import React, { useEffect } from 'react';
import useSWR from 'swr';
import { fetchAssets, Asset } from '@/lib/cryptoApi';
import { useStore } from '@/lib/store';
import { Watchlist } from '@/components/Watchlist';
import { ChartPanel } from '@/components/ChartPanel';
import { OrderBook } from '@/components/OrderBook';
import { MarketOverview } from '@/components/MarketOverview';
import { TopBar } from '@/components/TopBar'; // Wait, TopBar was in page in previous impl? Or page had it?
// Checking previous page.tsx -> It had TopBar inside the flex-col? 
// No, the previous page.tsx had TopBar missing in the import list I saw in memory but check `AppShell`.
// Actually TopBar should be part of the Page or Layout? 
// Usually TopBar is consistent. Let's put it in the Page for now, or AppShell if universal. 
// User request: Sidebar icons route to sections. TopBar is usually global too.
// Let's keep TopBar in Page for now to avoid over-engineering, or move to AppShell if it's truly global.
// Let's stick to the 3-column layout inside the Page.

export default function Home() {
    const { setAssets, assets, activeSymbol } = useStore();

    // Initial Fetch (Client Side Fetching is fine for this app)
    const { data: fetchedAssets } = useSWR<Asset[]>('assets', fetchAssets, {
        refreshInterval: 60000,
    });

    useEffect(() => {
        if (fetchedAssets) {
            setAssets(fetchedAssets);
        }
    }, [fetchedAssets, setAssets]);

    const activeAsset = assets.find(a => a.id === activeSymbol) || assets[0] || {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 65000,
        price_change_percentage_24h: 0,
        market_cap: 1000000000,
        total_volume: 500000000,
        image: ''
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 h-full">
            <TopBar />

            <div className="flex-1 flex min-h-0 min-w-0 border-t border-[#1a1a1a]">
                {/* Col 1: Watchlist (Fixed Width) */}
                <Watchlist assets={assets} />

                {/* Col 2: Workstation (Flex) */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-[#1a1a1a] border-l border-[#1a1a1a]">
                    <ChartPanel asset={activeAsset} />
                    <OrderBook />
                </div>

                {/* Col 3: Overview (Fixed Width) */}
                <MarketOverview assets={assets} />
            </div>
        </div>
    );
}
