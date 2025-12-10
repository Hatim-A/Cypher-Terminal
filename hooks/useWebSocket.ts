import { useEffect, useRef, useState, useCallback } from 'react';

type WSMessage = any;

export function useWebSocket(url: string | null) {
    const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
    const [readyState, setReadyState] = useState<number>(3); // CLOSED initially
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!url) return;

        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => setReadyState(1); // OPEN
        socket.onclose = () => setReadyState(3); // CLOSED
        socket.onerror = (err) => {
            console.error('WS Error:', err);
            setReadyState(3);
        };
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLastMessage(data);
            } catch (e) {
                console.error(e);
            }
        };

        return () => {
            socket.close();
        };
    }, [url]);

    return { lastMessage, readyState };
}

export function useBinanceTicker(symbol: string) {
    const stream = `${symbol.toLowerCase()}@ticker`;
    const { lastMessage } = useWebSocket(`wss://stream.binance.com:9443/ws/${stream}`);
    return lastMessage;
}

export function useBinanceAggTrades(symbol: string) {
    const stream = `${symbol.toLowerCase()}@aggTrade`;
    const { lastMessage } = useWebSocket(`wss://stream.binance.com:9443/ws/${stream}`);
    return lastMessage;
}

export function useBinanceMultiTicker(symbols: string[]) {
    // Combine streams: e.g. /stream?streams=btcusdt@ticker/ethusdt@ticker
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const { lastMessage } = useWebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
    return lastMessage;
}
