// Tasks vinculadas a employee/candidate. `Task` é a mesma entidade core reusada por todos os
// módulos (src/data/mock/tasks.ts) — mantido em arquivo próprio para não colidir com o trabalho em
// paralelo em outros módulos; o orquestrador deve fazer o merge destes registros no array `tasks`
// compartilhado ao integrar (RELATED_HREF/RELATED_LABEL em src/features/tasks/task-row.tsx já
// tratam "employee"/"candidate", então a UI funciona sem alterações adicionais).
import type { Task } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const peopleTasks: Task[] = [
  { id: "ptask_001", title: "Concluir upload de documentos de admissão", relatedType: "employee", relatedId: "emp_005", assigneeId: "usr_edivan", status: "in_progress", dueAt: hoursAgo(-30) },
  { id: "ptask_002", title: "Agendar 1:1 de boas-vindas com o gestor", relatedType: "employee", relatedId: "emp_005", assigneeId: "usr_edivan", status: "todo", dueAt: hoursAgo(-6) },
  { id: "ptask_003", title: "Resolver bloqueio na solicitação de equipamento", relatedType: "employee", relatedId: "emp_027", assigneeId: "usr_edivan", status: "todo", dueAt: hoursAgo(-2) },
  { id: "ptask_004", title: "Preparar pauta do ciclo de avaliação 2026 H1", relatedType: "employee", relatedId: "emp_017", assigneeId: "usr_edivan", status: "review" },
  { id: "ptask_005", title: "Confirmar entrevista final com Rafael Andrade", relatedType: "candidate", relatedId: "cand_005", assigneeId: "usr_edivan", status: "todo", dueAt: daysAgo(-3) },
  { id: "ptask_006", title: "Enviar proposta de oferta para revisão", relatedType: "candidate", relatedId: "cand_008", assigneeId: "usr_edivan", status: "review" },
  { id: "ptask_007", title: "Revisar checklist de desligamento", relatedType: "employee", relatedId: "emp_033", assigneeId: "usr_edivan", status: "todo", dueAt: daysAgo(-10) },
  { id: "ptask_008", title: "Follow-up de pesquisa de clima do time de Engenharia", relatedType: "employee", relatedId: "emp_010", assigneeId: "usr_edivan", status: "new" },
];

export function getTasksByEmployee(employeeId: string) {
  return peopleTasks.filter((t) => t.relatedType === "employee" && t.relatedId === employeeId);
}

export function getTasksByCandidate(candidateId: string) {
  return peopleTasks.filter((t) => t.relatedType === "candidate" && t.relatedId === candidateId);
}

export function addPeopleTask(task: Task) {
  peopleTasks.push(task);
}

export function updatePeopleTask(updated: Task) {
  const idx = peopleTasks.findIndex((t) => t.id === updated.id);
  if (idx !== -1) peopleTasks[idx] = updated;
}

export function deletePeopleTask(id: string) {
  const idx = peopleTasks.findIndex((t) => t.id === id);
  if (idx !== -1) peopleTasks.splice(idx, 1);
}
