import type { PeopleFeedback } from "@/types";
import { daysAgo } from "@/lib/time";

export const peopleFeedback: PeopleFeedback[] = [
  { id: "pfb_001", employeeId: "emp_017", fromId: "emp_016", body: "Rafael fechou o maior deal do trimestre e ajudou dois colegas a estruturar propostas — ótima liderança pelo exemplo.", createdAt: daysAgo(14) },
  { id: "pfb_002", employeeId: "emp_017", fromId: "emp_020", body: "Sempre disponível para revisar forecast comigo antes do fechamento do mês.", createdAt: daysAgo(6) },
  { id: "pfb_003", employeeId: "emp_021", fromId: "emp_022", body: "Juliana dá contexto claro nas priorizações e protege o time de escopo excessivo.", createdAt: daysAgo(20) },
  { id: "pfb_004", employeeId: "emp_006", fromId: "emp_004", body: "Entregou a migração de CI/CD com qualidade acima do esperado e documentou tudo para o time.", createdAt: daysAgo(9) },
  { id: "pfb_005", employeeId: "emp_018", fromId: "emp_016", body: "Precisa melhorar o acompanhamento de follow-ups — alguns deals esfriaram por falta de cadência.", createdAt: daysAgo(30) },
];

export function getFeedbackByEmployee(employeeId: string) {
  return peopleFeedback.filter((f) => f.employeeId === employeeId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function addPeopleFeedback(feedback: PeopleFeedback) {
  peopleFeedback.push(feedback);
}
