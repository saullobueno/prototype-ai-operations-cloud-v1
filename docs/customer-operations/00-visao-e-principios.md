# Visão e Princípios

## 1. O que é o AI Operations Cloud

> **AI Operations Cloud is the intelligent operating system for business operations.**

Uma plataforma operacional modular que conecta pessoas, clientes, dados, agentes de IA, automações e sistemas empresariais em uma única camada. O primeiro módulo é **Customer Operations**, mas o core (Customers, Events, Activities, Workflows, Agents, Knowledge, Policies, Analytics) é compartilhado por todos os módulos futuros (Sales, Finance, Business Operations).

Não é "helpdesk com IA". É uma plataforma onde **humanos, agentes de IA e automações trabalham juntos** sobre o mesmo grafo de dados operacionais — o **Operations Graph**.

## 2. Por que não é apenas um Customer Service SaaS

- O mercado está migrando de "IA que responde" para **IA que executa ações dentro de workflows**, com governança e supervisão humana (ver contexto de mercado: pressão por adoção de IA em Customer Service, mas exigência simultânea de acesso a humanos).
- Players como Intercom já evoluem de "chatbot" para "Customer Agent" — combinando Service, Sales, workflows e execução.
- O diferencial estratégico do AI Operations Cloud não pode ser "tem IA". Tem que ser: **camada operacional unificada + Operations Graph + agentes governados por policies/tools + colaboração humano-IA + expansão horizontal para outros domínios de negócio.**

## 3. Modelo mental correto

Errado: "Vou fazer um sistema de atendimento."

Certo: "Vou criar uma plataforma operacional onde uma empresa observa, decide e executa processos através de humanos, IA e automações."

A plataforma tem três tipos de **workers**:

| Tipo | Descrição |
|---|---|
| **Human** | Pessoa da empresa (agente humano, gestor, aprovador) |
| **AI Agent** | Agente autônomo que raciocina, consulta dados e executa ferramentas (tools) |
| **Automation** | Processo determinístico, sem raciocínio (workflow/regra) |

## 4. Os quatro layers da plataforma

```text
Layer 1 — Experience         → Dashboard, Inbox, Customers, Tickets, Analytics, Agents, Workflows, Knowledge
Layer 2 — Operations Core    → conversations, tickets, customers, tasks, events, activities, workflows, SLAs, approvals
Layer 3 — Intelligence       → AI Agents, LLMs, RAG, classificação, sentimento, intenção, decisão
Layer 4 — Integration/Data   → REST APIs, webhooks, email, WhatsApp, Slack, CRM, ERP, pagamentos, storage
```

Essa separação importa porque é ela que permite adicionar Sales Operations, Finance Operations etc. no futuro **sem reconstruir a plataforma**.

## 5. Princípios de design de produto

1. **Customer Operations é um módulo, não o produto inteiro.** Toda decisão de IA (nomenclatura de rotas, componentes, entidades) deve evitar acoplar conceitos de "suporte" ao core.
2. **Platform Core vs. Modules.** Objetos como Customer, Event, Activity, Task, Agent, Workflow, Knowledge, Policy, Integration, Analytics, Audit pertencem ao core e serão reutilizados por todos os módulos futuros.
3. **Human + AI, nunca "AI replaces humans".** Toda ação de agente tem um nível de autonomia visível: `Autonomous` / `Assisted` / `Human approval` / `Human only`.
4. **Agentes não têm acesso mágico.** Um Agent só age através de `Tools` explícitas, restringidas por `Policies`, com `Knowledge` delimitado.
5. **Tudo é observável.** Toda execução de agente e todo workflow run devem ser auditáveis passo a passo (ver `AgentRun`, `WorkflowRun` em `03-modelo-de-dados.md`).
6. **Event-driven por padrão.** O sistema pensa em eventos (`customer.created`, `payment.failed`, `ticket.resolved`) que disparam workflows, que acionam agentes, que executam tools, que geram novos eventos.
7. **Visual enterprise, não "IA genérica".** Evitar gradientes roxos, robôs, chat gigante, excesso de estrelas. Referência: Linear, Vercel, Stripe, Intercom, Datadog, Ramp, Notion — controle room + SaaS + intelligence layer.
8. **Navegação rasa.** Preferir `Sidebar → página → tabs` a `Sidebar → submenu → submenu → modal → página`.
9. **Dados mock realistas, nunca genéricos.** Nada de "John Doe / test@example.com / lorem ipsum". Usar a empresa fictícia ACME Cloud com relacionamentos reais entre entidades (ver `04-mock-data-acme-cloud.md`).

## 6. O que este protótipo É

- UI real, navegação real, componentes reais, estados reais (loading/empty/error/success), dados mock estáticos, interações simuladas (fake async) que parecem reais.
- Uma ferramenta de **exploração e validação de UX/IA/conceito** antes de comprometer engenharia real.
- A fonte de verdade para o **blueprint** do produto real (modelo de dados, arquitetura de informação, fluxos).

## 7. O que este protótipo NÃO é

Não implementa (por design, nesta fase):

- Autenticação e multi-tenancy reais
- Banco de dados real / persistência
- Pagamentos reais
- WhatsApp/canais reais
- LLM real (OpenAI/Anthropic) executando de fato
- Vector database / RAG real
- WebSockets / realtime real
- Execução real de workflows
- Billing real

Toda essa lógica é **simulada com dados estáticos e transições de estado fake** (ex.: um botão "Resolve with AI" mostra uma sequência de steps com delays artificiais, não uma chamada de IA real).

## 8. "AI Moments" — por que importam

O protótipo precisa de pelo menos duas interações memoráveis que demonstrem o conceito inteiro em poucos segundos:

1. **Resolve with AI** (dentro do Inbox/Conversation) — o agente analisa, decide e executa uma ação (ex.: reembolso), com trace visível.
2. **Ask Operations AI** (dentro do Overview) — pergunta em linguagem natural sobre a operação, resposta estruturada com causas e ações recomendadas.

Detalhes completos em `06-fluxos-e-ai-moments.md`.

## 9. Posicionamento

- **Não é:** AI Customer Support / AI Chatbot / Helpdesk with AI.
- **É:** **AI Operations Cloud** — *"Run your business with AI, automation, and people working together."* / *"One operational layer for every customer, workflow, agent, and decision."*
