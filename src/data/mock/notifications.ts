import type { Notification } from "@/types";
import { hoursAgo, minutesAgo, daysAgo } from "@/lib/time";

export const notifications: Notification[] = [
  { id: "notif_1", userId: "usr_edivan", title: "Aprovação de reembolso pendente", body: "Billing Agent solicitou um reembolso de €180 para Diego Ramírez — precisa de aprovação do Financeiro.", read: false, createdAt: minutesAgo(90) },
  { id: "notif_2", userId: "usr_edivan", title: "SLA em risco", body: "18 conversas estão perto de romper o SLA.", read: false, createdAt: hoursAgo(2) },
  { id: "notif_3", userId: "usr_edivan", title: "Lacuna de conhecimento detectada", body: "Knowledge Agent sinalizou 14 perguntas de clientes sem resposta essa semana.", read: false, createdAt: hoursAgo(12) },
  { id: "notif_4", userId: "usr_edivan", title: "Relatório semanal de performance de IA pronto", body: "A taxa de resolução por IA melhorou 8,4% essa semana.", read: true, createdAt: daysAgo(1) },
  { id: "notif_5", userId: "usr_edivan", title: "Nova integração conectada", body: "O Mixpanel foi conectado com sucesso ao seu workspace.", read: true, createdAt: daysAgo(3) },
  { id: "notif_6", userId: "usr_edivan", title: "Execução de workflow falhou", body: "Customer Escalation Workflow — execução falhou na etapa 'Aprovação humana'.", read: true, createdAt: daysAgo(2) },
];

export function getUnreadCount(userId: string): number {
  return notifications.filter((n) => n.userId === userId && !n.read).length;
}
