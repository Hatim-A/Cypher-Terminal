"use client";
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, Time } from 'lightweight-charts';

export const MainChart = ({ data }: { data: { time: number, value: number }[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const chartRef = useRef<any>(null);
    const seriesRef = useRef<any>(null);

    // 1. Initialization
    useEffect(() => {
        if (!containerRef.current) return;

        const chart = createChart(containerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#666',
            },
            grid: {
                vertLines: { color: '#1A1A1A' },
                horzLines: { color: '#1A1A1A' },
            },
            width: containerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: "#1A1A1A"
            },
            rightPriceScale: {
                borderColor: "#1A1A1A"
            }
        });

        chartRef.current = chart;

        // Modern Neon Theme
        const areaSeries = chart.addAreaSeries({
            lineColor: '#00FF95',
            topColor: 'rgba(0, 255, 149, 0.2)',
            bottomColor: 'rgba(0, 255, 149, 0.0)',
            lineWidth: 2,
        });

        seriesRef.current = areaSeries;

        const handleResize = () => {
            if (containerRef.current && chartRef.current) {
                try {
                    chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
                } catch (e) { /* ignore */ }
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => handleResize());
        });
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
            if (chartRef.current) {
                try {
                    chartRef.current.remove();
                } catch (e) { /* ignore */ }
                chartRef.current = null;
                seriesRef.current = null;
            }
        };
    }, []);

    // 2. Data Updates
    useEffect(() => {
        if (!chartRef.current || !seriesRef.current || data.length === 0) return;

        try {
            // Cast time to Time type for lightweight-charts
            const chartData = data.map(d => ({
                time: d.time as Time,
                value: d.value
            }));

            seriesRef.current.setData(chartData);
            chartRef.current.timeScale().fitContent();
        } catch (e) {
            console.warn("MainChart update failed", e);
        }
    }, [data]);

    return <div ref={containerRef} className="w-full h-[400px]" />;
};
