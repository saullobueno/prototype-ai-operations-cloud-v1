import { AlertCircle, Check, Clock, MinusCircle } from "lucide-react";
import type { WorkflowRunStep } from "@/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_ICON = { success: Check, failed: AlertCircle, waiting: Clock, skipped: MinusCircle };
const STATUS_COLOR = { success: "text-success", failed: "text-danger", waiting: "text-warning", skipped: "text-muted-foreground" };

export function WorkflowRunTrace({ steps }: { steps: WorkflowRunStep[] }) {
  return (
    <div className="space-y-1.5">
      {steps.map((step) => {
        const Icon = STATUS_ICON[step.status];
        return (
          <div key={step.nodeId} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
            <Icon className={cn("size-4 shrink-0", STATUS_COLOR[step.status])} />
            <span className={cn("flex-1 text-sm", step.status === "skipped" ? "text-muted-foreground" : "text-foreground")}>{step.label}</span>
            {step.detail && <span className="text-xs text-danger">{step.detail}</span>}
            <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(step.timestamp)}</span>
          </div>
        );
      })}
    </div>
  );
}
