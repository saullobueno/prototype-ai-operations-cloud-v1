import type { Approval } from "@/types";
import { daysAgo } from "@/lib/time";

// Aprovações de Business Operations. Arquivo novo e isolado — mesclar em
// src/data/mock/approvals.ts depois (mesmo motivo de businessAgents.ts). Enquanto não for
// mesclado, a tela /modules/business/approvals usa decideBusinessApproval (src/features/business)
// para aprovar/rejeitar dentro deste array local.
export const businessApprovals: Approval[] = [
  {
    id: "appr_biz_1",
    requestedByType: "agent",
    requestedById: "agent_biz_compliance",
    type: "vendor_onboarding",
    amountCents: 1840000,
    status: "pending",
    createdAt: daysAgo(3),
    context: "Solaris Facilities Management — aprovação de onboarding pendente (contrato anual de €18.400, acima do limite de autoaprovação de €5.000).",
    relatedType: "process_run",
    relatedId: "run_vo_003",
    module: "business_operations",
  },
  {
    id: "appr_biz_2",
    requestedByType: "agent",
    requestedById: "agent_biz_exception",
    type: "process_exception",
    status: "pending",
    createdAt: daysAgo(3),
    context: "Vantage Compliance Consulting — certidão fiscal ausente bloqueou a validação automática de documentos.",
    relatedType: "process_run",
    relatedId: "run_vo_004",
    module: "business_operations",
  },
  {
    id: "appr_biz_3",
    requestedByType: "human",
    requestedById: "usr_diego",
    type: "expense",
    amountCents: 42000,
    status: "pending",
    createdAt: daysAgo(2),
    context: "Diego Farias — despesa de jantar com cliente acima do limite de auto-aprovação (€300).",
    relatedType: "process_run",
    relatedId: "run_er_002",
    module: "business_operations",
  },
  {
    id: "appr_biz_4",
    requestedByType: "agent",
    requestedById: "agent_biz_compliance",
    type: "vendor_onboarding",
    amountCents: 960000,
    status: "approved",
    approverId: "usr_thomas",
    createdAt: "2026-08-05T12:00:00Z",
    context: "Nordic Supplies AB — onboarding aprovado após validação completa de documentos e compliance.",
    relatedType: "process_run",
    relatedId: "run_vo_001",
    module: "business_operations",
  },
  {
    id: "appr_biz_5",
    requestedByType: "agent",
    requestedById: "agent_biz_exception",
    type: "process_exception",
    status: "rejected",
    approverId: "usr_sofia",
    createdAt: daysAgo(11),
    context: "Pedido para pular a etapa de revisão jurídica foi rejeitado — risco de compliance considerado alto demais.",
    relatedType: "process_run",
    relatedId: "run_dpr_002",
    module: "business_operations",
  },
];

export function getBusinessApprovalById(id: string) {
  return businessApprovals.find((a) => a.id === id);
}
