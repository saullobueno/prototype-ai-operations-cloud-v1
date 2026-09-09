import type { Workflow } from "@/types";

// Workflows de automação ligados a processos de Business Operations. Arquivo novo e isolado
// (mesmo motivo de businessAgents.ts) — mesclar em src/data/mock/workflows.ts depois.
export const businessWorkflows: Workflow[] = [
  {
    id: "wf_biz_vendor_compliance_check",
    name: "Vendor Compliance Check",
    description: "Valida documentos e roda checagem de compliance automaticamente a cada novo pedido de Vendor Onboarding.",
    status: "active",
    trigger: { type: "manual" },
    currentVersionId: "wf_biz_vendor_compliance_check_v1",
    totalRuns: 34,
    successRuns: 30,
    failedRuns: 1,
    waitingRuns: 3,
    module: "business_operations",
  },
  {
    id: "wf_biz_exception_router",
    name: "Process Exception Router",
    description: "Detecta exceções de processo e roteia para o dono correto ou escalona quando o SLA está em risco.",
    status: "active",
    trigger: { type: "schedule" },
    currentVersionId: "wf_biz_exception_router_v1",
    totalRuns: 88,
    successRuns: 79,
    failedRuns: 2,
    waitingRuns: 7,
    module: "business_operations",
  },
];

export function getBusinessWorkflowById(id: string) {
  return businessWorkflows.find((w) => w.id === id);
}
