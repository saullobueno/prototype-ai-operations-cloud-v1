"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORICAL, CHART_AXIS, CHART_GRID } from "@/lib/chart-colors";

interface SimpleBarChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  height?: number;
  horizontal?: boolean;
  colorIndex?: number;
}

export function SimpleBarChart({ data, xKey, yKey, height = 260, horizontal = false, colorIndex = 0 }: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, left: horizontal ? 40 : -12, bottom: 0 }}>
        <CartesianGrid stroke={CHART_GRID} horizontal={!horizontal} vertical={horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" stroke={CHART_AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey={xKey} stroke={CHART_AXIS} fontSize={12} tickLine={false} axisLine={false} width={140} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} stroke={CHART_AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={CHART_AXIS} fontSize={12} tickLine={false} axisLine={false} width={40} />
          </>
        )}
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Bar dataKey={yKey} fill={CATEGORICAL[colorIndex % CATEGORICAL.length]} radius={4} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
