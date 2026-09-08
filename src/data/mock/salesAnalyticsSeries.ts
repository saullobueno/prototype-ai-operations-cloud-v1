// Séries temporais estáticas para a tela de Forecast/Revenue Analytics de Sales Operations
// (dados ilustrativos, mesmo padrão de analyticsSeries.ts — não derivados dinamicamente).

export const pipelineByStage = [
  { stage: "Qualification", valueK: 108 },
  { stage: "Discovery", valueK: 96 },
  { stage: "Proposal", valueK: 280 },
  { stage: "Negotiation", valueK: 332 },
];

export const forecastVsClosed6m = [
  { month: "Abr", forecast: 210, closed: 198 },
  { month: "Mai", forecast: 240, closed: 231 },
  { month: "Jun", forecast: 260, closed: 244 },
  { month: "Jul", forecast: 275, closed: 268 },
  { month: "Ago", forecast: 290, closed: 0 },
  { month: "Set", forecast: 305, closed: 0 },
];

export const winRateTrend = [
  { month: "Abr", winRate: 28 },
  { month: "Mai", winRate: 31 },
  { month: "Jun", winRate: 27 },
  { month: "Jul", winRate: 33 },
];

export const revenueAtRiskBreakdown = [
  { name: "Baixo risco", value: 62 },
  { name: "Médio risco", value: 24 },
  { name: "Alto risco", value: 14 },
];

export const dealsByOwner = [
  { owner: "Rafaela Nunes", deals: 9 },
  { owner: "Diego Farias", deals: 8 },
];
