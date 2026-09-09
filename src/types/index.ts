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
  phone?: string;
  bio?: string;
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
  // RoleName cobre os 5 papéis de sistema (usados no ranking de RBAC visual em
  // src/core/permissions); o `& {}` preserva o autocomplete desses literais mas ainda aceita
  // qualquer string, para permitir papéis customizados criados em /admin/roles.
  name: RoleName | (string & {});
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
  /** Cliente já convertido. Um Contact pertence a um Customer ou a um Account (Sales), nunca nenhum dos dois. */
  customerId?: string;
  /** Account (Sales Operations) ainda não convertido em Customer. */
  accountId?: string;
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

export type VendorStatus = "active" | "pending_approval" | "inactive";

export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: VendorStatus;
  contactEmail?: string;
  taxId?: string;
  onboardedAt?: string;
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
  relatedType:
    | "customer"
    | "ticket"
    | "conversation"
    | "workflow"
    | "lead"
    | "account"
    | "deal"
    | "process"
    | "process_run"
    | "invoice"
    | "vendor"
    | "employee"
    | "candidate";
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

/** Módulo dono do recurso. Ausente = Platform Core / Customer Operations (v1). */
export type ModuleKey =
  | "customer_operations"
  | "sales_operations"
  | "business_operations"
  | "finance_operations"
  | "people_operations";

