# AI Operations Cloud — Complete Product & Prototype Specification

**Version:** 1.0  
**Status:** High-fidelity product/reference prototype specification  
**Scope:** Full platform — Core + Customer Operations + Business Operations + Sales Operations + Finance Operations + People Operations

---

## 1. Product Definition

AI Operations Cloud is an AI-native operations platform for coordinating people, AI agents, workflows, business processes, knowledge, systems, approvals and operational data.

It is **not** a customer-support application with AI added on top. Customer Operations is one operational domain among five:

1. Customer Operations
2. Business Operations
3. Sales Operations
4. Finance Operations
5. People Operations

All domains share a common operational operating system.

### Product thesis

> **Events become work. Work is orchestrated by workflows and AI agents. Policies determine what can happen autonomously. Humans intervene when required. Every action creates an auditable operational record and measurable business outcome.**

### Core loop

```text
Event
  ↓
Context
  ↓
Classification / Decision
  ↓
Workflow / Process
  ↓
AI Agent / Human
  ↓
Tool / System Action
  ↓
Approval / Policy
  ↓
Outcome
  ↓
Activity / Event
  ↓
Analytics
```

---

# 2. Platform Architecture

```text
AI OPERATIONS CLOUD
│
├── PLATFORM CORE
│   ├── Workspace & Identity
│   ├── Organizations
│   ├── Users & Teams
│   ├── Permissions
│   ├── Tasks
│   ├── Events
│   ├── Activity
│   ├── Notifications
│   ├── Search
│   └── Command Center
│
├── AI INTELLIGENCE
│   ├── AI Agents
│   ├── Agent Runs
│   ├── Copilot
│   ├── Evaluations
│   ├── AI Policies
│   └── AI Usage
│
├── AUTOMATION
│   ├── Workflows
│   ├── Processes
│   ├── Workflow Runs
│   ├── Templates
│   └── Automation Analytics
│
├── KNOWLEDGE
│   ├── Knowledge Hub
│   ├── Sources
│   ├── Documents
│   ├── Collections
│   └── Knowledge Health
│
├── GOVERNANCE
│   ├── Policies
│   ├── Approvals
│   ├── Guardrails
│   ├── Audit Logs
│   └── Security
│
├── INTEGRATIONS
│   ├── Communication
│   ├── CRM
│   ├── Finance
│   ├── HR
│   ├── Data
│   └── APIs / Webhooks
│
└── OPERATIONAL DOMAINS
    ├── Customer Operations
    ├── Business Operations
    ├── Sales Operations
    ├── Finance Operations
    └── People Operations
```

---

# 3. Global Navigation

```text
AI OPERATIONS CLOUD

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

Global shell:

- collapsible sidebar;
- workspace switcher;
- global search;
- command palette;
- create button;
- AI Copilot launcher;
- notifications;
- help;
- user menu;
- breadcrumbs;
- contextual actions;
- responsive mobile navigation.

---

# 4. Shared Domain Model

## Core entities

```text
Workspace
Organization
User
Team
Role
Permission

Customer
Company
Contact
Employee
Account
Lead
Opportunity
Deal
Vendor

Conversation
Message
Ticket
Case
Task
Activity
Event
Notification

Workflow
WorkflowRun
Process
ProcessRun
Approval
Policy
Exception
Outcome

Agent
AgentRun
AgentVersion
Tool
Evaluation
Recommendation

KnowledgeSource
Document
Collection
KnowledgeChunk

Integration
Connection
Webhook
APIKey

Metric
Dashboard
AuditLog
```

## Operations Graph

The platform maintains a conceptual graph connecting entities and actions.

Example:

```text
Lead
 ↓
Account
 ↓
Opportunity
 ↓
Deal
 ↓
Customer
 ↓
Conversation
 ↓
Ticket
 ↓
Workflow
 ↓
Agent
 ↓
Tool
 ↓
Policy
 ↓
Approval
 ↓
Action
 ↓
Outcome
 ↓
Activity
```

The graph should be reflected visually in Customer 360, Employee 360, Deal Detail, Agent Run, Workflow Run and global Activity.

---

# 5. Command Center

The home page is a cross-domain operational command center.

## Purpose

Answer immediately:

- What is happening?
- What is unhealthy?
- What needs human attention?
- What is AI doing?
- Where are operational bottlenecks?
- What changed recently?

## KPI cards

```text
Active Operations
12,481

