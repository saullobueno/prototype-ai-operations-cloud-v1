import type { Interaction } from "@/types";
import { daysAgo, monthsAgo } from "@/lib/time";

export const interactions: Interaction[] = [
  // ---------- Meridian Freight (deal em risco alto — AI Moment) ----------
  {
    id: "int_meridian_1",
    accountId: "acc_meridianfreight",
    dealId: "deal_meridian_expansion",
    contactId: "contact_acc_meridianfreight_1",
    type: "email",
    direction: "outbound",
    subject: "Proposta de expansão Enterprise — Meridian Freight",
    summary: "Envio da proposta comercial de expansão para toda a operação de logística.",
    aiAnalysis: { sentiment: "positive", intent: "proposal_review", engagementScore: 68 },
    occurredAt: daysAgo(20),
  },
  {
    id: "int_meridian_2",
    accountId: "acc_meridianfreight",
    dealId: "deal_meridian_expansion",
    contactId: "contact_acc_meridianfreight_1",
    type: "meeting",
    direction: "outbound",
    subject: "Discovery call — expansão de licenças",
    summary: "Ricardo (champion) confirmou dor com o processo atual e disse que levaria a proposta ao Fábio (VP).",
    aiAnalysis: { sentiment: "positive", intent: "buying_process", engagementScore: 74, nextStepSuggested: "Agendar call com o decision maker" },
    occurredAt: daysAgo(15),
  },
  {
    id: "int_meridian_3",
    accountId: "acc_meridianfreight",
    dealId: "deal_meridian_expansion",
    contactId: "contact_acc_meridianfreight_0",
    type: "meeting",
    direction: "outbound",
    subject: "Call com decision maker (Fábio Menezes)",
    summary: "Fábio mencionou estar avaliando a proposta de um concorrente e não confirmou próximos passos nem agenda.",
    aiAnalysis: {
      sentiment: "negative",
      intent: "competitor_evaluation",
      engagementScore: 24,
      nextStepSuggested: "Agendar follow-up executivo",
    },
    occurredAt: daysAgo(12),
  },

  // ---------- Solstice Health ----------
  {
    id: "int_solstice_1",
    accountId: "acc_solsticehealth",
    dealId: "deal_solstice_platform",
    contactId: "contact_acc_solsticehealth_0",
    type: "meeting",
    direction: "outbound",
    subject: "Discovery call — plataforma completa",
    summary: "Débora confirmou orçamento aprovado para o próximo trimestre e forte interesse no módulo de compliance.",
    aiAnalysis: { sentiment: "positive", intent: "budget_confirmation", engagementScore: 88, nextStepSuggested: "Enviar proposta formal" },
    occurredAt: daysAgo(35),
  },
  {
    id: "int_solstice_2",
    accountId: "acc_solsticehealth",
    dealId: "deal_solstice_platform",
    contactId: "contact_acc_solsticehealth_0",
    type: "email",
    direction: "outbound",
    subject: "Proposta formal — Solstice Health",
    summary: "Proposta enviada com prazo de validade de 30 dias; Débora confirmou leitura.",
    aiAnalysis: { sentiment: "positive", intent: "proposal_review", engagementScore: 80 },
    occurredAt: daysAgo(2),
  },

  // ---------- Kepler Robotics (risco alto) ----------
  {
    id: "int_kepler_1",
    accountId: "acc_keplerrobotics",
    dealId: "deal_kepler_core",
    contactId: "contact_acc_keplerrobotics_0",
    type: "meeting",
    direction: "outbound",
    subject: "Kickoff técnico",
    summary: "Vinícius validou requisitos técnicos e demonstrou entusiasmo com a integração via API.",
    aiAnalysis: { sentiment: "positive", intent: "technical_validation", engagementScore: 70 },
    occurredAt: daysAgo(30),
  },
  {
    id: "int_kepler_2",
    accountId: "acc_keplerrobotics",
    dealId: "deal_kepler_core",
    contactId: "contact_acc_keplerrobotics_0",
    type: "call",
    direction: "outbound",
    subject: "Follow-up de proposta",
    summary: "Vinícius mencionou concorrente com preço menor e informou que o sponsor original mudou de área.",
    aiAnalysis: { sentiment: "negative", intent: "competitor_evaluation", engagementScore: 31, nextStepSuggested: "Enviar comparativo competitivo" },
    occurredAt: daysAgo(9),
  },

  // ---------- Bluewave Telecom ----------
  {
    id: "int_bluewave_1",
    accountId: "acc_bluewavetelecom",
    dealId: "deal_bluewave_enterprise",
    contactId: "contact_acc_bluewavetelecom_0",
    type: "meeting",
    direction: "outbound",
    subject: "Discovery — contrato Enterprise",
    summary: "Patrícia detalhou o processo de compras e confirmou que o comitê se reúne mensalmente.",
    aiAnalysis: { sentiment: "positive", intent: "procurement_process", engagementScore: 62 },
    occurredAt: daysAgo(25),
  },
  {
    id: "int_bluewave_2",
    accountId: "acc_bluewavetelecom",
    dealId: "deal_bluewave_enterprise",
    contactId: "contact_acc_bluewavetelecom_0",
    type: "email",
    direction: "inbound",
    subject: "Atualização do comitê de compras",
    summary: "Patrícia avisou que a decisão do comitê foi adiada para o próximo ciclo.",
    aiAnalysis: { sentiment: "neutral", intent: "procurement_process", engagementScore: 55, nextStepSuggested: "Confirmar nova data do comitê" },
    occurredAt: daysAgo(4),
  },

  // ---------- Granite Retail Group ----------
  {
    id: "int_granite_1",
    accountId: "acc_graniteretail",
    dealId: "deal_granite_core",
    contactId: "contact_acc_graniteretail_0",
    type: "call",
    direction: "outbound",
    subject: "Qualificação inicial",
    summary: "Cauã demonstrou interesse mas não confirmou orçamento disponível para este ano fiscal.",
    aiAnalysis: { sentiment: "neutral", intent: "budget_qualification", engagementScore: 40 },
    occurredAt: daysAgo(18),
  },
  {
    id: "int_granite_2",
    accountId: "acc_graniteretail",
    dealId: "deal_granite_core",
    contactId: "contact_acc_graniteretail_0",
    type: "email",
    direction: "outbound",
    subject: "Pergunta sobre orçamento",
    summary: "E-mail perguntando sobre disponibilidade de orçamento; sem resposta objetiva.",
    aiAnalysis: { sentiment: "neutral", intent: "budget_qualification", engagementScore: 38, nextStepSuggested: "Confirmar orçamento antes de avançar" },
    occurredAt: daysAgo(8),
  },

  // ---------- Aurora FinTech ----------
  {
    id: "int_aurora_1",
    accountId: "acc_aurorafintech",
    dealId: "deal_aurora_core",
    contactId: "contact_acc_aurorafintech_0",
    type: "meeting",
    direction: "outbound",
    subject: "Discovery — módulo de risco",
    summary: "Renata confirmou forte fit com o caso de uso de detecção de fraude e pediu proposta.",
    aiAnalysis: { sentiment: "positive", intent: "proposal_review", engagementScore: 84 },
    occurredAt: daysAgo(14),
  },
  {
    id: "int_aurora_2",
    accountId: "acc_aurorafintech",
    dealId: "deal_aurora_core",
    contactId: "contact_acc_aurorafintech_0",
    type: "email",
    direction: "outbound",
    subject: "Proposta enviada — Aurora FinTech",
    summary: "Renata confirmou leitura e sinalizou aprovação interna em andamento.",
    aiAnalysis: { sentiment: "positive", intent: "proposal_review", engagementScore: 86 },
    occurredAt: daysAgo(1),
  },

  // ---------- Nordwind Energy (risco alto) ----------
  {
    id: "int_nordwind_1",
    accountId: "acc_nordwindenergy",
    dealId: "deal_nordwind_core",
    contactId: "contact_acc_nordwindenergy_0",
    type: "meeting",
    direction: "outbound",
    subject: "Negociação de contrato plurianual",
    summary: "Sérgio avisou que entraria de licença e que a decisão ficaria pausada até seu retorno.",
    aiAnalysis: { sentiment: "negative", intent: "stalled_decision", engagementScore: 28, nextStepSuggested: "Escalar para outro stakeholder" },
    occurredAt: daysAgo(14),
  },
  {
    id: "int_nordwind_2",
    accountId: "acc_nordwindenergy",
    dealId: "deal_nordwind_addon",
    contactId: "contact_acc_nordwindenergy_0",
    type: "email",
    direction: "outbound",
    subject: "Follow-up módulo de monitoramento",
    summary: "E-mail de acompanhamento sobre o módulo adicional, ainda sem retorno definitivo.",
    aiAnalysis: { sentiment: "neutral", intent: "proposal_review", engagementScore: 45 },
    occurredAt: daysAgo(2),
  },

  // ---------- Silvercrest Media ----------
  {
    id: "int_silvercrest_1",
    accountId: "acc_silvercrestmedia",
    dealId: "deal_silvercrest_core",
    contactId: "contact_acc_silvercrestmedia_0",
    type: "call",
    direction: "outbound",
    subject: "Qualificação inicial",
    summary: "Bianca demonstrou interesse moderado; empresa pequena para o ICP ideal.",
    aiAnalysis: { sentiment: "neutral", intent: "budget_qualification", engagementScore: 42 },
    occurredAt: daysAgo(9),
  },
  {
    id: "int_silvercrest_2",
    accountId: "acc_silvercrestmedia",
    dealId: "deal_silvercrest_addon",
    contactId: "contact_acc_silvercrestmedia_0",
    type: "email",
    direction: "inbound",
    subject: "Dúvida sobre pricing",
    summary: "Bianca perguntou sobre planos menores, fora do pacote padrão vendido pelo time.",
    aiAnalysis: { sentiment: "neutral", intent: "pricing_question", engagementScore: 46 },
    occurredAt: daysAgo(2),
  },

  // ---------- Terracotta Hospitality (lead convertido) ----------
  {
    id: "int_terracotta_1",
    accountId: "acc_terracottahospitality",
    dealId: "deal_terracotta_intro",
    contactId: "contact_acc_terracottahospitality_0",
    type: "call",
    direction: "outbound",
    subject: "Kickoff pós-conversão do lead",
    summary: "Marina confirmou interesse em piloto departamental antes de expandir para toda a rede de hotéis.",
    aiAnalysis: { sentiment: "positive", intent: "pilot_setup", engagementScore: 76 },
    occurredAt: daysAgo(1),
  },

  // ---------- Vantage Biotech (lead convertido) ----------
  {
    id: "int_vantage_1",
    accountId: "acc_vantagebiotech",
    dealId: "deal_vantage_intro",
    contactId: "contact_acc_vantagebiotech_0",
    type: "meeting",
    direction: "outbound",
    subject: "Kickoff pós-conversão do lead",
    summary: "Henrique confirmou orçamento pré-aprovado e forte urgência para decisão ainda este trimestre.",
    aiAnalysis: { sentiment: "positive", intent: "budget_confirmation", engagementScore: 90, nextStepSuggested: "Acelerar envio da proposta" },
    occurredAt: daysAgo(1),
  },

  // ---------- Continuidade histórica das contas convertidas ----------
  {
    id: "int_novacorp_won",
    accountId: "acc_novacorp",
    dealId: "deal_novacorp_won",
    type: "meeting",
    direction: "outbound",
    subject: "Negociação final — Novacorp",
    summary: "Contrato Enterprise assinado após validação de segurança e compliance.",
    aiAnalysis: { sentiment: "positive", intent: "contract_negotiation", engagementScore: 92 },
    occurredAt: monthsAgo(16),
  },
  {
    id: "int_lumentech_won",
    accountId: "acc_lumentech",
    dealId: "deal_lumentech_won",
    type: "meeting",
    direction: "outbound",
    subject: "Negociação final — Lumen Tech",
    summary: "Contrato Business assinado após piloto departamental bem-sucedido.",
    aiAnalysis: { sentiment: "positive", intent: "contract_negotiation", engagementScore: 87 },
    occurredAt: monthsAgo(15),
  },
  {
    id: "int_vertexlabs_won",
    accountId: "acc_vertexlabs",
    dealId: "deal_vertexlabs_won",
    type: "meeting",
    direction: "outbound",
    subject: "Negociação final — Vertex Labs",
    summary: "Contrato Enterprise plurianual assinado com condições customizadas de SLA.",
    aiAnalysis: { sentiment: "positive", intent: "contract_negotiation", engagementScore: 95 },
    occurredAt: monthsAgo(34),
  },
];

// Persistência simplificada, mesmo padrão de src/data/mock/customers.ts. Usado quando um
// vendedor registra manualmente uma interação (a IA continua sendo a fonte das que já vêm
// com aiAnalysis, geradas por integrações de email/calendário simuladas nos dados iniciais).
export function addInteraction(interaction: Interaction) {
  interactions.push(interaction);
}

export function deleteInteraction(interactionId: string) {
  const idx = interactions.findIndex((i) => i.id === interactionId);
  if (idx !== -1) interactions.splice(idx, 1);
}

export function getInteractionsByAccount(accountId: string): Interaction[] {
  return interactions
    .filter((i) => i.accountId === accountId)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}

export function getInteractionsByDeal(dealId: string): Interaction[] {
  return interactions
    .filter((i) => i.dealId === dealId)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}
