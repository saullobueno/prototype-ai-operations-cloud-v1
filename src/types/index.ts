// Tipos de domínio do AI Operations Cloud — protótipo.
// Espelha docs/03-modelo-de-dados.md. Fonte de verdade para o mock data em src/data/mock.

// ---------- Platform Core ----------

export interface Workspace {
  id: string;
  name: string;
  environment: "production" | "sandbox";
  organizationId: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: "starter" | "professional" | "business" | "enterprise";
  createdAt: string;
}

export type RoleName = "Owner" | "Admin" | "Manager" | "Agent" | "Viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleId: string;
  teamIds: string[];
  status: "active" | "invited" | "suspended";
}

export interface Team {
  id: string;
  name: string;
  memberIds: string[];
}

export interface Role {
  id: string;
  name: RoleName;
  permissionIds: string[];
}

export interface Permission {
  id: string;
  key: string;
  description: string;
}

// ---------- Customer domain ----------

export type CustomerHealth = "healthy" | "at_risk" | "critical";
export type CustomerPlan = "Starter" | "Professional" | "Business" | "Enterprise";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  avatarUrl?: string;
  plan: CustomerPlan;
  lifetimeValueCents: number;
  customerSince: string;
  health: CustomerHealth;
  tags: string[];
}

export interface Contact {
  id: string;
  customerId: string;
  name: string;
  email: string;
  role?: string;
}

export interface Order {
  id: string;
  customerId: string;
  amountCents: number;
  status: "paid" | "pending" | "refunded" | "failed";
  createdAt: string;
  description: string;
}

export interface Payment {
  id: string;
  customerId: string;
  orderId?: string;
  amountCents: number;
  status: "completed" | "failed" | "refunded";
  method: string;
  createdAt: string;
}

// ---------- Customer Operations ----------

export type Channel = "email" | "chat" | "whatsapp" | "sms" | "voice" | "social";
export type ConversationStatus = "open" | "pending" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type Sentiment = "positive" | "neutral" | "frustrated" | "angry";

export interface AIAnalysis {
  intent: string;
  sentiment: Sentiment;
  priority: Priority;
  customerValueCents?: number;
  recommendedAction?: string;
  reason?: string;
  confidence: number;
}

export interface Conversation {
  id: string;
  customerId: string;
  channel: Channel;
  status: ConversationStatus;
  priority: Priority;
  assigneeId?: string;
  assigneeType?: "human" | "agent";
  aiAnalysis?: AIAnalysis;
  lastMessageAt: string;
  createdAt: string;
  subject: string;
}

export interface Message {
  id: string;
  conversationId: string;
  authorType: "customer" | "human" | "agent" | "system";
  authorId: string;
  body: string;
  createdAt: string;
}

export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";

export interface Ticket {
  id: string;
  customerId: string;
  conversationId?: string;
  title: string;
  status: TicketStatus;
  priority: Priority;
  assigneeId?: string;
  teamId?: string;
  slaId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SLA {
  id: string;
  name: string;
  firstResponseMinutes: number;
  resolutionMinutes: number;
  appliesToPriority: Priority[];
}

// ---------- Tasks, Activity, Events ----------

export interface Task {
  id: string;
  title: string;
  relatedType: "customer" | "ticket" | "conversation" | "workflow";
  relatedId: string;
  assigneeId: string;
  status: "new" | "todo" | "in_progress" | "review" | "done" | "canceled";
  dueAt?: string;
}

export interface Activity {
  id: string;
  customerId?: string;
  actorType: "human" | "agent" | "system";
  actorId: string;
  action: string;
  relatedType?: string;
  relatedId?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

// ---------- AI / Agents ----------

export interface Tool {
  id: string;
  key: string;
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
}

export type PolicyAction = "ai_can_execute" | "human_approval" | "finance_approval" | "never_execute";

export interface PolicyRule {
  id: string;
  condition: string;
  action: PolicyAction;
}

export interface Policy {
  id: string;
  name: string;
  rules: PolicyRule[];
}

export type AutonomyLevel = "autonomous" | "assisted" | "approval_required" | "human_only";
export type AgentStatus = "active" | "paused" | "draft";

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  status: AgentStatus;
  goal: string;
  personality: string[];
  knowledgeSourceIds: string[];
  toolIds: string[];
  policyIds: string[];
  autonomyLevel: AutonomyLevel;
}

export type AgentRunStepType = "retrieval" | "reasoning" | "tool_call" | "decision" | "message" | "approval";

export interface AgentRunStep {
  id: string;
  label: string;
  type: AgentRunStepType;
  detail?: string;
  timestamp: string;
  /** Só relevante para steps do tipo "approval" — resultado da aprovação humana (ausente = aguardando). */
  outcome?: "approved" | "rejected";
}

export type AgentRunStatus = "running" | "completed" | "escalated" | "failed";

export interface AgentRun {
  id: string;
  agentId: string;
  conversationId?: string;
  customerId?: string;
  status: AgentRunStatus;
  steps: AgentRunStep[];
  startedAt: string;
  completedAt?: string;
  /** Vincula este run à Approval que ele gerou, quando o run foi escalado para aprovação humana. */
  approvalId?: string;
}

export interface Evaluation {
  id: string;
  targetType: "agent_run" | "conversation";
  targetId: string;
  accuracy: number;
  tone: number;
  policyAdherence: number;
  resolution: "resolved" | "escalated" | "unresolved";
  reviewerId?: string;
  createdAt: string;
}

// ---------- Automation ----------

export type WorkflowTriggerType =
  | "conversation_created"
  | "ticket_created"
  | "customer_created"
  | "message_received"
  | "payment_failed"
  | "sla_approaching"
  | "webhook"
  | "schedule"
  | "manual";

export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  config?: Record<string, unknown>;
}

