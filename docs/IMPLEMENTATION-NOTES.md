# Implementation Notes — Full Platform Build

Registra decisões tomadas ao implementar `AI_OPERATIONS_CLOUD_COMPLETE_SPEC.md` (fonte de verdade única a partir de 2026-09-08, substituindo os docs granulares antigos arquivados em `docs/customer-operations/`) sempre que o protótipo já existente divergiu da especificação ou que a especificação deixou uma decisão em aberto.

## Convenções mantidas do protótipo existente (não a estrutura sugerida na §25/§30 da spec)

- Rotas continuam em `src/app/(app)/modules/<domínio>/...` (não `/app/<domínio>/...` como no Screen Inventory §24). Sales Operations já usava esse prefixo antes da spec unificada existir; manter consistência entre os 5 módulos importa mais do que casar 1:1 com a árvore de rotas ilustrativa da spec.
- Não foi criada a árvore `src/modules/` sugerida na §30. A organização real do projeto é `src/app/(app)/modules/<domínio>` (rotas) + `src/features/<domínio>` (componentes) + `src/data/mock/<entidade>.ts` (dados, arquivos flat, um por entidade) + `src/types/index.ts` (tipos, arquivo único). Cada novo módulo segue exatamente esse padrão, igual ao Sales Operations.
- Cada módulo tem seu próprio `*-nav-config.ts` + `layout.tsx` com `SecondarySidebarLayout`, replicando `sales-nav-config.ts`/`modules/sales/layout.tsx`.

## Modelo de dados — decisões

- **Sales Operations não ganhou um `Opportunity` separado.** A spec lista `Opportunity` como estágio entre Lead e Deal (§8), mas o módulo Sales já implementado usa `Deal` com `probability`/`stageId` cobrindo esse papel. Duplicar como uma nova entidade só para bater com a spec violaria o próprio critério de arquitetura do projeto (não duplicar conceito já coberto). Mantido como está.
- **`Vendor` é uma entidade core compartilhada** (`src/types/index.ts`, seção Customer domain) usada tanto por Business Operations (processo de Vendor Onboarding) quanto por Finance Operations (Payables). `src/data/mock/vendors.ts` é o dataset único — os 6 primeiros vendors representam o caminho feliz (nasceram de um `ProcessRun` de Vendor Onboarding concluído e já aparecem em Finance), os 2 seguintes estão `pending_approval` (aprovação ainda rodando em Business), demonstrando o grafo cross-módulo exigido na §21 da spec.
- **`Employee` (RH) é distinto de `User`** (conta/seat da plataforma) — um Employee pode ou não ter um User vinculado. Evita conflar "quem loga no produto" com "quem é funcionário da empresa fictícia".
- `Approval.type`, `Approval.status` e `Task.relatedType` foram estendidos para cobrir os novos módulos (vendor_onboarding, bill_payment, expense, time_off, hiring, process_exception / expired, cancelled / process, invoice, vendor, employee, candidate) — `Approval` e `Task` continuam sendo a mesma entidade core reusada por todos os módulos, não haverá `FinanceApproval`/`PeopleApproval` separados.
- `ModuleKey` ganhou `"business_operations" | "finance_operations" | "people_operations"`.

## Command Center

- A spec pede uma home cross-domain separada da Customer Operations Overview. Em vez de criar uma rota nova, `/overview` (já era genérica o bastante — KPIs, AI Operations Brief, atividade recente) foi evoluída in-place para incluir Module Health + Attention Center cross-módulo, evitando duas telas concorrentes de "home".

## Status

Business Operations, Finance Operations e People Operations foram implementados como módulos reais (não mais "coming soon"), seguindo o mesmo padrão do Sales Operations: doc-spec único (`AI_OPERATIONS_CLOUD_COMPLETE_SPEC.md`) → tipos em `src/types/index.ts` → dados mock relacionais → nav config + layout próprio → páginas. Os arrays mock por módulo (`Agent`, `Workflow`, `Policy`, `Approval`, `Task`, `AuditLog`) foram mesclados por referência nos arquivos compartilhados (`src/data/mock/{agents,workflows,policies,approvals,tasks,auditLogs}.ts` exportam `core<X> + módulo1<X> + módulo2<X> + ...`, então decidir uma aprovação no array local de um módulo também atualiza o array compartilhado usado pelo Admin/Command Center). `/overview` virou o Command Center real, com saúde por módulo e um "AI Operations Brief" com itens reais entre módulos (pipeline em risco, faturas vencidas, onboarding atrasado, aprovação de fornecedor pendente).

`npx tsc --noEmit` e `npm run build` passam limpos (104 rotas, build de produção completo) na versão final.

## Sidebar unificada + breadcrumbs (2026-09-08)

A sidebar deixou de ser "nav global fixo + secondary sidebar própria por módulo" (`SecondarySidebarLayout`, usado antes só por Sales) e virou uma única sidebar com accordion por módulo, reaproveitando os `*-nav-config.ts` de cada módulo (`business-nav-config.ts`, `finance-nav-config.ts`, `people-nav-config.ts`, `sales-nav-config.ts`) como fonte dos itens dentro de cada accordion — não foram reescritos, só passaram a ser consumidos por `nav-config.ts`/`sidebar-nav.tsx` em vez de por `SecondarySidebarLayout`. `SecondarySidebarLayout` continua existindo e em uso — Admin e Settings ainda são secondary sidebars próprias (não são "módulos operacionais", são áreas de configuração).

Estrutura nova: Command Center (pinned) → **Operations** (5 módulos, accordion, um aberto por vez) → **Intelligence** (AI Workforce, Automação, Conhecimento, Analytics) → **Platform** (Tarefas, Aprovações, Atividade, Eventos, Políticas, Integrações). Badges nos itens mais urgentes de cada módulo (Inbox, Tickets, Tasks, Approvals, Exceptions, Overdue, Onboarding atrasado, Deals em risco) são calculados a partir dos dados mock reais, mesma lógica do Command Center.

Três páginas novas para a seção Platform não terem link morto: `/approvals` (lista cross-módulo, reaproveita `decideApproval` já centralizado), `/policies`, `/events` — todas leves, reaproveitando componentes e dados já existentes.

Breadcrumbs são globais e automáticos (`src/components/layout/breadcrumbs.tsx`, montado uma vez em `AppShell`, não em cada página) — a trilha é derivada da mesma árvore de navegação que alimenta a sidebar, então nunca diverge do menu. O último segmento dinâmico (ID de entidade) é resolvido para o nome real via um pequeno registro de resolvers (`ENTITY_RESOLVERS`) cobrindo as telas de detalhe principais; o que não está coberto cai num fallback humanizado do segmento da URL.

Customer Operations não tem uma Overview própria distinta do Command Center — o item "Overview" do seu accordion aponta para a mesma `/overview`, de propósito (não existe hoje uma tela de overview só do Customer Ops separada da home cross-módulo).

## O que não foi implementado (fora do escopo do protótipo, por design)

Conforme §3/§31 da spec: sem autenticação real, sem chamadas a LLM reais, sem pagamentos/transações financeiras reais, sem decisões de RH reais, sem integrações externas reais. Tudo é dado mock estático + interação simulada, igual ao restante do protótipo.
