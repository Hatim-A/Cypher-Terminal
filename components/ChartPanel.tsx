"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickData, Time, IChartApi, ISeriesApi, LineData } from 'lightweight-charts';
import { useStore } from '@/lib/store';
import { Asset } from '@/lib/cryptoApi';
import { fetchBinanceKlines } from '@/lib/binanceApi';
import useSWR from 'swr';
import { Maximize2, Minimize2, Activity, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { ClientOnly } from './ClientOnly';
import { ChartToolbar } from './ChartToolbar'; // Add Import

// --- Technical Analysis Helpers ---
const calculateSMA = (data: CandlestickData<Time>[], period: number): LineData<Time>[] => {
    const sma: LineData<Time>[] = [];
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const sum = slice.reduce((acc, curr) => acc + (curr.close as number), 0);
        sma.push({ time: data[i].time, value: sum / period });
    }
    return sma;
};

const calculateEMA = (data: CandlestickData<Time>[], period: number): LineData<Time>[] => {
    const ema: LineData<Time>[] = [];
    const k = 2 / (period + 1);

    // Start with SMA for first value
    let prevEma = data.slice(0, period).reduce((acc, curr) => acc + (curr.close as number), 0) / period;
    ema.push({ time: data[period - 1].time, value: prevEma });

    for (let i = period; i < data.length; i++) {
        const close = data[i].close as number;
        const currentEma = (close * k) + (prevEma * (1 - k));
        ema.push({ time: data[i].time, value: currentEma });
        prevEma = currentEma;
    }
    return ema;
};


