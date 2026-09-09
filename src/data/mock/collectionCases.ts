import type { CollectionCase, CollectionCaseStatus } from "@/types";
import { daysAgo } from "@/lib/time";

// Casos de cobrança vinculados às faturas vencidas em destaque de src/data/mock/invoices.ts.
export const collectionCases: CollectionCase[] = [
  {
    id: "case_solarwave",
    invoiceId: "inv_solarwave_overdue",
    customerId: "cus_007",
    status: "escalated",
    strategy: "Escalar para Customer Success + oferecer parcelamento em 2x para preservar a conta",
    agentId: "agent_payment_recovery",
    createdAt: daysAgo(30),
  },
  {
    id: "case_velvet",
    invoiceId: "inv_velvet_overdue",
    customerId: "cus_015",
    status: "contacted",
    strategy: "Reenviar link de pagamento com cartão atualizado e confirmar recebimento por telefone",
    agentId: "agent_payment_recovery",
    createdAt: daysAgo(18),
  },
  {
    id: "case_atlaslogix",
    invoiceId: "inv_atlaslogix_overdue",
    customerId: "cus_010",
    status: "monitoring",
    strategy: "Aguardar prazo adicional combinado com o cliente antes de nova cobrança",
    agentId: "agent_payment_recovery",
    createdAt: daysAgo(10),
  },
  {
    id: "case_driftwear",
    invoiceId: "inv_driftwear_overdue",
    customerId: "cus_017",
    status: "monitoring",
    strategy: "Enviar lembrete automático padrão — sem sinais de risco elevado ainda",
    agentId: "agent_payment_recovery",
    createdAt: daysAgo(5),
  },
  {
    id: "case_resolved_1",
    invoiceId: "inv_gen_14",
    customerId: "cus_003",
    status: "resolved",
    strategy: "Cobrança automática por e-mail — cliente pagou após o primeiro lembrete",
    agentId: "agent_payment_recovery",
    createdAt: daysAgo(45),
  },
];

export function getCollectionCaseByInvoice(invoiceId: string) {
  return collectionCases.find((c) => c.invoiceId === invoiceId);
}

// Persistência simplificada, mesmo padrão de src/data/mock/deals.ts.
export function addCollectionCase(collectionCase: CollectionCase) {
  collectionCases.push(collectionCase);
}

export function updateCollectionCaseStatus(id: string, status: CollectionCaseStatus) {
  const found = collectionCases.find((c) => c.id === id);
  if (found) found.status = status;
  return found;
}

// Fluxo de cobrança: não é um cadastro (não cria/exclui casos manualmente), mas o time de Finance
// pode ajustar o status e a estratégia registrada pelo Payment Recovery Agent.
export function updateCollectionCase(id: string, patch: Partial<Pick<CollectionCase, "status" | "strategy">>) {
  const found = collectionCases.find((c) => c.id === id);
  if (found) Object.assign(found, patch);
  return found;
}
