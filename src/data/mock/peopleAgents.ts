// Agentes de IA de People Operations. `Agent` é a mesma entidade core reusada por todos os
// módulos (src/data/mock/agents.ts) — mantido em arquivo próprio para não colidir com o trabalho
// em paralelo em outros módulos; o orquestrador deve fazer o merge destes registros no array
// `agents` compartilhado ao integrar. Níveis de autonomia deliberadamente conservadores: o spec
// (§10) exige que decisões sensíveis de RH permaneçam governadas e revisadas por humanos — nenhum
// agente aqui é "autonomous".
import type { Agent } from "@/types";

export const peopleAgents: Agent[] = [
  {
    id: "agent_people_onboarding",
    name: "Employee Onboarding Agent",
    description: "Orquestra as etapas do onboarding de novos colaboradores — equipamento, contas/acessos, documentos e notificação ao gestor.",
    status: "active",
    goal: "Conduzir o onboarding de novos colaboradores do dia 1 até a conclusão",
    personality: ["Organizado", "Proativo"],
    knowledgeSourceIds: [],
    toolIds: [],
    policyIds: [],
    autonomyLevel: "assisted",
    module: "people_operations",
  },
  {
    id: "agent_people_request",
    name: "People Request Agent",
    description: "Triagem de solicitações de colaboradores (day off, equipamento, despesas, mobilidade interna, documentos) e encaminhamento para aprovação.",
    status: "active",
    goal: "Triar e encaminhar solicitações internas de colaboradores",
    personality: ["Ágil", "Empático"],
    knowledgeSourceIds: [],
    toolIds: [],
    policyIds: [],
    autonomyLevel: "approval_required",
    module: "people_operations",
  },
  {
    id: "agent_people_talent",
    name: "Talent Agent",
    description: "Analisa candidatos, sugere avanço de etapa no pipeline de contratação e prepara recomendações de oferta para revisão humana.",
    status: "active",
    goal: "Apoiar o time de talentos na triagem e avanço de candidatos",
    personality: ["Analítico", "Consultivo"],
    knowledgeSourceIds: [],
    toolIds: [],
    policyIds: [],
    autonomyLevel: "assisted",
    module: "people_operations",
  },
  {
    id: "agent_workforce_insights",
    name: "Workforce Insights Agent",
    description: "Analisa carga de trabalho, capacidade dos times, atrasos operacionais e sinais de retenção — sempre como recomendação para revisão humana, nunca como decisão automática sobre pessoas.",
    status: "active",
    goal: "Gerar insights de força de trabalho para apoiar decisões de gestores e RH",
    personality: ["Analítico", "Objetivo"],
    knowledgeSourceIds: [],
    toolIds: [],
    policyIds: [],
    autonomyLevel: "assisted",
    module: "people_operations",
  },
];

export function getPeopleAgentById(id: string) {
  return peopleAgents.find((a) => a.id === id);
}
