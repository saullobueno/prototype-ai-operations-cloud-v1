import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Building2, Handshake, Mail, Percent, Radio, Target, User, Wallet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type RevenueGraphNodeKind = "account" | "contact" | "interaction" | "deal" | "signal" | "intent" | "probability" | "revenue";

export interface RevenueGraphNodeData extends Record<string, unknown> {
  label: string;
  sublabel?: string;
  kind: RevenueGraphNodeKind;
  tone?: "positive" | "negative" | "neutral";
}

const KIND_ICON: Record<RevenueGraphNodeKind, LucideIcon> = {
  account: Building2,
  contact: User,
  interaction: Mail,
  deal: Handshake,
  signal: Radio,
  intent: Target,
  probability: Percent,
  revenue: Wallet,
};

const TONE_CLASS: Record<"positive" | "negative" | "neutral", string> = {
  positive: "border-success/40 bg-success/5",
  negative: "border-danger/40 bg-danger/5",
  neutral: "border-border bg-card",
};

export function RevenueGraphNode({ data }: NodeProps & { data: RevenueGraphNodeData }) {
  const Icon = KIND_ICON[data.kind];
  const tone = data.tone ?? "neutral";

  return (
    <div className={cn("flex min-w-[190px] items-center gap-2.5 rounded-lg border px-3 py-2.5 shadow-sm", TONE_CLASS[tone])}>
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground" />
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md",
          tone === "positive" ? "bg-success/15 text-success" : tone === "negative" ? "bg-danger/15 text-danger" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{data.label}</p>
        {data.sublabel && <p className="truncate text-[11px] text-muted-foreground">{data.sublabel}</p>}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground" />
    </div>
  );
}
