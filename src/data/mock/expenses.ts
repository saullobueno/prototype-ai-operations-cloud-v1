import type { Expense, ExpenseCategory } from "@/types";
import { daysAgo } from "@/lib/time";

const SUBMITTERS = ["usr_maria", "usr_pedro", "usr_sofia", "usr_thomas", "usr_rafaela", "usr_diego"];

// Despesas anômalas em destaque — usadas como exemplo concreto na lista e em Anomalias.
const featuredExpenses: Expense[] = [
  {
    id: "exp_flagged_1",
    vendorId: "ven_004",
    category: "marketing",
    amountCents: 480_000,
    submittedById: "usr_rafaela",
    status: "flagged",
    anomalyReason: "Valor 6x acima da média histórica de despesas de marketing (€800 → €4.800)",
    createdAt: daysAgo(5),
  },
  {
    id: "exp_flagged_2",
    vendorId: "ven_006",
    category: "travel",
    amountCents: 312_000,
    submittedById: "usr_diego",
    status: "flagged",
    anomalyReason: "Despesa de viagem enviada em duplicidade — mesmo valor e fornecedor em 2 dias",
    createdAt: daysAgo(9),
  },
  {
    id: "exp_flagged_3",
    category: "software",
    amountCents: 156_000,
    submittedById: "usr_thomas",
    status: "flagged",
    anomalyReason: "Assinatura de software sem fornecedor cadastrado e sem centro de custo associado",
    createdAt: daysAgo(3),
  },
];

const CATEGORY_ROTATION: ExpenseCategory[] = ["software", "travel", "office", "marketing", "other"];

const generatedExpenses: Expense[] = Array.from({ length: 26 }).map((_, i) => {
  const category = CATEGORY_ROTATION[i % CATEGORY_ROTATION.length];
  const amountCents = 4_000 + ((i * 3_700) % 90_000);
  const bucket = i % 8;
  const status = bucket === 0 ? "pending" : bucket === 1 ? "rejected" : "approved";
  return {
    id: `exp_gen_${i + 1}`,
    vendorId: i % 3 === 0 ? undefined : `ven_00${(i % 6) + 1}`,
    category,
    amountCents,
    submittedById: SUBMITTERS[i % SUBMITTERS.length],
    status,
    createdAt: daysAgo(1 + ((i * 5) % 100)),
  } satisfies Expense;
});

export const expenses: Expense[] = [...featuredExpenses, ...generatedExpenses];

export function getExpenseById(id: string) {
  return expenses.find((e) => e.id === id);
}

export function getFlaggedExpenses() {
  return expenses.filter((e) => e.status === "flagged");
}

export function updateExpense(expenseId: string, patch: Partial<Expense>) {
  const expense = expenses.find((e) => e.id === expenseId);
  if (expense) Object.assign(expense, patch);
  return expense;
}

// Persistência simplificada, mesmo padrão de src/data/mock/deals.ts.
export function addExpense(expense: Expense) {
  expenses.push(expense);
}

export function deleteExpense(expenseId: string) {
  const idx = expenses.findIndex((e) => e.id === expenseId);
  if (idx !== -1) expenses.splice(idx, 1);
}
