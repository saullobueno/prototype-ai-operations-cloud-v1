# AI Operations Cloud — Documentação do Protótipo

Este diretório contém o **blueprint completo** do protótipo visual do AI Operations Cloud. Não é uma documentação de produto final — é a especificação usada para **desenhar, testar e moldar** a plataforma antes de construir o produto real.

## Sobre o termo "protótipo"

Vale esclarecer a dúvida que motivou este pacote de documentos: aqui, "protótipo" significa **protótipo de produto de alta fidelidade** (product design prototype / UX blueprint), não um rascunho descartável.

- O **código** deste protótipo é feito para ser jogável e navegável (rotas reais, estado real, dados mock), mas **não** é a base de engenharia do produto real — ele não tem backend, autenticação real, banco de dados, filas de eventos, execução de IA de verdade, etc. Parte do código de UI (design system, componentes de domínio) pode ser reaproveitada; a camada de dados e infraestrutura será refeita do zero.
- A **documentação** (estes arquivos) é o ativo que sobrevive. É ela que vira a especificação funcional e o modelo de domínio do produto real. Por isso o processo é: prototipar em UI → validar navegação/UX/conceito → extrair blueprint → construir produto real usando este blueprint como fundação, não como código herdado.

Em outras palavras: **o protótipo é descartável como software, mas o pensamento nele fica registrado e evolui para a especificação do produto real.**

## Como os documentos se relacionam

```text
00-visao-e-principios.md          → por que o produto existe, filosofia, o que é/não é o protótipo
01-arquitetura-da-informacao.md   → sidebar, header, command palette, mapa de rotas
02-design-system.md               → tokens visuais, componentes de UI e de domínio, estados
03-modelo-de-dados.md             → entidades, relacionamentos, Operations Graph, tipos TypeScript
04-mock-data-acme-cloud.md        → dataset fictício (empresa ACME Cloud) usado em todas as telas
05-telas/                         → especificação tela a tela, por área do produto
06-fluxos-e-ai-moments.md         → jornadas de navegação e os momentos-chave de demonstração de IA
07-papeis-e-permissoes.md         → RBAC do protótipo (roles, permissions, visibilidade)
08-roadmap-prototipo-para-produto.md → como isso evolui para o produto real, fase a fase
PROMPT-CONSTRUCAO-PROTOTIPO.md    → prompt pronto para dar a uma IA (Claude Code) construir as telas
```

## Ordem de leitura recomendada

1. `00-visao-e-principios.md`
2. `01-arquitetura-da-informacao.md`
3. `03-modelo-de-dados.md`
4. `02-design-system.md`
5. `04-mock-data-acme-cloud.md`
6. `05-telas/*`
7. `06-fluxos-e-ai-moments.md`
8. `07-papeis-e-permissoes.md`
9. `08-roadmap-prototipo-para-produto.md`
10. `PROMPT-CONSTRUCAO-PROTOTIPO.md` — usar este por último, como prompt de execução

## Escopo deste protótipo (v1)

Módulo ativo: **Customer Operations**. Os demais módulos (Sales, Finance, Business Operations) aparecem na navegação como "Coming soon" — isso é proposital: a IA (arquitetura de informação) já nasce preparada para eles, mesmo sem serem construídos agora.

Empresa fictícia usada em todo o mock data: **ACME Cloud** (ver `04-mock-data-acme-cloud.md`).