export type WorkflowStatus = "active" | "paused" | "draft";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  currentVersionId: string;
  totalRuns: number;
  successRuns: number;
  failedRuns: number;
  waitingRuns: number;
}

export type WorkflowNodeType =
  | "trigger"
  | "ai_agent"
  | "condition"
  | "branch"
  | "api_call"
  | "send_email"
  | "send_message"
  | "create_ticket"
  | "update_customer"
  | "assign_team"
  | "human_approval"
  | "delay"
  | "loop"
  | "webhook"
  | "code"
  | "notification";

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  config?: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  publishedAt?: string;
}

export type WorkflowRunStatus = "success" | "failed" | "waiting" | "running";

export interface WorkflowRunStep {
  nodeId: string;
  label: string;
  status: "success" | "failed" | "waiting" | "skipped";
  detail?: string;
  timestamp: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowVersionId: string;
  status: WorkflowRunStatus;
  steps: WorkflowRunStep[];
  startedAt: string;
  completedAt?: string;
}

// ---------- Knowledge ----------

export type KnowledgeSourceType = "website" | "pdf" | "notion" | "google_drive" | "url" | "manual" | "api";

export interface KnowledgeSource {
  id: string;
  type: KnowledgeSourceType;
  name: string;
  syncStatus: "synced" | "syncing" | "error";
  lastSyncedAt?: string;
}

export type KnowledgeDocumentStatus = "ready" | "processing" | "conflict" | "outdated";

export interface KnowledgeDocument {
  id: string;
  sourceId: string;
  title: string;
  content: string;
  status: KnowledgeDocumentStatus;
  confidence: number;
  updatedAt: string;
  collection?: string;
  published?: boolean;
}

// ---------- Integrations, Channels, Notifications ----------

export interface Integration {
  id: string;
  name: string;
  category: "crm" | "erp" | "payments" | "analytics" | "storage" | "communication";
  status: "connected" | "disconnected" | "error";
  connectedAt?: string;
}

export interface ChannelConfig {
  id: string;
  type: Channel;
  name: string;
  status: "active" | "inactive";
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// ---------- Governance ----------

export type ApprovalType = "refund" | "account_deletion" | "subscription_change" | "escalation";

export interface Approval {
  id: string;
  requestedByType: "agent" | "human";
  requestedById: string;
  type: ApprovalType;
  amountCents?: number;
  status: "pending" | "approved" | "rejected";
  approverId?: string;
  createdAt: string;
  context?: string;
  customerId?: string;
  /** Vincula esta aprovação ao AgentRun que a originou (quando aplicável). */
  runId?: string;
}

export interface AuditLog {
  id: string;
  actorType: "human" | "agent" | "system";
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
}

// ---------- Notes / Files (Customer 360) ----------

export interface Note {
  id: string;
  customerId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  customerId: string;
  name: string;
  sizeKb: number;
  kind: "pdf" | "image" | "doc" | "sheet" | "other";
  uploadedById: string;
  createdAt: string;
}
