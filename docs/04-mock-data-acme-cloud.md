# Mock Data — ACME Cloud

Dataset fictício único, usado consistentemente em todas as telas do protótipo. Os IDs aqui definidos são referenciados nas specs de tela (`05-telas/`) — mantenha os mesmos IDs ao implementar para que os deep-links dos documentos funcionem.

## 1. Organização

```text
Organization: ACME Cloud
Domain: acmecloud.com
Plan: Business
Workspace: ACME Cloud — Production (env: production)
Workspace: ACME Cloud — Sandbox (env: sandbox)
```

Números de referência para os KPIs (usar consistentemente em Overview, Analytics, Admin):

```text
2,481 customers
42,831 conversations (histórico total)
1,248 conversations (últimos 30 dias — usado no Overview)
8 teams
7 AI agents ativos
34 workflows
18 integrations
```

## 2. Times (Team)

```text
team_billing        Billing
team_technical       Technical Support
team_success          Customer Success
team_triage            Triage
team_qa                  Quality Assurance
team_sales                Sales (placeholder, módulo futuro)
team_finance                Finance (placeholder, módulo futuro)
team_platform                 Platform / Admin
```

## 3. Usuários (User) — organização interna

```text
usr_maria     Maria Silva      maria@acmecloud.com      role: Manager   team: Billing
usr_pedro     Pedro Santos     pedro@acmecloud.com       role: Agent     team: Technical Support
usr_sofia     Sofia Costa      sofia@acmecloud.com        role: Agent     team: Customer Success
usr_thomas    Thomas Anderson  thomas@acmecloud.com        role: Admin     team: Platform
usr_edivan    Edivan (você)    edivan@econform.com.br        role: Owner     team: Platform   ← usuário logado no protótipo
```

Usar `usr_edivan` como o usuário autenticado por padrão no protótipo (avatar no header, autor de ações manuais).

## 4. Clientes (Customer) — amostra representativa (10–15 registros)

```text
cus_001  John Smith        john@acme-client.com         company: Novacorp        plan: Enterprise     ltv: €8,420   health: healthy    since: 2024-03-01
cus_002  Maria Fernandes    maria.f@brightretail.com      company: Bright Retail   plan: Business        ltv: €4,120   health: at_risk    since: 2023-11-15
cus_003  Thomas Anderson     t.anderson@matrixsys.io        company: Matrix Systems plan: Professional    ltv: €1,980   health: healthy    since: 2025-01-20
cus_004  Sofia Costa          sofia.costa@lumentech.pt        company: Lumen Tech     plan: Business        ltv: €6,050   health: healthy    since: 2024-07-08
cus_005  Michael Brown         m.brown@harboursupply.com        company: Harbour Supply plan: Starter        ltv: €390     health: at_risk    since: 2025-05-02
cus_006  Ana Beatriz           ana.b@vertexlabs.com               company: Vertex Labs    plan: Enterprise     ltv: €12,300  health: healthy    since: 2023-02-10
cus_007  Diego Ramírez          diego.r@solarwavetech.com           company: SolarWave      plan: Professional    ltv: €2,410   health: critical   since: 2024-09-19
cus_008  Helena Duarte           helena.d@nortepharma.pt              company: Norte Pharma   plan: Business        ltv: €5,780   health: healthy    since: 2023-06-25
cus_009  Lucas Pereira            lucas.p@quantumbyte.io                company: QuantumByte    plan: Starter         ltv: €210     health: healthy    since: 2025-08-11
cus_010  Camila Rocha              camila.r@atlaslogix.com                company: Atlas Logix    plan: Enterprise     ltv: €9,940   health: at_risk    since: 2022-12-01
```

Cada `Customer` deve ter ao menos: 1–4 `Conversation`, 0–3 `Ticket`, 1–3 `Order`/`Payment`, 5–12 `Activity`. Distribuir `health` e `plan` de forma variada para permitir filtros interessantes na lista de Customers.

## 5. Tipos de problema (usados em Conversations/Tickets, distribuídos entre os customers)

