# Design System

## 1. Direção visual

**Enterprise + modern + data-dense + premium.** Referências conceituais: Linear, Vercel, Stripe, Intercom, Datadog, Ramp, Notion. Sensação-alvo: *"control room + SaaS + intelligence layer"*.

Evitar explicitamente:

- Gradientes roxo/rosa genéricos de "produto de IA"
- Ícones de robô
- Excesso de estrelas/sparkles para marcar "isso é IA"
- Bolha de chat gigante centralizada
- Visual "chatbot consumer app"

IA deve ser comunicada por **estrutura de dados, trace de execução e clareza de decisão**, não por estética "mágica".

## 2. Tokens

### 2.1 Cor

Paleta neutra + 1 cor de destaque (accent) + cores semânticas. Suporte a light e dark mode desde o início.

```text
Base (neutral scale)   gray-50 … gray-950   → fundo, texto, bordas
Accent                 indigo/blue-600      → ações primárias, item ativo no sidebar, links
Success                green-600            → resolvido, aprovado, saudável
Warning                amber-500            → SLA em risco, atenção necessária
Danger                 red-600              → falha, crítico, urgente
Info                   sky-500              → neutro informativo (ex.: "processing")
AI accent              violet-500 (uso pontual e comedido) → apenas para marcar "isto foi gerado/decidido por IA" (badges, bordas finas), nunca como cor dominante de tela
```

Regra: cor semântica de status é sempre a mesma em toda a plataforma (ex.: `high priority` e `urgent` sempre em `danger`; `resolved`/`healthy` sempre em `success`).

### 2.2 Tipografia

```text
Font family: Inter (ou equivalente geométrica sans-serif do sistema)
Display   28–32px / semibold   → títulos de página
Heading   18–20px / semibold   → títulos de seção/card
Body      14px / regular       → texto padrão
Small     12–13px / regular    → metadados, timestamps, labels
Mono      13px                 → IDs, código, payloads de evento
```

### 2.3 Espaçamento e grid

```text
Base unit: 4px
Espaçamentos usuais: 4, 8, 12, 16, 24, 32, 48, 64
Page padding: 24px (desktop), 16px (tablet/mobile)
Border radius: 8px (cards/inputs), 6px (badges/buttons pequenos), 12px (modais)
```

### 2.4 Elevação

```text
Level 0   sem sombra           → cards em listas densas
Level 1   sombra sutil         → cards de destaque, dropdowns
Level 2   sombra média         → popovers, tooltips
Level 3   sombra forte         → modais, drawers
```

## 3. Componentes de UI (genéricos)

```text
Button (primary, secondary, ghost, destructive, sizes sm/md/lg)
Input, Textarea, Select, Combobox, DatePicker
Checkbox, Radio, Switch
Badge (status, count)
Avatar (com fallback de iniciais, indicador de status online/offline)
Card
Table (com sort, seleção múltipla, paginação, column visibility)
Tabs
Drawer (lateral direita, para detalhe rápido sem sair da lista)
Modal (para confirmações e formulários curtos)
Command (command palette, ⌘K)
Tooltip
Dropdown / Popover
Toast (feedback de ações)
Timeline (lista vertical de eventos com ícone + timestamp)
Chart (line, bar, area, donut — ver skill `dataviz` para paleta e padrões de gráfico)
Progress / Meter (barras de health, ex.: "AI Resolution ███████░░ 68%")
Skeleton (loading state)
EmptyState
Stepper (para builders multi-step, ex.: Agent Builder)
CodeBlock / JSONViewer (para payloads de evento e configs)
```

## 4. Componentes de domínio