Overall Operational Health
94.2%

AI Automation Rate
68.4%

Requires Attention
127
```

## Module Health

```text
Customer Operations    Healthy
Business Operations    Attention
Sales Operations       Healthy
Finance Operations     Critical
People Operations      Healthy
```

## Attention Center

Examples:

- 18 conversations approaching SLA;
- €420K pipeline at risk;
- 12 invoices overdue >30 days;
- 6 employee onboarding processes delayed;
- vendor approval waiting three days.

## AI Operations Brief

The AI summarizes significant operational changes and provides links to affected entities.

---

# 6. CUSTOMER OPERATIONS

## Mission

Operate customer engagement, service, support, customer health and customer-related processes.

## Navigation

```text
CUSTOMER OPERATIONS

Overview

Engagement
├── Inbox
├── Conversations
├── Customers
└── Customer 360

Service
├── Tickets
├── Cases
├── SLA
└── Escalations

Work
├── Tasks
├── Queues
└── Team Workload

Intelligence
├── Customer Insights
├── Sentiment
├── Customer Health
└── AI Recommendations

Analytics
├── Overview
├── Service Performance
├── Customer Experience
├── AI Performance
└── SLA
```

## Entities

Customer, Company, Contact, Conversation, Message, Ticket, Case, Issue, Request, SLA, Feedback, CSAT, Order, Subscription, Task, Activity.

## Overview

KPIs:

- active conversations;
- open tickets;
- SLA compliance;
- first response;
- resolution time;
- CSAT;
- AI resolution rate;
- backlog.

Charts:

- conversation volume;
- tickets by status;
- resolution trend;
- AI vs human resolution;
- SLA trend;
- sentiment;
- channel distribution.

## Inbox

Three-column workspace:

```text
Conversation List | Conversation | Customer Context
```

Filters:

- All;
- Mine;
- Unassigned;
- AI;
- Waiting;
- SLA risk;
- High priority.

Conversation row:

- customer;
- channel;
- last message;
- timestamp;
- priority;
- assignee;
- sentiment;
- AI state.

Conversation panel:

- header;
- status;
- priority;
- assignee;
- messages;
- AI analysis;
- suggested response;
- composer;
- internal note;
- AI draft;
- resolve action.

Customer context:

- health;
- plan;
- LTV;
- tickets;
- recent activity;
- tags;
- account data.

## Customer 360

```text
Customer
├── Overview
├── Activity
├── Conversations
├── Tickets
├── Orders
├── Subscriptions
├── Tasks
├── Notes
├── Files
└── Related Entities
```

Example:

```text
John Smith
Acme Enterprise

Health: Healthy
Plan: Professional
LTV: €8,420
Open Tickets: 2
```

Timeline should merge events from every module.

## Ticket Detail

Fields:

- ID;
- title;
- status;
- priority;
- customer;
- team;
- assignee;
- SLA;
- tags;
- custom fields.

Tabs:

- Overview;
- Conversation;
- Tasks;
- Activity;
- Related;
- AI Analysis.

## Customer AI agents

```text
Triage Agent
Support Agent
Billing Agent
Technical Agent
Retention Agent
```

Example workflow:

```text
Payment complaint
 ↓
Triage Agent
 ↓
Intent: Duplicate Charge
 ↓
Customer lookup
 ↓
Payment lookup
 ↓
Policy check
 ↓
Refund execution
 ↓
Customer notification
 ↓
Resolution
```

---

# 7. BUSINESS OPERATIONS

## Mission

Orchestrate cross-functional business processes and internal operational work.

Business Operations is the platform's BPM / process orchestration domain.

## Navigation

```text
BUSINESS OPERATIONS

Overview

Processes
├── Process Library
├── Active Processes
├── Process Runs
└── Templates

Operations
├── Operations Board
├── Operational Cases
├── Exceptions
├── Bottlenecks
└── Escalations

Automation
├── Workflows
├── Runs
└── Automation Opportunities

Governance
├── Policies
├── Approvals
├── Exceptions
└── Compliance

