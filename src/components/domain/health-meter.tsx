import { cn } from "@/lib/utils";

interface HealthMeterRowProps {
  label: string;
  value: number; // 0-100, ou número absoluto se isCount
  isCount?: boolean;
  tone?: "default" | "warning" | "danger";
}

export function HealthMeterRow({ label, value, isCount, tone = "default" }: HealthMeterRowProps) {
  const barTone = tone === "danger" ? "bg-danger" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div className="flex items-center gap-4 py-1.5">
      <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
      {isCount ? (
        <span className="text-sm font-medium text-foreground">{value}</span>
      ) : (
        <>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all", barTone)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
          </div>
          <span className="w-10 shrink-0 text-right text-sm font-medium text-foreground">{value}%</span>
        </>
      )}
    </div>
  );
}
