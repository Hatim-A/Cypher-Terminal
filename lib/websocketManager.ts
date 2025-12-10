type Subscriber = (data: any) => void;

class WebSocketManager {
    private ws: WebSocket | null = null;
    private url: string = "wss://stream.binance.com:9443/ws";
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 10;
    private pingInterval: NodeJS.Timeout | null = null;
    private subscribers: Set<Subscriber> = new Set();
    private streams: Set<string> = new Set();
    private isConnected: boolean = false;

    constructor() {
        this.connect();
    }

    private connect() {
        if (this.ws) {
            this.ws.close();
        }

        // We use combined streams url pattern if we had multiple, but for efficiency
        // we will use the single connection url and send subscription messages.
        // Or simpler: Connect to the base stream and subscribe.
        // For the 'All Mini Ticker' stream, the URL is wss://stream.binance.com:9443/ws/!miniTicker@arr

        // Strategy: Main connection for Tickers. Separate component connections for specific depths if needed, 
        // but for now, let's keep one main pipe.
        this.ws = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr");

        this.ws.onopen = () => {
            console.log("[WS] Connected");
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.notify(data);
            } catch (e) {
                console.error("[WS] Parse error", e);
            }
        };

        this.ws.onclose = () => {
            console.log("[WS] Closed");
            this.isConnected = false;
            this.stopHeartbeat();
            this.attemptReconnect();
        };

        this.ws.onerror = (err) => {
            console.error("[WS] Error", err);
            // Error usually triggers close, so we handle reconnect there
        };
    }

    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error("[WS] Max reconnect attempts reached");
            return;
        }

        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        console.log(`[WS] Reconnecting in ${delay}ms...`);

        setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        // Binance disconnects after 24h, but we just need to keep connection alive if stable
        // The library usually handles ping/pong frames, but we can do a logical check
    }

    private stopHeartbeat() {
        if (this.pingInterval) clearInterval(this.pingInterval);
    }

    public subscribe(cb: Subscriber) {
        this.subscribers.add(cb);
        return () => { this.subscribers.delete(cb); };
    }

    private notify(data: any) {
        this.subscribers.forEach(cb => cb(data));
    }
}

// Export singleton
export const wsManager = new WebSocketManager();
