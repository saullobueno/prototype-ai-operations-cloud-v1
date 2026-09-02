# Arquitetura da Informação

## 1. Estrutura geral de layout (shell da aplicação)

```text
┌─────────────────────────────────────────────────────────────────────┐
│ [Workspace Switcher]     [Search / ⌘K]      [AI] [🔔] [?] [Avatar]   │  ← Header (64px)
├───────────────┬─────────────────────────────────────────────────────┤
│               │                                                     │
│   Sidebar     │                     Page Content                   │
│  (240–260px)  │                                                     │
│               │                                                     │
└───────────────┴─────────────────────────────────────────────────────┘
```

- Sidebar colapsável (ícone-only, 64px) com toggle.
- Header fixo, mesma altura em todas as telas.
- Page content com padding consistente (definido em `02-design-system.md`), breadcrumb opcional no topo da página quando há profundidade (ex.: `Customers / John Smith`).

## 2. Workspace Switcher (topo do sidebar)

Estado fechado:

```text
┌─────────────────────────┐
│ ACME Cloud           ▼  │
│ Production Workspace    │
└─────────────────────────┘
```

Estado aberto (dropdown):

```text
Workspaces

✓ ACME Cloud
    Production

  ACME Cloud
    Sandbox

+ Create workspace
```

Prepara conceitualmente multi-tenancy, ambientes (produção/sandbox) e contas Enterprise — mesmo que no protótipo só exista 1 workspace real navegável (o switcher é funcional na UI, mas trocar de workspace pode simplesmente resetar para o mesmo dataset ACME Cloud com um toast "Switched to Sandbox").

## 3. Sidebar completo (estado atual do protótipo)

```text
⌂ Overview

◉ Operations
   ├─ Inbox
   ├─ Tickets
   ├─ Tasks
   └─ Activity

◉ Customers

◉ AI
   ├─ Agents
   ├─ Copilot
   ├─ Evaluations
   └─ AI Activity

◉ Automation
   ├─ Workflows
   ├─ Runs
   └─ Templates

◉ Knowledge

◉ Analytics

◉ Quality
─────────────────────────
MODULES

● Customer Operations   (Active)
○ Sales Operations      (Coming soon)
○ Finance Operations    (Coming soon)
○ Business Operations   (Coming soon)
─────────────────────────
⚙ Settings
🛡 Admin  (visível apenas para role Admin — ver 07-papeis-e-permissoes.md)
```

Regras de comportamento:

- Item ativo tem indicador visual (barra lateral colorida + fundo sutil).
- Grupos com submenu (`Operations`, `AI`, `Automation`) expandem/colapsam; o grupo do item ativo abre automaticamente.
- Itens em "Coming soon" são clicáveis e levam a uma tela de placeholder (`Module Coming Soon`, ver `05-telas/00-core.md`) — não devem ficar desabilitados/cinza sem interação, pois isso é parte de comunicar a visão da plataforma.
- `Admin` só aparece para o usuário logado com role `Owner` ou `Admin`.

## 4. Header

```text
┌──────────────────────────────────────────────────────────────┐
│ ☰  Search anything...                 ◇ AI   🔔   ?   Avatar │
└──────────────────────────────────────────────────────────────┘
```

- `☰` — toggle do sidebar (colapsa para ícone-only).
- `Search anything...` — campo que abre o Command Palette ao focar/clicar (não é uma busca inline separada).
- `◇ AI` — atalho para o "Ask Operations AI" (ver `06-fluxos-e-ai-moments.md`), abre um painel/drawer lateral.
- `🔔` — Notificações (dropdown com lista, ver `02-design-system.md` para o componente `NotificationDropdown`).
- `?` — Help menu (atalhos de teclado, changelog fake, link para docs).
- `Avatar` — menu do usuário (perfil, workspace atual, trocar tema, logout → volta para `/login`).

## 5. Command Palette (⌘K)

Ativado por `⌘K` / `Ctrl+K` ou clique na busca do header.

```text
> Search customers, conversations, tickets, workflows, knowledge, agents...

RECENT
  John Smith — Customer
  Ticket #SUP-1842

ACTIONS
  Create ticket
  Find customer
  Open AI Agent
  Create workflow
  View unresolved conversations
  Go to Analytics

NAVIGATE
  Overview
  Inbox
  Customers
  Tickets
  Knowledge
  AI Agents
  Workflows
  Analytics
  Settings
```

Categorias: `Recent`, `Actions`, `Navigate`, `Customers`, `Conversations`, `Tickets`, `Agents`, `Workflows`, `Knowledge`. Busca fuzzy sobre o dataset mock inteiro. Selecionar um item navega via router (rota real).

## 6. Mapa de rotas

