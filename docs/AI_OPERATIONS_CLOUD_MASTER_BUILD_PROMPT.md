# AI Operations Cloud — Master Build Prompt

You are an expert product designer, UX architect and senior frontend engineer.

Build a **high-fidelity visual product prototype** for **AI Operations Cloud**, using the accompanying complete product specification as the source of truth.

This is a sophisticated product prototype intended to become the primary visual/UX reference for a future real SaaS product. It is NOT a disposable mockup and it is NOT a production backend.

---

## 1. Product

AI Operations Cloud is an AI-native operating platform for business operations.

It contains five fully implemented operational domains:

1. Customer Operations
2. Business Operations
3. Sales Operations
4. Finance Operations
5. People Operations

These domains share:

- Tasks
- Events
- Activity
- AI Agents
- AI Copilot
- Workflows
- Processes
- Knowledge
- Policies
- Approvals
- Analytics
- Integrations
- Governance

Do not implement Sales, Finance or People as "coming soon". They are real modules of the prototype.

---

## 2. Primary Product Mental Model

Implement this conceptual loop throughout the UI:

```text
Event
→ Context
→ Decision
→ Workflow / Process
→ AI Agent / Human
→ Tool / System
→ Policy / Approval
→ Outcome
→ Activity
→ Analytics
```

The product should communicate that AI does operational work rather than merely generating text.

---

## 3. Prototype Boundaries

This is a frontend visual prototype.

Use:

- static/mock data;
- realistic interactions;
- local state;
- simulated AI execution;
- simulated workflows;
- simulated approvals;
- realistic loading/success/error states.

Do NOT implement:

- real AI API calls;
- real authentication;
- real payments;
- real HR actions;
- real external integrations;
- production database;
- production event bus;
- production secrets;
- production billing.

---

## 4. Visual Direction

Create a premium enterprise SaaS interface.

Desired qualities:

- sophisticated;
- technical;
- calm;
- trustworthy;
- information-dense;
- modern;
- operational.

Think about the product quality of Linear, Stripe, Intercom and Datadog without copying any of them.

Avoid:

- generic purple AI gradients;
- robot imagery;
- cartoon AI graphics;
- chatbot-centric layouts;
- excessive rounded cards;
- excessive glassmorphism;
- decorative dashboards;
- meaningless animation.

Use typography, spacing, hierarchy, borders and restrained surfaces to create quality.

---

## 5. Global Shell

Implement:

- collapsible sidebar;
- workspace switcher;
- global search;
- command palette;
- create button;
- AI Copilot button;
- notification center;
- help;
- user menu;
- breadcrumbs;
- page actions;
- responsive shell.

Main navigation:

```text
HOME
└── Command Center

MODULES
├── Customer Operations
├── Business Operations
├── Sales Operations
├── Finance Operations
└── People Operations

AI WORKFORCE
├── Agents
├── Agent Activity
├── Evaluations
└── Copilot

AUTOMATION
├── Workflows
├── Processes
├── Runs
└── Templates

KNOWLEDGE
├── Knowledge Hub
├── Sources
├── Documents
└── Collections

INTELLIGENCE
├── Global Analytics
├── Operations Intelligence
├── AI Performance
└── Recommendations

PLATFORM
├── Tasks
├── Approvals
├── Activity
├── Events
├── Policies
└── Integrations

ADMIN
├── Organization
├── Users
├── Teams
├── Roles & Permissions
├── Security
├── Audit Logs
├── Usage
└── Billing
```

---

## 6. Shared Design System

Create reusable primitives:

- Button
- IconButton
- Input
- Textarea
- Select
- Combobox
- DatePicker
- Checkbox
- Switch
- Radio
- Badge
- Avatar
- Tooltip
- Dropdown
- Popover
- Modal
- Drawer
- Toast
- Tabs
- Table/DataGrid
- Pagination
- Card
- EmptyState
- Skeleton
- Alert
- Banner
- Breadcrumb
- CommandPalette
- Timeline
- Progress

Create domain components:

