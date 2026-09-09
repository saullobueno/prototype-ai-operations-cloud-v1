# Telas — Customer Operations (Inbox, Conversas, Customers, Tickets)

---

## 1. Inbox

**Rota:** `(app)/inbox` (lista, sem conversa selecionada mostra estado vazio no painel central) e `(app)/inbox/[conversationId]` (conversa aberta).

**Objetivo:** tela mais usada do produto — Conversation + Customer 360 resumido + AI Copilot na mesma view.

**Layout (3 colunas):**

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Inbox                                        Filter   Sort   Views   │
├───────────────┬──────────────────────────┬───────────────────────────┤
│ Conversations │ Conversation              │ Customer                 │
│               │                           │                          │
│ 🔴 John       │ John Smith                │ John Smith               │
│   Payment     │ ────────────────────────  │ Novacorp                 │
│               │ Customer:                 │                          │
│ 🟡 Maria      │ "My payment failed..."    │ Plan: Enterprise         │
│   Login       │                           │ LTV: €8,420              │
│               │ [AI Analysis panel]       │ Health: 🟢 Healthy       │
│ 🟢 Pedro      │  Intent: Payment           │ Tickets: 4               │
│   Delivery    │  Sentiment: Frustrated      │                          │
│               │  Priority: High              │ [ View full profile → ]│
│  ...          │                              │                          │
│               │ [Composer: reply box]         │                          │
└───────────────┴──────────────────────────────┴───────────────────────┘
```

**Coluna 1 — Conversation list (`ConversationListItem`):**
- Avatar do cliente, nome, preview da última mensagem, canal (ícone), dot de status/prioridade (🔴 urgent/high, 🟡 medium, 🟢 low ou resolved), timestamp relativo.
- Filtros no topo: `Filter` (status, prioridade, canal, assignee, team), `Sort` (mais recente, SLA mais próximo), `Views` (salvos: "Unassigned", "My conversations", "Escalated to me", "Approaching SLA").
- Agrupamento opcional por status (Open / Pending / Resolved).

**Coluna 2 — Conversation panel (`ConversationPanel`):**
- Header: nome do cliente, status atual (dropdown editável), prioridade (dropdown editável), assignee (avatar + dropdown).
- Thread de mensagens (`Message[]`), bolhas diferenciadas por `authorType` (customer / human / agent / system).
- `AIAnalysisPanel` fixo/colapsável acima do composer: Intent, Sentiment, Priority, Customer value, Recommended action, Confidence.
- Botão de destaque **"Resolve with AI"** — ver `06-fluxos-e-ai-moments.md` (AI Moment #1) para o passo a passo completo da interação.
- Composer: textarea + botões (enviar, anexar, templates de resposta, "Ask Copilot" que abre o AI Copilot lateral).

**Coluna 3 — Customer context (`CustomerCard` expandido):**
- Avatar, nome, empresa, plano, LTV, health badge, contagem de tickets abertos.
- Link "View full profile →" para o Customer 360 completo.
- Mini lista: últimos 3 tickets / últimas 3 activities.

**Dados:** `Conversation`, `Message`, `Customer`, `AgentRun` (quando aplicável) — ver `04-mock-data-acme-cloud.md` §6.

**Estados:**
- Lista vazia (filtro sem resultados): `EmptyState` "No conversations match your filters".
- Nenhuma conversa selecionada: painel central com `EmptyState` "Select a conversation to get started".
- Loading: skeleton nas 3 colunas.

**Interações:**
- Clicar em item da lista → atualiza rota para `/inbox/[conversationId]`, sem reload de página (client-side).
- Mudar status/prioridade/assignee → atualização otimista + toast.
- "Resolve with AI" → ver fluxo dedicado.

---

## 2. Customers (lista)

**Rota:** `(app)/customers`

**Layout:**

```text
Customers                                    [ + New customer ]

[All] [At Risk] [VIP] [New]        Search customers...   Filters ▾

┌────────────────────────────────────────────────────────────┐
│ Name          Company        Plan        Health   LTV       │
│ John Smith    Novacorp       Enterprise  🟢       €8,420    │
│ Maria F.      Bright Retail  Business    🟡       €4,120    │
│ ...                                                          │
└────────────────────────────────────────────────────────────┘
```

**Componentes:** `Table` com colunas ordenáveis (Name, Company, Plan, Health, LTV, Customer since, Open tickets), tabs de filtro rápido (`All`, `At Risk`, `VIP` = Enterprise/Business alto LTV, `New` = últimos 30 dias), `Input` de busca, `Filters` dropdown (plan, health, tags).

**Dados:** `Customer[]` — ver §4 do mock data.

**Estados:** Loading (skeleton de tabela) / Empty (sem clientes cadastrados — não deve ocorrer no protótipo, mas o componente deve existir) / Populated.

**Interações:** clique na linha → `(app)/customers/[customerId]`. `+ New customer` abre `Modal` de criação (formulário simples, ao salvar adiciona ao estado local em memória e fecha com toast).

---

## 3. Customer 360

**Rota:** `(app)/customers/[customerId]` com tabs via `(app)/customers/[customerId]/[tab]`

**Layout (header + tabs):**

```text
John Smith
john@acme-client.com · Novacorp
Customer since March 2024      Lifetime value €8,420      Health 🟢 Healthy

