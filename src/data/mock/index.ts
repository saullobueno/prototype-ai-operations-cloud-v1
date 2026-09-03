// Ponto único de acesso ao mock data — conforme docs/04-mock-data-acme-cloud.md §16.
// Toda tela deve consumir os dados através daqui (e das funções helper abaixo),
// nunca importar um customer/conversation/ticket específico hardcoded.

export * from "./organization";
export * from "./teams";
export * from "./permissions";
export * from "./roles";
export * from "./users";
export * from "./customers";
export * from "./contacts";
export * from "./orders";
export * from "./conversations";
export * from "./messages";
export * from "./tickets";
export * from "./slas";
export * from "./tools";
export * from "./policies";
export * from "./agents";
export * from "./agentRuns";
export * from "./workflows";
export * from "./workflowVersions";
export * from "./workflowRuns";
export * from "./knowledgeSources";
export * from "./knowledgeDocuments";
export * from "./integrations";
export * from "./notifications";
export * from "./approvals";
export * from "./auditLogs";
export * from "./notes";
export * from "./tasks";
export * from "./evaluations";
export * from "./activities";
export * from "./events";

import { customers } from "./customers";
import { contacts } from "./contacts";
import { orders, payments } from "./orders";
import { conversations } from "./conversations";
import { getMessagesByConversation } from "./messages";
import { tickets } from "./tickets";
import { agents } from "./agents";
import { agentRuns, getAgentRunsByAgent } from "./agentRuns";
import { workflows } from "./workflows";
import { getWorkflowVersion } from "./workflowVersions";
import { getWorkflowRunsByWorkflow } from "./workflowRuns";
import { knowledgeDocuments } from "./knowledgeDocuments";
import { getActivitiesByCustomer } from "./activities";
import { notes, files } from "./notes";
import { tasks } from "./tasks";
import { users } from "./users";
import { roles } from "./roles";
import { teams } from "./teams";
import { evaluations } from "./evaluations";

// ---------- Customers ----------

export function getCustomerById(id: string) {
  return customers.find((c) => c.id === id);
}

export function getContactsByCustomer(customerId: string) {
  return contacts.filter((c) => c.customerId === customerId);
}

export function getOrdersByCustomer(customerId: string) {
  return orders.filter((o) => o.customerId === customerId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getPaymentsByCustomer(customerId: string) {
  return payments.filter((p) => p.customerId === customerId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getConversationsByCustomer(customerId: string) {
  return conversations
    .filter((c) => c.customerId === customerId)
    .sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt));
}

export function getTicketsByCustomer(customerId: string) {
  return tickets.filter((t) => t.customerId === customerId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getNotesByCustomer(customerId: string) {
  return notes.filter((n) => n.customerId === customerId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getFilesByCustomer(customerId: string) {
  return files.filter((f) => f.customerId === customerId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getTasksByCustomer(customerId: string) {
  return tasks.filter((t) => t.relatedType === "customer" && t.relatedId === customerId);
}

export function getTasksByRelated(relatedType: string, relatedId: string) {
  return tasks.filter((t) => t.relatedType === relatedType && t.relatedId === relatedId);
}

export { getActivitiesByCustomer };

// ---------- Conversations / Messages / Tickets ----------

export function getConversationById(id: string) {
  return conversations.find((c) => c.id === id);
}

export { getMessagesByConversation };

export function getTicketById(id: string) {
  return tickets.find((t) => t.id === id);
}

export function getTicketByConversation(conversationId: string) {
  return tickets.find((t) => t.conversationId === conversationId);
}

// ---------- Agents ----------

export function getAgentById(id: string) {
  return agents.find((a) => a.id === id);
}

export { getAgentRunsByAgent };

export function getAgentRunsByCustomer(customerId: string) {
  return agentRuns.filter((r) => r.customerId === customerId);
}

export function getEvaluationsForTarget(targetType: "agent_run" | "conversation", targetId: string) {
  return evaluations.filter((e) => e.targetType === targetType && e.targetId === targetId);
}

// ---------- Workflows ----------

export function getWorkflowById(id: string) {
  return workflows.find((w) => w.id === id);
}

export { getWorkflowVersion, getWorkflowRunsByWorkflow };

// ---------- Knowledge ----------

export function getKnowledgeDocumentById(id: string) {
  return knowledgeDocuments.find((d) => d.id === id);
}

export function getKnowledgeDocumentsBySource(sourceId: string) {
  return knowledgeDocuments.filter((d) => d.sourceId === sourceId);
}

// ---------- Users / Teams / Roles ----------

export function getUserById(id: string) {
  return users.find((u) => u.id === id);
}

export function getRoleById(id: string) {
  return roles.find((r) => r.id === id);
}

export function getTeamById(id: string) {
  return teams.find((t) => t.id === id);
}

// ---------- Formatação ----------

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(cents / 100);
}