Convenção: App Router (Next.js) com grupo de rotas autenticadas `(app)`.

```text
/login
/workspaces                                   → seleção de workspace pós-login

(app)/overview                                → Dashboard principal

(app)/inbox                                   → lista de conversas
(app)/inbox/[conversationId]                  → conversa aberta (painel 3 colunas)

(app)/customers                               → lista de clientes
(app)/customers/[customerId]                  → Customer 360
(app)/customers/[customerId]/[tab]            → overview|activity|conversations|tickets|orders|payments|tasks|notes|files|timeline

(app)/tickets                                 → lista de tickets
(app)/tickets/[ticketId]                      → detalhe do ticket

(app)/knowledge                               → sources, documents, articles, collections
(app)/knowledge/[documentId]                  → documento/artigo

(app)/ai/agents                               → AI Workforce (lista de agentes)
(app)/ai/agents/new                           → Agent Builder (criação)
(app)/ai/agents/[agentId]                     → detalhe do agente
(app)/ai/agents/[agentId]/edit                → Agent Builder (edição)
(app)/ai/agents/[agentId]/runs/[runId]        → trace de execução (Agent Run)
(app)/ai/copilot                              → Copilot (assistente lateral, contextual)
(app)/ai/evaluations                          → avaliações de qualidade de IA
(app)/ai/activity                             → AI Control Center (log de todas as ações de IA)

(app)/automation/workflows                    → lista de workflows
(app)/automation/workflows/new                → Workflow Builder (criação)
(app)/automation/workflows/[workflowId]       → Workflow Builder (canvas, versão publicada)
(app)/automation/workflows/[workflowId]/runs  → lista de execuções
(app)/automation/workflows/[workflowId]/runs/[runId] → trace de execução
(app)/automation/templates                    → galeria de templates de workflow

(app)/analytics                               → analytics geral (Operations/Customer/Agent/Automation)
(app)/analytics/ai                            → AI Performance analytics

(app)/quality                                 → AI Quality, Human Quality, Reviews, Coaching

(app)/modules/sales                           → placeholder "Coming soon"
(app)/modules/finance                         → placeholder "Coming soon"
(app)/modules/business                        → placeholder "Coming soon"

(app)/integrations                            → catálogo de integrações

(app)/settings                                → redirect para settings/general
(app)/settings/general
(app)/settings/branding
(app)/settings/localization
(app)/settings/business-hours
(app)/settings/teams
(app)/settings/users
(app)/settings/roles
(app)/settings/permissions
(app)/settings/customer-operations         → assignment, SLA, priorities, statuses, tags, custom fields
(app)/settings/ai                          → models, agents, policies, guardrails, usage, costs
(app)/settings/channels
(app)/settings/integrations
(app)/settings/security
(app)/settings/billing

(app)/admin                                → overview do admin console
(app)/admin/organizations
(app)/admin/users
(app)/admin/teams
(app)/admin/roles
(app)/admin/permissions
(app)/admin/ai-governance
(app)/admin/integrations
(app)/admin/usage
(app)/admin/billing
(app)/admin/security
(app)/admin/audit-logs
(app)/admin/system-health
```

Regra geral: toda entidade com detalhe (customer, ticket, agent, workflow, document) tem rota própria navegável diretamente (deep-link funcional), mesmo em dados mock.

## 7. Evolução da navegação (visão futura, não construir agora)

Quando Sales/Finance/Business Operations existirem, o sidebar se reorganiza em duas seções nítidas — **Modules** (específico de domínio) e **Platform** (compartilhado):

```text
AI OPERATIONS CLOUD

Overview

MODULES
  Customer Operations
    Inbox / Customers / Tickets / Knowledge / Quality
  Sales Operations
    Leads / Accounts / Deals / Pipeline
  Finance Operations
    Invoices / Payments / Approvals
  Business Operations
    Processes / Projects / Approvals

PLATFORM
  AI Workforce
  Automation
  Knowledge
  Analytics
  Integrations
  Settings
```

Isso não é implementado no protótipo v1, mas o nome dos grupos e a divisão Modules/Platform já devem existir no código do sidebar (ver `PROMPT-CONSTRUCAO-PROTOTIPO.md`) para facilitar a extensão futura.

## 8. Breadcrumbs e profundidade

Padrão: **Sidebar → página → tabs**, no máximo 2 níveis de profundidade dentro de uma página.

```text
Customers                          (lista)
  → John Smith                     (detalhe, tabs internas: Overview | Activity | Conversations | Tickets | Orders | Payments | Tasks | Notes | Files | Timeline)
```

Ações secundárias (editar campo, criar nota, anexar arquivo) usam **Drawer** ou **Modal**, nunca uma nova rota/página cheia — ver `02-design-system.md`.
