import type { Escalation } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const escalations: Escalation[] = [
  { id: "esc_001", processRunId: "run_dpr_002", reason: "Revisão de compliance sem resposta do fornecedor há 10 dias.", escalatedToId: "usr_thomas", status: "pending", createdAt: daysAgo(9) },
  { id: "esc_002", processRunId: "run_vo_004", reason: "Documento fiscal obrigatório pendente há mais de 48h — risco de atraso no SLA de onboarding.", escalatedToId: "usr_thomas", status: "acknowledged", createdAt: daysAgo(2) },
  { id: "esc_003", processRunId: "run_ir_002", reason: "Falha de SSO afetando clientes Enterprise na região EU — sem mitigação em 2h.", escalatedToId: "usr_edivan", status: "pending", createdAt: hoursAgo(1) },
  { id: "esc_004", reason: "Volume de exceções de compliance cresceu 30% no último mês.", escalatedToId: "usr_sofia", status: "resolved", createdAt: daysAgo(30) },
];

export function getEscalationsByRun(processRunId: string) {
  return escalations.filter((e) => e.processRunId === processRunId);
}

export function getPendingEscalations() {
  return escalations.filter((e) => e.status === "pending");
}
