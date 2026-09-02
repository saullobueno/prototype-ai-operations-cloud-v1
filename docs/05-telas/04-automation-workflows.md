# Telas — Automation (Workflows)

Provavelmente a área visualmente mais impressionante do protótipo — vale investir tempo extra aqui.

---

## 1. Workflows (lista)

**Rota:** `(app)/automation/workflows`

**Layout:**

```text
Workflows                                  [ + Create workflow ]

[All] [Active] [Paused] [Draft]      Search...

┌──────────────────────────────────────────────────────┐
│ Name                        Status    Runs    Success  │
│ New Ticket Triage            Active    1,284   96.6%    │
│ Customer Escalation Workflow  Active    1,284   96.6%    │
│ ...                                                       │
└──────────────────────────────────────────────────────┘
```

**Dados:** `Workflow[]` — ver `04-mock-data-acme-cloud.md` §12. Apenas 3–5 workflows precisam de canvas totalmente modelado (nodes/edges reais); os demais podem ter apenas metadados de lista.

**Interações:** clique → `(app)/automation/workflows/[workflowId]` (abre o canvas). `+ Create workflow` → `(app)/automation/workflows/new`. Também pode oferecer `(app)/automation/templates` como ponto de partida alternativo (galeria de templates pré-configurados, ex.: "Ticket Triage", "SLA Escalation", "Refund Approval").

---

## 2. Workflow Builder (canvas)

**Rota:** `(app)/automation/workflows/[workflowId]` (versão publicada) e `(app)/automation/workflows/new` (criação em branco ou a partir de template)

**Layout:**

```text
┌─────────────────────────────────────────────────────────────┐
│ New Ticket Triage        [Draft ▾]   [ Test ] [ Publish ]    │
├───────────────────────────────────────────┬───────────────────┤
│                                             │ Node config       │
│   ┌─────────────┐                          │ (painel contextual│
│   │ New Ticket  │  ← trigger                │  do node          │
│   └──────┬──────┘                           │  selecionado)      │
│          ↓                                  │                    │
│   ┌─────────────┐                           │  Ex.: AI Classify  │
│   │ AI Classify │                           │  Agent: Triage     │
│   └──────┬──────┘                           │  Agent             │
│          ↓                                  │  Output: intent    │
│   ┌───────┴────────┐                        │                    │
│   │                │                        │                    │
│ Payment          Technical                  │                    │
│   ↓                ↓                        │                    │
│ Billing Agent    Support Agent               │                    │
│   ↓                ↓                        │                    │
│ Check payment    Search KB                    │                    │
│   └───────┬────────┘                        │                    │
│          ↓                                  │                    │
│   Human approval?                            │                    │
│    │          │                              │                    │
│   YES         NO                             │                    │
│    ↓          ↓                              │                    │
│  Agent       Resolve                          │                    │
└─────────────────────────────────────────────┴───────────────────┘
```

**Componentes:** `WorkflowCanvas` (pan/zoom, minimap opcional), `WorkflowNodeCard` (ícone específico por tipo — ver lista de node types em `03-modelo-de-dados.md` §4 `WorkflowNode`), painel de configuração lateral contextual ao node selecionado, toolbar superior (`Draft/Published` badge, `Test`, `Publish`, `Version history`).

**Node palette (para adicionar novos nodes — sidebar de arrastar ou menu "+"):**

```text
Triggers: conversation created · ticket created · customer created · message received ·
          payment failed · SLA approaching · webhook · schedule · manual

Actions:  AI Agent · Condition · Branch · API Call · Send Email · Send Message ·
          Create Ticket · Update Customer · Assign Team · Human Approval · Delay ·
          Loop · Webhook · Code · Notification
```

**Interações:**
- Clique em um node → abre painel de configuração à direita (campos variam por tipo — ex.: node `AI Agent` mostra seletor de qual `Agent`; node `Condition` mostra editor de expressão simples).
- Arrastar novo node da paleta para o canvas, conectar via edges (drag entre portas).
- `Test` → simula uma execução fake com um payload de exemplo, destacando visualmente o caminho percorrido no canvas (nodes ficam verdes conforme "executam", com pequeno delay entre cada um).
- `Publish` → cria nova `WorkflowVersion`, toast de confirmação.

**Estados:** canvas vazio (novo workflow) mostra apenas o node de trigger + `EmptyState` "Add your first action" com botão "+".

---

## 3. Workflow Runs (lista)

**Rota:** `(app)/automation/workflows/[workflowId]/runs`

**Layout:**

```text
Customer Escalation Workflow — Runs

1,284 runs
Success 1,241    Failed 12    Waiting 31

┌───────────────────────────────────────────┐
│ Run #        Status    Started      Duration │
│ #12931        ✓         2h ago       1.2s      │
│ #12930        ⚠ Waiting  2h ago       —         │
│ #12929        ✗ Failed   3h ago       0.4s      │
└───────────────────────────────────────────┘
```

**Dados:** `WorkflowRun[]` — ver `03-modelo-de-dados.md` §4. Não é necessário gerar 1.284 registros reais; usar o número no resumo e popular a tabela com 20–30 runs de amostra (paginação simulada).

**Interações:** clique → `(app)/automation/workflows/[workflowId]/runs/[runId]`.

---

## 4. Workflow Run Detail (trace)

**Rota:** `(app)/automation/workflows/[workflowId]/runs/[runId]`

**Layout:** duas visões complementares — trace linear (lista) e, se possível, o mesmo canvas do builder com os nodes coloridos por resultado do run.

```text
Run #12931

✓ Trigger
✓ AI Classification
✓ Customer lookup
✓ Policy check
⚠ Human approval
✓ Notification
```

**Componentes:** reaproveita `AgentRunTrace` (mesmo padrão visual de steps expansíveis) — cada step mostra `nodeId`, `label`, `status`, `detail`, `timestamp`.

**Estados:** run `failed` destaca o step que falhou em vermelho com mensagem; run `waiting` destaca o step de `Human approval` pendente com CTA "Approve"/"Reject" inline (gera um `Approval` mock).

---

## 5. Templates

**Rota:** `(app)/automation/templates`

**Layout:** galeria de cards (`Card` com ícone, nome, descrição curta, tag de categoria).

```text
Templates

┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Ticket Triage │ │ SLA Escalation│ │ Refund Approval│
│ Classify and   │ │ Alert when     │ │ Route refund   │
│ route tickets  │ │ SLA at risk    │ │ requests        │
│ [ Use template]│ │ [ Use template]│ │ [ Use template] │
└───────────────┘ └───────────────┘ └───────────────┘
```

**Interações:** `Use template` → cria um novo workflow pré-populado e navega para `(app)/automation/workflows/[novoId]` (canvas já montado, em modo Draft).
