// Séries temporais estáticas para Forecasting e Financial Performance Analytics de Finance
// Operations (dados ilustrativos, mesmo padrão de src/data/mock/salesAnalyticsSeries.ts — não
// derivados dinamicamente dos registros de invoices/bills/expenses).

export const revenueForecast6m = [
  { month: "Abr", forecast: 4_020, actual: 3_940 },
  { month: "Mai", forecast: 4_180, actual: 4_260 },
  { month: "Jun", forecast: 4_350, actual: 4_190 },
  { month: "Jul", forecast: 4_480, actual: 4_520 },
  { month: "Ago", forecast: 4_600, actual: 0 },
  { month: "Set", forecast: 4_740, actual: 0 },
];

export const receivablesTrend6m = [
  { month: "Abr", receivables: 812 },
  { month: "Mai", receivables: 864 },
  { month: "Jun", receivables: 798 },
  { month: "Jul", receivables: 906 },
  { month: "Ago", receivables: 940 },
];

export const revenueByPlan = [
  { name: "Enterprise", value: 52 },
  { name: "Business", value: 33 },
  { name: "Starter", value: 15 },
];

export const expenseByCategory = [
  { category: "Software", valueK: 392 },
  { category: "Travel", valueK: 134 },
  { category: "Office", valueK: 61 },
  { category: "Marketing", valueK: 218 },
  { category: "Other", valueK: 34 },
];

export const monthlyExpenses6m = [
  { month: "Abr", expenses: 720 },
  { month: "Mai", expenses: 758 },
  { month: "Jun", expenses: 812 },
  { month: "Jul", expenses: 796 },
  { month: "Ago", expenses: 839 },
];

export const dsoTrend6m = [
  { month: "Abr", dso: 34 },
  { month: "Mai", dso: 31 },
  { month: "Jun", dso: 36 },
  { month: "Jul", dso: 29 },
  { month: "Ago", dso: 27 },
];