```text
Payment failed
Subscription cancellation
Password reset
API integration issue
Invoice request
Shipping delay
Account locked
Feature request
Refund request
Billing discrepancy
Login / SSO issue
Data export request
```

## 6. Conversas (Conversation) — exemplo detalhado (usar como padrão para as demais)

```text
conv_1842
  customer: cus_001 (John Smith)
  channel: email
  status: resolved
  priority: high
  assignee: agent_support (AI Agent) → escalated to usr_maria
  aiAnalysis:
    intent: "Payment failure"
    sentiment: "frustrated"
    priority: "high"
    recommendedAction: "Issue refund — customer charged twice"
    confidence: 93
  messages:
    1. customer: "My payment failed but I was charged twice, please help."
    2. agent (AI): "I checked your payment — it looks like a duplicate charge. Let me verify and resolve this."
    3. system: "AI escalated to Maria Silva for confirmation (amount above auto-approval threshold)."
    4. human (Maria): "Confirmed and refunded the duplicate charge. Sorry for the trouble!"
  timeline correspondente: ver seção 9 (Activity)
```

Criar 15–20 conversas adicionais cobrindo os demais customers e tipos de problema, com mistura de status (`open`, `pending`, `resolved`, `closed`) e prioridades, para popular Inbox com variedade visual (cores de status/prioridade).

## 7. Tickets (Ticket) — exemplo de referência

```text
TICKET #SUP-1842
  customer: cus_001 (John Smith)
  conversation: conv_1842
  title: "Payment failed — duplicate charge"
  status: in_progress → resolved
  priority: high
  assignee: usr_maria
  team: team_billing
  sla: sla_high_priority (2h resolution) — "2h 14m remaining" antes de resolver
```

Gerar 20–30 tickets no total, distribuídos entre os teams, com pelo menos:
- 3–5 em `open` sem assignee (para testar assignment)
- 3–5 próximos do SLA breach (para o "AI Operations Brief" no Overview)
- maioria `resolved`/`closed` para dar volume histórico

## 8. SLAs

```text
sla_urgent     30min first response / 2h resolution     → priority: urgent
sla_high       1h first response / 4h resolution         → priority: high
sla_normal     4h first response / 24h resolution         → priority: medium
sla_low        24h first response / 72h resolution          → priority: low
```

## 9. Activity / Timeline (exemplo — Customer 360 de John Smith, hoje)

```text
10:42   Customer contacted support
10:43   AI identified payment issue
10:44   Payment status checked
10:45   Human agent joined (Maria Silva)
10:47   Issue resolved
10:48   CSAT request sent
```

Cada `Activity` referencia `customerId: cus_001` e é renderizada na tab `Timeline` do Customer 360 e alimenta o `AI Activity` (quando `actorType: "agent"`).

## 10. Agentes de IA (Agent) — AI Workforce completo

```text
agent_triage     Triage Agent          status: active   autonomy: autonomous         goal: "Classify and route incoming conversations"
agent_support     Support Agent         status: active   autonomy: assisted            goal: "Resolve customer support requests"
agent_billing      Billing Agent          status: active   autonomy: approval_required   goal: "Handle payment and billing issues"
agent_technical     Technical Agent         status: active   autonomy: assisted            goal: "Resolve technical/product issues"
agent_success        Customer Success Agent   status: active   autonomy: assisted            goal: "Monitor account health and proactively engage at-risk customers"
agent_qa               QA Agent                 status: paused (🟡)   autonomy: autonomous         goal: "Evaluate conversation and agent quality"
agent_knowledge          Knowledge Agent           status: active   autonomy: autonomous         goal: "Keep knowledge base accurate and identify gaps"
```

KPIs do dia (para tela AI Workforce / Overview):

```text
2,481 tasks hoje
1,823 autonomous
  412 assisted
  246 escalated
```

### Tools por agente (exemplo — Support Agent)

```text
search_customer()
get_order()
get_payment()
create_ticket()
send_email()
```

### Tools restritas (exemplo — Billing Agent)

```text
issue_refund()          risk: high    policy: refund_policy
update_subscription()   risk: high    policy: subscription_policy
```

### Policy de referência

