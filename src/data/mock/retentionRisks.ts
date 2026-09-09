import type { RetentionRisk } from "@/types";

// Sinal de apoio à decisão humana — nunca uma ação automática sobre a carreira de alguém
// (ver docs/AI_OPERATIONS_CLOUD_COMPLETE_SPEC.md §10, "Sensitive HR decisions should remain governed and human-reviewed").
export const retentionRisks: RetentionRisk[] = [
  {
    employeeId: "emp_018",
    riskLevel: "high",
    reasons: ["Sem promoção ou mudança de cargo há mais de 24 meses", "Queda de performance no último ciclo de avaliação", "Alta carga de contas sem crescimento proporcional de comissão"],
  },
  {
    employeeId: "emp_010",
    riskLevel: "medium",
    reasons: ["Em licença prolongada há mais de 60 dias", "Baixo engajamento na última pesquisa de clima"],
  },
  {
    employeeId: "emp_022",
    riskLevel: "medium",
    reasons: ["Meta de NPS em risco há dois trimestres consecutivos", "Feedback recente menciona sobrecarga de atendimentos"],
  },
  {
    employeeId: "emp_007",
    riskLevel: "low",
    reasons: ["Sinais estáveis — nenhum indicador relevante de risco no momento"],
  },
  {
    employeeId: "emp_026",
    riskLevel: "low",
    reasons: ["Alta pontuação de reconhecimento entre pares no último trimestre"],
  },
  {
    employeeId: "emp_006",
    riskLevel: "low",
    reasons: ["Performance consistente e trajetória de crescimento clara"],
  },
];

export function getRetentionRiskByEmployee(employeeId: string) {
  return retentionRisks.find((r) => r.employeeId === employeeId);
}