export interface Tool {
  id: string;
  key: string;
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  module?: ModuleKey;
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
  module?: ModuleKey;
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
  module?: ModuleKey;
  /** Workflow reutilizável exibido em Automation > Modelos, usado como ponto de partida em vez de um canvas em branco. */
  isTemplate?: boolean;
  /** Categoria de exibição para modelos (ex.: "Suporte", "Billing"). Só relevante quando isTemplate é true. */
  templateCategory?: string;
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

export type ApprovalType =
  | "refund"
  | "account_deletion"
  | "subscription_change"
  | "escalation"
  | "vendor_onboarding"
  | "bill_payment"
  | "expense"
  | "purchase_order"
  | "time_off"
  | "hiring"
  | "process_exception";

export interface Approval {
  id: string;
  requestedByType: "agent" | "human";
  requestedById: string;
  type: ApprovalType;
  amountCents?: number;
  status: "pending" | "approved" | "rejected" | "expired" | "cancelled";
  approverId?: string;
  createdAt: string;
  deadline?: string;
  context?: string;
  customerId?: string;
  /** Vincula esta aprovação ao AgentRun que a originou (quando aplicável). */
  runId?: string;
  /** Módulo de origem — ausente = Customer Operations (v1, comportamento legado). */
  module?: ModuleKey;
  /** Entidade que originou o pedido de aprovação (process run, bill, invoice, employee request...). */
  relatedType?: string;
  relatedId?: string;
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

// ---------- Sales Operations ----------

export type ICPTier = "ideal" | "good" | "poor";
export type LeadSource = "website" | "referral" | "outbound" | "event" | "import" | "partner";
export type LeadStatus = "new" | "contacted" | "qualified" | "disqualified" | "converted";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  title?: string;
  source: LeadSource;
  status: LeadStatus;
  leadScore: number; // 0-100
  scoreReasons: string[];
  icpFit: ICPTier;
  ownerId?: string;
  /** Preenchido depois que o lead é qualificado e convertido em Account/Deal. */
  accountId?: string;
  createdAt: string;
}

export type AccountStatus = "prospecting" | "qualifying" | "active_deal" | "customer" | "lost" | "churned";

export interface Account {
  id: string;
  name: string;
  domain: string;
  industry: string;
  employeeCount?: number;
  annualRevenueCents?: number;
  icpFitScore: number; // 0-100
  icpTier: ICPTier;
  ownerId: string;
  status: AccountStatus;
  /** Vincula ao Customer real (core) quando o account fechou como cliente. */
  convertedCustomerId?: string;
  enrichedAt?: string;
  tags: string[];
  createdAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  defaultProbability: number; // 0-100
}

export type DealStatus = "open" | "won" | "lost";
export type RiskLevel = "low" | "medium" | "high";

export interface Deal {
  id: string;
  name: string;
  accountId: string;
  stageId: string;
  amountCents: number;
  probability: number; // 0-100
  expectedCloseDate: string;
  ownerId: string;
  status: DealStatus;
  riskLevel: RiskLevel;
  riskReasons: string[];
  recommendedAction?: string;
  lastActivityAt: string;
  createdAt: string;
  closedAt?: string;
}

export type InteractionType = "email" | "meeting" | "call";

export interface InteractionAIAnalysis {
  sentiment: "positive" | "neutral" | "negative";
  intent: string;
  engagementScore: number; // 0-100
  nextStepSuggested?: string;
}

export interface Interaction {
  id: string;
  accountId: string;
  dealId?: string;
  contactId?: string;
  type: InteractionType;
  direction: "inbound" | "outbound";
  subject?: string;
  summary: string;
  aiAnalysis?: InteractionAIAnalysis;
  occurredAt: string;
}

export type SignalType =
  | "no_response"
  | "competitor_mentioned"
  | "champion_left"
  | "budget_confirmed"
  | "pricing_page_visited"
  | "meeting_no_show"
  | "decision_maker_engaged"
  | "positive_buying_intent";

export interface Signal {
  id: string;
  accountId: string;
  dealId?: string;
  type: SignalType;
  detectedAt: string;
  detail?: string;
  impact: "positive" | "negative";
}

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected";

export interface Proposal {
  id: string;
  dealId: string;
  status: ProposalStatus;
  valueCents: number;
  sentAt?: string;
}

// ---------- Business Operations ----------
// Domínio de BPM / orquestração de processos. Reusa Task, Approval, Policy, Workflow, Agent do core.
// `BusinessProcess` é a definição reusável; `ProcessRun` é uma execução concreta (ex.: "Vendor Onboarding" rodando para um vendor específico).

export type BusinessProcessCategory = "procurement" | "onboarding" | "compliance" | "operations" | "finance" | "hr";
export type BusinessProcessStatus = "active" | "paused" | "draft";

export interface BusinessProcess {
  id: string;
  name: string;
  description: string;
  category: BusinessProcessCategory;
  status: BusinessProcessStatus;
  ownerId: string;
  /** Workflow (Automation) que implementa este processo, quando modelado como canvas. */
  workflowId?: string;
  slaHours?: number;
  totalRuns: number;
  activeRuns: number;
  avgDurationHours: number;
  exceptionRate: number; // 0-100
  automationRate: number; // 0-100
  createdAt: string;
}

export interface ProcessStage {
  id: string;
  processId: string;
  name: string;
  order: number;
}

export type ProcessStepStatus = "pending" | "in_progress" | "completed" | "blocked" | "skipped";
export type ProcessRunStatus = "running" | "completed" | "exception" | "waiting_approval";

export interface ProcessRunStep {
  stageId: string;
  label: string;
  status: ProcessStepStatus;
  ownerType: "human" | "agent" | "system";
  ownerId?: string;
  startedAt?: string;
  completedAt?: string;
  detail?: string;
}

export interface ProcessRun {
  id: string;
  processId: string;
  /** Descrição legível do que está rodando, ex.: "Vendor: Nordic Supplies AB". */
  subject: string;
  status: ProcessRunStatus;
  steps: ProcessRunStep[];
  startedAt: string;
  completedAt?: string;
  relatedType?: string;
  relatedId?: string;
}

export type OperationalCaseStatus = "open" | "in_progress" | "resolved";

export interface OperationalCase {
  id: string;
  title: string;
  processId?: string;
  processRunId?: string;
  status: OperationalCaseStatus;
  severity: RiskLevel;
  assigneeId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ProcessException {
  id: string;
  processId: string;
  processRunId: string;
  stageId?: string;
  reason: string;
  severity: RiskLevel;
  status: "open" | "resolved";
  createdAt: string;
}

export interface Escalation {
  id: string;
  processRunId?: string;
  reason: string;
  escalatedToId: string;
  status: "pending" | "acknowledged" | "resolved";
  createdAt: string;
}

export interface SOP {
  id: string;
  processId: string;
  title: string;
  content: string;
  updatedAt: string;
}

// ---------- Finance Operations ----------
// Reusa Customer (receivables) e Vendor (payables, core) — não reimplementa um ERP completo.

export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue" | "void";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmountCents: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  status: InvoiceStatus;
  amountCents: number;
  lineItems: InvoiceLineItem[];
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  daysOverdue?: number;
  riskLevel?: RiskLevel;
  riskReasons?: string[];
}

export type TransactionType = "charge" | "refund" | "payout" | "adjustment";

export interface Transaction {
  id: string;
  type: TransactionType;
  invoiceId?: string;
  amountCents: number;
  status: "completed" | "failed" | "pending";
  createdAt: string;
}

export type BillStatus = "pending_approval" | "approved" | "paid" | "rejected";

export interface Bill {
  id: string;
  vendorId: string;
  amountCents: number;
  status: BillStatus;
  dueDate: string;
  approvalId?: string;
  createdAt: string;
}

export type ExpenseCategory = "software" | "travel" | "office" | "marketing" | "other";

export interface Expense {
  id: string;
  vendorId?: string;
  category: ExpenseCategory;
  amountCents: number;
  submittedById: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  anomalyReason?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  name: string;
  category: ExpenseCategory;
  periodStart: string;
  periodEnd: string;
  allocatedCents: number;
  spentCents: number;
}

export type CollectionCaseStatus = "monitoring" | "contacted" | "escalated" | "resolved";

export interface CollectionCase {
  id: string;
  invoiceId: string;
  customerId: string;
  status: CollectionCaseStatus;
  strategy: string;
  agentId?: string;
  createdAt: string;
}

export interface Reconciliation {
  id: string;
  period: string;
  matchedCents: number;
  unmatchedCents: number;
  mismatches: number;
  status: "balanced" | "discrepancy";
}

export interface CashFlowForecastPoint {
  horizonDays: 30 | 60 | 90;
  projectedInflowCents: number;
  projectedOutflowCents: number;
  netCents: number;
}

export type FinancialAnomalyType =
  | "duplicate_payment"
  | "unusual_expense"
  | "unexpected_amount"
  | "vendor_anomaly"
  | "reconciliation_mismatch";

export interface FinancialAnomaly {
  id: string;
  type: FinancialAnomalyType;
  relatedType: "invoice" | "expense" | "bill" | "transaction";
  relatedId: string;
  detail: string;
  amountCents?: number;
  detectedAt: string;
  status: "open" | "dismissed" | "confirmed";
}

// ---------- People Operations ----------
// `Employee` é o sujeito de RH — distinto de `User` (conta/seat da plataforma). Um Employee pode ou não ter um User vinculado.

export type EmploymentStatus = "active" | "onboarding" | "on_leave" | "offboarding" | "terminated";

export interface Department {
  id: string;
  name: string;
  headId?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  title: string;
  departmentId: string;
  managerId?: string;
  status: EmploymentStatus;
  startDate: string;
  location?: string;
}

export type CandidateStage = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: CandidateStage;
  appliedAt: string;
}

