import axios from 'axios';

const CG_BASE = "https://api.coingecko.com/api/v3";

export interface Asset {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    total_volume: number;
    market_cap: number;
    image: string;
}

export const fetchAssets = async (): Promise<Asset[]> => {
    try {
        const res = await axios.get(`${CG_BASE}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 250,
                page: 1,
                price_change_percentage: '24h'
            }
        });
        return res.data;
    } catch (e) {
        console.error("CoinGecko Error", e);
        return [];
    }
};

export const fetchMarketChart = async (id: string, days: string = '1') => {
    // For true candles we should use /ohlc, but that endpoint on CG is limited to days=1,7,14,30,90,180,365
    // and returns [time, open, high, low, close]
    try {
        const res = await axios.get(`${CG_BASE}/coins/${id}/ohlc`, {
            params: {
                vs_currency: 'usd',
                days: days
            }
        });
        // Returns [time, open, high, low, close]
        return res.data.map((p: any) => ({
            time: p[0] / 1000,
            open: p[1],
            high: p[2],
            low: p[3],
            close: p[4]
        }));
    } catch (e) {
        // Fallback to prices if OHLC fails
        try {
            const res = await axios.get(`${CG_BASE}/coins/${id}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: days
                }
            });
            // Return as value objects for fallback simulation
            return res.data.prices.map((p: any) => ({
                time: p[0] / 1000,
                value: p[1]
            }));
        } catch (err) {
            console.error("Chart Data Error", err);
            return [];
        }
    }
};
export interface NewsItem {
    id: string;
    title: string;
    url: string;
    source: string;
    published_on: number;
    imageurl?: string;
    categories: string;
}

export const fetchNews = async (): Promise<NewsItem[]> => {
    try {
        const res = await axios.get("https://min-api.cryptocompare.com/data/v2/news/?lang=EN");
        return res.data.Data.map((item: any) => ({
            id: item.id,
            title: item.title,
            url: item.url,
            source: item.source_info.name,
            published_on: item.published_on,
            imageurl: item.imageurl,
            categories: item.categories
        }));
    } catch (e) {
        console.error("News Fetch Error", e);
        return [];
    }
};
