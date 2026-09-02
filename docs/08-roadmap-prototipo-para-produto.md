# Roadmap — do Protótipo ao Produto Real

Este roadmap descreve como o pensamento registrado nestes documentos evolui para engenharia real. Não é para ser executado agora — é a resposta à pergunta "e depois que o protótipo validar a ideia, o que muda?".

## Fase 0 — Product Design (ESTA FASE)

```text
Information architecture · Design system · Navigation · Mock data ·
Layouts · Responsive · Interações · Protótipo navegável
```

Entregável: este pacote de documentos + o protótipo em código (Next.js/React + dados mock), navegável ponta a ponta conforme `06-fluxos-e-ai-moments.md`.

Critério de saída: você consegue navegar as ~25 telas, mostrar os 2 AI Moments, e sentir que a arquitetura de informação (sidebar, Customer 360, Operations Graph) faz sentido sem precisar de mais explicação verbal.

## Fase 1 — Customer Operations (produto real, primeiro módulo)

```text
Auth real · Workspace real (multi-tenant) · Customers · Inbox ·
Tickets · Knowledge · Agents (config, não runtime ainda) · Workflows (config) · Analytics
```

O modelo de dados de `03-modelo-de-dados.md` vira schema real (banco relacional + índices). As entidades core (`Customer`, `Event`, `Activity`, `Task`) são desenhadas desde já pensando em serem reutilizadas pelos módulos da Fase 5 — não hardcoded para "suporte".

## Fase 2 — AI Core

```text
Agent runtime real · Tools (function calling) · Policies (engine de avaliação) ·
Knowledge retrieval (RAG real) · Execução de IA · Human approval · Audit · Evaluation
```

Aqui o `AgentRunTrace` do protótipo deixa de ser mock e passa a refletir execução real de um agente (LLM + tools + RAG). A UI já foi validada na Fase 0 — o trabalho de engenharia é conectar dados reais na mesma estrutura visual.

## Fase 3 — Integrations

```text
Email · Slack · WhatsApp · CRM · Stripe · Webhooks · REST API pública
```

O catálogo de `Integration` de `04-mock-data-acme-cloud.md` §14 vira o roadmap real de conectores.

## Fase 4 — Platform

```text
Multi-tenancy real · RBAC real (enforcement, não só UI) · SSO · Billing real ·
Usage metering · Security · Audit · Observability
```

O RBAC descrito em `07-papeis-e-permissoes.md` (hoje só visual) vira enforcement real em cada endpoint/query.

## Fase 5 — Sales Operations (segundo módulo)

```text
Leads · Accounts · Deals · Pipeline · Sales Agent · Revenue Analytics
```

Só se inicia depois da Fase 1–4 estarem sólidas, porque Sales Operations deve **reutilizar** Customer, Event, Task, Agent, Workflow, Knowledge — não duplicar. O teste de arquitetura: se ao construir Sales Operations você precisar duplicar o conceito de "Customer", o core da Fase 1 foi mal desenhado.

## O que muda de fato entre protótipo e produto real

| Aspecto | Protótipo (agora) | Produto real (depois) |
|---|---|---|
| Dados | Estáticos, em memória (`data/mock/*.ts`) | Banco de dados real, API, cache |
| Auth | Fake (qualquer submit entra) | Auth real, sessões, SSO |
| IA | Respostas pré-scriptadas, delays artificiais | LLM real, function calling, RAG |
| Workflows | Canvas navegável, execução simulada | Engine de execução real, filas, retries |
| RBAC | Visual (esconde/mostra elementos) | Enforcement real em toda query/mutação |
| Multi-tenancy | 1 workspace fake + switcher decorativo | Isolamento real de dados por tenant |
| Componentes de UI | Reaproveitáveis quase 1:1 | Mesma base, com dados reais plugados |
| Modelo de dados (`03-modelo-de-dados.md`) | Tipos TypeScript de referência | Vira schema de banco + contratos de API |

## Por que vale a pena fazer o protótipo antes

- Errar em UX/IA custa uma tarde de edição de documento ou componente; errar em modelo de dados depois de produção custa migração.
- O protótipo é o espaço para "brincar" com a ideia (testar se Customer Operations como módulo realmente comunica a visão de plataforma, testar se o Operations Graph faz sentido visualmente) antes de comprometer engenharia de backend, IA real e infraestrutura.
- Estes documentos (`00` a `07`) são o blueprint que a Fase 1 em diante vai seguir — o protótipo não é descartado como pensamento, só como código de UI descartável quando necessário.
