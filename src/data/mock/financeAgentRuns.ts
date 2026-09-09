import type { AgentRun } from "@/types";
import { hoursAgo, daysAgo } from "@/lib/time";

// Fluxo de Invoice Processing (spec §9): Invoice Received → Document Extraction → Vendor
// Validation → PO Match → Policy Check → Approval → Payment → Reconciliation. Reutiliza o
// mesmo AgentRun/AgentRunStep e a mesma UI de trace (AgentRunTrace) já usados em Customer Operations.
export const financeAgentRuns: AgentRun[] = [
  {
    id: "run_fin_invoice_processing_1",
    agentId: "agent_invoice_processing",
    status: "escalated",
    startedAt: daysAgo(4),
    steps: [
      { id: "step_1", label: "Fatura recebida", type: "message", detail: "Bill recebida de CloudEdge Infrastructure via e-mail de billing.", timestamp: daysAgo(4) },
      { id: "step_2", label: "Extração de documento", type: "tool_call", detail: '{ "vendor": "CloudEdge Infrastructure", "amount": "€12.400,00", "dueDate": "+6 dias" }', timestamp: hoursAgo(95) },
      { id: "step_3", label: "Fornecedor validado", type: "retrieval", detail: '{ "vendorId": "ven_002", "status": "active", "taxId": "IE9876543C" }', timestamp: hoursAgo(94.9) },
      { id: "step_4", label: "PO Match", type: "decision", detail: "Nenhuma ordem de compra vinculada encontrada — bill será tratada como despesa operacional recorrente.", timestamp: hoursAgo(94.8) },
      { id: "step_5", label: "Policy check", type: "decision", detail: 'Política "Política de aprovação de pagamento a fornecedor": valor €12.400,00 > €5.000 → finance_approval', timestamp: hoursAgo(94.7) },
      { id: "step_6", label: "Aprovação solicitada", type: "approval", detail: "Aguardando aprovação financeira (appr_fin_bill_1).", timestamp: hoursAgo(94.6) },
    ],
  },
  {
    id: "run_fin_invoice_processing_2",
    agentId: "agent_invoice_processing",
    status: "completed",
    startedAt: daysAgo(8),
    completedAt: daysAgo(8),
    steps: [
      { id: "step_1", label: "Fatura recebida", type: "message", detail: "Bill recebida de Praxis Data Center Services.", timestamp: daysAgo(8) },
      { id: "step_2", label: "Extração de documento", type: "tool_call", detail: '{ "vendor": "Praxis Data Center Services", "amount": "€960,00", "dueDate": "+5 dias" }', timestamp: daysAgo(8) },
      { id: "step_3", label: "Fornecedor validado", type: "retrieval", detail: '{ "vendorId": "ven_005", "status": "active" }', timestamp: daysAgo(8) },
      { id: "step_4", label: "PO Match", type: "decision", detail: "PO_2026_0341 encontrada e compatível com o valor da bill.", timestamp: daysAgo(8) },
      { id: "step_5", label: "Policy check", type: "decision", detail: 'Política "Política de aprovação de pagamento a fornecedor": valor €960,00 <= €5.000 → human_approval', timestamp: daysAgo(8) },
      { id: "step_6", label: "Aprovado automaticamente por regra de PO compatível", type: "approval", outcome: "approved", timestamp: daysAgo(8) },
      { id: "step_7", label: "Pagamento agendado", type: "tool_call", detail: '{ "tool": "schedule_payment", "status": "success" }', timestamp: daysAgo(8) },
      { id: "step_8", label: "Reconciliação concluída", type: "decision", detail: "Pagamento conciliado com o extrato bancário do período.", timestamp: daysAgo(8) },
    ],
  },
];

export function getFinanceAgentRun(id: string) {
  return financeAgentRuns.find((r) => r.id === id);
}

export function getFinanceAgentRunsByAgent(agentId: string) {
  return financeAgentRuns.filter((r) => r.agentId === agentId);
}