- CustomerCard
- CustomerHealth
- ConversationRow
- ConversationComposer
- AIInsight
- AIRecommendation
- TicketCard
- SLAIndicator
- AgentCard
- AgentRun
- WorkflowNode
- WorkflowCanvas
- ActivityTimeline
- KnowledgeSource
- AnalyticsMetric
- ChartCard
- ApprovalCard
- PolicyCard

Prioritize reuse and consistency.

---

## 7. Mock Data

Use a fictional company named:

**ACME Corporation**

Create interconnected mock entities.

Suggested dataset:

```text
Customers: 2,481
Conversations: 42,831
Employees: 384
Leads: 3,842
Open Opportunities: 287
Pipeline: €2.4M
Invoices: 1,284
AI Agents: 18
Workflows: 67
Processes: 24
Integrations: 18
```

The data must be relational.

Clicking a customer should reveal that customer's conversations, tickets, invoices, sales relationships and activities.

Clicking a deal should reveal its account, contacts, activities and risk analysis.

Clicking an invoice should connect to its customer/vendor/payment/activity.

Clicking an employee should connect to their team, onboarding and tasks.

---

## 8. Command Center

Make `/app/overview` the strongest first impression.

Include:

- Active Operations;
- Operational Health;
- AI Automation;
- Requires Attention;
- module health;
- AI Operations Brief;
- volume trends;
- SLA;
- AI vs human;
- recent activity.

Example Attention Center:

```text
18 conversations approaching SLA
€420K pipeline at risk
12 invoices overdue >30 days
6 onboarding processes delayed
Vendor approval waiting 3 days
```

Every item should navigate to a relevant entity.

---

# 9. CUSTOMER OPERATIONS

Implement complete navigation:

```text
Overview
Inbox
Conversations
Customers
Customer 360
Tickets
Cases
SLA
Escalations
Tasks
Queues
Team Workload
Customer Insights
Sentiment
Customer Health
AI Recommendations
Analytics
```

### Inbox

Use a three-column layout:

```text
Conversation List | Conversation | Customer Context
```

Make filters functional.

Conversation must support:

- status;
- priority;
- assignee;
- AI analysis;
- suggested response;
- internal note;
- composer;
- AI action simulation.

### Customer 360

Include:

- profile;
- health;
- plan;
- LTV;
- conversations;
- tickets;
- orders;
- subscriptions;
- tasks;
- notes;
- files;
- unified activity timeline.

### Signature Customer AI Flow

Implement a simulated "Resolve with AI" experience:

```text
Customer issue
→ Triage Agent
→ customer lookup
→ payment lookup
→ policy check
→ action
→ notification
→ resolution
```

Show a clear execution timeline. Do not show hidden chain-of-thought.

---

# 10. BUSINESS OPERATIONS

Implement:

```text
Overview
Process Library
Active Processes
Process Runs
Templates
Operations Board
Operational Cases
Exceptions
Bottlenecks
Escalations
Workflows
Automation Opportunities
Policies
Approvals
Compliance
Process Analytics
Process Mining
Recommendations
```

Build a strong Process Detail screen.

Tabs:

```text
Overview
Workflow
Runs
Tasks
Agents
Approvals
Policies
Analytics
Activity
```

Use Vendor Onboarding as the flagship example.

Show process stages and bottlenecks.

---

# 11. SALES OPERATIONS

Implement:

```text
Overview
Leads
Lead Detail
Accounts
Account Detail
Opportunities
Opportunity Detail
Deals
Deal Detail
Pipeline
Activities
Sequences
Meetings
Follow-ups
Lead Intelligence
Lead Scoring
Opportunity Insights
Deal Risk
Recommendations
Forecast
Pipeline Health
Revenue Performance
Conversion Analytics
Sales Workflows
AI Agents
Runs
```

### Pipeline

Create a real visual pipeline board.

Each deal card should show:

- account;
- value;
- probability;
- owner;
- age;
- next activity;
- AI risk.

### Deal Risk

Create a high-quality AI risk panel:

```text
Deal: €42,000
Risk: High

No activity for 12 days
Decision maker absent
Proposal viewed once
Competitor mentioned
```

Allow the user to create a follow-up task from the recommendation.

---

