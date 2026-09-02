# Fluxos de Navegação e AI Moments

## 1. Jornada de demonstração (5 minutos)

Esta é a sequência recomendada para qualquer demo/portfólio do protótipo — cada tela deve suportar bem essa transição:

```text
Landing (opcional) → Login → Workspace → Overview
   → Inbox → Conversation → "Resolve with AI" (AI Moment #1)
   → Customer 360 (a partir do link "View full profile")
   → AI Workforce → Agent Detail → Agent Run trace
   → Workflows → Workflow Builder (canvas)
   → Analytics → AI Performance
```

Objetivo: em 5 minutos, a pessoa entende que não é "um dashboard de atendimento", é uma plataforma operacional.

## 2. AI Moment #1 — "Resolve with AI" (dentro do Inbox)

**Onde:** `(app)/inbox/[conversationId]`, dentro do `AIAnalysisPanel`.

**Gatilho:** botão de destaque "Resolve with AI" visível quando a conversa tem `aiAnalysis.recommendedAction` definido.

**Sequência (com delays artificiais de 400–800ms entre steps, renderizada como uma lista que vai marcando ✓ progressivamente):**

```text
AI ANALYSIS
Intent: Payment failure
Sentiment: Frustrated
Priority: High
Customer value: €8,420
Recommended action: Issue refund
Reason: Payment failed twice and customer was charged twice.

[ Resolve with AI ]

↓ (clique)

Checking payment...
✓ Payment verified

Checking policy...
✓ Eligible for automatic refund

Issuing refund...
✓ €42 refunded

Sending response...
✓ Customer notified

Ticket resolved.
```

**Efeitos colaterais simulados no estado da aplicação (mock, em memória):**
- `Conversation.status` → `resolved`.
- Nova `Message` do tipo `agent` aparece na thread.
- Novo `Activity` é adicionado à Timeline do `Customer` correspondente.
- Um novo `AgentRun` é "criado" e fica acessível a partir de `(app)/ai/agents/[agentId]/runs/[runId]` (linkar no toast final: "View full trace →").

**Por que importa:** demonstra em uma única interação o conceito inteiro — Agent + Tool + Policy + Ação + Auditoria — sem precisar explicar nada em texto.

## 3. AI Moment #2 — "Ask Operations AI" (a partir do Overview/Header)

**Onde:** botão `◇ AI` no header (global) ou CTA dedicado no topo do Overview.

**Gatilho:** abre painel/drawer lateral com campo de pergunta em linguagem natural.

**Exemplo de interação:**

```text
> Why did support performance decrease this week?

Thinking... (indicador de processamento, ~1s)

I found 3 contributing factors:

1. Payment-related tickets increased 27%.
2. Average response time increased 14%.
3. Billing Agent escalations increased 9%.

Recommended actions:
• Update payment troubleshooting knowledge
• Review Billing Agent policy
• Add a dedicated billing workflow

[ Create knowledge article ]  [ Review policy ]  [ Create workflow ]
```

**Implementação no protótipo:** respostas pré-scriptadas (não é uma IA real) mapeadas a um pequeno conjunto de perguntas sugeridas exibidas como chips clicáveis quando o painel abre vazio (ex.: "Why did support performance decrease this week?", "Which customers are at risk?", "What's blocking AI resolution rate?"). Se o usuário digitar algo fora do script, mostrar uma resposta genérica plausível — não precisa cobrir todo o espaço de perguntas.

**Botões de ação** no final da resposta devem navegar de fato para as telas relevantes (Knowledge, Settings → AI Policies, Automation → Workflows), reforçando que o "insight" sempre termina em uma ação real da plataforma.

## 4. Fluxo: aprovação de ação de IA (governança)

Demonstra a filosofia "Human + AI, nunca AI replaces humans".

```text
Billing Agent detecta reembolso de €180 (acima do limite de auto-aprovação de €50)
   → cria Approval (status: pending)
   → aparece em: (app)/ai/activity (com ⚠ Approval) e (app)/admin/ai-governance
   → Manager (ex.: Maria Silva) clica "Approve"
   → Approval.status → approved
   → AgentRun retomado (step "Human approval" marcado ✓)
   → Refund executado, Activity registrada no Customer 360
```

Este fluxo deve estar implementado de ponta a ponta em pelo menos **um** caso (o do John Smith / conv_1842, se optar por variar o valor para ficar acima do threshold, ou um segundo exemplo dedicado com Maria Fernandes) para servir de prova de conceito completa da governança.

## 5. Fluxo: da IA identificando um gap de conhecimento até a correção

Fecha o "AI Operations Flywheel" descrito na visão do produto.

```text
(app)/analytics/ai → "Top unresolved intents: Refund policy exceptions 31%"
   → [ Create article ] → (app)/knowledge com Modal pré-preenchido
   → salvar → novo KnowledgeDocument criado (status: ready)
   → Knowledge Health "Missing topics" decrementa (mock: pode ser estático, não precisa recalcular de verdade — mas o documento deve aparecer na lista de Documents)
```

## 6. Fluxo: criação de ticket a partir de uma conversa

```text
Inbox → Conversation → botão "Create ticket" no header do painel central
   → Modal pré-preenchido (customer, título sugerido a partir do intent da IA, prioridade sugerida)
   → salvar → novo Ticket criado, linkado à Conversation
   → toast com link "View ticket →" para (app)/tickets/[novoId]
```

## 7. Estados de autonomia — onde aparecem

O `AutonomyBadge` (`Autonomous` / `Assisted` / `Human approval` / `Human only`) deve aparecer consistentemente em:

- `AgentCard` (lista de AI Workforce)
- Cabeçalho do Agent Detail
- Dentro do Agent Builder (seção Policies define isso implicitamente)
- Linha de cada ação em AI Activity

Isso é o que visualmente comunica a filosofia de governança em toda a plataforma, não só em uma tela isolada.
