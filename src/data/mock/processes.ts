import type { BusinessProcess } from "@/types";
import { daysAgo } from "@/lib/time";

// Biblioteca de processos de Business Operations. Só "proc_vendor_onboarding" tem runs/steps
// totalmente modelados (ver processRuns.ts) — os demais têm estatísticas realistas de lista,
// mesmo padrão adotado pelos workflows "extra" de Automation (workflows.ts).
export const processes: BusinessProcess[] = [
  {
    id: "proc_vendor_onboarding",
    name: "Vendor Onboarding",
    description: "Da solicitação de um novo fornecedor até a criação do vendor e configuração financeira, passando por validação de documentos e verificação de compliance.",
    category: "onboarding",
    status: "active",
    ownerId: "usr_thomas",
    workflowId: "wf_biz_vendor_compliance_check",
    slaHours: 72,
    totalRuns: 34,
    activeRuns: 3,
    avgDurationHours: 46,
    exceptionRate: 12,
    automationRate: 64,
    createdAt: daysAgo(240),
  },
  {
    id: "proc_purchase_requisition",
    name: "Purchase Requisition & Procurement",
    description: "Solicitação de compra, checagem de orçamento, aprovação do gestor e emissão de pedido de compra (PO).",
    category: "procurement",
    status: "active",
    ownerId: "usr_maria",
    slaHours: 48,
    totalRuns: 128,
    activeRuns: 9,
    avgDurationHours: 22,
    exceptionRate: 8,
    automationRate: 71,
    createdAt: daysAgo(300),
  },
  {
    id: "proc_data_privacy_review",
    name: "Data Privacy Compliance Review",
    description: "Revisão de compliance e privacidade de dados para novos fornecedores e integrações — mapeamento de dados, avaliação de risco e sign-off jurídico.",
    category: "compliance",
    status: "paused",
    ownerId: "usr_sofia",
    slaHours: 96,
    totalRuns: 46,
    activeRuns: 4,
    avgDurationHours: 58,
    exceptionRate: 17,
    automationRate: 38,
    createdAt: daysAgo(200),
  },
  {
    id: "proc_incident_response",
    name: "Operational Incident Response",
    description: "Reporte, triagem, investigação, resolução e postmortem de incidentes operacionais internos.",
    category: "operations",
    status: "active",
    ownerId: "usr_pedro",
    slaHours: 24,
    totalRuns: 212,
    activeRuns: 6,
    avgDurationHours: 9,
    exceptionRate: 21,
    automationRate: 55,
    createdAt: daysAgo(400),
  },
  {
    id: "proc_expense_reimbursement",
    name: "Expense Reimbursement Approval",
    description: "Submissão de despesa, checagem de política, aprovação do gestor e do financeiro, e reembolso.",
    category: "finance",
    status: "active",
    ownerId: "usr_maria",
    slaHours: 36,
    totalRuns: 340,
    activeRuns: 14,
    avgDurationHours: 14,
    exceptionRate: 6,
    automationRate: 82,
    createdAt: daysAgo(260),
  },
  {
    id: "proc_employee_offboarding",
    name: "Employee Offboarding",
    description: "Revogação de acessos, devolução de ativos e acerto final quando um colaborador deixa a empresa. Ainda em desenho — aguardando handoff completo para People Operations.",
    category: "hr",
    status: "draft",
    ownerId: "usr_thomas",
    slaHours: 120,
    totalRuns: 0,
    activeRuns: 0,
    avgDurationHours: 0,
    exceptionRate: 0,
    automationRate: 20,
    createdAt: daysAgo(10),
  },
];

export function getProcessById(id: string) {
  return processes.find((p) => p.id === id);
}

// Persistência simplificada, mesmo padrão de src/data/mock/tasks.ts — muta este array
// compartilhado para que a criação/edição/exclusão sobreviva à navegação dentro da sessão.
export function addProcess(process: BusinessProcess) {
  processes.push(process);
}

export function updateProcess(id: string, patch: Partial<BusinessProcess>) {
  const process = processes.find((p) => p.id === id);
  if (process) Object.assign(process, patch);
  return process;
}

export function deleteProcess(id: string) {
  const idx = processes.findIndex((p) => p.id === id);
  if (idx !== -1) processes.splice(idx, 1);
}