```text
Policy: Refund policy
  amount <= €50            → ai_can_execute
  €50 < amount <= €200      → human_approval
  amount > €200              → finance_approval
  fraud_suspected             → never_execute
```

## 11. Agent Run — exemplo (referenciado em `05-telas/03-ai-agents.md`)

```text
AgentRun #84291
  agent: agent_billing
  conversation: conv_1842
  customer: cus_001
  status: completed
  steps:
    10:42:01  Received message                      (message)
    10:42:02  Retrieved customer                      (retrieval)
    10:42:02  Retrieved payment                        (retrieval)
    10:42:03  Payment status = FAILED (duplicate)         (reasoning)
    10:42:04  Checked refund policy                         (decision) → "amount €42 <= €50 → ai_can_execute"
    10:42:05  Generated response                              (reasoning)
    10:42:06  Issued refund via issue_refund()                  (tool_call)
    10:42:06  Sent response                                       (message)
```

## 12. Workflows — exemplo de referência

```text
Workflow: "New Ticket Triage"
  trigger: ticket_created
  nodes: New Ticket → AI Classify → [branch: Payment | Technical] →
         Payment → Billing Agent → Check payment → Human approval? → [Yes: Human][No: Resolve]
         Technical → Support Agent → Search KB → Resolve

Workflow: "Customer Escalation Workflow"
  1,284 runs totais
  success: 1,241 / failed: 12 / waiting: 31
```

Criar 34 workflows no total para bater com o KPI do Overview/Admin (a maioria pode ser entradas simples de lista — apenas 3–5 precisam de canvas totalmente detalhado com nodes/edges reais para a tela de builder).

## 13. Knowledge — fontes e health

```text
Sources: Website (acmecloud.com/help), Product Docs (Notion), Refund Policy (PDF), Internal Procedures (Google Drive)

Knowledge Health:
  Coverage: 92%
  Freshness: 81%
  Conflicts: 7
  Missing topics: 14
  Low-confidence docs: 3

Top unresolved intents (AI Analytics):
  1. Refund policy exceptions      31%
  2. Account changes                18%
  3. Technical bugs                  16%
  4. Shipping exceptions              12%
```

## 14. Integrações (Integration)

```text
Stripe          payments        connected
Salesforce      crm              connected
Slack           communication     connected
WhatsApp Business  communication   connected
SendGrid         communication      connected
Zendesk (migração) crm                disconnected
Segment           analytics           connected
AWS S3             storage             connected
```

18 integrações no total para bater o KPI — as demais podem ser entradas simples no catálogo (`disconnected`, disponíveis para conectar).

## 15. KPIs do Overview (snapshot "hoje")

```text
Conversations        1,248   ↑ 12.4%
AI Resolution          68.2%   ↑ 5.8%
First Response         4m 21s   ↓ 18%
CSAT                    94.2%   ↑ 2.1%

AI Resolution       68%
SLA Compliance      94%
Customer Sentiment  91%
Backlog              42

AI Operations Brief:
  ⚠ 18 conversations are approaching SLA breach.
  ⚠ Payment-related issues increased 27% this week.
  ✓ AI resolution rate improved by 8.4%.
```

## 16. Convenção de arquivo de dados no código

```text
data/mock/
  organization.ts
  workspaces.ts
  users.ts
  teams.ts
  roles.ts
  customers.ts
  contacts.ts
  orders.ts
  payments.ts
  conversations.ts
  messages.ts
  tickets.ts
  slas.ts
  activities.ts
  events.ts
  agents.ts
  agentRuns.ts
  tools.ts
  policies.ts
  workflows.ts
  workflowVersions.ts
  workflowRuns.ts
  knowledgeSources.ts
  knowledgeDocuments.ts
  integrations.ts
  notifications.ts
  approvals.ts
  auditLogs.ts
  index.ts          ← re-exporta tudo + funções helper (getCustomerById, getConversationsByCustomer, etc.)
```

Cada arquivo exporta um array tipado (usando as interfaces de `03-modelo-de-dados.md`) e os IDs devem seguir os prefixos usados neste documento (`cus_`, `conv_`, `agent_`, etc.) para rastreabilidade entre specs e implementação.
