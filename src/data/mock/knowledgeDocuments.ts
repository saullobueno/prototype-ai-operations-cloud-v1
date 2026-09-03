import type { KnowledgeDocument } from "@/types";
import { daysAgo } from "@/lib/time";

export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "doc_refund_exceptions",
    sourceId: "ks_refund_policy",
    title: "Exceções da Política de Reembolso",
    content:
      "# Exceções da Política de Reembolso\n\nA maioria das solicitações de reembolso segue a política padrão: valores abaixo de €50 são aprovados automaticamente, valores entre €50 e €200 exigem aprovação do gestor, e valores acima de €200 exigem aprovação do Financeiro.\n\nCasos excepcionais (indisponibilidade do serviço, cobranças duplicadas, erros de cobrança comprovados) podem qualificar para tratamento expedito mesmo acima dos limites padrão — sempre escale com o contexto completo para que um humano possa aplicar julgamento.",
    status: "ready",
    confidence: 88,
    updatedAt: daysAgo(3),
    collection: "Billing",
    published: true,
  },
  {
    id: "doc_webhook_signing",
    sourceId: "ks_product_docs",
    title: "Guia de Validação de Assinatura de Webhook",
    content: "# Validação de Assinatura de Webhook\n\nCada payload de webhook é assinado usando HMAC-SHA256. Valide o header `X-ACME-Signature` contra o corpo bruto da requisição usando seu segredo de assinatura de webhook antes de processar o payload.",
    status: "ready",
    confidence: 95,
    updatedAt: daysAgo(10),
    collection: "API",
    published: true,
  },
  {
    id: "doc_sso_setup",
    sourceId: "ks_product_docs",
    title: "Configurando o Mapeamento de Domínio do SSO",
    content: "# Configurando o SSO\n\nQuando um workspace muda seu domínio principal, o mapeamento do provedor de identidade do SSO precisa ser atualizado manualmente por um admin antes que usuários do novo domínio consigam autenticar.",
    status: "outdated",
    confidence: 61,
    updatedAt: daysAgo(120),
    collection: "Onboarding",
    published: true,
  },
  {
    id: "doc_password_reset",
    sourceId: "ks_website",
    title: "Redefinindo sua Senha",
    content: "# Redefinindo sua Senha\n\nOs links de redefinição são válidos por 30 minutos. Se um link expirar, solicite um novo na tela de login.",
    status: "ready",
    confidence: 97,
    updatedAt: daysAgo(45),
    collection: "Onboarding",
    published: true,
  },
  {
    id: "doc_data_export",
    sourceId: "ks_internal_procedures",
    title: "Processo de Exportação de Dados para Compliance",
    content: "# Exportação de Dados para Compliance\n\nExportações completas do workspace para auditorias de compliance são disparadas pela ferramenta `trigger_export` e normalmente são concluídas em algumas horas. Um link de download seguro e com expiração é gerado automaticamente.",
    status: "ready",
    confidence: 90,
    updatedAt: daysAgo(15),
    collection: "Compliance",
    published: true,
  },
  {
    id: "doc_rate_limits",
    sourceId: "ks_api_reference",
    title: "Limites de Taxa da API",
    content: "# Limites de Taxa da API\n\nEndpoints em lote são limitados a 100 requisições/minuto por workspace. Requisições que excedem o limite recebem uma resposta 429 com um header `Retry-After`.",
    status: "processing",
    confidence: 40,
    updatedAt: daysAgo(1),
    collection: "API",
    published: false,
  },
  {
    id: "doc_billing_vs_enterprise",
    sourceId: "ks_refund_policy",
    title: "Tratando Cobrança em Downgrade de Assinatura",
    content: "# Cobrança em Downgrade de Assinatura\n\nQuando um cliente faz downgrade no meio do ciclo, a mudança de preço deve valer a partir do próximo ciclo de cobrança. Se um cliente for cobrado no preço antigo após o downgrade, emita um crédito proporcional.",
    status: "conflict",
    confidence: 52,
    updatedAt: daysAgo(60),
    collection: "Billing",
    published: false,
  },
  {
    id: "doc_account_lockout",
    sourceId: "ks_internal_procedures",
    title: "Bloqueio de Conta e Verificação de Identidade",
    content: "# Bloqueio de Conta\n\nContas são bloqueadas após 5 tentativas de login malsucedidas. O desbloqueio exige verificação de identidade, que não é delegada a agentes de IA — sempre roteie para um agente humano.",
    status: "ready",
    confidence: 92,
    updatedAt: daysAgo(30),
    collection: "Segurança",
    published: true,
  },
];

// Persistência simplificada: grava de volta neste array compartilhado para que artigos
// criados a partir de um gap de IA (Analytics, Knowledge Readiness, Ask Operations AI)
// sobrevivam à navegação dentro da sessão — não sobrevive a um reload.
// Ver docs/06-fluxos-e-ai-moments.md.
export function addKnowledgeDocument(doc: KnowledgeDocument) {
  knowledgeDocuments.push(doc);
}
