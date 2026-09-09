import { peopleApprovals } from "@/data/mock/peopleApprovals";
import { peopleRequests } from "@/data/mock/peopleRequests";
import type { Approval } from "@/types";

// Espelha `decideApproval` (src/features/governance/decide-approval.ts), mas opera sobre o array
// `peopleApprovals` próprio deste módulo em vez do `approvals` compartilhado — ver nota em
// src/data/mock/peopleApprovals.ts sobre o merge pendente. Mesma persistência simplificada
// (muta o array compartilhado do módulo, não sobrevive a um reload).
export function decidePeopleApproval(approvalId: string, decision: "approved" | "rejected", approverId: string): Approval | undefined {
  const approval = peopleApprovals.find((a) => a.id === approvalId);
  if (!approval) return undefined;

  approval.status = decision;
  approval.approverId = approverId;

  const request = peopleRequests.find((r) => r.approvalId === approvalId);
  if (request) request.status = decision;

  return approval;
}
