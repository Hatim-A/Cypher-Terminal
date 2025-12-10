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

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

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

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    useEffect(() => {
        if (seriesRef.current && data.length > 0) {
            // Check if we need to update or set data (simple optimization for big lists vs single updates could be added)
            seriesRef.current.setData(data);
        }
    }, [data]);

    return (
        <div ref={chartContainerRef} className="w-full h-[400px]" />
    );
};
