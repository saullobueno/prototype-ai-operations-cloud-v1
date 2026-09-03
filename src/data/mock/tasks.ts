import type { Task } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const tasks: Task[] = [
  { id: "task_1", title: "Fazer follow-up da aprovação de reembolso", relatedType: "customer", relatedId: "cus_007", assigneeId: "usr_maria", status: "todo", dueAt: hoursAgo(-4) },
  { id: "task_2", title: "Agendar ligação de retenção", relatedType: "customer", relatedId: "cus_012", assigneeId: "usr_sofia", status: "in_progress", dueAt: daysAgo(-1) },
  { id: "task_3", title: "Verificar correção do mapeamento de domínio do SSO", relatedType: "ticket", relatedId: "SUP-1849", assigneeId: "usr_pedro", status: "review" },
  { id: "task_4", title: "Enviar nota fiscal atualizada com o CNPJ/VAT", relatedType: "customer", relatedId: "cus_006", assigneeId: "usr_maria", status: "done" },
  { id: "task_5", title: "Revisar solicitação de exportação para compliance", relatedType: "ticket", relatedId: "SUP-1852", assigneeId: "usr_sofia", status: "todo" },
  { id: "task_6", title: "Publicar artigo atualizado de exceções de reembolso", relatedType: "workflow", relatedId: "wf_refund_approval", assigneeId: "usr_thomas", status: "new" },
  { id: "task_7", title: "Migrar automação antiga de resposta de SLA", relatedType: "workflow", relatedId: "wf_refund_approval", assigneeId: "usr_thomas", status: "canceled" },
];

// Persistência simplificada: as 3 telas que criam/editam/excluem tasks (página /tasks, aba
// Tasks do Customer 360, aba Tasks do Ticket) mutam este mesmo array compartilhado através
// dos helpers abaixo, para que o efeito sobreviva à navegação dentro da sessão — não
// sobrevive a um reload. Ver docs/06-fluxos-e-ai-moments.md.
export function addTask(task: Task) {
  tasks.push(task);
}

export function updateTask(updated: Task) {
  const idx = tasks.findIndex((t) => t.id === updated.id);
  if (idx !== -1) tasks[idx] = updated;
}

export function deleteTask(id: string) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx !== -1) tasks.splice(idx, 1);
}
