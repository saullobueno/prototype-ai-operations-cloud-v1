"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORICAL } from "@/lib/chart-colors";

interface DonutChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export function DonutChart({ data, height = 220 }: DonutChartProps) {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={height} height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="65%" outerRadius="90%" paddingAngle={2} stroke="var(--card)" strokeWidth={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={CATEGORICAL[i % CATEGORICAL.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-full" style={{ background: CATEGORICAL[i % CATEGORICAL.length] }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium text-foreground">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