export const ChartPanel = ({ asset }: { asset: Asset | undefined }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    // Default to 15m as per user request for "1m and 15m" primary focus
    const [interval, setInterval] = useState('1m');
    const [isZenMode, setIsZenMode] = useState(false);
    const [activeIndicators, setActiveIndicators] = useState<Set<string>>(new Set());

    const { priceMap } = useStore();

    // Ticker construction: Binance symbols are usually clean like BTCUSDT
    // CoinGecko IDs are like "bitcoin", symbol "btc"
    const ticker = asset ? `${asset.symbol.toUpperCase()}USDT` : 'BTCUSDT';

    // Fetch History from Binance
    const { data: history, error } = useSWR(
        asset ? ['binance_klines', ticker, interval] : null,
        () => fetchBinanceKlines(ticker, interval),
        {
            refreshInterval: 0,
            revalidateOnFocus: false,
            keepPreviousData: false // Clear when switching to avoid weird scales
        }
    );

    const toggleIndicator = (type: string) => {
        const next = new Set(activeIndicators);
        if (next.has(type)) next.delete(type);
        else next.add(type);
        setActiveIndicators(next);
    };

    // Escape Key Listener for Zen Mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isZenMode) {
                setIsZenMode(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZenMode]);

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Cleanup old chart
        if (chartRef.current) {
            try {
                chartRef.current.remove();
            } catch (e) {
                // Ignore disposal errors on cleanup
            }
            chartRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#000000' }, // OLED Black
                textColor: '#666',
            },
            grid: {
                vertLines: { color: '#1a1a1a' },
                horzLines: { color: '#1a1a1a' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                borderColor: '#1a1a1a',
                timeVisible: true,
                secondsVisible: interval === '1m', // Show seconds only on low timeframe
            },
            rightPriceScale: {
                borderColor: '#1a1a1a',
            },
            crosshair: {
                mode: 1, // Magnet
                vertLine: {
                    color: '#333',
                    width: 1,
                    style: 3,
                },
                horzLine: {
                    color: '#333',
                    width: 1,
                    style: 3,
                },
            }
        });

        chartRef.current = chart;

        // Candlestick Series
        const series = chart.addCandlestickSeries({
            upColor: '#5AC2F7', // Sky Blue
            downColor: '#8B8F9A', // Cool Grey
            borderVisible: false,
            wickUpColor: '#5AC2F7',
            wickDownColor: '#8B8F9A',
        });
        seriesRef.current = series;

        // Resize handler using ResizeObserver for robustness
        const handleResize = () => {
            // Check if chart is still valid before resizing
            if (chartContainerRef.current && chartRef.current) {
                const { clientWidth, clientHeight } = chartContainerRef.current;
                // Double check it hasn't been disposed (safety)
                try {
                    chartRef.current.applyOptions({ width: clientWidth, height: clientHeight });
                    chartRef.current.timeScale().fitContent(); // Auto-fit on resize
                } catch (e) {
                    console.warn("Chart resize failed:", e);
                }
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            // Defer execution slightly to strictly avoid "ResizeObserver loop limit exceeded" 
            // and reduce race condition probability
            requestAnimationFrame(() => handleResize());
        });

        if (chartContainerRef.current) {
            resizeObserver.observe(chartContainerRef.current);
        }

        return () => {
            // 1. Disconnect observer FIRST
            resizeObserver.disconnect();

            // 2. Clear refs to prevent other effects from using the dying chart
            seriesRef.current = null;
            smaSeriesRef.current = null;
            emaSeriesRef.current = null;

            // 3. Remove chart
            if (chartRef.current) {
                try {
                    chartRef.current.remove();
                } catch (e) {
                    // Ignore already disposed errors
                }
                chartRef.current = null;
            }
        };
    }, [interval, isZenMode]); // Re-create chart when Zen Mode toggles (safest for DOM reparenting)

    // Sync Data & Indicators
    useEffect(() => {
        if (!chartRef.current || !seriesRef.current || !history || history.length === 0) return;

        try {
            // 1. Set Candles
            seriesRef.current.setData(history as unknown as CandlestickData<Time>[]);

            // 2. Manage SMA
            if (activeIndicators.has('SMA')) {
                if (!smaSeriesRef.current) {
                    smaSeriesRef.current = chartRef.current.addLineSeries({
                        color: '#FFA500', // Orange
                        lineWidth: 2,
                        priceLineVisible: false,
                        lastValueVisible: false,
                    });
                }
                const smaData = calculateSMA(history as unknown as CandlestickData<Time>[], 20);
                smaSeriesRef.current.setData(smaData);
            } else if (smaSeriesRef.current) {
                chartRef.current.removeSeries(smaSeriesRef.current);
                smaSeriesRef.current = null;
            }

            // 3. Manage EMA
            if (activeIndicators.has('EMA')) {
                if (!emaSeriesRef.current) {
                    emaSeriesRef.current = chartRef.current.addLineSeries({
                        color: '#B026FF', // Neon Purple
                        lineWidth: 2,
                        priceLineVisible: false,
                        lastValueVisible: false,
                    });
                }
                const emaData = calculateEMA(history as unknown as CandlestickData<Time>[], 20);
                emaSeriesRef.current.setData(emaData);
            } else if (emaSeriesRef.current) {
                chartRef.current.removeSeries(emaSeriesRef.current);
                emaSeriesRef.current = null;
            }

            chartRef.current.timeScale().fitContent();
        } catch (e) {
            // Prevent crash if chart was disposed mid-update
            console.warn("Chart data update failed:", e);
        }
    }, [history, activeIndicators]);

    if (!asset) return <div className="flex-1 bg-[#111111] border-b border-[#1a1a1a] flex items-center justify-center text-text-dim text-xs">NO ASSET SELECTED</div>;

    const live = priceMap[ticker];
    const currentPrice = live ? parseFloat(live.c) : asset.current_price;
    const intervals = ['1m', '15m', '1h', '4h', '1d', '1w'];

    // Tool State
    const [activeTool, setActiveTool] = useState<string>('Crosshair');

    // --- Drawing Logic ---
    type Point = { x: number; y: number };
    type DrawingType = 'Trend Line' | 'Fib Retracement' | 'Brush' | 'Text' | 'Measure';

    type Drawing =
        | { type: 'Trend Line'; points: [Point, Point] }
        | { type: 'Fib Retracement'; points: [Point, Point] }
        | { type: 'Brush'; points: Point[] }
        | { type: 'Text'; point: Point; text: string }
        | { type: 'Measure'; points: [Point, Point] };

    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [currentDrawing, setCurrentDrawing] = useState<{ type: DrawingType; points: Point[] } | null>(null);

    // Mouse Interaction
    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = chartContainerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const p = { x, y };

        if (!activeTool || activeTool === 'Crosshair' || activeTool === 'Move') return;

        if (activeTool === 'Text') {
            const text = window.prompt("Enter text label:");
            if (text) {
                setDrawings([...drawings, { type: 'Text', point: p, text }]);
            }
            return;
        }

        if (activeTool === 'Brush') {
            setCurrentDrawing({ type: 'Brush', points: [p] });
            return;
        }

        // Two-point tools (Trend, Fib, Measure)
        if (!currentDrawing) {
            setCurrentDrawing({ type: activeTool as DrawingType, points: [p] });
        } else {
            // Finish drawing
            const start = currentDrawing.points[0];
            setDrawings([...drawings, { type: currentDrawing.type, points: [start, p] } as Drawing]);
            setCurrentDrawing(null);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!currentDrawing) return;

        const rect = chartContainerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const p = { x, y };

        if (currentDrawing.type === 'Brush') {
            setCurrentDrawing({ ...currentDrawing, points: [...currentDrawing.points, p] });
        } else {
            // Update preview for 2-point tools (Trend, Fib, Measure)
            // We store the preview state in currentDrawing 
            // Actually, currentDrawing only stores established points. 
            // We need a 'previewPoint' or just force re-render with current mouse position?
            // Simpler: Just rely on 'currentDrawing' having 1 point, and using 'activeTool' + mouse position for preview.
            // But React handleMouseMove state update might be slow for high polling.
            // Let's stick to simple start/end logic implies 'click-click' for lines, 'drag' for brush.
        }
    };

    // For Brush, we need MouseUp to finish
    const handleMouseUp = () => {
        if (currentDrawing?.type === 'Brush') {
            setDrawings([...drawings, { type: 'Brush', points: currentDrawing.points } as Drawing]);
            setCurrentDrawing(null);
        }
    };

    // Helper to render drawings
    const renderDrawing = (d: Drawing, i: number, isPreview = false) => {
        const style = { stroke: '#5AC2F7', strokeWidth: 2, fill: 'none' };

        switch (d.type) {
            case 'Trend Line':
            case 'Measure':
                return (
                    <g key={i}>
                        <line x1={d.points[0].x} y1={d.points[0].y} x2={d.points[1].x} y2={d.points[1].y} {...style} strokeDasharray={d.type === 'Measure' ? "4 4" : ""} />
                        {d.type === 'Measure' && (
                            <text x={d.points[1].x + 10} y={d.points[1].y} fill="white" fontSize="10" fontFamily="monospace">
                                {/* Mock measurement logic - delta Y pixels for now */}
                                {Math.abs(d.points[1].y - d.points[0].y).toFixed(0)}px
                            </text>
                        )}
                    </g>
                );
            case 'Fib Retracement':
                const start = d.points[0];
                const end = d.points[1];
                const dy = end.y - start.y;
                const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
                return (
                    <g key={i}>
                        <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#5AC2F7" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                        {levels.map(level => {
                            const y = start.y + (dy * level);
                            return <line key={level} x1={start.x} y1={y} x2={end.x} y2={y} stroke={level === 0 || level === 1 ? "#5AC2F7" : "#8B8F9A"} strokeWidth="1" />;
                        })}
                    </g>
                );
            case 'Brush':
                const pathData = d.points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
                return <path key={i} d={pathData} {...style} strokeLinecap="round" strokeLinejoin="round" />;
            case 'Text':
                return <text key={i} x={d.point.x} y={d.point.y} fill="#5AC2F7" fontSize="12" fontFamily="monospace">{d.text}</text>;
            default: return null;
        }
    };

    return (
        <div className={clsx(
            "flex flex-col border-b border-dark-border bg-dark-bg relative transition-all duration-300",
            isZenMode ? "fixed inset-0 z-[100] h-[100vh] w-[100vw] border-none bg-black" : "h-[60%]"
        )}>
            {/* Header */}
            <div className="h-12 border-b border-dark-border bg-dark-bg flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white">{ticker.replace('USDT', '')} / USDT</span>
                    <span className="text-xs font-mono text-accent-purple font-bold">${currentPrice.toFixed(2)}</span>

                    {/* TA Controls */}
                    <div className="flex items-center gap-1 ml-4 border-l border-[#222] pl-4">
                        {/* Indicators toggles */}
                        <button
                            onClick={() => toggleIndicator('SMA')}
                            className={clsx(
                                "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border transition-colors",
                                activeIndicators.has('SMA') ? "bg-[#FFA500]/20 text-[#FFA500] border-[#FFA500]/50" : "text-[#666] border-transparent hover:text-white"
                            )}
                        >
                            <TrendingUp size={10} /> SMA 20
                        </button>
                        <button
                            onClick={() => toggleIndicator('EMA')}
                            className={clsx(
                                "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border transition-colors",
                                activeIndicators.has('EMA') ? "bg-[#B026FF]/20 text-[#B026FF] border-[#B026FF]/50" : "text-[#666] border-transparent hover:text-white"
                            )}
                        >
                            <Activity size={10} /> EMA 20
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#111] rounded p-1 border border-[#1a1a1a]">
                        {intervals.map(tf => (
                            <button
                                key={tf}
                                onClick={() => setInterval(tf)}
                                className={clsx(
                                    "text-[10px] px-2 py-0.5 rounded transition-colors font-mono",
                                    interval === tf ? "bg-[#333] text-white" : "text-[#666] hover:text-[#bbb]"
                                )}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsZenMode(!isZenMode)}
                        className={clsx(
                            "text-[#666] hover:text-white transition-colors p-1 rounded",
                            isZenMode && "bg-soft-red text-white"
                        )}
                        title={isZenMode ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isZenMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>


            {/* Main Area: Toolbar + Chart */}
            <div className="flex-1 flex min-h-0 relative overflow-hidden">
                {/* Left Toolbar - Scrollable container */}
                <div className="h-full overflow-y-auto border-r border-[#1a1a1a] scrollbar-hide shrink-0 bg-dark-bg z-20">
                    <ClientOnly>
                        <ChartToolbar activeTool={activeTool} onToolSelect={setActiveTool} />
                    </ClientOnly>
                </div>

                {/* Chart Canvas & Overlay */}
                <div
                    className={clsx("flex-1 relative w-full h-full p-0 overflow-hidden bg-black", activeTool !== 'Crosshair' && activeTool !== 'Move' && "cursor-crosshair")}
                    ref={chartContainerRef}
                    id="tradingview-container"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {/* SVG Drawing Layer */}
                    <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full">
                        {drawings.map((d, i) => renderDrawing(d, i))}

                        {/* Live Preview for Line/Fib/Measure (using Mouse Move logic would be better, but for now showing start point) */}
                        {currentDrawing && currentDrawing.type !== 'Brush' && (
                            <circle cx={currentDrawing.points[0].x} cy={currentDrawing.points[0].y} r="3" fill="#5AC2F7" opacity="0.5" />
                        )}
                        {currentDrawing && currentDrawing.type === 'Brush' && (
                            <path d={currentDrawing.points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ")} stroke="#5AC2F7" strokeWidth="2" fill="none" strokeLinecap="round" />
                        )}
                    </svg>

                    {/* Canvas injected here */}
                    {/* Ensure full coverage */}

                    {/* Floating Exit Button for Zen Mode */}
                    {isZenMode && (
                        <button
                            onClick={() => setIsZenMode(false)}
                            className="absolute top-4 right-4 z-50 bg-soft-red hover:bg-red-600 text-white px-4 py-2 rounded shadow-2xl backdrop-blur-sm transition-all border border-red-500/50 hover:scale-105 active:scale-95"
                        >
                            <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
                                <Minimize2 size={16} /> EXIT FULLSCREEN
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
