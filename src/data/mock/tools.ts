import type { Tool } from "@/types";

export const tools: Tool[] = [
  { id: "tool_search_customer", key: "search_customer", name: "Buscar cliente", description: "Consulta o registro de um cliente por nome, e-mail ou ID.", riskLevel: "low" },
  { id: "tool_get_order", key: "get_order", name: "Consultar pedido", description: "Recupera os detalhes de pedido de um cliente.", riskLevel: "low" },
  { id: "tool_get_payment", key: "get_payment", name: "Consultar pagamento", description: "Recupera status e histórico de pagamento.", riskLevel: "low" },
  { id: "tool_create_ticket", key: "create_ticket", name: "Criar ticket", description: "Abre um novo ticket de suporte.", riskLevel: "low" },
  { id: "tool_send_email", key: "send_email", name: "Enviar e-mail", description: "Envia um e-mail para o cliente.", riskLevel: "medium" },
  { id: "tool_send_message", key: "send_message", name: "Enviar mensagem", description: "Responde dentro da conversa atual.", riskLevel: "low" },
  { id: "tool_issue_refund", key: "issue_refund", name: "Emitir reembolso", description: "Emite um reembolso sobre um pagamento.", riskLevel: "high" },
  { id: "tool_update_subscription", key: "update_subscription", name: "Atualizar assinatura", description: "Altera o plano ou assinatura de um cliente.", riskLevel: "high" },
  { id: "tool_delete_account", key: "delete_account", name: "Excluir conta", description: "Exclui permanentemente a conta de um cliente.", riskLevel: "high" },
  { id: "tool_update_knowledge", key: "update_knowledge", name: "Atualizar conhecimento", description: "Cria ou edita um documento da base de conhecimento.", riskLevel: "medium" },
  { id: "tool_trigger_export", key: "trigger_export", name: "Disparar exportação de dados", description: "Inicia um job de exportação de dados para um cliente.", riskLevel: "medium" },

  // ---------- Sales Operations ----------
  { id: "tool_enrich_company", key: "enrich_company", name: "Enriquecer empresa", description: "Busca dados públicos (porte, setor, receita estimada) para enriquecer um Account.", riskLevel: "low", module: "sales_operations" },
  { id: "tool_calculate_lead_score", key: "calculate_lead_score", name: "Calcular lead score", description: "Calcula o score de um lead com base em fit de ICP, cargo e engajamento.", riskLevel: "low", module: "sales_operations" },
  { id: "tool_analyze_interaction", key: "analyze_interaction", name: "Analisar interação", description: "Analisa sentimento, intenção e engajamento de um e-mail, reunião ou call.", riskLevel: "low", module: "sales_operations" },
  { id: "tool_detect_deal_risk", key: "detect_deal_risk", name: "Detectar risco de deal", description: "Avalia sinais de um deal e retorna nível de risco, razões e ação recomendada.", riskLevel: "medium", module: "sales_operations" },
  { id: "tool_predict_close_probability", key: "predict_close_probability", name: "Prever probabilidade de fechamento", description: "Estima a probabilidade de fechamento de um deal com base no histórico e nos sinais.", riskLevel: "low", module: "sales_operations" },
  { id: "tool_generate_proposal", key: "generate_proposal", name: "Gerar proposta", description: "Gera uma proposta comercial em rascunho a partir dos dados do deal.", riskLevel: "medium", module: "sales_operations" },
  { id: "tool_draft_follow_up", key: "draft_follow_up", name: "Redigir follow-up", description: "Redige um e-mail de follow-up personalizado para um contato ou deal.", riskLevel: "low", module: "sales_operations" },
];