# 12. FINANCE OPERATIONS

Implement:

```text
Overview
Invoices
Invoice Detail
Payments
Collections
Overdue
Bills
Expenses
Vendors
Reconciliation
Financial Tasks
Exceptions
Approvals
Cash Flow Insights
Payment Risk
Anomalies
Forecasting
Recommendations
Cash Flow Analytics
Revenue Analytics
Expense Analytics
Receivables Analytics
```

### Invoice Detail

Show:

- invoice metadata;
- line items;
- customer/vendor;
- payment status;
- approval;
- activity;
- AI analysis.

### Payment Recovery

Create a simulated AI agent flow:

```text
Invoice overdue
→ customer history
→ payment history
→ risk analysis
→ collection strategy
→ approval if necessary
→ communication
→ monitoring
```

### Anomaly

Create visual examples of duplicate payments, unusual expenses and reconciliation mismatches.

Do not perform real financial transactions.

---

# 13. PEOPLE OPERATIONS

Implement:

```text
Overview
Employees
Employee 360
Directory
Teams
Departments
Organization
Onboarding
Employee Journey
Internal Mobility
Offboarding
Candidates
Hiring Pipeline
Interviews
Talent Insights
Goals
Reviews
Feedback
Performance Insights
Requests
People Tasks
Approvals
Documents
Workforce Insights
Team Health
Retention Risk
Recommendations
Analytics
```

### Employee 360

Use:

```text
Overview
Profile
Activity
Team
Goals
Performance
Feedback
Documents
Requests
Tasks
Journey
```

### Onboarding

Implement:

```text
Employee Created
→ Role Identified
→ Onboarding Process
→ Equipment
→ Accounts
→ Documents
→ Manager Notification
→ Tasks
→ Completion
```

Sensitive people decisions should be presented as insights/recommendations requiring appropriate human review, not autonomous decisions.

---

# 14. AI WORKFORCE

Implement:

```text
Agents
Agent Detail
Agent Builder
Agent Activity
Agent Run
Evaluations
Copilot
```

Agent Builder sections:

```text
Identity
Objective
Behavior
Knowledge
Tools
Policies
Permissions
Escalation
Test Agent
```

Show tools and autonomy policies.

Example:

```text
Refund ≤ €50 → autonomous
€50–€200 → human approval
> €200 → finance approval
Fraud → prohibited
```

Create agent versions.

---

# 15. AI ACTIVITY

Create a professional observability table:

```text
Time
Agent
Action
Entity
Status
Confidence
Cost
Duration
```

Statuses:

```text
Running
Completed
Waiting Approval
Escalated
Failed
```

Agent Run Detail must contain a timeline.

Use concise operational trace information.

Never expose private chain-of-thought.

---

# 16. AI COPILOT

Make Copilot contextual.

On a Deal:

> Why is this deal at risk?

On an Invoice:

> Why is this invoice overdue?

On a Customer:

> Summarize this account.

On a Process:

> What is causing this process bottleneck?

Provide suggested actions.

---

# 17. AUTOMATION

Implement:

```text
Workflows
Workflow Detail
Workflow Builder
Workflow Runs
Workflow Run Detail
Templates
Processes
```

Workflow Builder must be a visual node canvas.

Node types:

```text
Trigger
Condition
Branch
Loop
Delay
AI Agent
Classify
Summarize
Action
Approval
Assignment
Escalation
```

Build at least six polished example workflows:

1. New Customer Triage
2. Payment Failure Resolution
3. SLA Escalation
4. New Lead Qualification
5. Invoice Processing
6. Employee Onboarding

---

# 18. KNOWLEDGE

Implement:

```text
Knowledge Hub
Sources
Documents
Document Detail
Collections
```

Show:

```text
Coverage
Freshness
Conflicts
Missing Topics
Low-confidence documents
```

Documents should display:

- status;
- source;
- collection;
- version;
- indexing;
- AI readiness;
- related agents.

---

# 19. GOVERNANCE

Implement:

```text
Policies
Approvals
Guardrails
Audit Logs
Security
```

Approval UI must show:

