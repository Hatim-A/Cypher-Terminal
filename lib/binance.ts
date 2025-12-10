import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3';

export const getTopSymbols = async (limit = 20) => {
    // Get 24hr ticker price change statistics
    const res = await axios.get(`${BASE_URL}/ticker/24hr`);
    // Filter for USDT pairs and sort by volume
    const data = res.data
        .filter((item: any) => item.symbol.endsWith('USDT'))
        .sort((a: any, b: any) => Number(b.quoteVolume) - Number(a.quoteVolume))
        .slice(0, limit);

    return data;
};

export const getKlines = async (symbol: string, interval: string = '1h', limit: number = 500) => {
    const res = await axios.get(`${BASE_URL}/klines`, {
        params: { symbol, interval, limit }
    });

    // [time, open, high, low, close, volume, ...]
    return res.data.map((k: any) => ({
        time: k[0] / 1000,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
    }));
};

export const getDepth = async (symbol: string, limit: number = 20) => {
    const res = await axios.get(`${BASE_URL}/depth`, {
        params: { symbol, limit }
    });
    return res.data;
};

export const getTrades = async (symbol: string, limit: number = 50) => {
    const res = await axios.get(`${BASE_URL}/trades`, {
        params: { symbol, limit }
    });
    return res.data;
};
