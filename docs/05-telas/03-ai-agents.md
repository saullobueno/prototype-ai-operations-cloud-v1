# Telas — AI (Agents, Builder, Runs, Activity, Evaluations, Copilot)

Esta é a área que carrega o maior diferencial conceitual do produto: **AI Workforce**, não "chat with AI".

---

## 1. AI Workforce (lista de agentes)

**Rota:** `(app)/ai/agents`

**Layout:**

```text
AI Workforce                                   [ + Create agent ]

7 active agents

┌───────────────────┬────────┬────────────────┐
│ Support Agent       🟢     │ Assisted        │
│ Billing Agent        🟢     │ Approval req.   │
│ Technical Agent       🟢     │ Assisted        │
│ Triage Agent            🟢     │ Autonomous      │
│ QA Agent                  🟡     │ Autonomous      │
│ Customer Success Agent      🟢     │ Assisted        │
│ Knowledge Agent                🟢     │ Autonomous      │
└───────────────────┴────────┴────────────────┘

Today
2,481 tasks
1,823 autonomous · 412 assisted · 246 escalated
```

**Componentes:** `AgentCard` (grid ou lista — grid recomendado para reforçar a metáfora de "força de trabalho"), `AutonomyBadge`, `KPIStatCard` (resumo do dia).

**Dados:** `Agent[]` — ver `04-mock-data-acme-cloud.md` §10.

**Estados:** Loading (skeleton de cards) / Populated. (Empty state existe como componente, mas não ocorre no dataset padrão.)

**Interações:** clique no card → `(app)/ai/agents/[agentId]`. `+ Create agent` → `(app)/ai/agents/new`.

---

## 2. Agent Detail

**Rota:** `(app)/ai/agents/[agentId]`

**Layout:**

```text
Support Agent                                  [ Edit ] [ Pause ]
Resolve customer support requests
Status: 🟢 Active    Autonomy: Assisted

[Overview] [Knowledge] [Tools] [Policies] [Runs] [Performance]
```

### Tab: Overview
Goal, personality tags, descrição, resumo de atividade recente (últimos 5 `AgentRun`).

### Tab: Knowledge
Lista de `KnowledgeSource` vinculados (checkboxes, mesma UI do builder mas somente leitura + botão para editar).

### Tab: Tools
Lista de `Tool` vinculados, com `riskLevel` badge.

```text
READ        search_customer, get_order
WRITE       create_ticket
EXECUTE     send_email
RESTRICTED  issue_refund (requires policy check)
```

### Tab: Policies
Lista de `PolicyRuleRow` aplicáveis a este agente (ver `03-modelo-de-dados.md` §4, `Policy`/`PolicyRule`).

### Tab: Runs
Tabela de `AgentRun[]` (id, cliente, status, duração, resultado). Clique → `(app)/ai/agents/[agentId]/runs/[runId]`.

### Tab: Performance
KPIs do agente: taxa de resolução, tempo médio, escalonamentos, custo por resolução (reaproveita `KPIStatCard`).

**Estados:** Loading / Populated por tab.

---

## 3. Agent Builder

**Rotas:** `(app)/ai/agents/new` (criação) e `(app)/ai/agents/[agentId]/edit` (edição — mesmo layout, pré-preenchido).

**Layout:** `Stepper` vertical ou horizontal com seções, painel de preview à direita (opcional).

```text
[Identity] [Goal] [Personality] [Knowledge] [Tools] [Policies] [Review]

Identity
  Name           [_________________]
  Description    [_________________]
  Avatar         [ upload/choose ]

Goal
  [ Resolve customer support requests_____________ ]

Personality
  [x] Professional  [x] Friendly  [x] Concise  [ ] Playful  [ ] Formal

Knowledge
  [x] Help Center
  [x] Product documentation
  [x] Refund policy
  [ ] Internal procedures

Tools
  [x] Search customer     [x] Search orders    [x] Check payment
  [x] Create ticket        [ ] Issue refund      [ ] Send email

Policies
  Refunds > €100        → Human approval
  Account deletion        → Human approval
  Legal complaint           → Human escalation
  [ + Add policy rule ]

Review
  Resumo de tudo configurado + [ Create agent ] / [ Save changes ]
```

**Componentes:** `Stepper`, `Input`, `Textarea`, `Checkbox` (grupos para Personality/Knowledge/Tools), `PolicyRuleRow` editável, `Button`.

**Ponto conceitual crítico (refletir na UI):** ferramentas de risco alto (`issue_refund`, `update_subscription`, `delete_account`) exigem que uma `Policy` seja definida antes de poderem ser marcadas como habilitadas — se o usuário tenta marcar uma tool restrita sem policy, mostrar um aviso inline: "This action requires an approval policy before it can be enabled."

