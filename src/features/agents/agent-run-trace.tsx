"use client";

import { useState } from "react";
import { Brain, CheckCircle2, ChevronDown, Database, MessageCircle, Wrench, GitBranch, UserCheck, XCircle } from "lucide-react";
import type { AgentRun, AgentRunStepType } from "@/types";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEP_ICON: Record<AgentRunStepType, typeof Brain> = {
  retrieval: Database,
  reasoning: Brain,
  tool_call: Wrench,
  decision: GitBranch,
  message: MessageCircle,
  approval: UserCheck,
};

export function AgentRunTrace({ run }: { run: AgentRun }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-1.5">
      {run.steps.map((step) => {
        const isApproval = step.type === "approval";
        const Icon = isApproval ? (step.outcome === "approved" ? CheckCircle2 : step.outcome === "rejected" ? XCircle : UserCheck) : STEP_ICON[step.type];
        const iconClassName = isApproval
          ? step.outcome === "approved"
            ? "text-success"
            : step.outcome === "rejected"
              ? "text-danger"
              : "text-warning"
          : "text-muted-foreground";
        const isOpen = expanded === step.id;
        return (
          <div key={step.id} className="rounded-lg border border-border">
            <button
              onClick={() => setExpanded(isOpen ? null : step.id)}
              disabled={!step.detail}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left disabled:cursor-default"
            >
              <span className="text-xs tabular-nums text-muted-foreground">{formatTime(step.timestamp)}</span>
              <Icon className={cn("size-4 shrink-0", iconClassName)} />
              <span className="flex-1 text-sm text-foreground">
                {step.label}
                {isApproval && !step.outcome && <span className="ml-1.5 text-xs text-warning">(aguardando aprovação)</span>}
                {isApproval && step.outcome === "approved" && <span className="ml-1.5 text-xs text-success">(aprovado)</span>}
                {isApproval && step.outcome === "rejected" && <span className="ml-1.5 text-xs text-danger">(rejeitado)</span>}
              </span>
              {step.detail && (
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
              )}
            </button>
            {isOpen && step.detail && (
              <div className="border-t border-border bg-muted/40 px-3 py-2">
                <pre className="whitespace-pre-wrap break-words font-mono text-xs text-muted-foreground">{step.detail}</pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
