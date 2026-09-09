# Telas — Knowledge

## 1. Knowledge (hub)

**Rota:** `(app)/knowledge`

**Objetivo:** tratar Knowledge como um ativo operacional (não uma pasta de documentos).

**Layout:**

```text
Knowledge

[Sources] [Documents] [Articles] [Collections] [Sync] [AI Readiness]

┌─────────────────────────────────────────┐
│ AI Knowledge Health                      │
│                                           │
│ Coverage             92%                 │
│ Freshness             81%                │
│ Conflicts              7                 │
│ Missing topics        14                 │
│ Low-confidence docs    3                 │
│                                           │
│ "14 customer questions cannot currently  │
│  be answered reliably from your          │
│  knowledge base."                        │
│                                           │
│ [ View gaps → ]                          │
└─────────────────────────────────────────┘

[ + Add source ]
```

Sub-tabs (todas dentro da mesma rota `(app)/knowledge`, controladas por tab state, não rotas separadas — mantendo a navegação rasa):

### Tab: Sources
Lista de `KnowledgeSource` (Website, PDF, Notion, Google Drive, URL, Manual upload, API), com status de sync (`synced`/`syncing`/`error`) e última sincronização. Botão `+ Add source` abre `Modal` com seletor de tipo de fonte (fake connect — apenas adiciona à lista com status `syncing` → depois de alguns segundos muda para `synced` via timer simulado).

### Tab: Documents
`Table` de `KnowledgeDocument`: título, fonte, status (`ready`/`processing`/`conflict`/`outdated`), confidence score, última atualização. Clique → `(app)/knowledge/[documentId]`.

### Tab: Articles
Subconjunto de documentos marcados como artigos publicados (visão editorial, com botão "Publish"/"Unpublish").

### Tab: Collections
Agrupamentos temáticos de documentos (ex.: "Billing", "Onboarding", "API"), usado para organizar o que os Agents podem consultar.

### Tab: Sync
Visão técnica simplificada do pipeline: `Documents → Parsing → Chunking → Embedding → Index → Retrieval → Agent` (diagrama estático ilustrativo, não interativo — apenas para comunicar o conceito, não expor complexidade real no MVP).

### Tab: AI Readiness
Aprofundamento do card "AI Knowledge Health": lista de `Missing topics` (com contagem de perguntas de clientes que não puderam ser respondidas) e `Conflicts` (documentos com informação contraditória), cada item com CTA "Create article" ou "Resolve conflict" (abre `Modal` de edição simples).

**Dados:** ver `04-mock-data-acme-cloud.md` §13.

**Estados:** Loading (skeleton do health card + tabela) / Empty (`Sources` sem nenhuma fonte conectada — "Connect your first knowledge source") / Populated.

---

## 2. Knowledge Document

**Rota:** `(app)/knowledge/[documentId]`

**Layout:**

```text
← Back to Knowledge

Refund Policy Exceptions
Source: Refund Policy (PDF) · Updated 3 days ago · Confidence 88%

[Content] [Used by] [History]
```

### Tab: Content
Renderização do conteúdo do documento (markdown simples), com botão `Edit` que abre editor inline (textarea) — salvar apenas atualiza o estado em memória.

### Tab: Used by
Lista de `Agent[]` que têm esse documento como `knowledgeSourceId` associado, e (se disponível) conversas recentes onde o documento foi citado pela IA.

### Tab: History
Lista simples de versões (mock estático: "v3 — updated by Sofia Costa — 3 days ago", "v2 — ...", "v1 — ...").

**Estados:** Loading / Populated. Documento inexistente → 404 com CTA "Back to Knowledge".
