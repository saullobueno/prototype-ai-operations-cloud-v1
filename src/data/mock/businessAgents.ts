import type { Agent } from "@/types";

// Agentes de IA de Business Operations (spec §7). Arquivo novo e isolado — NÃO faz parte de
// src/data/mock/agents.ts (compartilhado entre módulos paralelos). O orquestrador deve mesclar
// estes registros em agents.ts depois. IDs usam o prefixo "agent_biz_" para não colidir.
export const businessAgents: Agent[] = [
  {
    id: "agent_biz_process",
    name: "Process Agent",
    description: "Orquestra a execução de processos de negócio, avança etapas e monitora o progresso de cada run.",
    status: "active",
    goal: "Orquestrar a execução de processos de negócio e monitorar o progresso de cada etapa",
    personality: ["Sistemático", "Confiável"],
    knowledgeSourceIds: ["ks_internal_procedures"],
    toolIds: ["tool_advance_process_stage", "tool_notify_stage_owner"],
    policyIds: [],
    autonomyLevel: "autonomous",
    module: "business_operations",
  },
  {
    id: "agent_biz_ops_coordinator",
    name: "Operations Coordinator",
    description: "Coordena casos operacionais entre times, priorizando por severidade e SLA.",
    status: "active",
    goal: "Coordenar casos operacionais entre times, priorizando por severidade e SLA",
    personality: ["Organizado", "Proativo"],
    knowledgeSourceIds: ["ks_internal_procedures"],
    toolIds: ["tool_prioritize_case", "tool_assign_case"],
    policyIds: [],
    autonomyLevel: "assisted",
    module: "business_operations",
  },
  {
    id: "agent_biz_compliance",
    name: "Compliance Agent",
    description: "Verifica exigências regulatórias e de compliance em cada processo antes da aprovação.",
    status: "active",
    goal: "Verificar exigências regulatórias e de compliance antes de cada aprovação",
    personality: ["Meticuloso", "Cauteloso"],
    knowledgeSourceIds: ["ks_internal_procedures"],
    toolIds: ["tool_validate_vendor_documents", "tool_run_compliance_check"],
    policyIds: ["policy_biz_vendor_onboarding"],
    autonomyLevel: "approval_required",
    module: "business_operations",
  },
  {
    id: "agent_biz_exception",
    name: "Exception Agent",
    description: "Detecta, classifica e escalona exceções de processo automaticamente.",
    status: "active",
    goal: "Detectar, classificar e escalonar exceções de processo",
    personality: ["Analítico", "Direto"],
    knowledgeSourceIds: ["ks_internal_procedures"],
    toolIds: ["tool_detect_process_exception", "tool_escalate_exception"],
    policyIds: ["policy_biz_process_exception"],
    autonomyLevel: "autonomous",
    module: "business_operations",
  },
  {
    id: "agent_biz_optimization",
    name: "Optimization Agent",
    description: "Analisa dados históricos de processos para identificar gargalos e oportunidades de automação.",
    status: "active",
    goal: "Identificar gargalos, trabalho manual repetido e oportunidades de automação",
    personality: ["Analítico", "Objetivo"],
    knowledgeSourceIds: ["ks_internal_procedures"],
    toolIds: ["tool_calculate_process_metrics"],
    policyIds: [],
    autonomyLevel: "autonomous",
    module: "business_operations",
  },
];

export function getBusinessAgentById(id: string) {
  return businessAgents.find((a) => a.id === id);
}
