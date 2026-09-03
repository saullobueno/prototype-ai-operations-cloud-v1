import type { Event } from "@/types";
import { conversations } from "./conversations";
import { tickets } from "./tickets";
import { agentRuns } from "./agentRuns";
import { workflowRuns } from "./workflowRuns";

// Catálogo de referência — docs/03-modelo-de-dados.md §6.
export const EVENT_CATALOG = [
  "customer.created",
  "customer.updated",
  "conversation.created",
  "conversation.message_received",
  "conversation.resolved",
  "ticket.created",
  "ticket.assigned",
  "ticket.resolved",
  "payment.failed",
  "payment.completed",
  "workflow.started",
  "workflow.completed",
  "workflow.failed",
  "agent.started",
  "agent.completed",
  "agent.escalated",
] as const;

function buildEvents(): Event[] {
  const events: Event[] = [];

  for (const conv of conversations) {
    events.push({ id: `evt_${conv.id}_created`, type: "conversation.created", payload: { conversationId: conv.id, customerId: conv.customerId }, createdAt: conv.createdAt });
    if (conv.status === "resolved" || conv.status === "closed") {
      events.push({ id: `evt_${conv.id}_resolved`, type: "conversation.resolved", payload: { conversationId: conv.id }, createdAt: conv.lastMessageAt });
    }
  }

  for (const ticket of tickets) {
    events.push({ id: `evt_${ticket.id}_created`, type: "ticket.created", payload: { ticketId: ticket.id, customerId: ticket.customerId }, createdAt: ticket.createdAt });
    if (ticket.resolvedAt) {
      events.push({ id: `evt_${ticket.id}_resolved`, type: "ticket.resolved", payload: { ticketId: ticket.id }, createdAt: ticket.resolvedAt });
    }
  }

  for (const run of agentRuns) {
    events.push({ id: `evt_${run.id}_started`, type: "agent.started", payload: { agentId: run.agentId, runId: run.id }, createdAt: run.startedAt });
    if (run.status === "completed" && run.completedAt) {
      events.push({ id: `evt_${run.id}_completed`, type: "agent.completed", payload: { agentId: run.agentId, runId: run.id }, createdAt: run.completedAt });
    }
    if (run.status === "escalated" && run.completedAt) {
      events.push({ id: `evt_${run.id}_escalated`, type: "agent.escalated", payload: { agentId: run.agentId, runId: run.id }, createdAt: run.completedAt });
    }
  }

  for (const run of workflowRuns) {
    const type = run.status === "failed" ? "workflow.failed" : run.status === "waiting" ? "workflow.started" : "workflow.completed";
    events.push({ id: `evt_${run.id}`, type, payload: { workflowId: run.workflowId, runId: run.id }, createdAt: run.completedAt ?? run.startedAt });
  }

  return events;
}

export const events: Event[] = buildEvents();