Optimization
├── Process Analytics
├── Process Mining
├── Bottlenecks
└── AI Recommendations
```

## Entities

BusinessProcess, ProcessRun, OperationalCase, Workflow, Task, Approval, Policy, Exception, Escalation, SOP, Outcome.

## Process Detail

Tabs:

- Overview;
- Workflow;
- Runs;
- Tasks;
- Agents;
- Approvals;
- Policies;
- Analytics;
- Activity.

## Example: Vendor Onboarding

```text
Request
 ↓
Vendor information
 ↓
Document collection
 ↓
AI validation
 ↓
Compliance check
 ↓
Approval
 ↓
Vendor creation
 ↓
Finance setup
 ↓
Completion
```

## Business AI agents

- Process Agent;
- Operations Coordinator;
- Compliance Agent;
- Exception Agent;
- Optimization Agent.

## Process intelligence

Identify:

- bottlenecks;
- repeated manual work;
- excessive approval time;
- failed steps;
- high exception rates;
- automation candidates.

---

# 8. SALES OPERATIONS

## Mission

Operate the complete revenue process from lead acquisition through opportunity, deal, forecast and handoff to customer operations.

## Navigation

```text
SALES OPERATIONS

Overview

Pipeline
├── Leads
├── Accounts
├── Opportunities
├── Deals
└── Pipeline Board

Engagement
├── Activities
├── Sequences
├── Meetings
└── Follow-ups

Intelligence
├── Lead Intelligence
├── Lead Scoring
├── Opportunity Insights
├── Deal Risk
└── Recommendations

Revenue Operations
├── Forecast
├── Pipeline Health
├── Revenue Performance
└── Conversion Analytics

Automation
├── Sales Workflows
├── AI Agents
└── Runs
```

## Entities

Lead, Contact, Account, Company, Opportunity, Deal, Pipeline, Stage, Activity, Meeting, Sequence, Proposal, Quote, Forecast, SalesTask.

## Sales lifecycle

```text
Lead
 ↓
Enrichment
 ↓
Qualification
 ↓
Scoring
 ↓
Engagement
 ↓
Opportunity
 ↓
Deal
 ↓
Closed Won / Lost
```

## Pipeline Board

Columns represent stages.

Each card:

- account;
- opportunity;
- value;
- probability;
- owner;
- age;
- next activity;
- AI risk;
- expected close.

## Deal Detail

Tabs:

- Overview;
- Timeline;
- Contacts;
- Activities;
- Meetings;
- Emails;
- Tasks;
- Documents;
- AI Insights;
- Workflow;
- Activity.

## Sales intelligence

Deal Risk Agent identifies:

- inactivity;
- missing decision maker;
- low engagement;
- stalled stage;
- competitor signals;
- delayed proposal;
- weak next step.

Example:

```text
Deal: €42,000
Risk: High

Reasons:
• No activity for 12 days
• Decision maker absent
• Proposal viewed once
• Competitor mentioned
```

## Sales AI agents

- Lead Research Agent;
- Qualification Agent;
- Follow-up Agent;
- Deal Risk Agent;
- Forecast Agent.

## Forecast

Views:

- weighted pipeline;
- commit;
- best case;
- upside;
- historical attainment;
- forecast variance.

---

# 9. FINANCE OPERATIONS

## Mission

Orchestrate operational finance processes without attempting to replace a complete accounting/ERP system.

## Navigation

```text
FINANCE OPERATIONS

Overview

Receivables
├── Invoices
├── Payments
├── Collections
└── Overdue

Payables
├── Bills
├── Expenses
├── Vendors
└── Payment Approvals

Operations
├── Reconciliation
├── Financial Tasks
├── Exceptions
└── Approvals

Intelligence
├── Cash Flow Insights
├── Payment Risk
├── Anomalies
├── Forecasting
└── Recommendations

Analytics
├── Cash Flow
├── Revenue
├── Expenses
├── Receivables
└── Financial Performance
```

## Entities

Account, Customer, Vendor, Invoice, Payment, Transaction, Expense, Subscription, Budget, Approval, CollectionCase, Reconciliation, Forecast.

## Invoice Detail

Tabs:

- Overview;
- Line Items;
- Customer;
- Payments;
- Approval;
- Activity;
- AI Analysis.

## Finance AI agents

```text
Invoice Processing Agent
Payment Recovery Agent
Reconciliation Agent
Financial Anomaly Agent
Cash Flow Agent
```

## Invoice Processing

```text
Invoice Received
 ↓
