# Telas — Platform (Integrations, Settings, Admin)

## 1. Integrations (catálogo)

**Rota:** `(app)/integrations`

**Layout:**

```text
Integrations                          Search...   [ Category ▾ ]

┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Stripe         │ │ Salesforce    │ │ Slack          │
│ Payments       │ │ CRM           │ │ Communication  │
│ ● Connected    │ │ ● Connected   │ │ ● Connected    │
└───────────────┘ └───────────────┘ └───────────────┘
┌───────────────┐
│ Zendesk        │
│ CRM            │
│ ○ Disconnected │
│ [ Connect ]    │
└───────────────┘
```

**Componentes:** grid de cards por integração, badge de status (`connected`/`disconnected`/`error`), filtro por categoria (`crm`, `erp`, `payments`, `analytics`, `storage`, `communication`).

**Dados:** ver `04-mock-data-acme-cloud.md` §14.

**Interações:** `Connect` em uma integração desconectada abre `Modal` (fake OAuth: "Connecting..." → sucesso após ~1s → status muda para `connected`). Card conectado, ao clicar, abre `Drawer` com detalhes básicos (data de conexão, escopo, botão "Disconnect").

---

## 2. Settings

**Rota base:** `(app)/settings` (redireciona para `general`). Layout: sidebar secundária dentro da página (settings tem seu próprio submenu, diferente do sidebar principal).

```text
┌──────────────┬─────────────────────────────┐
│ Workspace     │                              │
│  General      │       (conteúdo da seção)     │
│  Branding     │                              │
│  Localization │                              │
│  Business hrs │                              │
│               │                              │
│ Organization  │                              │
│  Teams        │                              │
│  Users        │                              │
│  Roles        │                              │
│  Permissions  │                              │
│               │                              │
│ Customer Ops  │                              │
│  Assignment   │                              │
│  SLA          │                              │
│  Priorities   │                              │
│  Statuses     │                              │
│  Tags         │                              │
│  Custom fields│                              │
│               │                              │
│ AI            │                              │
│  Models       │                              │
│  Agents       │                              │
│  Policies     │                              │
│  Guardrails   │                              │
│  Usage        │                              │
│  Costs        │                              │
│               │                              │
│ Channels      │                              │
│ Integrations  │                              │
│ Security      │                              │
│ Billing       │                              │
└──────────────┴─────────────────────────────┘
```

### Seções — conteúdo esperado (todas usam formulários simples com salvar local em memória):

- **General:** nome do workspace, timezone, idioma padrão.
- **Branding:** logo (upload mock), cor primária (color picker), preview ao vivo.
- **Localization:** idioma, formato de data/hora, moeda.
- **Business hours:** grade semanal de horário de atendimento + feriados.
- **Teams:** `Table` de `Team`, criar/editar/excluir, gerenciar membros.
- **Users:** `Table` de `User`, convidar (`Modal`), editar role, suspender.
- **Roles:** lista de `Role` com contagem de permissões; clique abre editor de `Permission[]` (checkboxes agrupados por domínio: Customers, Tickets, Agents, Workflows, Settings...).
- **Permissions:** catálogo somente-leitura de todas as `Permission` disponíveis, agrupadas por categoria.
- **Assignment:** regras de roteamento (round-robin / by team / by skill) — UI simples de seleção, sem lógica real.
- **SLA:** `Table` de `SLA` (nome, first response, resolution, prioridades aplicáveis), CRUD.
- **Priorities / Statuses / Tags:** listas editáveis simples (nome + cor).
- **Custom fields:** builder simples de campos customizados por entidade (Customer/Ticket), tipo (text/number/select/date).
- **AI → Models:** lista de modelos disponíveis (mock: nomes genéricos como "Fast", "Balanced", "Advanced" — evitar nomear modelos de terceiros reais aqui, é config de produto, não marketing), custo relativo.
- **AI → Agents:** atalho para `(app)/ai/agents` (não duplicar UI).
- **AI → Policies:** `Table` de `Policy`, CRUD de `PolicyRule`.
- **AI → Guardrails:** toggles globais (ex.: "Require human approval for any refund above €500", "Never allow AI to delete customer data").
- **AI → Usage / Costs:** gráfico simples de uso de IA por período e custo estimado.
- **Channels:** lista de `Channel`, conectar/desconectar (similar ao Integrations).
- **Integrations:** atalho para `(app)/integrations`.
- **Security:** autenticação (toggle SSO/MFA — mock), sessões ativas (lista fake), API keys (`Table` com botão "Generate key" que mostra um valor mock uma única vez).
- **Billing:** plano atual, uso do período, histórico de faturas (`Table` mock), forma de pagamento (mock, sem processar nada real).

**Estados:** cada seção tem Loading (skeleton do form) / Populated. Salvar sempre dá toast de sucesso (não há erro de validação de backend real, apenas validação de formulário client-side básica).

---

## 3. Admin Console

**Rota base:** `(app)/admin`

**Objetivo:** separar administração de plataforma da operação do dia a dia. Visível apenas para roles `Owner`/`Admin` (ver `07-papeis-e-permissoes.md`).

**Layout:** mesmo padrão de sidebar secundária de Settings.

```text
Admin

Overview
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

### Overview
KPIs gerais da conta (mesmos números de `04-mock-data-acme-cloud.md` §1), estado geral do sistema.

### Organizations
Para o protótipo, uma única `Organization` (ACME Cloud) — tela existe para comunicar que a arquitetura suporta múltiplas organizações no futuro (ex.: cenário de revenda/multi-empresa), mas lista apenas 1 registro.

### Users / Teams / Roles / Permissions
Mesmas telas de `Settings → Organization`, reaproveitadas (podem ser literalmente o mesmo componente montado sob rota diferente, com breadcrumb "Admin" em vez de "Settings").

### AI Governance
Visão consolidada de `Policy[]` de toda a organização + `Approval[]` pendentes globalmente + guardrails ativos. É a versão "auditoria" do que existe em `Settings → AI`.

```text
AI Governance

Pending approvals            4
Active policies              12
Guardrail violations (30d)    0

┌─────────────────────────────────────┐
│ Billing Agent requested refund €180  │
│ Customer: Maria Fernandes             │
│ [ Approve ]  [ Reject ]               │
└─────────────────────────────────────┘
```

### Integrations / Usage / Billing / Security
Espelham as seções de Settings, com foco em visão agregada/administrativa (ex.: Usage mostra consumo de IA por agente/time, não só total).

### Audit Logs
```text
Audit Logs                          Filters: Actor · Action · Target · Date

┌───────────────────────────────────────────────────┐
│ Actor          Action              Target      When │
│ Billing Agent   issue_refund        Payment #...  2m │
│ Maria Silva      update_ticket        Ticket #1842  5m │
│ Support Agent      create_ticket       Ticket #1845   8m │
└───────────────────────────────────────────────────┘
```
`Table` de `AuditLog[]`, filtrável, somente leitura, essencial para reforçar a narrativa de governança.

### System Health
Painel decorativo (mock) simulando status de serviços internos (API, Workflow Engine, AI Runtime, Integrations) — badges verde/amarelo/vermelho, sem dados reais.

**Estados:** Loading (skeleton) / Populated, por seção. `AI Governance` e `Audit Logs` são as duas seções que merecem mais fidelidade visual, pois carregam o argumento de venda de "enterprise-grade governance".
