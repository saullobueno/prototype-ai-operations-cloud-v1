import { Check, CircleDashed, Loader2, MinusCircle, TriangleAlert } from "lucide-react";
import type { ProcessRunStep, ProcessStage, ProcessStepStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_ICON: Record<ProcessStepStatus, typeof Check> = {
  completed: Check,
  in_progress: Loader2,
  blocked: TriangleAlert,
  skipped: MinusCircle,
  pending: CircleDashed,
};

const STATUS_TONE: Record<ProcessStepStatus, string> = {
  completed: "border-success/40 bg-success/10 text-success",
  in_progress: "border-info/40 bg-info/10 text-info",
  blocked: "border-danger/40 bg-danger/10 text-danger",
  skipped: "border-border bg-muted text-muted-foreground",
  pending: "border-border bg-muted/40 text-muted-foreground",
};

interface ProcessFlowProps {
  stages: ProcessStage[];
  steps?: ProcessRunStep[];
}

/** Visual de esteira do processo (etapas horizontais conectadas). Usado na aba Workflow do
 * Process Detail e no Overview. Se `steps` for informado, colore cada etapa pelo status do run. */
export function ProcessFlow({ stages, steps }: ProcessFlowProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {stages.map((stage, i) => {
        const step = steps?.find((s) => s.stageId === stage.id);
        const status = step?.status ?? "pending";
        const Icon = STATUS_ICON[status];
        return (
          <div key={stage.id} className="flex shrink-0 items-center gap-3">
            <div className={cn("flex w-44 flex-col gap-1.5 rounded-lg border px-3 py-2.5", STATUS_TONE[status])}>
              <div className="flex items-center gap-1.5">
                <Icon className={cn("size-3.5 shrink-0", status === "in_progress" && "animate-spin")} />
                <span className="text-xs font-medium">{stage.name}</span>
              </div>
              {step?.detail && <p className="text-[11px] leading-snug opacity-90">{step.detail}</p>}
              {step?.ownerType && (
                <span className="text-[11px] capitalize opacity-70">
                  {step.ownerType === "agent" ? "IA" : step.ownerType === "human" ? "Humano" : "Sistema"}
                </span>
              )}
            </div>
            {i < stages.length - 1 && <div className="h-px w-4 shrink-0 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