Document Extraction
 ↓
Vendor Validation
 ↓
PO Match
 ↓
Policy Check
 ↓
Approval
 ↓
Payment
 ↓
Reconciliation
```

## Payment Recovery

The agent considers:

- invoice age;
- customer history;
- payment history;
- account value;
- previous collection attempts;
- policy.

## Financial anomaly detection

Examples:

- duplicate payments;
- unusual expense;
- unexpected amount;
- abnormal vendor behavior;
- reconciliation mismatch.

## Cash flow intelligence

Forecast:

```text
30 days
60 days
90 days
```

Inputs include receivables, payables, subscriptions and historical cash flow.

---

# 10. PEOPLE OPERATIONS

## Mission

Operate employee lifecycle, internal requests, onboarding, performance and workforce processes.

## Navigation

```text
PEOPLE OPERATIONS

Overview

People
├── Employees
├── Directory
├── Teams
├── Departments
└── Organization

Employee Lifecycle
├── Onboarding
├── Employee Journey
├── Internal Mobility
└── Offboarding

Talent
├── Candidates
├── Hiring Pipeline
├── Interviews
└── Talent Insights

Performance
├── Goals
├── Reviews
├── Feedback
└── Performance Insights

Operations
├── Requests
├── People Tasks
├── Approvals
└── Documents

Intelligence
├── Workforce Insights
├── Team Health
├── Retention Risk
└── Recommendations
```

## Entities

Employee, Candidate, Team, Manager, Department, Position, Onboarding, Offboarding, Leave, Review, Goal, Feedback, Request, Document, PeopleTask.

## Employee 360

```text
Employee
├── Overview
├── Profile
├── Activity
├── Team
├── Goals
├── Performance
├── Feedback
├── Documents
├── Requests
├── Tasks
└── Journey
```

## People AI agents

- Employee Onboarding Agent;
- People Request Agent;
- Talent Agent;
- Workforce Insights Agent.

## Onboarding workflow

```text
Employee Created
 ↓
Role Identified
 ↓
Onboarding Process
 ↓
Equipment Request
 ↓
Accounts Request
 ↓
Documents
 ↓
Manager Notification
 ↓
Tasks
 ↓
Completion
```

## Workforce intelligence

Analyze:

- workload;
- team capacity;
- operational delays;
- staffing needs;
- retention indicators;
- organizational patterns.

Sensitive HR decisions should remain governed and human-reviewed.

---

# 11. AI WORKFORCE

## Agent Library

Each agent has:

- identity;
- objective;
- capabilities;
- knowledge;
- tools;
- permissions;
- policies;
- escalation;
- versions;
- evaluations;
- analytics.

## Agent Detail

Tabs:

```text
Overview
Capabilities
Knowledge
Tools
Policies
Permissions
Activity
Analytics
Versions
Evaluations
```

## Agent Builder

Sections:

1. Identity
2. Objective
3. Behavior
4. Knowledge
5. Tools
6. Policies
7. Permissions
8. Escalation
9. Test Agent

Example tools:

```text
search_customer
get_customer
get_order
get_payment
create_ticket
update_customer
send_email
send_message
issue_refund
create_task
create_approval
```

## Autonomy policy example

```text
Refund ≤ €50
→ autonomous

€50–€200
→ human approval

> €200
→ finance approval

Fraud-related
→ never execute autonomously
```

The prototype should visualize these rules rather than execute real financial actions.

---

# 12. AI ACTIVITY & AGENT RUNS

## AI Activity

Columns:

- timestamp;
- agent;
- action;
- entity;
- customer/account;
- status;
- confidence;
- cost;
- duration.

Statuses:

```text
Running
Completed
Waiting Approval
Escalated
Failed
```

## Agent Run Detail

Show an operational execution timeline.

Example:

```text
10:42:01  Event received
10:42:02  Customer context retrieved
10:42:03  Payment information retrieved
10:42:04  Intent classified
10:42:05  Policy evaluated
10:42:06  Action approved
10:42:07  Customer response generated
10:42:08  Response sent
10:42:09  Run completed
```

Each step can expand to show:

- input summary;
- output summary;
- tool;
- policy;
- result;
- duration.

Do not expose private chain-of-thought. Show concise operational traces only.

---

# 13. AI COPILOT

Copilot is for employees/operators, not the end customer.

Capabilities:

- summarize current entity;
- explain priority;
- draft response;
- identify next action;
- find policy;
- create task;
- create ticket;
- inspect account;
- analyze deal;
- summarize invoice;
- explain process bottleneck;
- generate operational report.

It must be contextual to the page.

Example:

On Deal Detail:

> "Why is this deal at risk?"

On Invoice:

> "Why hasn't this invoice been paid?"

On Employee:

> "What is blocking this onboarding?"

---

# 14. AI EVALUATIONS

Evaluation dimensions:

- accuracy;
- policy adherence;
- tone;
- resolution;
- hallucination;
- tool correctness;
- escalation correctness;
- classification accuracy.

Views:

```text
Overview
Test Sets
Evaluations
Failed Cases
Trends
```

Failed case detail should show:

- expected;
- actual;
- policy;
- agent version;
- tools used;
- evaluation result;
- remediation suggestion.

---

# 15. AUTOMATION

## Workflow model

```text
Trigger
 ↓
