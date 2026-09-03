import type { Activity } from "@/types";
import { conversations } from "./conversations";
import { tickets } from "./tickets";
import { hoursAgo } from "@/lib/time";

// Timeline canônica — John Smith (cus_001), hoje. Conforme docs/04-mock-data-acme-cloud.md §9.
const canonicalTimeline: Activity[] = [
  { id: "act_john_1", customerId: "cus_001", actorType: "human", actorId: "cus_001", action: "Cliente entrou em contato com o suporte", relatedType: "conversation", relatedId: "conv_1842", createdAt: hoursAgo(4) },
  { id: "act_john_2", customerId: "cus_001", actorType: "agent", actorId: "agent_billing", action: "IA identificou o problema de pagamento", relatedType: "conversation", relatedId: "conv_1842", createdAt: hoursAgo(3.95) },
  { id: "act_john_3", customerId: "cus_001", actorType: "agent", actorId: "agent_billing", action: "Status do pagamento verificado", relatedType: "conversation", relatedId: "conv_1842", createdAt: hoursAgo(3.9) },
  { id: "act_john_4", customerId: "cus_001", actorType: "human", actorId: "usr_maria", action: "Atendente humano entrou na conversa", relatedType: "conversation", relatedId: "conv_1842", createdAt: hoursAgo(3.8) },
  { id: "act_john_5", customerId: "cus_001", actorType: "human", actorId: "usr_maria", action: "Problema resolvido", relatedType: "ticket", relatedId: "SUP-1842", createdAt: hoursAgo(3) },
  { id: "act_john_6", customerId: "cus_001", actorType: "system", actorId: "system", action: "Solicitação de CSAT enviada", relatedType: "conversation", relatedId: "conv_1842", createdAt: hoursAgo(2.9) },
];

// Gera activities genéricas a partir de conversations/tickets para os demais clientes,
// mantendo a Timeline do Customer 360 dinâmica (nunca hardcoded por cliente).
function buildDerivedActivities(): Activity[] {
  const derived: Activity[] = [];

  for (const conv of conversations) {
    if (conv.id === "conv_1842") continue;
    derived.push({
      id: `act_${conv.id}_created`,
      customerId: conv.customerId,
      actorType: "human",
      actorId: conv.customerId,
      action: `Cliente entrou em contato com o suporte via ${conv.channel}`,
      relatedType: "conversation",
      relatedId: conv.id,
      createdAt: conv.createdAt,
    });

    if (conv.aiAnalysis) {
      derived.push({
        id: `act_${conv.id}_ai`,
        customerId: conv.customerId,
        actorType: "agent",
        actorId: conv.assigneeType === "agent" ? conv.assigneeId ?? "agent_support" : "agent_triage",
        action: `IA classificou a conversa como "${conv.aiAnalysis.intent}"`,
        relatedType: "conversation",
        relatedId: conv.id,
        createdAt: conv.createdAt,
      });
    }

    if (conv.status === "resolved" || conv.status === "closed") {
      derived.push({
        id: `act_${conv.id}_resolved`,
        customerId: conv.customerId,
        actorType: conv.assigneeType === "agent" ? "agent" : "human",
        actorId: conv.assigneeId ?? "agent_support",
        action: "Conversa resolvida",
        relatedType: "conversation",
        relatedId: conv.id,
        createdAt: conv.lastMessageAt,
      });
    }
  }

  for (const ticket of tickets) {
    derived.push({
      id: `act_${ticket.id}_created`,
      customerId: ticket.customerId,
      actorType: "system",
      actorId: "system",
      action: `Ticket ${ticket.id} criado — ${ticket.title}`,
      relatedType: "ticket",
      relatedId: ticket.id,
      createdAt: ticket.createdAt,
    });

    if (ticket.resolvedAt) {
      derived.push({
        id: `act_${ticket.id}_resolved`,
        customerId: ticket.customerId,
        actorType: ticket.assigneeId ? "human" : "agent",
        actorId: ticket.assigneeId ?? "agent_support",
        action: `Ticket ${ticket.id} resolvido`,
        relatedType: "ticket",
        relatedId: ticket.id,
        createdAt: ticket.resolvedAt,
      });
    }
  }

  return derived;
}

export const activities: Activity[] = [...canonicalTimeline, ...buildDerivedActivities()];

export function getActivitiesByCustomer(customerId: string): Activity[] {
  return activities
    .filter((a) => a.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