```text
CustomerCard          → avatar, nome, empresa, plano, health badge
CustomerHealthBadge    → 🟢 Healthy / 🟡 At risk / 🔴 Critical
ConversationListItem   → avatar cliente, preview, canal, status dot, timestamp
ConversationPanel      → thread de mensagens + composer
AIAnalysisPanel         → intent, sentiment, priority, recommended action (dentro da Conversation)
TicketCard / TicketRow  → id, título, status, prioridade, SLA countdown, assignee
SLABadge                → countdown com cor por urgência (verde > amarelo > vermelho)
AgentCard               → avatar, nome, status (🟢/🟡/⚪), tarefas hoje
AgentRunTrace            → lista expansível de steps (retrieval, tool_call, decision...)
AutonomyBadge            → ● Autonomous / ○ Assisted / ○ Human approval / ○ Human only
WorkflowCanvas            → área de nodes + edges (drag, zoom, minimap)
WorkflowNodeCard           → ícone por tipo de node, label, estado de execução quando em run view
ActivityTimeline           → timeline vertical (usado no Customer 360 e no Audit Log)
AIInsightCard               → card de recomendação ("Create a knowledge article about refund exceptions")
KPIStatCard                  → valor grande + variação percentual + sparkline opcional
HealthMeterRow                → barra de progresso rotulada (AI Resolution, SLA Compliance...)
KnowledgeHealthCard            → coverage/freshness/conflicts/missing topics
NotificationDropdown            → lista de notificações agrupadas por dia
CommandPalette                   → conforme `01-arquitetura-da-informacao.md`
ModuleComingSoonCard              → usado nos módulos Sales/Finance/Business
PolicyRuleRow                      → condição → ação (ex.: "amount <= €50 → AI can execute")
ApprovalRequestCard                 → contexto da solicitação + botões Approve/Reject
```

## 5. Estados obrigatórios por tela com dados

Toda tela que lista ou carrega dados precisa definir explicitamente 4 estados (ver specs em `05-telas/`):

1. **Loading** — Skeleton fiel ao layout final (não spinner genérico central, exceto em ações pontuais).
2. **Empty** — `EmptyState` com ícone, título, descrição curta e CTA quando aplicável (ex.: "No conversations yet" / "Create your first workflow").
3. **Error** — mensagem de erro amigável + botão "Try again" (mesmo sendo mock, simular falha ocasional é opcional, mas o componente deve existir).
4. **Success/Populated** — o estado normal com dados.

Para ações assíncronas simuladas (ex.: "Resolve with AI", "Issue refund"), usar uma sequência de micro-estados com delay artificial (300–800ms por step) para parecer real, nunca instantâneo.

## 6. Modais vs. Drawers — quando usar cada um

```text
Drawer  → detalhe rápido sem perder contexto da lista (ex.: preview de ticket a partir da lista de tickets)
Modal   → confirmação, formulário curto, ação destrutiva (ex.: "Delete workflow?", "Create ticket")
Página nova → apenas quando o objeto tem identidade própria navegável e complexa (Customer 360, Agent detail, Workflow builder)
```

## 7. Padrões de layout por tipo de página

```text
List page       → Header (título + ações) / Filtros e busca / Tabela ou lista / Paginação
Detail page     → Header (identidade do objeto + ações) / Tabs / Conteúdo da tab ativa
3-column page   → usado apenas em Inbox: lista à esquerda / conteúdo central / painel de contexto à direita
Builder page    → Canvas ou Stepper central / painel de configuração lateral (contextual ao node/step selecionado)
Dashboard page  → Grid de KPI cards no topo / seções de health/insights abaixo / largura total
```

## 8. Dark mode

Todos os tokens de cor devem ter par light/dark. Superfícies em dark mode usam `gray-900`/`gray-950`, nunca preto puro. Cores semânticas mantêm o mesmo hue, ajustando luminosidade para contraste AA mínimo.

## 9. Acessibilidade mínima

- Contraste AA em texto e ícones funcionais (status, badges).
- Todo ícone-only button tem `aria-label`.
- Navegação por teclado no Command Palette, Tabs e Table (setas + Enter).
- Focus ring visível em todos os elementos interativos.
