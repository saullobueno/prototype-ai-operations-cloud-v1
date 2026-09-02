# Modelo de Dados

Este documento define as entidades do protótipo, seus relacionamentos e os tipos TypeScript de referência para o mock data (`04-mock-data-acme-cloud.md`). É também o rascunho do modelo de domínio do produto real.

## 1. Princípio: Platform Core vs. Module-specific

```text
Organization
      │
      ├── Users, Teams, Roles, Permissions
      ├── Customers
      │      ├── Contacts
      │      ├── Conversations
      │      ├── Tickets
      │      ├── Orders / Payments
      │      └── Activities
      ├── Agents
      ├── Workflows
      ├── Knowledge
      ├── Integrations
      └── Analytics
```

Entidades **core** (reutilizadas por todo módulo futuro): `Customer`, `Event`, `Activity`, `Task`, `Agent`, `Workflow`, `Knowledge`, `Policy`, `Tool`, `Integration`, `Notification`, `AuditLog`, `Approval`.

Entidades **específicas de Customer Operations** (v1): `Conversation`, `Message`, `Ticket`, `SLA`.

## 2. O Operations Graph

O conceito central do produto: todo evento relevante do negócio pode ser rastreado como um grafo de causalidade.

```text
Customer → Conversation/Ticket/Order → Event → Workflow → Agent → Tool → Policy → Approval → Human → Event (novo)
```

Exemplo concreto:

```text
John Smith
   ↓
Conversation #1842
   ↓
Support Agent
   ↓
Payment Tool
   ↓
payment.failed (Event)
   ↓
Refund Policy
   ↓
€42
   ↓
Auto approved
   ↓
Refund issued
   ↓
Customer notified
```

Isso é o que alimenta: Customer 360 (Timeline), AI Activity, Agent Runs, Workflow Runs, Audit Logs e Analytics. Todas essas telas são, na prática, **visualizações diferentes do mesmo grafo de eventos**.

## 3. Lista de entidades

```text
Workspace, Organization, User, Team, Role, Permission,
Customer, Contact, Order, Payment,
Conversation, Message, Ticket, Task, Activity, Event,
Agent, AgentRun, Tool, Policy,
Workflow, WorkflowVersion, WorkflowRun, WorkflowStep,
KnowledgeSource, KnowledgeDocument,
Integration, Channel, Notification,
SLA, Approval, AuditLog,
Evaluation
```

## 4. Tipos TypeScript de referência

