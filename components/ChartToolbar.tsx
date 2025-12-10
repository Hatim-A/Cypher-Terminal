"use client";
import React from 'react';
import {
    Crosshair,
    MousePointer2,
    TrendingUp,
    Type,
    LayoutGrid,
    Eraser,
    Lock,
    Eye,
    Trash2,
    Ruler,
    Move,
    Pencil
} from 'lucide-react';
import { clsx } from 'clsx';

interface ChartToolbarProps {
    activeTool: string;
    onToolSelect: (tool: string) => void;
}

export const ChartToolbar = ({ activeTool, onToolSelect }: ChartToolbarProps) => {
    const tools = [
        { icon: Crosshair, label: 'Crosshair' },
        { icon: TrendingUp, label: 'Trend Line' },
        { icon: LayoutGrid, label: 'Fib Retracement' },
        { icon: Pencil, label: 'Brush' },
        { icon: Type, label: 'Text' },
        { icon: Move, label: 'Move' },
        { icon: Ruler, label: 'Measure' },
    ];

    const actions = [
        { icon: Lock, label: 'Lock All' },
        { icon: Eye, label: 'Hide All' },
        { icon: Trash2, label: 'Remove All' },
    ];

    return (
        <div className="w-10 bg-dark-bg flex flex-col items-center py-2 gap-4 shrink-0 z-20 overflow-x-hidden overflow-y-auto scrollbar-hide">
            {/* Main Tools */}
            <div className="flex flex-col gap-1 w-full px-1">
                {tools.map((Tool, i) => (
                    <button
                        key={i}
                        onClick={() => onToolSelect(Tool.label)}
                        className={clsx(
                            "w-8 h-8 flex items-center justify-center rounded transition-colors group relative",
                            activeTool === Tool.label ? "bg-[#1a1a1a] text-neon-green border border-[#333]" : "text-[#888] hover:bg-[#111] hover:text-white"
                        )}
                        title={Tool.label}
                    >
                        <Tool.icon size={16} strokeWidth={1.5} />
                        {/* Tooltip */}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-[#222] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-[#333]">
                            {Tool.label}
                        </div>
                    </button>
                ))}
            </div>

            <div className="h-[1px] w-4 bg-[#1a1a1a] my-1"></div>

            {/* Actions */}
            <div className="flex flex-col gap-1 w-full px-1">
                {actions.map((Action, i) => (
                    <button
                        key={i}
                        className="w-8 h-8 flex items-center justify-center rounded text-[#888] hover:bg-[#111] hover:text-soft-red transition-colors group relative"
                        title={Action.label}
                    >
                        <Action.icon size={16} strokeWidth={1.5} />
                    </button>
                ))}
            </div>
        </div>
    );
};
