import type { WorkflowVersion } from "@/types";
import { daysAgo } from "@/lib/time";

export const workflowVersions: WorkflowVersion[] = [
  {
    id: "wf_ticket_triage_v3",
    workflowId: "wf_ticket_triage",
    version: 3,
    publishedAt: daysAgo(14),
    nodes: [
      { id: "n1", type: "trigger", label: "Novo ticket", position: { x: 320, y: 0 } },
      { id: "n2", type: "ai_agent", label: "Classificar com IA", config: { agentId: "agent_triage" }, position: { x: 320, y: 100 } },
      { id: "n3", type: "branch", label: "Intenção?", position: { x: 320, y: 200 } },
      { id: "n4", type: "ai_agent", label: "Billing Agent", config: { agentId: "agent_billing" }, position: { x: 140, y: 300 } },
      { id: "n5", type: "ai_agent", label: "Support Agent", config: { agentId: "agent_technical" }, position: { x: 500, y: 300 } },
      { id: "n6", type: "api_call", label: "Verificar pagamento", position: { x: 140, y: 400 } },
      { id: "n7", type: "api_call", label: "Buscar na base de conhecimento", position: { x: 500, y: 400 } },
      { id: "n8", type: "human_approval", label: "Aprovação humana?", position: { x: 320, y: 500 } },
      { id: "n9", type: "assign_team", label: "Atribuir ao agente", position: { x: 180, y: 620 } },
      { id: "n10", type: "notification", label: "Resolver", position: { x: 460, y: 620 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4", condition: "Pagamento" },
      { id: "e4", source: "n3", target: "n5", condition: "Técnico" },
      { id: "e5", source: "n4", target: "n6" },
      { id: "e6", source: "n5", target: "n7" },
      { id: "e7", source: "n6", target: "n8" },
      { id: "e8", source: "n7", target: "n8" },
      { id: "e9", source: "n8", target: "n9", condition: "Sim" },
      { id: "e10", source: "n8", target: "n10", condition: "Não" },
    ],
  },
  {
    id: "wf_escalation_v5",
    workflowId: "wf_escalation",
    version: 5,
    publishedAt: daysAgo(30),
    nodes: [
      { id: "n1", type: "trigger", label: "Conversa criada", position: { x: 300, y: 0 } },
      { id: "n2", type: "ai_agent", label: "Análise de sentimento por IA", config: { agentId: "agent_triage" }, position: { x: 300, y: 100 } },
      { id: "n3", type: "condition", label: "Sentimento = frustrado/irritado?", position: { x: 300, y: 200 } },
      { id: "n4", type: "assign_team", label: "Escalar para humano", position: { x: 140, y: 320 } },
      { id: "n5", type: "ai_agent", label: "Agente de IA responde", config: { agentId: "agent_support" }, position: { x: 460, y: 320 } },
      { id: "n6", type: "notification", label: "Notificar canal do time", position: { x: 140, y: 440 } },
      { id: "n7", type: "notification", label: "Registrar atividade", position: { x: 460, y: 440 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4", condition: "Sim" },
      { id: "e4", source: "n3", target: "n5", condition: "Não" },
      { id: "e5", source: "n4", target: "n6" },
      { id: "e6", source: "n5", target: "n7" },
    ],
  },
  {
    id: "wf_sla_escalation_v2",
    workflowId: "wf_sla_escalation",
    version: 2,
    publishedAt: daysAgo(60),
    nodes: [
      { id: "n1", type: "trigger", label: "SLA se aproximando", position: { x: 260, y: 0 } },
      { id: "n2", type: "condition", label: "< 30min restantes?", position: { x: 260, y: 100 } },
      { id: "n3", type: "notification", label: "Alertar agente responsável", position: { x: 100, y: 220 } },
      { id: "n4", type: "delay", label: "Aguardar 15min", position: { x: 420, y: 220 } },
      { id: "n5", type: "notification", label: "Notificar gestor", position: { x: 100, y: 340 } },
      { id: "n6", type: "condition", label: "Ainda não resolvido?", position: { x: 420, y: 340 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3", condition: "Sim" },
      { id: "e3", source: "n2", target: "n4", condition: "Não" },
      { id: "e4", source: "n3", target: "n5" },
      { id: "e5", source: "n4", target: "n6" },
    ],
  },
  {
    id: "wf_refund_approval_v4",
    workflowId: "wf_refund_approval",
    version: 4,
    publishedAt: daysAgo(21),
    nodes: [
      { id: "n1", type: "trigger", label: "Pagamento falhou", position: { x: 280, y: 0 } },
      { id: "n2", type: "ai_agent", label: "Billing Agent", config: { agentId: "agent_billing" }, position: { x: 280, y: 100 } },
      { id: "n3", type: "condition", label: "Verificar política de reembolso", config: { policyId: "policy_refund" }, position: { x: 280, y: 200 } },
      { id: "n4", type: "api_call", label: "Emitir reembolso", position: { x: 120, y: 320 } },
      { id: "n5", type: "human_approval", label: "Aprovação humana", position: { x: 440, y: 320 } },
      { id: "n6", type: "send_message", label: "Notificar cliente", position: { x: 280, y: 440 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4", condition: "<= €50" },
      { id: "e4", source: "n3", target: "n5", condition: "> €50" },
      { id: "e5", source: "n4", target: "n6" },
      { id: "e6", source: "n5", target: "n6" },
    ],
  },
];

export function getWorkflowVersion(id: string): WorkflowVersion | undefined {
  return workflowVersions.find((v) => v.id === id);
}
