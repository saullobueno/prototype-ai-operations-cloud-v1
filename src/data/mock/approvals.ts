import type { Approval } from "@/types";
import { hoursAgo, minutesAgo } from "@/lib/time";

export const approvals: Approval[] = [
  {
    id: "appr_1",
    requestedByType: "agent",
    requestedById: "agent_billing",
    type: "refund",
    amountCents: 18000,
    status: "pending",
    createdAt: minutesAgo(90),
    customerId: "cus_007",
    context: "Diego Ramírez (SolarWave) solicitou um reembolso ligado a uma indisponibilidade de serviço relatada. O valor excede o limite de aprovação automática de €200 — encaminhado para aprovação do Financeiro.",
    runId: "run_83998",
  },
  {
    id: "appr_2",
    requestedByType: "agent",
    requestedById: "agent_billing",
    type: "refund",
    amountCents: 4200,
    status: "approved",
    approverId: "usr_maria",
    createdAt: hoursAgo(3.2),
    customerId: "cus_001",
    context: "John Smith (Novacorp) — reembolso de cobrança duplicada.",
  },
  {
    id: "appr_3",
    requestedByType: "human",
    requestedById: "usr_sofia",
    type: "subscription_change",
    status: "pending",
    createdAt: hoursAgo(5),
    customerId: "cus_012",
    context: "Felipe Nogueira (Ironclad Security) está considerando cancelar — Customer Success solicitando aprovação de desconto de retenção.",
  },
  {
    id: "appr_4",
    requestedByType: "agent",
    requestedById: "agent_success",
    type: "escalation",
    status: "pending",
    createdAt: hoursAgo(1),
    customerId: "cus_010",
    context: "Divergência de cobrança de Camila Rocha (Atlas Logix) — IA sinalizou para revisão do gestor antes de emitir crédito na conta.",
  },
  {
    id: "appr_5",
    requestedByType: "agent",
    requestedById: "agent_billing",
    type: "refund",
    amountCents: 9900,
    status: "rejected",
    approverId: "usr_maria",
    createdAt: hoursAgo(30),
    customerId: "cus_005",
    context: "A solicitação de reembolso não atendeu aos critérios da política — o cliente recebeu um crédito de serviço em vez disso.",
  },
];

export function getPendingApprovals(): Approval[] {
  return approvals.filter((a) => a.status === "pending");
}

export function getApprovalById(id: string): Approval | undefined {
  return approvals.find((a) => a.id === id);
}

export function getApprovalByRunId(runId: string): Approval | undefined {
  return approvals.find((a) => a.runId === runId);
}
