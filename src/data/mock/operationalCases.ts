import type { OperationalCase } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const operationalCases: OperationalCase[] = [
  { id: "case_001", title: "Falhas de SSO afetando clientes Enterprise (EU)", processId: "proc_incident_response", processRunId: "run_ir_002", status: "in_progress", severity: "high", assigneeId: "usr_pedro", createdAt: hoursAgo(3) },
  { id: "case_002", title: "Vendor Solaris Facilities — aprovação pendente há 3 dias", processId: "proc_vendor_onboarding", processRunId: "run_vo_003", status: "open", severity: "medium", assigneeId: "usr_thomas", createdAt: daysAgo(3) },
  { id: "case_003", title: "Certidão fiscal ausente — Vantage Compliance Consulting", processId: "proc_vendor_onboarding", processRunId: "run_vo_004", status: "open", severity: "medium", assigneeId: "usr_thomas", createdAt: daysAgo(3) },
  { id: "case_004", title: "Questionário de segurança de fornecedor vencido", processId: "proc_data_privacy_review", processRunId: "run_dpr_002", status: "open", severity: "high", assigneeId: "usr_sofia", createdAt: daysAgo(10) },
  { id: "case_005", title: "Pedido de compra duplicado detectado — PR-2058", processId: "proc_purchase_requisition", processRunId: "run_pr_002", status: "in_progress", severity: "low", assigneeId: "usr_maria", createdAt: daysAgo(1) },
  { id: "case_006", title: "Crachá de acesso com defeito — HQ andar 3", status: "open", severity: "low", assigneeId: "usr_pedro", createdAt: daysAgo(5) },
  { id: "case_007", title: "Despesa acima do limite de política — Diego Farias", processId: "proc_expense_reimbursement", processRunId: "run_er_002", status: "in_progress", severity: "medium", assigneeId: "usr_maria", createdAt: daysAgo(2) },
  { id: "case_008", title: "Contrato de fornecedor legado sem assinatura eletrônica", status: "resolved", severity: "low", assigneeId: "usr_thomas", createdAt: daysAgo(15), resolvedAt: daysAgo(12) },
  { id: "case_009", title: "Postmortem de incidente de latência concluído", processId: "proc_incident_response", processRunId: "run_ir_001", status: "resolved", severity: "low", assigneeId: "usr_pedro", createdAt: hoursAgo(24), resolvedAt: hoursAgo(20) },
  { id: "case_010", title: "Conclusão de treinamento de compliance abaixo da meta", status: "open", severity: "medium", assigneeId: "usr_sofia", createdAt: daysAgo(6) },
  { id: "case_011", title: "Solicitação de compra acima do orçamento — PR-2041", processId: "proc_purchase_requisition", processRunId: "run_pr_001", status: "resolved", severity: "low", assigneeId: "usr_maria", createdAt: daysAgo(20), resolvedAt: daysAgo(19) },
  { id: "case_012", title: "Violação de política de retenção de dados sinalizada pela IA", status: "open", severity: "high", assigneeId: "usr_sofia", createdAt: daysAgo(1) },
];

export function getOperationalCaseById(id: string) {
  return operationalCases.find((c) => c.id === id);
}

export function getCasesByProcess(processId: string) {
  return operationalCases.filter((c) => c.processId === processId);
}

// Persistência simplificada, mesmo padrão de src/data/mock/tasks.ts. Casos operacionais podem
// ser abertos manualmente (ex.: "crachá com defeito") ou gerados a partir de um processo/run —
// por isso suportam criação e edição, mas não exclusão (são registro de auditoria operacional).
export function addOperationalCase(operationalCase: OperationalCase) {
  operationalCases.push(operationalCase);
}

export function updateOperationalCase(id: string, patch: Partial<OperationalCase>) {
  const found = operationalCases.find((c) => c.id === id);
  if (found) Object.assign(found, patch);
  return found;
}