```typescript
// ---------- Platform Core ----------

interface Workspace {
  id: string;
  name: string;                 // "ACME Cloud"
  environment: "production" | "sandbox";
  organizationId: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: "starter" | "professional" | "business" | "enterprise";
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleId: string;
  teamIds: string[];
  status: "active" | "invited" | "suspended";
}

interface Team {
  id: string;
  name: string;                 // "Billing", "Technical Support"
  memberIds: string[];
}

interface Role {
  id: string;
  name: "Owner" | "Admin" | "Manager" | "Agent" | "Viewer";
  permissionIds: string[];
}

interface Permission {
  id: string;
  key: string;                  // "tickets.write", "agents.execute.refund"
  description: string;
}

// ---------- Customer domain (core, reusável por todos os módulos) ----------

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  avatarUrl?: string;
  plan: "Starter" | "Professional" | "Business" | "Enterprise";
  lifetimeValueCents: number;
  customerSince: string;
  health: "healthy" | "at_risk" | "critical";
  tags: string[];
}

interface Contact {
  id: string;
  customerId: string;
  name: string;
  email: string;
  role?: string;                // "Billing contact", "Technical contact"
}

interface Order {
  id: string;
  customerId: string;
  amountCents: number;
  status: "paid" | "pending" | "refunded" | "failed";
  createdAt: string;
}

interface Payment {
  id: string;
  customerId: string;
  orderId?: string;
  amountCents: number;
  status: "completed" | "failed" | "refunded";
  method: string;
  createdAt: string;
}

// ---------- Customer Operations ----------

interface Conversation {
  id: string;
  customerId: string;
  channel: "email" | "chat" | "whatsapp" | "sms" | "voice" | "social";
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;           // userId ou agentId
  assigneeType?: "human" | "agent";
  aiAnalysis?: {
    intent: string;
    sentiment: "positive" | "neutral" | "frustrated" | "angry";
    priority: "low" | "medium" | "high" | "urgent";
    recommendedAction?: string;
    confidence: number;          // 0–100
  };
  lastMessageAt: string;
  createdAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  authorType: "customer" | "human" | "agent" | "system";
  authorId: string;
  body: string;
  createdAt: string;
}

interface Ticket {
  id: string;                    // "SUP-1842"
  customerId: string;
  conversationId?: string;
  title: string;
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  teamId?: string;
  slaId?: string;
  createdAt: string;
  resolvedAt?: string;
}

interface SLA {
  id: string;
  name: string;
  firstResponseMinutes: number;
  resolutionMinutes: number;
  appliesToPriority: string[];
}

// ---------- Tasks, Activity, Events (core) ----------

interface Task {
  id: string;
  title: string;
  relatedType: "customer" | "ticket" | "conversation" | "workflow";
  relatedId: string;
  assigneeId: string;
  status: "todo" | "in_progress" | "done";
  dueAt?: string;
}

interface Activity {
  id: string;
  customerId?: string;
  actorType: "human" | "agent" | "system";
  actorId: string;
  action: string;                // "Customer contacted support", "Refund approved"
  relatedType?: string;
  relatedId?: string;
  createdAt: string;
}

interface Event {
  id: string;
  type: string;                  // "payment.failed", "ticket.resolved", "workflow.completed"
  payload: Record<string, unknown>;
  createdAt: string;
}

// ---------- AI / Agents ----------

interface Tool {
  id: string;
  key: string;                   // "search_customer", "issue_refund"
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
}

interface Policy {
  id: string;
  name: string;                  // "Refund policy"
  rules: PolicyRule[];
}

interface PolicyRule {
  condition: string;              // "amount <= 5000" (cents)
  action: "ai_can_execute" | "human_approval" | "finance_approval" | "never_execute";
}

interface Agent {
  id: string;
  name: string;                   // "Support Agent", "Billing Agent"
  description: string;
  avatarUrl?: string;
  status: "active" | "paused" | "draft";
  goal: string;
  personality: string[];          // ["Professional", "Friendly", "Concise"]
  knowledgeSourceIds: string[];
  toolIds: string[];
  policyIds: string[];
  autonomyLevel: "autonomous" | "assisted" | "approval_required";
}

interface AgentRun {
  id: string;
  agentId: string;
  conversationId?: string;
  customerId?: string;
  status: "running" | "completed" | "escalated" | "failed";
  steps: AgentRunStep[];
  startedAt: string;
  completedAt?: string;
}

interface AgentRunStep {
  id: string;
  label: string;                  // "Retrieved customer", "Checked refund policy"
  type: "retrieval" | "reasoning" | "tool_call" | "decision" | "message";
  detail?: string;
  timestamp: string;
}

interface Evaluation {
  id: string;
  targetType: "agent_run" | "conversation";
  targetId: string;
  accuracy: number;
  tone: number;
  policyAdherence: number;
  resolution: "resolved" | "escalated" | "unresolved";
  reviewerId?: string;            // se avaliação humana
  createdAt: string;
}

// ---------- Automation ----------

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  trigger: WorkflowTrigger;
  currentVersionId: string;
}

interface WorkflowTrigger {
  type: "conversation_created" | "ticket_created" | "customer_created" | "message_received"
      | "payment_failed" | "sla_approaching" | "webhook" | "schedule" | "manual";
  config?: Record<string, unknown>;
}

interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  publishedAt?: string;
}

interface WorkflowNode {
  id: string;
  type: "trigger" | "ai_agent" | "condition" | "branch" | "api_call" | "send_email"
      | "send_message" | "create_ticket" | "update_customer" | "assign_team"
      | "human_approval" | "delay" | "loop" | "webhook" | "code" | "notification";
  label: string;
  config?: Record<string, unknown>;
  position: { x: number; y: number };
}

interface WorkflowEdge {
  id: string;
  source: string;                 // nodeId
  target: string;                 // nodeId
  condition?: string;             // label da branch, ex.: "Payment", "Technical"
}

interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowVersionId: string;
  status: "success" | "failed" | "waiting" | "running";
  steps: WorkflowRunStep[];
  startedAt: string;
  completedAt?: string;
}

interface WorkflowRunStep {
  nodeId: string;
  label: string;
  status: "success" | "failed" | "waiting" | "skipped";
  detail?: string;
  timestamp: string;
}

// ---------- Knowledge ----------

interface KnowledgeSource {
  id: string;
  type: "website" | "pdf" | "notion" | "google_drive" | "url" | "manual" | "api";
  name: string;
  syncStatus: "synced" | "syncing" | "error";
  lastSyncedAt?: string;
}

interface KnowledgeDocument {
  id: string;
  sourceId: string;
  title: string;
  content: string;
  status: "ready" | "processing" | "conflict" | "outdated";
  confidence: number;             // 0–100, "AI readiness"
  updatedAt: string;
}

// ---------- Integrations, Channels, Notifications ----------

interface Integration {
  id: string;
  name: string;                   // "Stripe", "Slack", "Salesforce"
  category: "crm" | "erp" | "payments" | "analytics" | "storage" | "communication";
  status: "connected" | "disconnected" | "error";
}

interface Channel {
  id: string;
  type: "email" | "chat" | "whatsapp" | "sms" | "voice" | "social";
  name: string;
  status: "active" | "inactive";
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// ---------- Governance ----------

interface Approval {
  id: string;
  requestedByType: "agent" | "human";
  requestedById: string;
  type: "refund" | "account_deletion" | "subscription_change" | "escalation";
  amountCents?: number;
  status: "pending" | "approved" | "rejected";
  approverId?: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  actorType: "human" | "agent" | "system";
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
}
```

