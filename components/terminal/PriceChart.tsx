"use client";
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export const PriceChart = ({
    data,
    colors: {
        backgroundColor = 'transparent',
        lineColor = '#2962FF',
        textColor = '#888',
        areaTopColor = '#2962FF',
        areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {}
}: { data: any[], colors?: any }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const seriesRef = useRef<any>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Cleanup old chart
        if (chartRef.current) {
            try {
                chartRef.current.remove();
            } catch (e) { /* ignore */ }
            chartRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
        });
        chartRef.current = chart;

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00FF94',
            downColor: '#FF0055',
            borderVisible: false,
            wickUpColor: '#00FF94',
            wickDownColor: '#FF0055',
        });
        seriesRef.current = candlestickSeries;

        candlestickSeries.setData(data);

        // Resize handler using ResizeObserver for robustness
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                try {
                    chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
                } catch (e) { /* ignore */ }
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => handleResize());
        });
        resizeObserver.observe(chartContainerRef.current);

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
    }, [backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]); // Still recreate on color change for now, but safe.

    useEffect(() => {
        // Data update
        if (seriesRef.current && data.length > 0) {
            try {
                seriesRef.current.setData(data);
            } catch (e) { /* ignore */ }
        }
    }, [data]);

    return (
        <div ref={chartContainerRef} className="w-full h-[400px]" />
    );
};