Condition
 ↓
AI / Logic
 ↓
Action
 ↓
Approval
 ↓
Action
 ↓
Outcome
```

## Trigger types

- event;
- conversation;
- ticket;
- record change;
- schedule;
- webhook;
- manual.

## Node categories

### Logic

- condition;
- branch;
- loop;
- delay;
- merge.

### AI

- agent;
- classify;
- summarize;
- sentiment;
- extract;
- recommend.

### Actions

- create record;
- update record;
- send message;
- send email;
- create task;
- create approval;
- API call;
- notification.

### Human

- approval;
- assignment;
- escalation;
- review.

## Workflow Builder

Full-screen canvas.

Example:

```text
New Ticket
   ↓
AI Classify
   ↓
Condition
 ┌─┴───────────┐
 ↓             ↓
Billing     Technical
 ↓             ↓
Billing      Technical
Agent         Agent
 └──────┬──────┘
        ↓
 Human Approval?
        ↓
 Resolve
        ↓
 Notify Customer
```

---

# 16. KNOWLEDGE

## Knowledge Hub

Metrics:

```text
Sources
Documents
Indexed
Coverage
Freshness
Conflicts
Missing Topics
```

Example:

```text
AI Knowledge Coverage 92%
Freshness 81%
Conflicts 7
Missing Topics 14
Low-confidence documents 3
```

## Sources

Types:

- website;
- URL;
- PDF;
- upload;
- Notion;
- Google Drive;
- API;
- manual.

Prototype statuses:

```text
Ready
Processing
Needs Review
Stale
Failed
```

## Document Detail

- metadata;
- content preview;
- source;
- version;
- collection;
- chunks;
- indexing state;
- used by agents;
- related questions;
- freshness.

---

# 17. GOVERNANCE

## Policies

Policies define what humans, workflows and AI agents can do.

Examples:

```text
Refund limit
Approval threshold
Data access
Escalation requirement
Business hours
Financial authorization
Sensitive HR action
```

## Approval engine

Approval request contains:

- requester;
- requester type;
- entity;
- action;
- value;
- reason;
- policy;
- approvers;
- deadline;
- status.

Statuses:

```text
Pending
Approved
Rejected
Expired
Cancelled
```

## Audit Log

Every significant action records:

- timestamp;
- actor;
- actor type;
- action;
- entity;
- entity ID;
- source;
- result;
- metadata.

Actor types:

```text
Human
AI Agent
Workflow
System
```

---

# 18. INTEGRATIONS

Prototype categories:

```text
Communication
├── Email
├── Slack
├── WhatsApp
└── SMS

CRM
├── Salesforce
└── HubSpot

Finance
├── Stripe
└── Accounting

People
├── HRIS
└── Identity

