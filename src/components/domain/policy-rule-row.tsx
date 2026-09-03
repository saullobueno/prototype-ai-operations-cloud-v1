import type { PolicyRule } from "@/types";
import { cn } from "@/lib/utils";

const ACTION_STYLE: Record<PolicyRule["action"], string> = {
  ai_can_execute: "bg-success/15 text-success",
  human_approval: "bg-warning/15 text-warning-foreground dark:text-warning",
  finance_approval: "bg-info/15 text-info",
  never_execute: "bg-danger/15 text-danger",
};

const ACTION_LABEL: Record<PolicyRule["action"], string> = {
  ai_can_execute: "IA pode executar",
  human_approval: "Aprovação humana",
  finance_approval: "Aprovação do financeiro",
  never_execute: "Nunca executar",
};

export function PolicyRuleRow({ rule }: { rule: PolicyRule }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-muted/50 px-3 py-1.5 text-sm">
      <span className="text-muted-foreground">{rule.condition}</span>
      <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-xs font-medium", ACTION_STYLE[rule.action])}>{ACTION_LABEL[rule.action]}</span>
    </div>
  );
}