## 5. Relacionamentos-chave (para montar o Customer 360)

```text
Customer (1) ── (N) Contact
Customer (1) ── (N) Conversation ── (N) Message
Customer (1) ── (N) Ticket
Customer (1) ── (N) Order ── (N) Payment
Customer (1) ── (N) Activity
Customer (1) ── (N) Task (via relatedType = "customer")

Conversation (1) ── (0..1) AgentRun
Ticket (0..1) ── (1) SLA
Ticket (0..1) ── (1) Conversation

Agent (1) ── (N) AgentRun
Agent (N) ── (N) Tool
Agent (N) ── (N) Policy
Agent (N) ── (N) KnowledgeSource

Workflow (1) ── (N) WorkflowVersion ── (1) [current]
WorkflowVersion (1) ── (N) WorkflowRun

KnowledgeSource (1) ── (N) KnowledgeDocument
```

Todo `Customer 360` é montado filtrando essas coleções por `customerId` — mesmo em mock data, a página deve buscar dinamicamente (nunca hardcoded por customer).

## 6. Eventos de referência (catálogo)

```text
customer.created / customer.updated
conversation.created / conversation.message_received / conversation.resolved
ticket.created / ticket.assigned / ticket.resolved
payment.failed / payment.completed
workflow.started / workflow.completed / workflow.failed
agent.started / agent.completed / agent.escalated
```

Esse catálogo alimenta a Timeline do Customer 360, o AI Activity e o Audit Log — três telas diferentes sobre o mesmo tipo de dado.
