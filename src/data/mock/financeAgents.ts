import type { Agent } from "@/types";

// Finance AI agents (spec §9). Arquivo próprio porque src/data/mock/agents.ts é compartilhado
// entre módulos — precisa ser mesclado no array `agents` compartilhado pelo orquestrador.
export const financeAgents: Agent[] = [
  {
    id: "agent_invoice_processing",
    name: "Invoice Processing Agent",
    description: "Processa faturas recebidas: extração de documento, validação de fornecedor, PO match, policy check e reconciliação.",
    status: "active",
    goal: "Processar faturas recebidas do recebimento até a reconciliação com o mínimo de intervenção humana",
    personality: ["Preciso", "Metódico"],
    knowledgeSourceIds: ["ks_internal_procedures"],
    toolIds: ["tool_get_invoice", "tool_get_vendor", "tool_create_approval"],
    policyIds: ["policy_bill_payment"],
    autonomyLevel: "approval_required",
    module: "finance_operations",
  },
  {
    id: "agent_payment_recovery",
    name: "Payment Recovery Agent",
    description: "Identifica faturas em risco de não pagamento e recomenda a estratégia de cobrança considerando idade da fatura, histórico do cliente e valor da conta.",
    status: "active",
    goal: "Reduzir a inadimplência recuperando faturas vencidas antes que virem prejuízo",
    personality: ["Empático", "Assertivo"],
    knowledgeSourceIds: ["ks_refund_policy"],
    toolIds: ["tool_get_invoice", "tool_send_email", "tool_create_task"],
    policyIds: [],
    autonomyLevel: "assisted",
    module: "finance_operations",
  },
  {
    id: "agent_reconciliation",
    name: "Reconciliation Agent",
    description: "Concilia transações internas com extratos bancários e sinaliza divergências para revisão.",
    status: "active",
    goal: "Manter os registros financeiros conciliados com o extrato bancário",
    personality: ["Preciso", "Rigoroso"],
    knowledgeSourceIds: [],
    toolIds: ["tool_get_payment"],
    policyIds: [],
    autonomyLevel: "autonomous",
    module: "finance_operations",
  },
  {
    id: "agent_financial_anomaly",
    name: "Financial Anomaly Agent",
    description: "Monitora transações, despesas e bills para detectar pagamentos duplicados, valores inesperados e comportamento anômalo de fornecedores.",
    status: "active",
    goal: "Detectar anomalias financeiras antes que causem perdas ou não conformidade",
    personality: ["Analítico", "Cauteloso"],
    knowledgeSourceIds: [],
    toolIds: ["tool_get_payment", "tool_create_task"],
    policyIds: [],
    autonomyLevel: "autonomous",
    module: "finance_operations",
  },
  {
    id: "agent_cash_flow",
    name: "Cash Flow Agent",
    description: "Projeta fluxo de caixa em 30/60/90 dias com base em recebíveis, pagáveis e assinaturas recorrentes.",
    status: "active",
    goal: "Manter uma previsão de caixa confiável para apoiar decisões financeiras",
    personality: ["Analítico", "Conciso"],
    knowledgeSourceIds: [],
    toolIds: ["tool_get_invoice"],
    policyIds: [],
    autonomyLevel: "autonomous",
    module: "finance_operations",
  },
];

export function getFinanceAgentById(id: string) {
  return financeAgents.find((a) => a.id === id);
}