[Overview] [Activity] [Conversations] [Tickets] [Orders] [Payments] [Tasks] [Notes] [Files] [Timeline]
```

### Tab: Overview
Cards resumo: contato principal, plano/assinatura, últimos 3 tickets, últimas 3 conversas, saúde da conta (fatores: sentiment recente, backlog aberto, SLA breaches).

### Tab: Activity
Feed cronológico geral (equivalente a Timeline, mas com filtro por tipo de ação).

### Tab: Conversations
Lista de `Conversation` filtradas por `customerId`, mesmo componente `ConversationListItem` usado no Inbox, sem o painel de 3 colunas (clique abre a conversa completa em `/inbox/[conversationId]`).

### Tab: Tickets
Lista de `Ticket` do cliente (`TicketRow`).

### Tab: Orders / Tab: Payments
Tabelas simples de `Order[]` e `Payment[]`.

### Tab: Tasks
Lista de `Task` relacionadas (`relatedType: "customer"`), com status e assignee.

### Tab: Notes
Notas internas em texto livre, autoria e timestamp — CRUD simples em memória.

### Tab: Files
Lista de arquivos anexados (mock: nomes de arquivo com ícone por tipo, sem upload real funcional — ou upload que apenas adiciona à lista local).

### Tab: Timeline
```text
TODAY
10:42  Customer contacted support
10:43  AI identified payment issue
10:44  Payment status checked
10:45  Human agent joined
10:47  Issue resolved
10:48  CSAT request sent
```
Componente `ActivityTimeline`, dados de `Activity[]` filtrados por `customerId`, ordenados por `createdAt` desc, agrupados por dia.

**Estados por tab:** cada tab tem seu próprio Loading/Empty/Populated (ex.: "No notes yet" na tab Notes).

**Interações:** editar campos do header (plano, tags) via popover inline; `+ Add note`, `+ Upload file`, `+ New task` abrem `Modal`/`Drawer` conforme regra de `02-design-system.md` §6.

---

## 4. Tickets (lista)

**Rota:** `(app)/tickets`

**Layout:**

```text
Tickets                                      [ + New ticket ]

[All] [Open] [Unassigned] [Breaching SLA]      Search...   Filters ▾

┌───────────────────────────────────────────────────────────────┐
│ #        Title                Status       Priority  SLA   Assignee │
│ SUP-1842 Payment failed        In progress  High      2h14m Maria   │
│ ...                                                                  │
└───────────────────────────────────────────────────────────────┘
```

**Componentes:** `Table`, `SLABadge` (countdown colorido), `Badge` de status/prioridade, filtros salvos como tabs.

**Dados:** `Ticket[]` — ver §7 do mock data.

**Interações:** clique → `(app)/tickets/[ticketId]`.

---

## 5. Ticket Detail

**Rota:** `(app)/tickets/[ticketId]`

**Layout:**

```text
Ticket #SUP-1842
Payment failed — duplicate charge

Status: In progress    Priority: High    Assignee: Maria    Team: Billing
SLA: 2h 14m remaining    Customer: John Smith

[Overview] [Conversation] [Tasks] [Activity] [Related] [AI Analysis]
```

### Tab: Overview
Descrição, campos customizáveis (prioridade, tags, team), botões de ação (Resolve, Escalate, Reassign).

### Tab: Conversation
Embed da conversa vinculada (`ConversationPanel` somente leitura ou linkável para `/inbox/[conversationId]`).

### Tab: Tasks
Subtarefas do ticket (`Task[]` com `relatedType: "ticket"`).

### Tab: Activity
Histórico de mudanças de status/assignee/prioridade neste ticket.

### Tab: Related
Outros tickets do mesmo cliente ou com o mesmo `intent`/tag (para detectar padrões).

### Tab: AI Analysis
Reaproveita `AIAnalysisPanel` + link para o `AgentRun` relacionado, se existir (`(app)/ai/agents/[agentId]/runs/[runId]`).

**Estados:** Loading (skeleton do header + tabs) / Populated. Sem empty state relevante (ticket sempre existe se a rota é válida); rota inválida → tela 404 simples com CTA "Back to Tickets".
