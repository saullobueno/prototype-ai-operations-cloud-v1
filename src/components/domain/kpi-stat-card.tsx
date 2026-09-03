import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPIStatCardProps {
  label: string;
  value: string;
  trend?: { direction: "up" | "down"; value: string; positive?: boolean };
  className?: string;
}

export function KPIStatCard({ label, value, trend, className }: KPIStatCardProps) {
  const isGood = trend ? (trend.positive ?? trend.direction === "up") : undefined;
  return (
    <Card className={cn("gap-2 py-4", className)}>
      <CardContent className="px-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                isGood ? "text-success" : "text-danger"
              )}
            >
              {trend.direction === "up" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
              {trend.value}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
