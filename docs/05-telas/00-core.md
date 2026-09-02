# Telas — Core (Login, Workspace, Overview, Coming Soon)

Convenções gerais desta seção de documentos: cada tela lista **Rota**, **Objetivo**, **Layout**, **Componentes usados**, **Dados necessários**, **Estados** e **Interações**. Componentes referenciam `02-design-system.md`; entidades referenciam `03-modelo-de-dados.md`; dados concretos referenciam `04-mock-data-acme-cloud.md`.

---

## 1. Login

**Rota:** `/login`

**Objetivo:** entrada no protótipo, sem autenticação real — qualquer submit avança.

**Layout:** tela centralizada, split opcional (formulário à esquerda / ilustração ou brand panel à direita em desktop; full-width em mobile).

```text
┌─────────────────────────────┐
│         AI Operations Cloud │
│                              │
│  Email                      │
│  [___________________]      │
│  Password                   │
│  [___________________]      │
│                              │
│  [ Sign in ]                │
│                              │
│  Continue with Google        │
│  Continue with SSO            │
└─────────────────────────────┘
```

**Componentes:** `Input`, `Button`, `Card`.

**Dados:** nenhum dado real validado. Campo pré-preenchido com `edivan@econform.com.br` como conveniência de demo (usuário `usr_edivan`).

**Estados:** default / submitting (botão com spinner, 500ms fake) / (não implementar estado de erro de credenciais — não é o foco do protótipo).

**Interações:** submit → navega para `/workspaces`.

---

## 2. Workspace Selection

**Rota:** `/workspaces`

**Objetivo:** simular seleção de workspace/ambiente antes de entrar na aplicação.

**Layout:** lista centralizada de cards de workspace.

```text
Select a workspace

┌───────────────────────────┐
│ ACME Cloud                │
│ Production                │
└───────────────────────────┘
┌───────────────────────────┐
│ ACME Cloud                │
│ Sandbox                   │
└───────────────────────────┘

+ Create workspace (desabilitado no protótipo, com tooltip "Coming soon")
```

**Dados:** `Workspace[]` (ver `04-mock-data-acme-cloud.md` §1).

**Interações:** clique em um card → navega para `/overview`, define o workspace ativo (usado no Workspace Switcher do header).

---

## 3. Overview (Dashboard principal)

**Rota:** `(app)/overview`

**Objetivo:** responder "como estão minhas operações agora?" — não é um dashboard cheio de gráficos, é um painel de decisão.

**Layout:**

```text
Good morning, Edivan
Here's what needs your attention today.

┌───────────┬───────────┬───────────┬───────────┐
│Conversat. │AI Resol.  │First Resp.│CSAT       │  ← KPIStatCard x4
│1,248 ↑12.4%│68.2% ↑5.8%│4m21s ↓18% │94.2% ↑2.1%│
└───────────┴───────────┴───────────┴───────────┘

Operations health
AI Resolution       ███████████████░░ 68%
SLA Compliance      █████████████████ 94%
Customer Sentiment  ████████████████░ 91%
Backlog              42

┌─────────────────────────────────────────────┐
│ AI Operations Brief                          │
│                                               │
│ Your operation is healthy overall.           │
│ 3 things need attention:                     │
│                                               │
│ ⚠ 18 conversations are approaching SLA breach│
│ ⚠ Payment-related issues increased 27%       │
│ ✓ AI resolution rate improved by 8.4%        │
│                                               │
│ [ View recommendations → ]                   │
└─────────────────────────────────────────────┘
```

Abaixo (opcional, se espaço): mini seções "Recent activity" (últimas 5 Activities) e "AI Workforce status" (contagem de agentes ativos, atalho para `/ai/agents`).

**Componentes:** `KPIStatCard` (x4), `HealthMeterRow` (x4), `AIInsightCard`/`AIOperationsBrief` (card dedicado), `ActivityTimeline` (versão compacta), `AgentCard` (compacta, resumo).

**Dados:** ver `04-mock-data-acme-cloud.md` §15 para os números exatos a usar.

**Estados:** Loading (skeleton dos cards) / Populated (padrão). Não há empty state relevante aqui (sempre há dados).

**Interações:**
- `View recommendations →` abre um Drawer com lista expandida de recomendações (cada uma linkando para a tela relevante: Tickets filtrado por SLA em risco, Analytics filtrado por "payment issues").
- Clique em um KPI card → navega para a tela de Analytics correspondente, com filtro já aplicado.
- Botão/ícone `◇ AI` no header (ou um CTA "Ask Operations AI" no topo do Overview) abre o painel do "AI Moment #2" — ver `06-fluxos-e-ai-moments.md`.

---

## 4. Module Coming Soon (Sales / Finance / Business Operations)

**Rota:** `(app)/modules/sales`, `(app)/modules/finance`, `(app)/modules/business`

**Objetivo:** comunicar a visão de plataforma sem implementar o módulo — reforça que Customer Operations é "um módulo", não o produto inteiro.

**Layout:**

```text
┌─────────────────────────────────────────┐
│  Sales Operations                        │
│  Coming soon                             │
│                                           │
│  Leads · Accounts · Deals · Pipeline ·   │
│  Sales Agents · Revenue Analytics        │
│                                           │
│  This module will share the same         │
│  Customers, Events, Agents and Workflows │
│  you already use in Customer Operations. │
│                                           │
│  [ Notify me when available ]            │
└─────────────────────────────────────────┘
```

**Componentes:** `ModuleComingSoonCard`, `Badge` ("Coming soon"), `Button` (ghost, sem ação real — apenas toast "Thanks, we'll let you know").

**Dados:** texto estático por módulo (lista de sub-áreas futuras, conforme visão do produto).

**Estados:** único estado (estático).
