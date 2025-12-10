import axios from 'axios';
import { CONFIG } from './config';

// Binance Public API Base
const BINANCE_BASE = CONFIG.EXCHANGE.REST_URL;

export interface Kline {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export const fetchBinanceKlines = async (symbol: string, interval: string = '1d'): Promise<Kline[]> => {
    try {
        // Symbol needs to be uppercase, e.g. BTCUSDT
        // Interval: 1m, 3m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M
        const res = await axios.get(`${BINANCE_BASE}/klines`, {
            params: {
                symbol: symbol.toUpperCase(),
                interval: interval,
                limit: 1000 // Reasonable history
            }
        });

        // Response format: [ [time, open, high, low, close, volume, ...], ... ]
        return res.data.map((k: any[]) => ({
            time: k[0] / 1000, // TradingView needs seconds
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            // volume: parseFloat(k[5]) // Optional if we want volume series later
        }));
    } catch (e) {
        console.error("Binance Kline Error", e);
        return [];
    }
};