- actor;
- action;
- entity;
- reason;
- policy;
- amount/value;
- approvers;
- status.

Audit logs should distinguish:

```text
Human
AI Agent
Workflow
System
```

---

# 20. ANALYTICS

Implement dashboards for:

- Global Operations;
- Customer Operations;
- Business Operations;
- Sales Operations;
- Finance Operations;
- People Operations;
- AI Performance;
- Automation.

Charts should support dimensions such as:

- time;
- team;
- channel;
- agent;
- customer segment;
- intent;
- process;
- module.

Use realistic data, not arbitrary random charts.

---

# 21. CROSS-MODULE RELATIONSHIPS

This is critical.

Implement visible cross-domain links.

Example:

```text
Sales
Lead
→ Opportunity
→ Deal Won
→ Customer

Customer
→ Subscription
→ Invoice
→ Payment

Payment Failed
→ Finance Operation
→ Customer Conversation

People
→ Employee
→ Onboarding
→ Business Process
→ Tasks
→ Approvals
```

The user should feel that all five modules belong to the same operating system.

---

# 22. Shared Operations Layer

Tasks, Events, Activity, Approvals and Policies must work across modules.

Examples:

```text
Sales creates Task
Finance creates Approval
People creates Task
Customer creates Escalation
Business creates Process Run
AI Agent creates Activity
Workflow creates Event
```

Use the same UI primitives and concepts.

---

# 23. Responsive UX

Desktop is primary.

Tablet must work.

Mobile must prioritize:

- tasks;
- approvals;
- inbox;
- customer;
- deal;
- invoice;
- employee;
- notifications;
- AI actions.

Workflow Builder may be desktop-first.

---

# 24. States

Every screen must have appropriate:

- loading;
- skeleton;
- empty;
- filtered-empty;
- error;
- permission denied;
- saving;
- saved;
- success;
- offline/connection error.

---

# 25. Technical Organization

Prefer domain-oriented architecture:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── charts/
│   └── product/
├── core/
├── modules/
│   ├── customer-operations/
│   ├── business-operations/
│   ├── sales-operations/
│   ├── finance-operations/
│   └── people-operations/
├── features/
│   ├── ai/
│   ├── automation/
│   ├── knowledge/
│   ├── analytics/
│   ├── approvals/
│   ├── policies/
│   └── integrations/
├── data/
└── types/
```

Keep mock data separate from UI.

Use typed entities.

Do not duplicate shared primitives between modules.

---

# 26. Implementation Strategy

Build in this order:

### Phase 1
Foundation + design system + shell + routing + mock data.

### Phase 2
Command Center + Tasks + Activity + Events + Approvals + Policies.

### Phase 3
Customer Operations.

### Phase 4
Sales Operations.

### Phase 5
Finance Operations.

### Phase 6
People Operations.

### Phase 7
Business Operations.

### Phase 8
AI Workforce.

### Phase 9
Automation.

### Phase 10
Knowledge + Analytics.

### Phase 11
Admin.

After each phase, perform a visual and UX consistency pass.

---

# 27. Quality Bar

Do not optimize for number of pages.

Optimize for:

- coherence;
- hierarchy;
- believable data;
- reusable components;
- consistent interactions;
- cross-module relationships;
- operational realism;
- visual polish.

The prototype should look like a product that could be shown to a serious SaaS investor or enterprise design partner.

Avoid shallow "dashboard collection" behavior.

Every major screen needs a reason to exist and a relationship to the operating model.

---

# 28. Definition of Done

The prototype is complete when:

- all five operational modules are implemented;
- every module has overview, core entities, workflows/processes and analytics;
- AI agents are first-class entities;
- AI runs are observable;
- workflows are visual;
- policies and approvals are visible;
- knowledge is connected to agents;
- tasks/events/activity are cross-module;
- Command Center summarizes the entire company;
- cross-domain navigation works;
- mock data is coherent;
- responsive behavior is intentional;
- loading/error/empty states exist;
- visual language is consistent;
- the product feels like one platform.

The final experience should communicate:

> **AI Operations Cloud turns business events into governed, observable and measurable work performed by humans, AI agents and automated workflows.**
