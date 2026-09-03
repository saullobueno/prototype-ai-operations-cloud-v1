import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NODE_ICON, NODE_TYPE_LABEL } from "./workflow-node-icon";
import type { WorkflowNodeType } from "@/types";
import { cn } from "@/lib/utils";

export interface WorkflowCanvasNodeData extends Record<string, unknown> {
  label: string;
  type: WorkflowNodeType;
  runStatus?: "success" | "failed" | "waiting" | "skipped";
  selected?: boolean;
}

const RUN_STATUS_RING: Record<string, string> = {
  success: "ring-2 ring-success",
  failed: "ring-2 ring-danger",
  waiting: "ring-2 ring-warning",
  skipped: "opacity-40",
};

export function WorkflowCanvasNode({ data, selected }: NodeProps & { data: WorkflowCanvasNodeData }) {
  const Icon = NODE_ICON[data.type];
  const isTrigger = data.type === "trigger";
  const isApproval = data.type === "human_approval";

  return (
    <div
      className={cn(
        "flex min-w-[180px] items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 shadow-sm transition-shadow",
        isTrigger ? "border-primary/40 bg-primary/5" : isApproval ? "border-warning/40 bg-warning/5" : "border-border",
        selected && "ring-2 ring-primary",
        data.runStatus && RUN_STATUS_RING[data.runStatus]
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-md", isTrigger ? "bg-primary/15 text-primary" : isApproval ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{data.label}</p>
        <p className="text-[11px] text-muted-foreground">{NODE_TYPE_LABEL[data.type]}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  );
}
