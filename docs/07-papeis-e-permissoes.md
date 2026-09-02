# Papéis e Permissões (RBAC do protótipo)

Este RBAC é simplificado para fins de UI/UX — não há enforcement real de segurança (é um protótipo estático), mas a UI deve **se comportar como se houvesse**, escondendo/desabilitando elementos conforme o papel do usuário logado.

## 1. Roles

```text
Owner     acesso total, inclusive Admin Console e Billing
Admin     acesso total à operação + Admin Console, exceto Billing/danger zone
Manager   acesso à operação do seu(s) time(s) + aprovações + configurações do módulo (não Admin, não Settings de plataforma)
Agent     acesso à operação do dia a dia (Inbox, Tickets, Customers, Knowledge leitura) — sem Settings/Admin
Viewer    apenas leitura (Analytics, Customers, Tickets) — sem ações de escrita
```

## 2. Usuário logado padrão no protótipo

`usr_edivan` (Edivan) com role `Owner` — garante acesso a todas as telas por padrão, incluindo Admin. Isso evita ter que implementar troca de sessão para navegar o protótipo inteiro.

Opcional (não obrigatório para v1): um seletor de "Preview as role" nas configurações do protótipo (não do produto) que re-renderiza o sidebar/telas ocultando itens conforme o role selecionado — útil para validar a experiência de outros papéis sem precisar de múltiplos logins. Se implementado, deixar claro que é uma ferramenta de debug do protótipo, não uma feature do produto.

## 3. Visibilidade por role (sidebar e ações)

```text
                    Owner  Admin  Manager  Agent  Viewer
Overview             ✓      ✓       ✓       ✓      ✓
Inbox / Tickets       ✓      ✓       ✓       ✓      view-only
Customers               ✓      ✓       ✓       ✓      view-only
AI (Agents/Copilot)       ✓      ✓       view     view   view
AI Agent Builder            ✓      ✓       —        —      —
Automation (Workflows)        ✓      ✓       view     —      —
Workflow Builder                 ✓      ✓       —        —      —
Knowledge                          ✓      ✓       ✓        ✓      view-only
Analytics / Quality                  ✓      ✓       ✓ (seu time) view-only view-only
Settings                               ✓      ✓       ✗ (parcial*) ✗      ✗
Admin                                    ✓      ✓       ✗        ✗      ✗
Billing (dentro de Settings)               ✓      ✗       ✗        ✗      ✗
```

`*` Manager tem acesso a algumas seções operacionais de Settings (SLA, Assignment, Priorities/Statuses/Tags do seu módulo), não à seção de plataforma (Security, AI Guardrails, Billing).

## 4. Ações restritas por Policy (nível de dado, não de tela)

Diferente do RBAC de usuário, as `Policy`/`PolicyRule` (ver `03-modelo-de-dados.md`) restringem o que os **Agentes de IA** podem executar, independente do usuário humano logado:

```text
amount <= €50            → ai_can_execute (sem aprovação humana)
€50 < amount <= €200      → human_approval (qualquer usuário com permissão de aprovação, tipicamente Manager+)
amount > €200              → finance_approval (papel específico — placeholder para quando Finance Operations existir)
fraud_suspected             → never_execute (bloqueado independente de quem aprove)
```

Essa distinção é importante para a narrativa do produto: **RBAC controla o que humanos podem fazer na UI; Policies controlam o que os agentes de IA podem fazer nos dados.** São dois sistemas de governança complementares.

## 5. Aplicação na UI

- Itens de navegação sem permissão: **ocultar**, não apenas desabilitar (reduz ruído visual).
- Botões de ação sem permissão (ex.: `Agent` tentando editar uma `Policy`): **ocultar** o botão, não mostrar erro.
- Aprovações pendentes (`Approval`) só mostram os botões `Approve`/`Reject` para roles com permissão de aprovação (`Manager`, `Admin`, `Owner`); `Agent`/`Viewer` veem a solicitação em modo somente leitura.
