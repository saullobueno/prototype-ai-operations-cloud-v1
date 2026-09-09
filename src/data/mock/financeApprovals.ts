import type { Approval } from "@/types";
import { daysAgo } from "@/lib/time";

// Arquivo próprio porque src/data/mock/approvals.ts é compartilhado entre módulos — precisa
// ser mesclado no array `approvals` compartilhado pelo orquestrador. Enquanto isso, as telas
// de Finance Operations consomem este array isoladamente (ver decide em finance/approvals/page.tsx).
export const financeApprovals: Approval[] = [
  {
    id: "appr_fin_bill_1",
    requestedByType: "agent",
    requestedById: "agent_invoice_processing",
    type: "bill_payment",
    amountCents: 1_240_000,
    status: "pending",
    createdAt: daysAgo(4),
    deadline: daysAgo(-2),
    context: "Pagamento de bill CloudEdge Infrastructure acima do limite de execução autônoma (€500) — requer aprovação humana.",
    module: "finance_operations",
    relatedType: "bill",
    relatedId: "bill_cloudedge_001",
    runId: "run_fin_invoice_processing_1",
  },
  {
    id: "appr_fin_bill_2",
    requestedByType: "agent",
    requestedById: "agent_invoice_processing",
    type: "bill_payment",
    amountCents: 380_000,
    status: "pending",
    createdAt: daysAgo(2),
    deadline: daysAgo(-8),
    context: "Pagamento de bill Meridian Legal Partners — valor acima do limite de execução autônoma.",
    module: "finance_operations",
    relatedType: "bill",
    relatedId: "bill_meridianlegal_001",
  },
  {
    id: "appr_fin_expense_1",
    requestedByType: "agent",
    requestedById: "agent_financial_anomaly",
    type: "expense",
    amountCents: 480_000,
    status: "pending",
    createdAt: daysAgo(5),
    context: "Despesa de marketing sinalizada como anômala (6x acima da média) — política proíbe execução autônoma.",
    module: "finance_operations",
    relatedType: "expense",
    relatedId: "exp_flagged_1",
  },
  {
    id: "appr_fin_po_1",
    requestedByType: "human",
    requestedById: "usr_maria",
    type: "purchase_order",
    amountCents: 2_100_000,
    status: "approved",
    approverId: "usr_edivan",
    createdAt: daysAgo(15),
    context: "Ordem de compra para renovação de licenciamento de infraestrutura em nuvem.",
    module: "finance_operations",
    relatedType: "bill",
    relatedId: "bill_praxisdc_001",
  },
  {
    id: "appr_fin_expense_2",
    requestedByType: "agent",
    requestedById: "agent_financial_anomaly",
    type: "expense",
    amountCents: 312_000,
    status: "rejected",
    approverId: "usr_edivan",
    createdAt: daysAgo(9),
    context: "Despesa de viagem enviada em duplicidade — rejeitada após confirmação do gestor.",
    module: "finance_operations",
    relatedType: "expense",
    relatedId: "exp_flagged_2",
  },
  {
    id: "appr_fin_invoice_writeoff_1",
    requestedByType: "agent",
    requestedById: "agent_payment_recovery",
    type: "escalation",
    amountCents: 842_000,
    status: "pending",
    createdAt: daysAgo(3),
    context: "Fatura vencida há 62 dias sem retorno do cliente — Payment Recovery Agent escalou para decidir entre write-off parcial ou plano de parcelamento.",
    module: "finance_operations",
    relatedType: "invoice",
    relatedId: "inv_solarwave_overdue",
  },
];

export function decideFinanceApproval(approvalId: string, decision: "approved" | "rejected", approverId: string) {
  const approval = financeApprovals.find((a) => a.id === approvalId);
  if (!approval) return undefined;
  approval.status = decision;
  approval.approverId = approverId;
  return approval;
}