Data
├── REST API
├── Webhooks
├── Database
└── Data Warehouse
```

States:

```text
Connected
Not Connected
Error
Coming Soon
```

No real external integrations are required in the visual prototype.

---

# 19. ANALYTICS

## Global Analytics

Cross-domain metrics:

- operations volume;
- automation rate;
- AI resolution;
- human intervention;
- SLA;
- process duration;
- exceptions;
- cost;
- time saved.

## Customer Analytics

- conversation volume;
- ticket volume;
- first response;
- resolution;
- SLA;
- CSAT;
- sentiment;
- AI resolution.

## Sales Analytics

- lead conversion;
- pipeline;
- win rate;
- deal velocity;
- forecast;
- pipeline risk.

## Finance Analytics

- revenue;
- receivables;
- overdue;
- payment success;
- cash flow;
- expense;
- anomalies.

## People Analytics

- headcount;
- onboarding duration;
- workload;
- requests;
- staffing;
- performance process completion.

## Business Analytics

- process duration;
- throughput;
- bottlenecks;
- exception rate;
- automation opportunities.

---

# 20. TASKS

Tasks are a shared operational primitive.

A task can originate from:

```text
Human
AI Agent
Workflow
Ticket
Conversation
Deal
Invoice
Employee
Process
```

Fields:

- title;
- description;
- owner;
- team;
- source;
- priority;
- status;
- due date;
- related entity;
- AI/human;
- activity.

Views:

```text
My Tasks
Team Tasks
AI Tasks
Overdue
Completed
```

---

# 21. EVENTS

Events are the backbone of orchestration.

Examples:

```text
customer.created
conversation.received
ticket.created
ticket.updated
deal.stage_changed
invoice.overdue
payment.failed
employee.created
onboarding.delayed
approval.requested
workflow.completed
agent.escalated
```

Each event can trigger a workflow.

Event detail:

- source;
- timestamp;
- entity;
- payload summary;
- trigger;
- resulting actions;
- downstream events.

---

# 22. NOTIFICATIONS

Types:

- assignment;
- approval;
- escalation;
- SLA risk;
- workflow failure;
- AI escalation;
- anomaly;
- mention;
- system.

Channels in prototype:

- in-app;
- email placeholder;
- push placeholder.

---

# 23. SETTINGS & ADMIN

## Workspace

```text
General
Branding
Localization
Business Hours
Holidays
```

## Organization

```text
Users
Teams
Roles
Permissions
```

## AI

```text
Models
Agents
Policies
Guardrails
Usage
Cost
```

## Operations

```text
Statuses
Priorities
SLAs
Assignment
Custom Fields
Tags
```

## Security

```text
Authentication
MFA
Sessions
API Keys
Audit
```

## Billing

```text
Plan
Usage
Invoices
Payment
Limits
```

Admin overview:

```text
Organizations
Users
Teams
Roles
Permissions
AI Governance
Integrations
Usage
Billing
Security
Audit Logs
System Health
```

---

# 24. Screen Inventory

## Core

```text
/login
/workspaces
/app/overview
/app/search
/app/notifications
```

## Customer

```text
/app/customer
/app/customer/overview
/app/customer/inbox
/app/customer/inbox/:id
/app/customer/conversations
/app/customer/customers
/app/customer/customers/:id
/app/customer/tickets
/app/customer/tickets/:id
/app/customer/tasks
/app/customer/activity
/app/customer/analytics
```

## Business

```text
/app/business
/app/business/processes
/app/business/processes/:id
/app/business/processes/:id/runs
/app/business/cases
/app/business/exceptions
/app/business/bottlenecks
/app/business/analytics
```

## Sales

```text
/app/sales
/app/sales/leads
/app/sales/leads/:id
/app/sales/accounts
/app/sales/accounts/:id
/app/sales/opportunities
/app/sales/opportunities/:id
/app/sales/deals
/app/sales/deals/:id
/app/sales/pipeline
/app/sales/activities
/app/sales/sequences
/app/sales/forecast
/app/sales/analytics
```

## Finance

```text
/app/finance
/app/finance/invoices
/app/finance/invoices/:id
/app/finance/payments
/app/finance/collections
/app/finance/bills
/app/finance/expenses
/app/finance/vendors
/app/finance/reconciliation
/app/finance/exceptions
/app/finance/forecast
/app/finance/analytics
```

## People

```text
/app/people
/app/people/employees
/app/people/employees/:id
/app/people/teams
/app/people/departments
/app/people/onboarding
/app/people/onboarding/:id
/app/people/candidates
/app/people/hiring
/app/people/goals
/app/people/reviews
/app/people/requests
/app/people/analytics
```

## AI

```text
/app/ai/agents
/app/ai/agents/:id
/app/ai/agents/:id/builder
/app/ai/activity
/app/ai/activity/:id
/app/ai/copilot
/app/ai/evaluations
```

## Automation

```text
/app/automation/workflows
/app/automation/workflows/:id
/app/automation/workflows/:id/builder
/app/automation/runs
/app/automation/runs/:id
/app/automation/templates
```

## Knowledge

```text
/app/knowledge
/app/knowledge/sources
/app/knowledge/documents
/app/knowledge/documents/:id
/app/knowledge/collections
```

## Platform

```text
/app/tasks
/app/approvals
/app/activity
/app/events
/app/policies
/app/integrations
```

## Admin

```text
/app/admin
/app/admin/users
/app/admin/teams
/app/admin/roles
/app/admin/permissions
/app/admin/security
/app/admin/audit
/app/admin/usage
/app/admin/billing
```

---

# 25. Prototype Data

Use a coherent fictional company:

**ACME Corporation**

Suggested scale:

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

All data must be internally consistent.

Relationships must be real inside the mock model. For example, clicking a customer must show conversations, tickets, invoices and related sales information belonging to that customer.

---

# 26. Design System

Visual direction:

- premium enterprise SaaS;
- high information density;
- restrained;
- technical;
- trustworthy;
- modern;
- calm;
- operational.

Reference qualities can be inspired by Linear, Stripe, Intercom and Datadog without copying their UI.

Avoid:

- generic AI purple gradients;
- robot illustrations;
- chatbot-first design;
- excessive rounded cards;
- decorative dashboards;
- meaningless animations.

Components:

```text
Button
IconButton
Input
Textarea
Select
Combobox
DatePicker
Checkbox
Switch
Radio
Badge
Avatar
Tooltip
Dropdown
Popover
Modal
Drawer
Toast
Tabs
Table
DataGrid
Pagination
Card
EmptyState
Skeleton
Alert
Banner
Breadcrumb
CommandPalette
Timeline
Progress
```

Product components:

```text
CustomerCard
CustomerHealth
ConversationRow
ConversationComposer
AIInsight
AIRecommendation
TicketCard
SLAIndicator
AgentCard
AgentRun
WorkflowNode
WorkflowCanvas
ActivityTimeline
KnowledgeSource
AnalyticsMetric
ChartCard
ApprovalCard
PolicyCard
```

---

# 27. Interaction Requirements

The prototype must behave like a product, even with static data.

Required interactions:

- navigation;
- search;
- filters;
- sorting;
- tabs;
- drawers;
- modals;
- dropdowns;
- command palette;
- create flows;
- status changes;
- task assignment;
- approval actions;
- AI action simulations;
- workflow node selection;
- agent configuration;
- notifications;
- local persistence where useful.

## Signature demo flow

```text
Command Center
 ↓
