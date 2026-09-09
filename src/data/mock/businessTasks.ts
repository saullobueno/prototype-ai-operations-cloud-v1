import type { Task } from "@/types";
import { daysAgo } from "@/lib/time";

// Tasks de Business Operations. Arquivo novo e isolado — mesclar em src/data/mock/tasks.ts
// depois (mesmo motivo de businessAgents.ts).
export const businessTasks: Task[] = [
  { id: "task_biz_1", title: "Revisar documentos fiscais da Solaris Facilities", relatedType: "process_run", relatedId: "run_vo_003", assigneeId: "usr_thomas", status: "in_progress", dueAt: daysAgo(-1) },
  { id: "task_biz_2", title: "Confirmar recebimento da certidão fiscal da Vantage Compliance", relatedType: "vendor", relatedId: "ven_008", assigneeId: "usr_thomas", status: "todo" },
  { id: "task_biz_3", title: "Atualizar SOP de Vendor Onboarding com nova etapa de compliance", relatedType: "process", relatedId: "proc_vendor_onboarding", assigneeId: "usr_sofia", status: "new" },
  { id: "task_biz_4", title: "Fazer follow-up do questionário de segurança pendente", relatedType: "process_run", relatedId: "run_dpr_002", assigneeId: "usr_sofia", status: "todo", dueAt: daysAgo(-2) },
  { id: "task_biz_5", title: "Validar orçamento da PR-2058 (refresh de laptops)", relatedType: "process_run", relatedId: "run_pr_002", assigneeId: "usr_maria", status: "review" },
  { id: "task_biz_6", title: "Publicar postmortem do incidente de latência da API", relatedType: "process_run", relatedId: "run_ir_001", assigneeId: "usr_pedro", status: "done" },
];

export function getBusinessTasksByRelated(relatedType: string, relatedId: string) {
  return businessTasks.filter((t) => t.relatedType === relatedType && t.relatedId === relatedId);
}
