// Aprovações específicas de People Operations (time_off, hiring).
//
// `Approval` é a mesma entidade core reusada por todos os módulos (ver docs/IMPLEMENTATION-NOTES.md) —
// o ideal de longo prazo é que estes registros vivam no array `approvals` compartilhado
// (src/data/mock/approvals.ts). Como esse arquivo é de propriedade de outro fluxo de trabalho em
// paralelo neste momento, mantemos um array próprio aqui para não colidir; o orquestrador deve
// fazer o merge destes registros em `approvals` (e remover este arquivo em favor de
// `decideApproval`) quando integrar os módulos.
import type { Approval } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const peopleApprovals: Approval[] = [
  {
    id: "papr_001",
    requestedByType: "human",
    requestedById: "emp_021",
    type: "time_off",
    status: "pending",
    createdAt: hoursAgo(6),
    context: "Juliana Prado (CS Manager) solicitou 5 dias de férias a partir do dia 21 — aguardando aprovação do gestor.",
    module: "people_operations",
    relatedType: "employee",
    relatedId: "emp_021",
  },
  {
    id: "papr_002",
    requestedByType: "agent",
    requestedById: "agent_people_talent",
    type: "hiring",
    status: "pending",
    createdAt: daysAgo(1),
    context: "Talent Agent recomenda avançar a oferta para Daniela Rocha (Marketing Specialist) — aguardando aprovação de Head of Marketing.",
    module: "people_operations",
    relatedType: "candidate",
    relatedId: "cand_008",
  },
  {
    id: "papr_003",
    requestedByType: "agent",
    requestedById: "agent_people_request",
    type: "time_off",
    status: "pending",
    createdAt: daysAgo(2),
    context: "People Request Agent triou a solicitação de equipamento de Marina Costa (onboarding) — aguardando confirmação de orçamento.",
    module: "people_operations",
    relatedType: "employee",
    relatedId: "emp_005",
  },
  {
    id: "papr_004",
    requestedByType: "human",
    requestedById: "emp_016",
    type: "hiring",
    status: "approved",
    approverId: "usr_edivan",
    createdAt: daysAgo(38),
    context: "Oferta para Vitor Hugo Sales (Software Engineer) aprovada — contratação concluída.",
    module: "people_operations",
    relatedType: "candidate",
    relatedId: "cand_011",
  },
  {
    id: "papr_005",
    requestedByType: "human",
    requestedById: "emp_004",
    type: "time_off",
    status: "rejected",
    approverId: "usr_edivan",
    createdAt: daysAgo(55),
    context: "Solicitação de férias coincidia com a semana de lançamento — reagendamento solicitado.",
    module: "people_operations",
    relatedType: "employee",
    relatedId: "emp_010",
  },
];

export function getPendingPeopleApprovals() {
  return peopleApprovals.filter((a) => a.status === "pending");
}

export function getPeopleApprovalById(id: string) {
  return peopleApprovals.find((a) => a.id === id);
}
