"use client";
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, Time } from 'lightweight-charts';

export const MainChart = ({ data }: { data: { time: number, value: number }[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || data.length === 0) return;

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

        // Modern Neon Theme
        const areaSeries = chart.addAreaSeries({
            lineColor: '#00FF95',
            topColor: 'rgba(0, 255, 149, 0.2)',
            bottomColor: 'rgba(0, 255, 149, 0.0)',
            lineWidth: 2,
        });

        // Cast time to Time type for lightweight-charts
        const chartData = data.map(d => ({
            time: d.time as Time,
            value: d.value
        }));

        areaSeries.setData(chartData);
        chart.timeScale().fitContent();

        const handleResize = () => {
            if (containerRef.current) {
                chart.applyOptions({ width: containerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data]);

    return <div ref={containerRef} className="w-full h-[400px]" />;
};
