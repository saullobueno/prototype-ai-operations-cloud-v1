import type { Transaction, TransactionType } from "@/types";
import { daysAgo } from "@/lib/time";
import { invoices } from "./invoices";

const paidInvoices = invoices.filter((i) => i.status === "paid" && i.paidAt);

const chargeTransactions: Transaction[] = paidInvoices.map((invoice, i) => ({
  id: `txn_charge_${i + 1}`,
  type: "charge" as TransactionType,
  invoiceId: invoice.id,
  amountCents: invoice.amountCents,
  status: "completed",
  createdAt: invoice.paidAt as string,
}));

// Alguns pagamentos falharam antes de serem retentados com sucesso — enriquece a aba Payments.
const failedRetries: Transaction[] = [
  { id: "txn_failed_1", type: "charge", invoiceId: "inv_gen_3", amountCents: invoices.find((i) => i.id === "inv_gen_3")?.amountCents ?? 120_000, status: "failed", createdAt: daysAgo(58) },
  { id: "txn_failed_2", type: "charge", invoiceId: "inv_gen_9", amountCents: invoices.find((i) => i.id === "inv_gen_9")?.amountCents ?? 98_000, status: "failed", createdAt: daysAgo(40) },
];

const refunds: Transaction[] = [
  { id: "txn_refund_1", type: "refund", invoiceId: "inv_gen_5", amountCents: 42_000, status: "completed", createdAt: daysAgo(20) },
  { id: "txn_refund_2", type: "refund", invoiceId: "inv_gen_12", amountCents: 15_000, status: "completed", createdAt: daysAgo(11) },
];

const payouts: Transaction[] = [
  { id: "txn_payout_1", type: "payout", amountCents: 4_820_000, status: "completed", createdAt: daysAgo(7) },
  { id: "txn_payout_2", type: "payout", amountCents: 5_140_000, status: "completed", createdAt: daysAgo(14) },
  { id: "txn_payout_3", type: "payout", amountCents: 3_960_000, status: "pending", createdAt: daysAgo(1) },
];

const adjustments: Transaction[] = [
  { id: "txn_adj_1", type: "adjustment", invoiceId: "inv_gen_7", amountCents: -8_000, status: "completed", createdAt: daysAgo(25) },
];

export const transactions: Transaction[] = [...chargeTransactions, ...failedRetries, ...refunds, ...payouts, ...adjustments].sort(
  (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
);

export function getTransactionsByInvoice(invoiceId: string) {
  return transactions.filter((t) => t.invoiceId === invoiceId);
}

export function getTransactionById(id: string) {
  return transactions.find((t) => t.id === id);
}

// Registro de um fato financeiro consumado — sem edição/exclusão pela UI (histórico imutável).
// A única ação humana é registrar manualmente uma transação nova (ex.: pagamento recebido fora
// do fluxo automático de cobrança). Inserida no início para aparecer em primeiro na lista.
export function addTransaction(transaction: Transaction) {
  transactions.unshift(transaction);
}
