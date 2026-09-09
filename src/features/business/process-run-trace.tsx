import { Check, CircleDashed, Loader2, MinusCircle, TriangleAlert } from "lucide-react";
import type { ProcessRunStep } from "@/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_ICON = { completed: Check, in_progress: Loader2, blocked: TriangleAlert, skipped: MinusCircle, pending: CircleDashed };
const STATUS_COLOR = { completed: "text-success", in_progress: "text-info", blocked: "text-danger", skipped: "text-muted-foreground", pending: "text-muted-foreground" };

export function ProcessRunTrace({ steps }: { steps: ProcessRunStep[] }) {
  return (
    <div className="space-y-1.5">
      {steps.map((step) => {
        const Icon = STATUS_ICON[step.status];
        return (
          <div key={step.stageId} className="flex items-start gap-3 rounded-lg border border-border px-3 py-2.5">
            <Icon className={cn("mt-0.5 size-4 shrink-0", STATUS_COLOR[step.status], step.status === "in_progress" && "animate-spin")} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={cn("text-sm", step.status === "pending" || step.status === "skipped" ? "text-muted-foreground" : "text-foreground")}>{step.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {step.completedAt ? formatDateTime(step.completedAt) : step.startedAt ? formatDateTime(step.startedAt) : "—"}
                </span>
              </div>
              {step.detail && <p className={cn("mt-0.5 text-xs", step.status === "blocked" ? "text-danger" : "text-muted-foreground")}>{step.detail}</p>}
              <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                Dono: {step.ownerType === "agent" ? "IA" : step.ownerType === "human" ? "Humano" : "Sistema"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
