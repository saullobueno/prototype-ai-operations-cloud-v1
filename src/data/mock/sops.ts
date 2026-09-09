import type { SOP } from "@/types";
import { daysAgo } from "@/lib/time";

export const sops: SOP[] = [
  {
    id: "sop_vendor_onboarding",
    processId: "proc_vendor_onboarding",
    title: "SOP — Vendor Onboarding",
    content: "Todo novo fornecedor deve passar por coleta de documentos (CNPJ/VAT, certidão de regularidade fiscal), validação automática de IA, checagem de compliance e aprovação de Procurement antes da criação do vendor e do setup financeiro. Contratos acima de €5.000/ano exigem aprovação humana explícita.",
    updatedAt: daysAgo(45),
  },
  {
    id: "sop_purchase_requisition",
    processId: "proc_purchase_requisition",
    title: "SOP — Purchase Requisition & Procurement",
    content: "Toda solicitação de compra passa por checagem automática de orçamento disponível. Solicitações acima do orçamento trimestral do time exigem aprovação do gestor antes da emissão do PO.",
    updatedAt: daysAgo(90),
  },
  {
    id: "sop_data_privacy_review",
    processId: "proc_data_privacy_review",
    title: "SOP — Data Privacy Compliance Review",
    content: "Novos fornecedores ou integrações que processam dados pessoais exigem mapeamento de dados, avaliação de risco e sign-off jurídico antes da ativação. Fornecedores que não respondem ao questionário de segurança em 10 dias devem ser escalados.",
    updatedAt: daysAgo(120),
  },
  {
    id: "sop_incident_response",
    processId: "proc_incident_response",
    title: "SOP — Operational Incident Response",
    content: "Incidentes operacionais devem ser triados em até 15 minutos. Incidentes de severidade alta sem mitigação em 2 horas são escalados automaticamente para a liderança.",
    updatedAt: daysAgo(30),
  },
  {
    id: "sop_expense_reimbursement",
    processId: "proc_expense_reimbursement",
    title: "SOP — Expense Reimbursement Approval",
    content: "Despesas até €300 são aprovadas automaticamente após checagem de política. Acima desse valor, exigem aprovação do gestor e, acima de €2.000, aprovação do financeiro.",
    updatedAt: daysAgo(60),
  },
  {
    id: "sop_employee_offboarding",
    processId: "proc_employee_offboarding",
    title: "SOP — Employee Offboarding (rascunho)",
    content: "Rascunho em desenho conjunto com People Operations — deve cobrir revogação de acessos em até 24h da notificação, devolução de ativos e acerto final.",
    updatedAt: daysAgo(10),
  },
];

export function getSopByProcess(processId: string) {
  return sops.find((s) => s.processId === processId);
}

// Persistência simplificada, mesmo padrão de src/data/mock/tasks.ts.
export function addSop(sop: SOP) {
  sops.push(sop);
}

export function updateSop(id: string, patch: Partial<SOP>) {
  const sop = sops.find((s) => s.id === id);
  if (sop) Object.assign(sop, patch);
  return sop;
}

export function deleteSop(id: string) {
  const idx = sops.findIndex((s) => s.id === id);
  if (idx !== -1) sops.splice(idx, 1);
}
