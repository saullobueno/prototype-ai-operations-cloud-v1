# Telas — Analytics e Quality

## 1. Analytics (geral)

**Rota:** `(app)/analytics`

**Objetivo:** analytics em camadas, não "tickets per day" solto.

**Layout:**

```text
Analytics

[Operations] [Customer] [AI] [Agent] [Automation]
```

### Tab: Operations
`KPIStatCard`/`Chart` para: ticket volume (line chart por dia), backlog (número + tendência), SLA compliance (%), tempo médio de resposta, tempo médio de resolução.

### Tab: Customer
CSAT (line chart), sentiment ao longo do tempo (área empilhada: positive/neutral/frustrated/angry), sinais de churn (lista de customers com `health: at_risk`/`critical`), customer effort score.

### Tab: AI
Ver seção dedicada abaixo (`AI Performance`) — pode ser a mesma tela de `(app)/analytics/ai` embutida como tab, ou linkada.

### Tab: Agent
Por agente humano: carga de trabalho (conversas/tickets atribuídos), produtividade (resoluções/dia), taxa de resolução, qualidade média (das `Evaluation`).

### Tab: Automation
Runs por workflow (bar chart), taxa de sucesso/falha, tempo economizado estimado (mock: "≈ 340h saved this month").

**Componentes:** usar a skill `dataviz` para paleta e padrões de gráfico (line, bar, area, donut), `KPIStatCard`, `Table` para rankings (ex.: top workflows por volume).

**Dados:** derivados agregando o mock data (contagens sobre `Ticket`, `Conversation`, `WorkflowRun`, `Evaluation`) — não precisa ser cálculo dinâmico real; pode ser série temporal pré-gerada e estática por enquanto, desde que visualmente coerente com os KPIs do Overview.

**Estados:** Loading (skeleton de gráficos) / Populated. Filtro de período no topo (`Last 7 days` / `30 days` / `90 days`) — trocar período pode apenas trocar entre 2–3 datasets estáticos pré-definidos.

---

## 2. AI Performance (AI Analytics)

**Rota:** `(app)/analytics/ai`

**Layout:**

```text
AI PERFORMANCE

Resolution rate        68.4%
Human escalation         21.3%
Unknown / unresolved       10.3%

Cost / resolution        €0.14
Avg confidence             91.2%

Why isn't AI resolving more?

Top unresolved intents
1. Refund policy            31%
2. Account changes           18%
3. Technical bugs              16%
4. Shipping exceptions           12%

Recommended action
"Create a knowledge article about refund exceptions."
[ Create article ]
```

**Componentes:** `KPIStatCard`, `Chart` (donut para resolution/escalation/unresolved breakdown, bar horizontal para top unresolved intents), `AIInsightCard` para a recomendação com CTA acionável.

**Interação-chave (loop de melhoria contínua):** `[ Create article ]` navega para `(app)/knowledge` com um `Modal` de criação de documento pré-preenchido com o tópico sugerido — fechando visualmente o loop descrito na visão do produto: *AI opera → AI mede → AI detecta fraqueza → AI recomenda → Humano aprova → Sistema melhora.*

**Dados:** ver `04-mock-data-acme-cloud.md` §13 (Top unresolved intents) e §15.

---

## 3. Quality

**Rota:** `(app)/quality`

**Objetivo:** garantir que qualidade (humana e de IA) seja tratada como parte central da operação, não um apêndice.

**Layout:**

```text
Quality

[AI Quality] [Human Quality] [Conversation Reviews] [Evaluations] [Coaching]
```

Nota: esta tela compartilha conceitualmente conteúdo com `(app)/ai/evaluations` (ver `05-telas/03-ai-agents.md` §6). Decisão de IA para o protótipo: `(app)/ai/evaluations` foca em qualidade **da IA** (agent runs); `(app)/quality` é a visão mais ampla que inclui qualidade **humana** e processos de revisão/coaching organizacionais. Reaproveitar os mesmos componentes (`Table` de `Evaluation`, formulário de scoring) em ambas as telas, com filtros de `targetType` diferentes por padrão.

### Tab: AI Quality
Redireciona/embute a mesma visão de `(app)/ai/evaluations` tab "AI Quality".

### Tab: Human Quality
Ranking de agentes humanos por score médio de avaliação (accuracy, tone, policy adherence, CSAT das conversas que atenderam).

### Tab: Conversation Reviews
Fila de conversas marcadas para revisão (aleatória ou por flag de risco), com botão "Review" abrindo `Drawer` de scoring.

### Tab: Evaluations
Histórico completo de avaliações (tabela combinada humano + IA), filtrável.

### Tab: Coaching
Mesmo conteúdo de `(app)/ai/evaluations` tab "Coaching", mas pode incluir também recomendações para agentes humanos (ex.: "Pedro Santos — tone score below team average in Technical Support this week").

**Estados:** Loading / Empty ("No reviews pending") / Populated, por tab.
