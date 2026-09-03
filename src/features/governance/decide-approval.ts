import { activities as activitiesStore, approvals, getAgentRun } from "@/data/mock";
import type { Approval } from "@/types";

const APPROVAL_TYPE_LABEL: Record<string, string> = {
  refund: "reembolso",
  account_deletion: "exclusão de conta",
  subscription_change: "mudança de assinatura",
  escalation: "escalonamento",
};

// Persistência simplificada: grava de volta nos arrays compartilhados (approvals, agentRuns,
// activities) para que aprovar/rejeitar em qualquer uma das telas de governança (AI Governance,
// AI Activity) reflita na outra e no KPI de "Aprovações pendentes" — dentro da mesma sessão,
// não sobrevive a um reload. Ver docs/06-fluxos-e-ai-moments.md.
export function decideApproval(approvalId: string, decision: "approved" | "rejected", approverId: string): Approval | undefined {
  const approval = approvals.find((a) => a.id === approvalId);
  if (!approval) return undefined;

  approval.status = decision;
  approval.approverId = approverId;

  if (approval.runId) {
    const run = getAgentRun(approval.runId);
    if (run) {
      const approvalStep = [...run.steps].reverse().find((s) => s.type === "approval");
      if (approvalStep) approvalStep.outcome = decision;

      run.status = decision === "approved" ? "completed" : "failed";
      run.completedAt = new Date().toISOString();

      if (run.customerId) {
        activitiesStore.push({
          id: `act_${Date.now()}`,
          customerId: run.customerId,
          actorType: "human",
          actorId: approverId,
          action:
            decision === "approved"
              ? `Aprovação de ${APPROVAL_TYPE_LABEL[approval.type] ?? approval.type} concedida — a IA prosseguiu com a ação`
              : `Aprovação de ${APPROVAL_TYPE_LABEL[approval.type] ?? approval.type} rejeitada — nenhuma ação foi executada`,
          relatedType: "agent_run",
          relatedId: run.id,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return approval;
}
