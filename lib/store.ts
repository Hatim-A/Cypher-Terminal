import { create } from 'zustand';
import { Asset } from './cryptoApi';

export interface TickerData {
    s: string;  // Symbol
    c: string;  // Close Price
    o: string;  // Open Price
    h: string;  // High Price
    l: string;  // Low Price
    v: string;  // Volume
    q: string;  // Quote Volume
}

interface MarketState {
    assets: Asset[];
    priceMap: Record<string, TickerData>;
    activeSymbol: string; // "bitcoin"
    activeTicker: string; // "btc"
    searchQuery: string;

    setAssets: (assets: Asset[]) => void;
    updatePrices: (tickers: TickerData[]) => void;
    setActiveSymbol: (id: string, symbol: string) => void;
    setSearchQuery: (query: string) => void;
}

export const useStore = create<MarketState>((set) => ({
    assets: [],
    priceMap: {},
    activeSymbol: "bitcoin",
    activeTicker: "btc",
    searchQuery: "",

    setAssets: (assets) => set({ assets }),

    updatePrices: (tickers) => set((state) => {
        // Performance optimization:
        // We might want to avoid creating a new object for the ENTIRE map every ms.
        // But for < 500 items, JS engines handle shallow copy fast enough.
        // For strictly better perf, we can use Immer or mutable pattern, but let's stick to standard React immutable flow first.

        const newMap = { ...state.priceMap };
        tickers.forEach(t => {
            newMap[t.s] = t;
        });
        return { priceMap: newMap };
    }),

    setActiveSymbol: (id, symbol) => set({ activeSymbol: id, activeTicker: symbol }),
    setSearchQuery: (query) => set({ searchQuery: query }),
}));
