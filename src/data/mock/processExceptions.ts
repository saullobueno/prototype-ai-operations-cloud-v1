import type { ProcessException } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const processExceptions: ProcessException[] = [
  { id: "exc_001", processId: "proc_vendor_onboarding", processRunId: "run_vo_004", stageId: "stage_vo_4", reason: "Certidão de regularidade fiscal ausente — impossível validar automaticamente.", severity: "medium", status: "open", createdAt: daysAgo(3) },
  { id: "exc_002", processId: "proc_data_privacy_review", processRunId: "run_dpr_002", stageId: "stage_dpr_3", reason: "Questionário de segurança do fornecedor pendente há mais de 10 dias.", severity: "high", status: "open", createdAt: daysAgo(10) },
  { id: "exc_003", processId: "proc_incident_response", processRunId: "run_ir_001", stageId: "stage_ir_3", reason: "Investigação inicial não identificou causa raiz — reaberta com o time de infraestrutura.", severity: "medium", status: "resolved", createdAt: hoursAgo(28) },
  { id: "exc_004", processId: "proc_purchase_requisition", processRunId: "run_pr_002", stageId: "stage_pr_3", reason: "Solicitação de compra acima do limite de aprovação padrão do gestor.", severity: "low", status: "open", createdAt: daysAgo(1) },
  { id: "exc_005", processId: "proc_expense_reimbursement", processRunId: "run_er_002", stageId: "stage_er_3", reason: "Despesa individual acima do limite de auto-aprovação (€300).", severity: "medium", status: "open", createdAt: daysAgo(2) },
  { id: "exc_006", processId: "proc_vendor_onboarding", processRunId: "run_vo_001", stageId: "stage_vo_3", reason: "Documento enviado em formato inválido — reenviado pelo fornecedor em 24h.", severity: "low", status: "resolved", createdAt: "2026-08-03T10:00:00Z" },
];

export function getExceptionById(id: string) {
  return processExceptions.find((e) => e.id === id);
}

export function getExceptionsByProcess(processId: string) {
  return processExceptions.filter((e) => e.processId === processId);
}

export function getOpenExceptions() {
  return processExceptions.filter((e) => e.status === "open");
}

// Exceções são registros gerados automaticamente pela IA/orquestração de processos — não são
// criadas ou excluídas manualmente neste protótipo, só têm o status atualizado (resolver/reabrir)
// pela operação humana. Mesmo padrão de mutação de src/data/mock/tasks.ts.
export function updateExceptionStatus(id: string, status: ProcessException["status"]) {
  const exception = processExceptions.find((e) => e.id === id);
  if (exception) exception.status = status;
  return exception;
}
