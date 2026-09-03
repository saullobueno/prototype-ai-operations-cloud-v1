import type { AgentRun } from "@/types";
import { hoursAgo, minutesAgo, daysAgo } from "@/lib/time";

// Run canônico — referenciado em docs/04-mock-data-acme-cloud.md §11 e no AI Moment #1.
export const CANONICAL_RUN_ID = "run_84291";

export const agentRuns: AgentRun[] = [
  {
    id: CANONICAL_RUN_ID,
    agentId: "agent_billing",
    conversationId: "conv_1842",
    customerId: "cus_001",
    status: "completed",
    startedAt: hoursAgo(3.95),
    completedAt: hoursAgo(3.9),
    steps: [
      { id: "step_1", label: "Mensagem recebida", type: "message", timestamp: hoursAgo(3.95) },
      { id: "step_2", label: "Cliente consultado", type: "retrieval", detail: '{ "customerId": "cus_001", "plan": "Enterprise", "ltv": "€8.420" }', timestamp: hoursAgo(3.94) },
      { id: "step_3", label: "Pagamento consultado", type: "retrieval", detail: '{ "paymentId": "pay_order_cus_001_0", "status": "failed", "amount": "€42,00" }', timestamp: hoursAgo(3.93) },
      { id: "step_4", label: "Status do pagamento = FALHOU (duplicado)", type: "reasoning", detail: "Detectadas duas cobranças do mesmo valor com 4 minutos de diferença — classificado como cobrança duplicada.", timestamp: hoursAgo(3.92) },
      { id: "step_5", label: "Política de reembolso verificada", type: "decision", detail: 'Política "Política de reembolso": valor €42 <= €50 → ai_can_execute', timestamp: hoursAgo(3.91) },
      { id: "step_6", label: "Resposta gerada", type: "reasoning", timestamp: hoursAgo(3.905) },
      { id: "step_7", label: "Reembolso emitido via issue_refund()", type: "tool_call", detail: '{ "tool": "issue_refund", "amount": "€42,00", "status": "success" }', timestamp: hoursAgo(3.9) },
      { id: "step_8", label: "Resposta enviada", type: "message", timestamp: hoursAgo(3.9) },
    ],
  },
  {
    id: "run_84120",
    agentId: "agent_support",
    conversationId: "conv_1005",
    customerId: "cus_005",
    status: "escalated",
    startedAt: hoursAgo(6),
    completedAt: hoursAgo(5.8),
    steps: [
      { id: "step_1", label: "Mensagem recebida", type: "message", timestamp: hoursAgo(6) },
      { id: "step_2", label: "Cliente consultado", type: "retrieval", timestamp: hoursAgo(5.95) },
      { id: "step_3", label: "Tentativa de verificação de identidade", type: "tool_call", detail: "A verificação exige uma pergunta de segurança que o agente não está autorizado a fazer.", timestamp: hoursAgo(5.9) },
      { id: "step_4", label: "Escalado para humano", type: "decision", detail: "A verificação de identidade para desbloqueio de conta exige um agente humano.", timestamp: hoursAgo(5.8) },
    ],
  },
  {
    id: "run_84055",
    agentId: "agent_billing",
    conversationId: "conv_1015",
    customerId: "cus_015",
    status: "running",
    startedAt: minutesAgo(20),
    steps: [
      { id: "step_1", label: "Mensagem recebida", type: "message", timestamp: minutesAgo(20) },
      { id: "step_2", label: "Cliente consultado", type: "retrieval", timestamp: minutesAgo(19) },
      { id: "step_3", label: "Pagamento consultado", type: "retrieval", detail: '{ "status": "failed", "attempts": 2 }', timestamp: minutesAgo(18) },
      { id: "step_4", label: "Tentando pagamento novamente", type: "tool_call", timestamp: minutesAgo(15) },
    ],
  },
  {
    id: "run_83998",
    agentId: "agent_billing",
    conversationId: "conv_1007",
    customerId: "cus_007",
    status: "escalated",
    startedAt: hoursAgo(2),
    completedAt: minutesAgo(90),
    approvalId: "appr_1",
    steps: [
      { id: "step_1", label: "Mensagem recebida", type: "message", timestamp: hoursAgo(2) },
      { id: "step_2", label: "Cliente consultado", type: "retrieval", timestamp: hoursAgo(1.9) },
      { id: "step_3", label: "Histórico de pedidos consultado", type: "retrieval", timestamp: hoursAgo(1.85) },
      { id: "step_4", label: "Política de reembolso verificada", type: "decision", detail: "Política \"Política de reembolso\": valor solicitado > €200 → finance_approval", timestamp: hoursAgo(1.8) },
      { id: "step_5", label: "Escalado para o gestor para aprovação", type: "approval", detail: "Aprovação appr_1 aguardando decisão do Financeiro.", timestamp: minutesAgo(90) },
    ],
  },
  {
    id: "run_83920",
    agentId: "agent_technical",
    conversationId: "conv_1008",
    customerId: "cus_008",
    status: "completed",
    startedAt: daysAgo(1),
    completedAt: daysAgo(1),
    steps: [
      { id: "step_1", label: "Mensagem recebida", type: "message", timestamp: daysAgo(1) },
      { id: "step_2", label: "Cliente consultado", type: "retrieval", timestamp: daysAgo(1) },
      { id: "step_3", label: "Base de conhecimento pesquisada", type: "retrieval", detail: "Artigo correspondente: Guia de validação de assinatura de webhook", timestamp: daysAgo(1) },
      { id: "step_4", label: "Resposta gerada", type: "reasoning", timestamp: daysAgo(1) },
      { id: "step_5", label: "Resposta enviada", type: "message", timestamp: daysAgo(1) },
    ],
  },
  {
    id: "run_83811",
    agentId: "agent_success",
    conversationId: "conv_1011",
    customerId: "cus_011",
    status: "completed",
    startedAt: daysAgo(2),
    completedAt: daysAgo(2),
    steps: [
      { id: "step_1", label: "Mensagem recebida", type: "message", timestamp: daysAgo(2) },
      { id: "step_2", label: "Cliente consultado", type: "retrieval", timestamp: daysAgo(2) },
      { id: "step_3", label: "Exportação de compliance disparada", type: "tool_call", detail: '{ "tool": "trigger_export", "status": "queued" }', timestamp: daysAgo(2) },
      { id: "step_4", label: "Resposta enviada", type: "message", timestamp: daysAgo(2) },
    ],
  },
  {
    id: "run_83700",
    agentId: "agent_knowledge",
    status: "completed",
    startedAt: hoursAgo(12),
    completedAt: hoursAgo(12),
    steps: [
      { id: "step_1", label: "Conversas recentes não resolvidas escaneadas", type: "retrieval", timestamp: hoursAgo(12) },
      { id: "step_2", label: "Lacuna de conhecimento identificada", type: "reasoning", detail: "31% das conversas não resolvidas se relacionam a exceções da política de reembolso não cobertas na documentação atual.", timestamp: hoursAgo(12) },
      { id: "step_3", label: "Tópico faltante sinalizado", type: "decision", timestamp: hoursAgo(12) },
    ],
  },
];

export function getAgentRunsByAgent(agentId: string): AgentRun[] {
  return agentRuns.filter((r) => r.agentId === agentId);
}

export function getAgentRun(runId: string): AgentRun | undefined {
  return agentRuns.find((r) => r.id === runId);
}
