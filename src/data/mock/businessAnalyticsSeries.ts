// Séries agregadas para os gráficos de /modules/business/analytics e /modules/business/bottlenecks.
// Mesmo padrão de src/data/mock/salesAnalyticsSeries.ts — dados derivados, não uma entidade core.

export const processDurationByCategory = [
  { category: "Onboarding", horas: 46 },
  { category: "Procurement", horas: 22 },
  { category: "Compliance", horas: 58 },
  { category: "Operations", horas: 9 },
  { category: "Finance", horas: 14 },
];

export const exceptionRateTrend6m = [
  { month: "Abr", taxa: 9 },
  { month: "Mai", taxa: 11 },
  { month: "Jun", taxa: 10 },
  { month: "Jul", taxa: 14 },
  { month: "Ago", taxa: 13 },
  { month: "Set", taxa: 12 },
];

export const automationRateByProcess = [
  { processo: "Expense", taxa: 82 },
  { processo: "Procurement", taxa: 71 },
  { processo: "Vendor Onb.", taxa: 64 },
  { processo: "Incident", taxa: 55 },
  { processo: "Compliance", taxa: 38 },
  { processo: "Offboarding", taxa: 20 },
];

export const runStatusBreakdown = [
  { name: "Concluído", value: 62 },
  { name: "Em execução", value: 18 },
  { name: "Aguardando aprovação", value: 12 },
  { name: "Exceção", value: 8 },
];

export const throughputTrend6m = [
  { month: "Abr", execucoes: 118 },
  { month: "Mai", execucoes: 132 },
  { month: "Jun", execucoes: 141 },
  { month: "Jul", execucoes: 129 },
  { month: "Ago", execucoes: 154 },
  { month: "Set", execucoes: 47 },
];
