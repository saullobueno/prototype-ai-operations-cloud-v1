// Séries temporais estáticas para as telas de Analytics (dados ilustrativos, não derivados dinamicamente).

export const ticketVolume7d = [
  { day: "Seg", tickets: 38 },
  { day: "Ter", tickets: 44 },
  { day: "Qua", tickets: 41 },
  { day: "Qui", tickets: 52 },
  { day: "Sex", tickets: 47 },
  { day: "Sáb", tickets: 22 },
  { day: "Dom", tickets: 18 },
];

export const csat30d = [
  { day: "S1", csat: 91 },
  { day: "S2", csat: 92 },
  { day: "S3", csat: 90 },
  { day: "S4", csat: 94 },
];

export const sentimentTrend = [
  { day: "S1", positive: 58, neutral: 28, frustrated: 11, angry: 3 },
  { day: "S2", positive: 60, neutral: 26, frustrated: 10, angry: 4 },
  { day: "S3", positive: 55, neutral: 29, frustrated: 12, angry: 4 },
  { day: "S4", positive: 63, neutral: 25, frustrated: 9, angry: 3 },
];

export const responseResolutionTime = [
  { day: "Seg", firstResponseMin: 5.1, resolutionHrs: 4.8 },
  { day: "Ter", firstResponseMin: 4.6, resolutionHrs: 4.5 },
  { day: "Qua", firstResponseMin: 4.9, resolutionHrs: 5.1 },
  { day: "Qui", firstResponseMin: 4.2, resolutionHrs: 4.0 },
  { day: "Sex", firstResponseMin: 4.4, resolutionHrs: 4.3 },
  { day: "Sáb", firstResponseMin: 3.8, resolutionHrs: 3.6 },
  { day: "Dom", firstResponseMin: 3.5, resolutionHrs: 3.4 },
];

export const workflowRunsByDay = [
  { day: "Seg", runs: 210 },
  { day: "Ter", runs: 244 },
  { day: "Qua", runs: 198 },
  { day: "Qui", runs: 267 },
  { day: "Sex", runs: 231 },
  { day: "Sáb", runs: 94 },
  { day: "Dom", runs: 81 },
];

export const aiResolutionBreakdown = [
  { name: "Resolvido por IA", value: 68 },
  { name: "Escalado", value: 21 },
  { name: "Não resolvido", value: 11 },
];

export const topUnresolvedIntents = [
  { intent: "Exceções da política de reembolso", share: 31 },
  { intent: "Mudanças de conta", share: 18 },
  { intent: "Bugs técnicos", share: 16 },
  { intent: "Exceções de envio", share: 12 },
];

export const aiResolutionTrend = [
  { day: "S1", resolution: 61 },
  { day: "S2", resolution: 63 },
  { day: "S3", resolution: 65 },
  { day: "S4", resolution: 68 },
];
