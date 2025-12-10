"use client";
import React from 'react';

export const BottomStatusBar = () => {
    return (
        <div className="h-7 bg-dark-panel border-t border-dark-border flex items-center justify-between px-4 text-xxs text-text-dim select-none">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-neon-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
                    <span className="font-bold">SYSTEM OPERATIONAL</span>
                </div>
                <span>•</span>
                <span>LATENCY: 12ms</span>
                <span>•</span>
                <span>BINANCE STREAM: ACTIVE</span>
            </div>
            <div>
                POWERED BY COINGECKO API • V1.2.0 • PRO MODE
            </div>
        </div>
    );
};
