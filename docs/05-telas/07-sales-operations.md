# Telas — Sales Operations (Overview, Leads, Accounts, Deals, Forecast)

Segundo módulo do protótipo, ativo (não mais placeholder — ver `docs/00-visao-e-principios.md` §5 e `08-roadmap-prototipo-para-produto.md`). Reutiliza Customer, Task, Activity, Event, Agent, Tool, Workflow, Notification, AuditLog do core; introduz Lead, Account, PipelineStage, Deal, Interaction, Signal, Proposal (ver `03-modelo-de-dados.md` §4.1).

Navegação: `(app)/modules/sales/layout.tsx` usa `SecondarySidebarLayout` (mesmo componente de Settings/Admin) com nav própria — Overview, Leads, Accounts, Deals, Forecast. O item "Sales Operations" no sidebar global aponta só para `/modules/sales`.

---

## 1. Overview

**Rota:** `(app)/modules/sales`

**Layout:**

```text
Sales Operations                                          [ + Novo lead ]

┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Pipeline     │ Forecast    │ Win rate    │ Receita      │
│ aberto       │ ponderado   │             │ em risco     │
│ €815.5k      │ €XXXk       │ 31%         │ €XXk         │
└─────────────┴─────────────┴─────────────┴─────────────┘

[AIInsightCard] "3 de 17 oportunidades abertas estão em risco alto — €XXk em receita."
                [ Ver deals em risco → ]

Sinais recentes                                  Deals em risco
🔴 Meridian Freight — concorrente mencionado      Meridian Freight  €38.000  HIGH
🟢 Vantage Biotech — orçamento confirmado          Kepler Robotics   €52.000  HIGH
...                                                Nordwind Energy   €210.000 HIGH
```

**Componentes:** `KPIStatCard` ×4 (calculados a partir de `deals`/`getDealsAtRisk`, nunca hardcoded), `AIInsightCard`, lista de `Signal[]` recentes (`getRecentSignals`), lista de deals com `riskLevel: "high"` (`getDealsAtRisk`).

**Interações:** clique num deal em risco → `(app)/modules/sales/deals/[dealId]`. "+ Novo lead" abre `Modal` (`LeadFormDialog`).

---

## 2. Leads

**Rota:** `(app)/modules/sales/leads` (lista) e `(app)/modules/sales/leads/[leadId]` (detalhe)

**Lista:** tabs de filtro (`Todos`/`Novos`/`Contatados`/`Qualificados`/`Desqualificados`), busca por nome/empresa, tabela com nome, empresa, fonte, lead score (badge colorido por faixa), ICP fit, status. Mesmo padrão de `(app)/customers` (`ClickableTableRow`, `EmptyState`).

**Detalhe:**

```text
Marina Torres — Terracotta Hospitality
VP of Operations · marina.torres@terracottahospitality.com

Lead score: 78/100                    ICP fit: Good
Fonte: Referral                       Status: Converted

Por que este score:
• Indicação de cliente existente
• Cargo com poder de decisão
• Empresa dentro do ICP (300-500 funcionários)

[ Qualificar e converter em Account/Deal ]  (some se já convertido)
```

**Interação de conversão:** botão cria um novo `Account` (status `qualifying`) + `Deal` inicial (stage `Qualification`) a partir dos dados do lead, marca `Lead.status = "converted"` e `Lead.accountId`, navega para o novo Account com toast "Lead convertido em Account". Segue o mesmo padrão de persistência em memória de `customer-form-dialog.tsx` (muta o array exportado + toast).

---

## 3. Accounts

**Rota:** `(app)/modules/sales/accounts` (lista) e `(app)/modules/sales/accounts/[accountId]` (Account 360)

**Lista:** mesmo padrão de `(app)/customers` — tabs (`Todos`/`Deal ativo`/`Qualificando`/`Clientes`/`Perdidos`), busca, tabela (nome, indústria, ICP tier, status, dono, deals abertos, valor total em pipeline).