export type OnboardingStepStatus = "pending" | "in_progress" | "done" | "blocked";

export interface OnboardingStep {
  id: string;
  label: string;
  status: OnboardingStepStatus;
  ownerType: "human" | "agent" | "system";
  completedAt?: string;
}

export interface Onboarding {
  id: string;
  employeeId: string;
  status: "in_progress" | "completed" | "delayed";
  steps: OnboardingStep[];
  startedAt: string;
  completedAt?: string;
}

export interface Offboarding {
  id: string;
  employeeId: string;
  status: "in_progress" | "completed";
  lastDay: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  progress: number; // 0-100
  status: "on_track" | "at_risk" | "achieved";
  dueDate: string;
}

export type ReviewStatus = "scheduled" | "in_progress" | "completed";

export interface PerformanceReview {
  id: string;
  employeeId: string;
  cycle: string;
  status: ReviewStatus;
  rating?: number;
}

export interface PeopleFeedback {
  id: string;
  employeeId: string;
  fromId: string;
  body: string;
  createdAt: string;
}

export type PeopleRequestType = "time_off" | "equipment" | "expense" | "internal_mobility" | "document";

export interface PeopleRequest {
  id: string;
  employeeId: string;
  type: PeopleRequestType;
  status: "pending" | "approved" | "rejected";
  approvalId?: string;
  createdAt: string;
}

export interface RetentionRisk {
  employeeId: string;
  riskLevel: RiskLevel;
  reasons: string[];
}
