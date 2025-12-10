export const CONFIG = {
    // Exchange API (Binance)
    EXCHANGE: {
        REST_URL: "https://api.binance.com/api/v3",
        WS_URL: "wss://stream.binance.com:9443/ws",
        WS_STREAM_URL: "wss://stream.binance.com:9443/stream"
    },

    // Market Data API (CoinGecko)
    MARKET_DATA: {
        BASE_URL: "https://api.coingecko.com/api/v3",
    },

    // News API (CryptoCompare)
    NEWS: {
        BASE_URL: "https://min-api.cryptocompare.com/data/v2",
    }
};