**Account 360 — header + tabs:**

```text
Meridian Freight
meridianfreight.com · Logistics · 310 funcionários
ICP fit: Good (74)      Dono: Diego Farias      Status: Active deal

[Overview] [Contacts] [Interactions] [Deals] [Signals] [Revenue Graph] [Timeline]
```

### Tab Overview
Cards resumo: dados de enrichment (indústria, porte, receita estimada), ICP fit com breakdown, deal(s) aberto(s) em destaque, últimos 3 signals.

### Tab Contacts
Lista de `Contact` filtrados por `accountId` (`getContactsByAccount`) — mesmo componente usado no Customer 360.

### Tab Interactions
Lista de `Interaction` (`getInteractionsByAccount`), ícone por tipo (email/meeting/call), sentimento e engagement score do `aiAnalysis`.

### Tab Deals
Lista de `Deal` do account (`getDealsByAccount`), com stage e risco.

### Tab Signals
Lista de `Signal` (`getSignalsByAccount`), badge verde (positive) / vermelho (negative).

### Tab Revenue Graph
Grafo navegável (`@xyflow/react`, mesma lib do Workflow Builder) renderizando:

```text
Account → Contacts → Interactions → Deals → Signals → Intent → Probability → Revenue
```

Cada nó é clicável e abre a entidade correspondente (ex.: clicar num nó de Deal abre `(app)/modules/sales/deals/[dealId]`). Este é o componente que materializa visualmente o "Revenue Graph" descrito na visão do produto.

### Tab Timeline
Mesmo padrão de `Activity` do Customer 360, filtrado por `relatedType: "account" | "deal"` e `relatedId`.

**Estados:** cada tab com Loading/Empty próprios (ex.: "Nenhuma interação registrada ainda").

---

## 4. Deals

**Rota:** `(app)/modules/sales/deals` (lista) e `(app)/modules/sales/deals/[dealId]` (detalhe)

**Lista:** toggle `Lista`/`Pipeline` (`Tabs`). `Pipeline` é o board Kanban padrão — uma coluna por `PipelineStage`, cards com nome do deal, valor, dono, badge de risco. `Lista` é uma tabela ordenável (nome, account, estágio, valor, probabilidade, risco, previsão de fechamento).

**Detalhe — Deal Risk (AI Moment #3, ver `06-fluxos-e-ai-moments.md` §3.1):**

```text
Meridian Freight — Expansão Enterprise
€38.000                                          Stage: Negotiation

Risk: HIGH

Reasons:
• 12 dias sem resposta do contato principal
• Decision maker não engajado nas últimas interações
• Concorrente mencionado na última reunião
• Nenhuma reunião agendada

Recommended action: Agendar follow-up executivo

[ Agendar follow-up ]  [ Ver Revenue Graph → ]

[Overview] [Interactions] [Proposal] [Activity]
```

`DealRiskPanel` só aparece com destaque quando `riskLevel !== "low"`; para `low`, mostra um resumo neutro ("Sem sinais de risco identificados").

### Tab Overview
Dados do deal, account vinculado, dono, datas.

### Tab Interactions
`getInteractionsByDeal(dealId)`.

### Tab Proposal
`getProposalByDeal(dealId)` — status, valor, data de envio; botão "Gerar proposta" se ainda não existir (fake, cria em memória).

### Tab Activity
Histórico de mudança de estágio/status (mesmo padrão do Ticket Detail em Customer Operations).

---

## 5. Forecast

**Rota:** `(app)/modules/sales/forecast`

Mesmo padrão de `(app)/analytics`: `KPIStatCard` + `SimpleBarChart` (pipeline por estágio), `TrendLineChart` (forecast vs. fechado, win rate), `DonutChart` (receita por nível de risco). Dados em `src/data/mock/salesAnalyticsSeries.ts` (ilustrativos, mesmo padrão de `analyticsSeries.ts` — não recalculados a partir de `deals[]` a cada render).
