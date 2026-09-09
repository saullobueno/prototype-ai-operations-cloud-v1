import type { Budget } from "@/types";
import { daysAgo, monthsAgo } from "@/lib/time";

// Período corrente: mês fiscal ancorado em NOW (2026-09-02) — src/lib/time.ts.
export const budgets: Budget[] = [
  { id: "budget_software_q3", name: "Software & Cloud — Q3 2026", category: "software", periodStart: monthsAgo(2), periodEnd: daysAgo(-28), allocatedCents: 4_800_000, spentCents: 3_920_000 },
  { id: "budget_travel_q3", name: "Travel — Q3 2026", category: "travel", periodStart: monthsAgo(2), periodEnd: daysAgo(-28), allocatedCents: 1_200_000, spentCents: 1_340_000 },
  { id: "budget_office_q3", name: "Office & Facilities — Q3 2026", category: "office", periodStart: monthsAgo(2), periodEnd: daysAgo(-28), allocatedCents: 900_000, spentCents: 610_000 },
  { id: "budget_marketing_q3", name: "Marketing & Media — Q3 2026", category: "marketing", periodStart: monthsAgo(2), periodEnd: daysAgo(-28), allocatedCents: 2_600_000, spentCents: 2_180_000 },
  { id: "budget_other_q3", name: "Outras despesas — Q3 2026", category: "other", periodStart: monthsAgo(2), periodEnd: daysAgo(-28), allocatedCents: 600_000, spentCents: 340_000 },
];

export function getBudgetByCategory(category: string) {
  return budgets.find((b) => b.category === category);
}

// Orçamento é uma meta definida por humano (não derivada/calculada) — create+edit fazem sentido,
// mesmo padrão de src/data/mock/deals.ts. Sem exclusão na v1: um orçamento expirado é substituído
// pelo próximo período, não removido do histórico.
export function addBudget(budget: Budget) {
  budgets.push(budget);
}

export function updateBudget(budgetId: string, patch: Partial<Budget>) {
  const budget = budgets.find((b) => b.id === budgetId);
  if (budget) Object.assign(budget, patch);
  return budget;
}
