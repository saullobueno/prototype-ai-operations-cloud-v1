import type { Invoice, InvoiceLineItem, InvoiceStatus, RiskLevel } from "@/types";
import { daysAgo } from "@/lib/time";

const CUSTOMER_IDS = [
  "cus_001", "cus_002", "cus_003", "cus_004", "cus_005", "cus_006", "cus_007", "cus_008", "cus_009",
  "cus_010", "cus_011", "cus_012", "cus_013", "cus_014", "cus_015", "cus_016", "cus_017", "cus_018",
];

function lineItems(items: { description: string; quantity: number; unitAmountCents: number }[]): InvoiceLineItem[] {
  return items.map((item, i) => ({ id: `li_${i + 1}`, ...item }));
}

// ---------- Faturas em destaque (AI Moment — Payment Recovery) ----------
// Contas cus_007 (SolarWave) e cus_015 (Velvet Studio) estão com health "critical" em
// src/data/mock/customers.ts — os cenários de risco de pagamento abaixo usam essa continuidade.

const featuredInvoices: Invoice[] = [
  {
    id: "inv_solarwave_overdue",
    number: "INV-2026-1042",
    customerId: "cus_007",
    status: "overdue",
    amountCents: 842_000,
    lineItems: lineItems([
      { description: "Assinatura Enterprise — trimestre", quantity: 1, unitAmountCents: 720_000 },
      { description: "Módulo de automação avançada", quantity: 1, unitAmountCents: 122_000 },
    ]),
    issueDate: daysAgo(92),
    dueDate: daysAgo(62),
    daysOverdue: 62,
    riskLevel: "high",
    riskReasons: [
      "Fatura vencida há 62 dias, muito acima da média de 12 dias do cliente",
      "Conta com saúde crítica (health = critical) e histórico de 3 atrasos nos últimos 6 meses",
      "Conta de alto valor — pausar o serviço traria risco de churn imediato",
      "2 tentativas de cobrança automatizadas por e-mail sem resposta",
    ],
  },
  {
    id: "inv_velvet_overdue",
    number: "INV-2026-1077",
    customerId: "cus_015",
    status: "overdue",
    amountCents: 356_000,
    lineItems: lineItems([{ description: "Assinatura Business — mensal", quantity: 1, unitAmountCents: 356_000 }]),
    issueDate: daysAgo(75),
    dueDate: daysAgo(45),
    daysOverdue: 45,
    riskLevel: "high",
    riskReasons: [
      "Fatura vencida há 45 dias sem qualquer contato do cliente",
      "Conta com saúde crítica — 2 tickets de suporte abertos sem resolução",
      "Cartão de pagamento cadastrado expirou há 2 meses",
      "Nenhuma tentativa de cobrança anterior registrada para esta fatura",
    ],
  },
  {
    id: "inv_atlaslogix_overdue",
    number: "INV-2026-1103",
    customerId: "cus_010",
    status: "overdue",
    amountCents: 214_000,
    lineItems: lineItems([{ description: "Assinatura Business — mensal", quantity: 1, unitAmountCents: 214_000 }]),
    issueDate: daysAgo(51),
    dueDate: daysAgo(21),
    daysOverdue: 21,
    riskLevel: "medium",
    riskReasons: [
      "Fatura vencida há 21 dias — dentro do padrão histórico do cliente, mas acima da média geral",
      "Conta com saúde em risco (at_risk) e 1 atraso anterior nos últimos 12 meses",
      "1 tentativa de cobrança automatizada, cliente respondeu pedindo prazo adicional",
    ],
  },
  {
    id: "inv_driftwear_overdue",
    number: "INV-2026-1118",
    customerId: "cus_017",
    status: "overdue",
    amountCents: 98_000,
    lineItems: lineItems([{ description: "Assinatura Starter — mensal", quantity: 1, unitAmountCents: 98_000 }]),
    issueDate: daysAgo(38),
    dueDate: daysAgo(8),
    daysOverdue: 8,
    riskLevel: "low",
    riskReasons: ["Fatura vencida há apenas 8 dias, dentro da janela normal de atraso do cliente"],
  },
];

