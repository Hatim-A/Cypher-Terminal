"use client";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export const Sparkline = ({ data, color = "#444" }: { data: number[], color?: string }) => {
    const chartData = data.map((val, i) => ({ i, val }));

    return (
        <div className="h-[30px] w-[80px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="val"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
