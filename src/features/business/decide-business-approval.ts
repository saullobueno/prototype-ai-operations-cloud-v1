import { businessApprovals } from "@/data/mock/businessApprovals";
import type { Approval } from "@/types";

// Persistência simplificada, mesmo padrão de src/features/governance/decide-approval.ts —
// opera sobre o array local businessApprovals (ainda não mesclado em src/data/mock/approvals.ts,
// ver nota em businessApprovals.ts). Uma vez mesclado, o decideApproval genérico passa a cobrir
// também estas aprovações.
export function decideBusinessApproval(approvalId: string, decision: "approved" | "rejected", approverId: string): Approval | undefined {
  const approval = businessApprovals.find((a) => a.id === approvalId);
  if (!approval) return undefined;

  approval.status = decision;
  approval.approverId = approverId;

  return approval;
}