Finance issue
 ↓
Invoice
 ↓
AI Analysis
 ↓
Payment Recovery Agent
 ↓
Agent Run
 ↓
Policy
 ↓
Approval
 ↓
Action
 ↓
Activity
 ↓
Analytics
```

Another:

```text
Command Center
 ↓
Sales Pipeline
 ↓
At-risk Deal
 ↓
Deal Risk Agent
 ↓
Recommendation
 ↓
Create Task
 ↓
Activity
```

---

# 28. Responsive Behavior

Desktop is primary.

Tablet must remain functional.

Mobile should prioritize:

- inbox;
- customer;
- ticket;
- deal;
- invoice;
- employee;
- tasks;
- approvals;
- notifications;
- AI actions.

Workflow Builder is desktop-first and can provide a simplified mobile read-only/run view.

---

# 29. Global UX States

Every significant screen must support:

```text
Loading
Skeleton
Empty
Filtered Empty
Error
Permission Denied
Success
Saving
Saved
Offline / Connection Error
```

Use realistic copy and preserve layout stability.

---

# 30. Frontend Architecture

Recommended conceptual organization:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── charts/
│   └── product/
│
├── core/
│   ├── workspace/
│   ├── identity/
│   ├── permissions/
│   ├── events/
│   ├── activity/
│   ├── tasks/
│   └── navigation/
│
├── modules/
│   ├── customer-operations/
│   ├── business-operations/
│   ├── sales-operations/
│   ├── finance-operations/
│   └── people-operations/
│
├── features/
│   ├── ai/
│   ├── automation/
│   ├── knowledge/
│   ├── analytics/
│   ├── approvals/
│   ├── policies/
│   └── integrations/
│
├── data/
│   ├── mock/
│   ├── fixtures/
│   └── generators/
│
└── types/
```

