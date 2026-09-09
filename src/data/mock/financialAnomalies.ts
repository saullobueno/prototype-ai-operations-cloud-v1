import type { FinancialAnomaly } from "@/types";
import { daysAgo } from "@/lib/time";

// Um exemplo concreto e legível por tipo (spec §9 "Financial anomaly detection"), não filler genérico.
export const financialAnomalies: FinancialAnomaly[] = [
  {
    id: "anom_duplicate_1",
    type: "duplicate_payment",
    relatedType: "transaction",
    relatedId: "txn_charge_1",
    detail: "Duas cobranças de €1.240,00 processadas para a mesma fatura (INV-2026-2003) com 6 minutos de diferença — provável duplo clique no checkout.",
    amountCents: 124_000,
    detectedAt: daysAgo(4),
    status: "open",
  },
  {
    id: "anom_unusual_expense_1",
    type: "unusual_expense",
    relatedType: "expense",
    relatedId: "exp_flagged_1",
    detail: "Despesa de marketing de €4.800,00 é 6x maior que a média histórica (€800,00) do mesmo centro de custo.",
    amountCents: 480_000,
    detectedAt: daysAgo(5),
    status: "open",
  },
  {
    id: "anom_unexpected_amount_1",
    type: "unexpected_amount",
    relatedType: "invoice",
    relatedId: "inv_gen_7",
    detail: "Fatura emitida com valor 40% acima do contrato vigente do cliente — possível erro de configuração no plano.",
    amountCents: 8_000,
    detectedAt: daysAgo(6),
    status: "confirmed",
  },
  {
    id: "anom_vendor_anomaly_1",
    type: "vendor_anomaly",
    relatedType: "bill",
    relatedId: "bill_cloudedge_001",
    detail: "CloudEdge Infrastructure emitiu 3 bills em 48h — frequência muito acima do padrão mensal habitual deste fornecedor.",
    amountCents: 1_240_000,
    detectedAt: daysAgo(3),
    status: "open",
  },
  {
    id: "anom_reconciliation_1",
    type: "reconciliation_mismatch",
    relatedType: "transaction",
    relatedId: "txn_payout_3",
    detail: "Extrato bancário de agosto/2026 tem €312.000,00 não conciliados com nenhuma transação registrada — 4 lançamentos sem correspondência.",
    amountCents: 312_000,
    detectedAt: daysAgo(2),
    status: "open",
  },
  {
    id: "anom_duplicate_2",
    type: "duplicate_payment",
    relatedType: "expense",
    relatedId: "exp_flagged_2",
    detail: "Despesa de viagem enviada em duplicidade pelo mesmo colaborador — mesmo fornecedor e valor em 2 dias consecutivos.",
    amountCents: 312_000,
    detectedAt: daysAgo(9),
    status: "open",
  },
  {
    id: "anom_unusual_expense_2",
    type: "unusual_expense",
    relatedType: "expense",
    relatedId: "exp_flagged_3",
    detail: "Assinatura de software recorrente sem fornecedor cadastrado e sem centro de custo associado — revisão manual recomendada.",
    amountCents: 156_000,
    detectedAt: daysAgo(3),
    status: "dismissed",
  },
];

export function getAnomalyById(id: string) {
  return financialAnomalies.find((a) => a.id === id);
}

export function getOpenAnomalies() {
  return financialAnomalies.filter((a) => a.status === "open");
}

// Detectadas por IA — não são criáveis manualmente. A única ação humana é confirmar (vira uma
// exceção investigada) ou descartar (falso positivo) uma anomalia aberta.
export function updateAnomalyStatus(id: string, status: FinancialAnomaly["status"]) {
  const found = financialAnomalies.find((a) => a.id === id);
  if (found) found.status = status;
  return found;
}
