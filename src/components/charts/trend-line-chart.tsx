"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORICAL, CHART_AXIS, CHART_GRID } from "@/lib/chart-colors";

interface TrendLineChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; label: string }[];
  height?: number;
  valueSuffix?: string;
}

export function TrendLineChart({ data, xKey, series, height = 260, valueSuffix = "" }: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={CHART_GRID} vertical={false} />
        <XAxis dataKey={xKey} stroke={CHART_AXIS} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={CHART_AXIS} fontSize={12} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "var(--foreground)" }}
          formatter={(value) => `${value}${valueSuffix}`}
        />
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={CATEGORICAL[i % CATEGORICAL.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