**Estados:** cada step tem validação simples (campos obrigatórios) antes de avançar. `Review` mostra resumo navegável (clique num item volta ao step correspondente).

**Interações:** `Create agent`/`Save changes` → toast de sucesso + navega para `(app)/ai/agents/[agentId]`.

---

## 4. Agent Run (trace de execução)

**Rota:** `(app)/ai/agents/[agentId]/runs/[runId]`

**Layout:**

```text
← Back to Support Agent

Agent Run #84291
Customer: John Smith        Status: ✓ Completed

10:42:01  Received message
10:42:02  Retrieved customer
10:42:02  Retrieved payment
10:42:03  Payment status = FAILED
10:42:04  Checked refund policy
10:42:05  Generated response
10:42:06  Sent response
```

**Componentes:** `AgentRunTrace` — cada step é expansível (clique revela `detail`, ex.: o JSON retornado pela tool, via `JSONViewer` ou `CodeBlock`). Ícone por `type` de step (`retrieval`, `reasoning`, `tool_call`, `decision`, `message`).

**Dados:** ver `04-mock-data-acme-cloud.md` §11 (AgentRun #84291) como exemplo canônico a implementar por completo; demais runs podem ter traces mais curtos/genéricos.

**Estados:** Loading (skeleton da lista de steps) / Populated. Run com `status: failed` mostra o step que falhou destacado em vermelho com mensagem de erro.

---

## 5. AI Activity (AI Control Center)

**Rota:** `(app)/ai/activity`

**Objetivo:** visão de auditoria/governança sobre tudo que os agentes fizeram.

**Layout:**

```text
AI Activity                          Filters: Agent · Action · User · Customer · Date · Status · Risk

┌─────────────────────────────────────────────────────┐
│ Agent              Action              Status         │
│ Support Agent       Resolve ticket      ✓             │
│ Billing Agent         Refund request      ⚠ Approval   │
│ Support Agent           Escalate case       ✓             │
│ Knowledge Agent            Updated article    ✓             │
└─────────────────────────────────────────────────────┘
```

**Componentes:** `Table` filtrável, `Badge` de status (`✓ completed`, `⚠ pending approval`, `✗ failed`), linha clicável → abre `Drawer` com resumo do `AgentRun` (ou navega para o trace completo).

**Dados:** agregação de todos os `AgentRun` + `Approval` pendentes.

**Estados:** Loading / Empty ("No AI activity yet") / Populated.

---

## 6. Evaluations

**Rota:** `(app)/ai/evaluations`

**Objetivo:** qualidade de IA mensurada — parte da narrativa "Human + AI" e do loop de melhoria contínua.

**Layout:**

```text
Evaluations

[AI Quality] [Human Quality] [Reviews] [Coaching]

Avg accuracy        94%
Avg tone             91%
Policy adherence      97%
```

### Tab: AI Quality
Tabela de `Evaluation` com `targetType: agent_run`, scores (accuracy, tone, policyAdherence), resultado (resolved/escalated/unresolved).

### Tab: Human Quality
Mesmo formato, mas `targetType: conversation` avaliada por humano (`reviewerId` presente).

### Tab: Reviews
Lista de conversas marcadas para revisão manual, com botão "Review" abrindo `Drawer` com a conversa + formulário de scoring rápido (sliders 0–100 para accuracy/tone/policy).

### Tab: Coaching
Agrupamento de padrões de erro recorrentes (ex.: "Billing Agent frequently misses refund policy exceptions — 4 occurrences this week") com CTA "Update policy" ou "Update knowledge".

**Estados:** Loading / Empty / Populated, por tab.

---

## 7. AI Copilot

**Rota:** `(app)/ai/copilot` (versão full-page) — também acessível como painel lateral contextual a partir de qualquer tela via botão `◇ AI` no header.

**Layout (painel lateral, 380–420px):**

```text
┌─────────────────────────┐
│ Copilot                 │
│                          │
│ Ask about this customer,│
│ ticket or operation...   │
│                          │
│ [ chat input ]            │
└─────────────────────────┘
```

Comportamento: contextual — se aberto a partir de uma Conversation/Ticket/Customer, o Copilot "sabe" sobre aquele objeto (mock: respostas pré-scriptadas relevantes ao contexto). Se aberto a partir do Overview, comporta-se como o "Ask Operations AI" (ver `06-fluxos-e-ai-moments.md`, AI Moment #2) — de fato, o Copilot e o "Ask Operations AI" podem ser a mesma implementação de componente, variando apenas o contexto injetado.

**Estados:** idle (sugestões de perguntas prontas) / thinking (indicador de "digitando"/processing, 800ms–1.5s fake) / respondido.
