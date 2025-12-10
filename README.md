# Cipher Terminal

**Cipher Terminal** is a high-performance, professional-grade cryptocurrency trading interface designed for real-time market analysis and execution. Built with a focus on speed, data density, and aesthetic precision, it delivers a premium "OLED" visual experience optimized for low-latency decision-making.

![Interface Preview](/assets/interface-preview.png)
*(Placeholder: Add actual interface screenshot here)*

## Project Overview

Cipher Terminal reconstructs the professional trading desk experience in a modern web architecture. It leverages direct WebSocket connections for millisecond-latency order book updates and REST APIs for granular historical data. The application is engineered to handle high-frequency state updates without compromising render performance, utilizing a strictly typed, component-driven architecture.

### Key Features

-   **Real-Time Market Data**: Integrated WebSocket streams for live Order Book (Depth) and Ticker updates.
-   **Professional Charting**: Advanced candlestick charting powered by TradingView's lightweight-charts, supporting custom intervals (`1m` to `1w`) and technical indicators.
-   **High-Performance State Management**: Optimized global state handling via Zustand ensures instant UI reactivity and minimal re-renders.
-   **True OLED / Custom Theming**: 
    -   **OLED Mode**: Pitch black (`#000000`) backgrounds for infinite contrast.
    -   **Ultra Palette**: Custom "True Zero Ultra" color scheme featuring Sky Blue (`#5AC2F7`) accents and Cool Grey (`#8B8F9A`) indicators.
-   **Pro-Grade Components**:
    -   **Order Book**: Visual depth visualization with bid/ask spread analysis.
    -   **Market Overview**: Instant "Top Gainers" and "Top Losers" analysis.
    -   **News Feed**: Integrated real-time market news aggregation.
    -   **Global Watchlist**: Rapid-fire search and asset switching.

## Technology Stack

### Core
-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### State & Data
-   **State Management**: [Zustand](https://docs.pmnd.rs/zustand)
-   **Data Fetching**: [SWR](https://swr.vercel.app/) (Stale-While-Revalidate)
-   **API Integration**: Axios

### Visualization
-   **Charting**: [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Installation

Ensure you have Node.js 18+ installed.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/cipher-terminal.git
    cd cipher-terminal
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open the application**
    Navigate to `http://localhost:3000` to view the terminal.

## Configuration

Cipher Terminal acts as a frontend interface. By default, it is configured to connect to public cryptocurrency exchange APIs.

To customize data sources or endpoints, navigate to `lib/cryptoApi.ts`.

```typescript
// Example configuration in lib/cryptoApi.ts
export const BASE_URL = "https://api.exchange.com/v3";
export const WS_URL = "wss://stream.exchange.com/ws";
```

## Contributing

We welcome contributions to improve performance and expand feature sets.

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/advanced-order-types`).
3.  Commit your changes (`git commit -m 'Add Stop-Loss functionality'`).
4.  Push to the branch (`git push origin feature/advanced-order-types`).
5.  Open a Pull Request.

Please ensure all new components follow the existing distinct visual language and strict typing guidelines.

## License

This project is licensed under the **PolyForm Noncommercial License 1.0.0**.

**You are free to:**
- Use this software for private, personal, or non-profit purposes.
- Modify and customize the code for your own personal use.
- Share the code with others for non-commercial education or collaboration.

**You may NOT:**
- Sell this software or any modified version of it.
- Use this software as part of a commercial product or service.
- Use it to trade funds on behalf of a commercial entity (e.g., prop trading firms, hedge funds).

See the [LICENSE](LICENSE) file for full legal details.

## Disclaimer

This software is for informational and educational purposes only. It does not constitute financial advice. Trading cryptocurrencies involves significant risk. The developers assume no liability for financial losses incurred while using this application.

---
*Cipher Terminal - Advanced Market Analytics*
