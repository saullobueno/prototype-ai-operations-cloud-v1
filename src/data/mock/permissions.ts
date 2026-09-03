import type { Permission } from "@/types";

export const permissions: Permission[] = [
  { id: "perm_tickets_read", key: "tickets.read", description: "Ver tickets" },
  { id: "perm_tickets_write", key: "tickets.write", description: "Criar e editar tickets" },
  { id: "perm_conversations_read", key: "conversations.read", description: "Ver conversas" },
  { id: "perm_conversations_write", key: "conversations.write", description: "Responder conversas" },
  { id: "perm_customers_read", key: "customers.read", description: "Ver clientes" },
  { id: "perm_customers_write", key: "customers.write", description: "Editar registros de clientes" },
  { id: "perm_agents_read", key: "agents.read", description: "Ver agentes de IA" },
  { id: "perm_agents_write", key: "agents.write", description: "Criar e editar agentes de IA" },
  { id: "perm_agents_execute_refund", key: "agents.execute.refund", description: "Aprovar reembolsos emitidos por IA" },
  { id: "perm_workflows_read", key: "workflows.read", description: "Ver workflows" },
  { id: "perm_workflows_write", key: "workflows.write", description: "Criar e editar workflows" },
  { id: "perm_knowledge_read", key: "knowledge.read", description: "Ver base de conhecimento" },
  { id: "perm_knowledge_write", key: "knowledge.write", description: "Editar base de conhecimento" },
  { id: "perm_analytics_read", key: "analytics.read", description: "Ver analytics" },
  { id: "perm_settings_write", key: "settings.write", description: "Editar configurações do workspace" },
  { id: "perm_admin_access", key: "admin.access", description: "Acessar o console de admin" },
  { id: "perm_billing_write", key: "billing.write", description: "Gerenciar faturamento e plano" },
  { id: "perm_approvals_write", key: "approvals.write", description: "Aprovar ou rejeitar aprovações pendentes" },
];