// ---------- Faturas geradas — cobrem os demais status (draft, sent, viewed, paid, void) ----------
// Escala sugerida na spec (§25) é de 1.284 faturas/ano; o mock mantém ~48 registros navegáveis
// (mesmo padrão de amostragem usado em wf_extra_* de src/data/mock/workflows.ts).

const DESCRIPTIONS = ["Assinatura mensal — Plano Business", "Assinatura mensal — Plano Enterprise", "Licenciamento core — mensal", "Add-on de analytics avançado"];

function statusForIndex(i: number): InvoiceStatus {
  const bucket = i % 9;
  if (bucket === 0) return "draft";
  if (bucket === 1) return "void";
  if (bucket === 2 || bucket === 3 || bucket === 4) return "paid";
  if (bucket === 5) return "sent";
  if (bucket === 6) return "viewed";
  return "overdue";
}

function riskForOverdue(daysOverdueValue: number): { riskLevel: RiskLevel; riskReasons: string[] } {
  if (daysOverdueValue > 30) {
    return { riskLevel: "high", riskReasons: ["Fatura vencida há mais de 30 dias", "Nenhuma resposta às tentativas de cobrança automatizadas"] };
  }
  if (daysOverdueValue > 10) {
    return { riskLevel: "medium", riskReasons: ["Fatura vencida acima da média histórica do cliente"] };
  }
  return { riskLevel: "low", riskReasons: ["Fatura vencida há poucos dias, dentro da janela normal"] };
}

const generatedInvoices: Invoice[] = Array.from({ length: 44 }).map((_, i) => {
  const customerId = CUSTOMER_IDS[i % CUSTOMER_IDS.length];
  const amountCents = 45_000 + ((i * 37_000) % 780_000);
  const issueDaysAgo = 10 + ((i * 11) % 150);
  const dueDaysAgo = issueDaysAgo - 30;
  const status = statusForIndex(i);
  const number = `INV-2026-${String(2001 + i).padStart(4, "0")}`;
  const id = `inv_gen_${i + 1}`;

  const base: Invoice = {
    id,
    number,
    customerId,
    status,
    amountCents,
    lineItems: lineItems([{ description: DESCRIPTIONS[i % DESCRIPTIONS.length], quantity: 1, unitAmountCents: amountCents }]),
    issueDate: daysAgo(issueDaysAgo),
    dueDate: daysAgo(dueDaysAgo),
  };

  if (status === "paid") {
    return { ...base, paidAt: daysAgo(Math.max(dueDaysAgo - 3, 1)) };
  }
  if (status === "overdue") {
    const daysOverdue = Math.max(dueDaysAgo, 1);
    return { ...base, daysOverdue, ...riskForOverdue(daysOverdue) };
  }
  if (status === "sent" || status === "viewed" || status === "draft") {
    // Ainda dentro do prazo — vencimento no futuro.
    return { ...base, dueDate: daysAgo(-(10 + (i % 20))) };
  }
  return base;
});

export const invoices: Invoice[] = [...featuredInvoices, ...generatedInvoices];

export function getInvoiceById(id: string) {
  return invoices.find((i) => i.id === id);
}

export function getInvoicesByCustomer(customerId: string) {
  return invoices.filter((i) => i.customerId === customerId).sort((a, b) => +new Date(b.issueDate) - +new Date(a.issueDate));
}

export function getOverdueInvoices() {
  return invoices.filter((i) => i.status === "overdue").sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0));
}

// Persistência simplificada, mesmo padrão de src/data/mock/deals.ts.
export function addInvoice(invoice: Invoice) {
  invoices.push(invoice);
}

export function updateInvoice(invoiceId: string, patch: Partial<Invoice>) {
  const invoice = invoices.find((i) => i.id === invoiceId);
  if (invoice) Object.assign(invoice, patch);
  return invoice;
}

// Exclusão física só faz sentido para rascunhos (nunca chegaram a existir para o cliente) — a UI
// (src/app/(app)/modules/finance/invoices/page.tsx) só oferece essa ação para status "draft".
// Faturas emitidas usam updateInvoice(id, { status: "void" }) para anular, preservando o histórico.
export function deleteInvoice(invoiceId: string) {
  const idx = invoices.findIndex((i) => i.id === invoiceId);
  if (idx !== -1) invoices.splice(idx, 1);
}