Use strong domain typing and shared primitives.

---

# 31. Prototype Boundaries

Do NOT implement:

- real authentication;
- production authorization;
- real AI API calls;
- real payments;
- real financial transactions;
- real HR decisions;
- real external integrations;
- production database;
- production event infrastructure;
- production billing;
- production secrets.

The prototype is a **high-fidelity product/reference prototype**.

Its purpose is to validate:

- information architecture;
- UX;
- visual language;
- domain model;
- navigation;
- module relationships;
- interaction patterns;
- operational concepts.

---

# 32. Prototype-to-Production Handoff

The prototype should preserve:

- domain vocabulary;
- entity definitions;
- relationships;
- navigation;
- workflow semantics;
- AI concepts;
- governance concepts;
- screen hierarchy;
- UX decisions.

But production architecture must later be designed independently around real:

- APIs;
- database;
- event bus;
- authentication;
- authorization;
- tenancy;
- observability;
- AI infrastructure;
- integration contracts;
- security;
- compliance.

The prototype is therefore a **product blueprint and UX reference**, not production architecture.

---

# 33. Definition of Done

The prototype is successful when a viewer can understand within minutes that:

1. AI Operations Cloud is a platform, not a single-purpose app.
2. Five operational domains exist and are implemented:
   - Customer;
   - Business;
   - Sales;
   - Finance;
   - People.
3. All domains share a common operational core.
4. AI agents perform operational work.
5. Humans supervise and approve when necessary.
6. Workflows connect events, decisions and actions.
7. Policies govern autonomy.
8. Knowledge supplies context.
9. Every action produces an operational trail.
10. Analytics measure outcomes.
11. Cross-domain relationships are visible.
12. The product could plausibly evolve into a real SaaS platform.

---

# 34. Recommended Implementation Order

### Phase 1 — Foundation
- design system;
- shell;
- sidebar;
- routing;
- workspace;
- command palette;
- mock data;
- global states.

### Phase 2 — Core Operations
- Command Center;
- Tasks;
- Activity;
- Events;
- Approvals;
- Policies.

### Phase 3 — Customer
- Inbox;
- Conversation;
- Customer 360;
- Tickets;
- Customer analytics.

### Phase 4 — Sales
- Pipeline;
- Leads;
- Opportunities;
- Deals;
- Deal intelligence;
- Forecast.

### Phase 5 — Finance
- Invoices;
- Payments;
- Collections;
- Vendors;
- Reconciliation;
- Financial intelligence.

### Phase 6 — People
- Employees;
- Employee 360;
- Onboarding;
- Requests;
- Performance.

### Phase 7 — Business
- Processes;
- Process runs;
- Cases;
- Exceptions;
- Bottlenecks.

### Phase 8 — AI Workforce
- Agent library;
- Agent detail;
- Builder;
- Runs;
- Evaluations;
- Copilot.

### Phase 9 — Automation
- Workflow library;
- Builder;
- Runs;
- Templates.

### Phase 10 — Knowledge & Analytics
- Knowledge;
- Sources;
- Documents;
- Analytics;
- Recommendations.

### Phase 11 — Admin
- users;
- teams;
- roles;
- security;
- audit;
- usage;
- billing.

---

# 35. Final Product Mental Model

```text
                    AI OPERATIONS CLOUD
                             │
                  ┌──────────┴──────────┐
                  │                     │
             OPERATIONAL             AI
               DOMAINS             WORKFORCE
                  │                     │
      ┌───────────┼───────────┐        │
      │           │           │        │
   Customer    Business      Sales   Agents
      │           │           │        │
      ├───────────┼───────────┼────────┤
      │           │           │        │
   Finance      People       Tasks   Copilot
      │           │           │        │
      └───────────┼───────────┘        │
                  │                    │
             WORKFLOWS ────────────────┘
                  │
             PROCESSES
                  │
          POLICIES / APPROVALS
                  │
             INTEGRATIONS
                  │
               EVENTS
                  │
              ACTIVITY
                  │
              ANALYTICS
                  │
             OUTCOMES
```

The fundamental product abstraction is:

> **The platform turns business events into governed, observable and measurable work performed by humans, AI agents and automated workflows.**
