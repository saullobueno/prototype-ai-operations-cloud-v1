# Prompt de Construção do Protótipo

Este documento é para ser usado como **prompt de execução** (colar em Claude Code ou ferramenta equivalente) para construir o protótipo visual do AI Operations Cloud a partir da documentação em `/docs`. Pode ser usado inteiro de uma vez ou dividido por fase (ver seção 8 "Ordem de implementação sugerida").

---

## PROMPT

Você vai construir um **protótipo visual navegável de alta fidelidade** do produto **AI Operations Cloud**, uma plataforma operacional modular de Customer Operations com IA (o primeiro de vários módulos futuros: Sales, Finance, Business Operations).

Este é um protótipo de produto, não um MVP de engenharia: **não** há backend real, banco de dados real, autenticação real, LLM real ou integrações reais. Tudo deve ser construído com **dados mock estáticos** e **interações simuladas** (fake async com delays artificiais), mas a UI, a navegação, as rotas e os componentes devem ser **reais e de produção**, como se a API já existisse por trás.

Toda a especificação de produto está em `/docs`. Leia e siga rigorosamente, nesta ordem, antes de escrever qualquer código:

1. `docs/00-visao-e-principios.md` — visão do produto e princípios de design que devem guiar TODAS as decisões (filosofia Human+AI, Platform Core vs. Modules, visual enterprise não-genérico de IA).
2. `docs/01-arquitetura-da-informacao.md` — sidebar completo, header, command palette, mapa de rotas exato a implementar.
3. `docs/03-modelo-de-dados.md` — entidades e tipos TypeScript de referência. Use esses tipos como base dos tipos do projeto.
4. `docs/02-design-system.md` — tokens, componentes de UI e de domínio, estados obrigatórios (loading/empty/error/success), regras de modal vs. drawer.
5. `docs/04-mock-data-acme-cloud.md` — o dataset fictício (empresa ACME Cloud) a usar em TODAS as telas. Use os mesmos IDs deste documento.
6. `docs/05-telas/*.md` — especificação tela a tela (rota, layout, componentes, dados, estados, interações). Esta é a fonte de verdade para cada tela individual.
7. `docs/06-fluxos-e-ai-moments.md` — os dois "AI Moments" (Resolve with AI, Ask Operations AI) e os fluxos de navegação — implemente-os com fidelidade, são o coração da demonstração do produto.
8. `docs/07-papeis-e-permissoes.md` — RBAC visual (esconder/mostrar elementos conforme role do usuário logado).

### 1. Stack técnica

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** para estilos, com tokens de `docs/02-design-system.md` mapeados em `tailwind.config`
- **shadcn/ui** (ou equivalente Radix-based) como base para os componentes de UI genéricos listados em `docs/02-design-system.md` §3
- Estado de UI local com React state/context — **sem** backend, sem React Query real (pode simular latência com `setTimeout`/`Promise` para dar sensação de app real)
- Ícones: `lucide-react`
- Gráficos: seguir a skill `dataviz` para paleta e padrões (chame a skill antes de implementar qualquer gráfico)
- Dark mode via `next-themes` ou equivalente, tokens com par light/dark desde o início

### 2. Estrutura de pastas

Siga exatamente esta organização (já definida para refletir a separação Platform Core vs. Modules, importante para a extensibilidade futura):

```text
src/
├── app/                        ← rotas (App Router), conforme docs/01-arquitetura-da-informacao.md §6
├── components/
│   ├── ui/                     ← componentes genéricos (Button, Input, Table, Modal, Drawer...)
│   ├── layout/                 ← AppShell, Header, Sidebar, PageContainer
│   ├── navigation/              ← CommandPalette, WorkspaceSwitcher, Breadcrumbs
│   └── charts/                  ← wrappers de gráfico (seguindo skill dataviz)
├── features/                     ← componentes de domínio por área
│   ├── customers/
│   ├── conversations/
│   ├── tickets/
│   ├── knowledge/
│   ├── agents/
│   ├── workflows/
│   ├── analytics/
│   └── settings/
├── modules/
│   └── customer-operations/       ← composição das features acima na experiência do módulo
├── core/
│   ├── auth/                        ← fake auth (login sempre sucede)
│   ├── workspace/                     ← workspace switcher, contexto de workspace ativo
│   ├── permissions/                     ← RBAC visual (docs/07)
│   ├── events/                            ← tipos e helpers do catálogo de eventos (docs/03 §6)
│   └── activity/                            ← helpers de Activity/Timeline
├── data/
│   └── mock/                                  ← conforme docs/04-mock-data-acme-cloud.md §16
├── lib/                                          ← utils (formatação de data, moeda, etc.)
└── types/                                          ← tipos TS derivados de docs/03-modelo-de-dados.md
```

Regra arquitetural crítica: **nenhuma entidade core (`Customer`, `Event`, `Activity`, `Task`, `Agent`, `Workflow`, `Knowledge`, `Policy`) deve viver dentro de `modules/customer-operations/`.** Elas vivem em `core/`, `types/` e `data/mock/` na raiz, exatamente para que módulos futuros (Sales, Finance) possam reutilizá-las sem refatoração. `modules/customer-operations/` apenas compõe e organiza a navegação específica do módulo.

### 3. O que construir, na ordem de `docs/05-telas/`

Implemente todas as telas descritas em:

- `docs/05-telas/00-core.md` — Login, Workspace Selection, Overview, Module Coming Soon
- `docs/05-telas/01-customer-operations.md` — Inbox, Customers, Customer 360, Tickets, Ticket Detail
- `docs/05-telas/02-knowledge.md` — Knowledge (hub), Knowledge Document
- `docs/05-telas/03-ai-agents.md` — AI Workforce, Agent Detail, Agent Builder, Agent Run, AI Activity, Evaluations, Copilot
- `docs/05-telas/04-automation-workflows.md` — Workflows, Workflow Builder (canvas), Workflow Runs, Workflow Run Detail, Templates
- `docs/05-telas/05-analytics-quality.md` — Analytics, AI Performance, Quality
- `docs/05-telas/06-platform-settings-admin.md` — Integrations, Settings (todas as seções), Admin Console

Para cada tela: implemente exatamente o layout, os componentes e os 4 estados (loading/empty/error/success conforme aplicável) descritos na spec correspondente. Não invente campos ou seções fora do que está documentado — se algo parecer faltando, prefira seguir o padrão já estabelecido em telas semelhantes (ex.: uma nova tab de detalhe deve seguir o mesmo padrão visual das tabs já especificadas) a inventar um conceito novo.

### 4. Mock data

Gere os arquivos de `data/mock/` conforme `docs/04-mock-data-acme-cloud.md`, usando os mesmos IDs (`cus_001`, `conv_1842`, `agent_billing`, etc.) para manter rastreabilidade com a documentação. Expanda os exemplos dados (ex.: 10 customers documentados → gere pelo menos 15-20 para dar volume real às listas/tabelas, mantendo os 10 documentados como estão e seguindo o mesmo padrão de nomes/empresas fictícias para os adicionais). Crie funções helper em `data/mock/index.ts` (`getCustomerById`, `getConversationsByCustomer`, `getTicketsByCustomer`, `getActivitiesByCustomer`, etc.) — o Customer 360 e telas relacionadas devem montar seus dados dinamicamente a partir dessas funções, nunca hardcoded por customer específico.

### 5. Os dois AI Moments (prioridade alta)

Implemente com fidelidade total a `docs/06-fluxos-e-ai-moments.md` §2 e §3:

1. **Resolve with AI** — dentro da Conversation (Inbox), sequência de steps com delay progressivo, efeitos colaterais visíveis no estado (status muda, nova activity aparece, novo AgentRun fica acessível).
2. **Ask Operations AI** — painel/drawer acessível pelo botão `◇ AI` no header, com perguntas sugeridas clicáveis e respostas estruturadas com CTAs que navegam para telas reais.

Esses dois momentos são o que mais comunica o conceito do produto — não economize em polish visual e timing aqui.

### 6. Regras de qualidade

- Toda rota listada em `docs/01-arquitetura-da-informacao.md` §6 deve ser navegável e deep-linkável (recarregar a página em qualquer rota deve funcionar, pois os dados vêm de arquivos estáticos importados, não de estado de navegação).
- Responsivo: desktop (prioridade), tablet, mobile — sidebar colapsa para ícone-only ou drawer em telas menores.
- Dark mode funcional em todas as telas desde o início, não como retrofit.
- Siga `docs/02-design-system.md` à risca para evitar visual "genérico de IA" (sem gradientes roxos, sem robôs, sem excesso de sparkles).
- Nenhum texto placeholder tipo "Lorem ipsum" ou "John Doe" — sempre usar o dataset ACME Cloud.
- Command Palette (`⌘K`) funcional desde cedo, buscando sobre o dataset mock inteiro (customers, conversations, tickets, agents, workflows, knowledge).

### 7. O que explicitamente NÃO fazer

- Não implemente autenticação real, banco de dados, chamadas a LLMs reais, RAG real, pagamentos reais ou WebSockets reais (ver `docs/00-visao-e-principios.md` §7).
- Não crie os módulos Sales/Finance/Business Operations além da tela "Coming soon" (`docs/05-telas/00-core.md` §4).
- Não adicione telas, campos ou fluxos que não estejam documentados em `/docs` — se identificar uma lacuna genuína na documentação, sinalize antes de improvisar.

### 8. Ordem de implementação sugerida (para dividir o trabalho em etapas)

```text
Etapa 1 — Fundação
  Estrutura de projeto, design system (tokens + componentes ui/), AppShell (Header + Sidebar),
  roteamento base, data/mock completo, tipos em types/

Etapa 2 — Core
  Login, Workspace Selection, Overview, Command Palette

Etapa 3 — Customer Operations
  Inbox (3 colunas) + AI Moment #1, Customers (lista), Customer 360 (todas as tabs), Tickets, Ticket Detail

Etapa 4 — AI
  AI Workforce, Agent Detail, Agent Builder, Agent Run trace, AI Activity, Evaluations, Copilot + AI Moment #2

Etapa 5 — Automation
  Workflows (lista), Workflow Builder (canvas), Workflow Runs, Templates

Etapa 6 — Knowledge, Analytics, Quality
  Knowledge hub + Document, Analytics (todas as tabs), AI Performance, Quality

Etapa 7 — Platform
  Integrations, Settings (todas as seções), Admin Console, RBAC visual (docs/07), Module Coming Soon (Sales/Finance/Business)

Etapa 8 — Polish
  Dark mode em todas as telas, responsivo, estados de loading/empty/error revisados, timing dos AI Moments refinado
```

Ao final de cada etapa, valide contra a spec correspondente em `docs/05-telas/` antes de avançar para a próxima.

---

## Como usar este prompt

- **De uma vez:** cole o bloco `## PROMPT` inteiro em uma sessão de Claude Code já aberta na raiz deste projeto (onde `/docs` está).
- **Por etapas (recomendado para revisar incrementalmente):** cole o prompt inteiro na primeira mensagem para dar contexto completo, mas peça explicitamente para executar apenas a "Etapa 1" da seção 8; revise o resultado; peça a etapa seguinte na mesma sessão (o contexto do prompt e da documentação já lida se mantém).
