import type { Signal } from "@/types";
import { daysAgo } from "@/lib/time";

export const signals: Signal[] = [
  // Meridian Freight — compõe o exemplo de Deal Risk em destaque
  {
    id: "signal_meridian_1",
    accountId: "acc_meridianfreight",
    dealId: "deal_meridian_expansion",
    type: "competitor_mentioned",
    detectedAt: daysAgo(12),
    detail: "Fábio Menezes mencionou estar avaliando proposta de concorrente durante a call.",
    impact: "negative",
  },
  {
    id: "signal_meridian_2",
    accountId: "acc_meridianfreight",
    dealId: "deal_meridian_expansion",
    type: "meeting_no_show",
    detectedAt: daysAgo(6),
    detail: "Nenhuma reunião de follow-up foi agendada desde a call com o decision maker.",
    impact: "negative",
  },
  {
    id: "signal_meridian_3",
    accountId: "acc_meridianfreight",
    dealId: "deal_meridian_expansion",
    type: "no_response",
    detectedAt: daysAgo(1),
    detail: "12 dias sem resposta de Fábio Menezes (decision maker) desde a última call.",
    impact: "negative",
  },

  // Kepler Robotics
  {
    id: "signal_kepler_1",
    accountId: "acc_keplerrobotics",
    dealId: "deal_kepler_core",
    type: "competitor_mentioned",
    detectedAt: daysAgo(9),
    detail: "Vinícius citou proposta concorrente com preço mais agressivo.",
    impact: "negative",
  },
  {
    id: "signal_kepler_2",
    accountId: "acc_keplerrobotics",
    dealId: "deal_kepler_core",
    type: "champion_left",
    detectedAt: daysAgo(9),
    detail: "Sponsor original do projeto mudou de área dentro da Kepler Robotics.",
    impact: "negative",
  },

  // Nordwind Energy
  {
    id: "signal_nordwind_1",
    accountId: "acc_nordwindenergy",
    dealId: "deal_nordwind_core",
    type: "meeting_no_show",
    detectedAt: daysAgo(14),
    detail: "Decision maker entrou de licença prolongada; nenhuma reunião nas últimas 2 semanas.",
    impact: "negative",
  },
  {
    id: "signal_nordwind_2",
    accountId: "acc_nordwindenergy",
    dealId: "deal_nordwind_core",
    type: "competitor_mentioned",
    detectedAt: daysAgo(14),
    detail: "Concorrente apresentou proposta de preço mais agressiva na mesma janela de decisão.",
    impact: "negative",
  },

  // Bluewave Telecom
  {
    id: "signal_bluewave_1",
    accountId: "acc_bluewavetelecom",
    dealId: "deal_bluewave_enterprise",
    type: "decision_maker_engaged",
    detectedAt: daysAgo(4),
    detail: "Patrícia (VP of Procurement) segue ativamente empurrando a aprovação internamente.",
    impact: "positive",
  },

  // Granite Retail Group
  {
    id: "signal_granite_1",
    accountId: "acc_graniteretail",
    dealId: "deal_granite_core",
    type: "no_response",
    detectedAt: daysAgo(8),
    detail: "Sem confirmação de orçamento após pergunta direta por e-mail.",
    impact: "negative",
  },

  // Silvercrest Media
  {
    id: "signal_silvercrest_1",
    accountId: "acc_silvercrestmedia",
    dealId: "deal_silvercrest_core",
    type: "no_response",
    detectedAt: daysAgo(9),
    detail: "Baixo engajamento geral, consistente com fit de ICP baixo (poor).",
    impact: "negative",
  },

  // Solstice Health
  {
    id: "signal_solstice_1",
    accountId: "acc_solsticehealth",
    dealId: "deal_solstice_platform",
    type: "budget_confirmed",
    detectedAt: daysAgo(35),
    detail: "Débora Aquino confirmou orçamento já aprovado para o trimestre.",
    impact: "positive",
  },
  {
    id: "signal_solstice_2",
    accountId: "acc_solsticehealth",
    dealId: "deal_solstice_platform",
    type: "positive_buying_intent",
    detectedAt: daysAgo(2),
    detail: "Proposta lida múltiplas vezes na mesma semana do envio.",
    impact: "positive",
  },

  // Aurora FinTech
  {
    id: "signal_aurora_1",
    accountId: "acc_aurorafintech",
    dealId: "deal_aurora_core",
    type: "decision_maker_engaged",
    detectedAt: daysAgo(1),
    detail: "Renata Lopes sinalizou aprovação interna em andamento.",
    impact: "positive",
  },

  // Terracotta Hospitality / Vantage Biotech — recém convertidos, sinais de intenção
  {
    id: "signal_terracotta_1",
    accountId: "acc_terracottahospitality",
    dealId: "deal_terracotta_intro",
    type: "pricing_page_visited",
    detectedAt: daysAgo(2),
    detail: "Marina Torres visitou a página de pricing duas vezes na última semana.",
    impact: "positive",
  },
  {
    id: "signal_vantage_1",
    accountId: "acc_vantagebiotech",
    dealId: "deal_vantage_intro",
    type: "budget_confirmed",
    detectedAt: daysAgo(2),
    detail: "Henrique Salles confirmou orçamento pré-aprovado para este trimestre.",
    impact: "positive",
  },

  // Perdidos — sinais retroativos que explicam o resultado
  {
    id: "signal_palisade_1",
    accountId: "acc_palisadeinsurance",
    dealId: "deal_palisade_lost",
    type: "competitor_mentioned",
    detectedAt: daysAgo(96),
    detail: "Cliente optou por concorrente com preço ~20% menor.",
    impact: "negative",
  },
  {
    id: "signal_coppervalley_1",
    accountId: "acc_coppervalleyfoods",
    dealId: "deal_coppervalley_lost",
    type: "no_response",
    detectedAt: daysAgo(81),
    detail: "Projeto pausado após corte orçamentário interno confirmado por e-mail.",
    impact: "negative",
  },
];

export function getSignalsByAccount(accountId: string): Signal[] {
  return signals
    .filter((s) => s.accountId === accountId)
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
}

export function getSignalsByDeal(dealId: string): Signal[] {
  return signals
    .filter((s) => s.dealId === dealId)
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
}

export function getRecentSignals(limit = 8): Signal[] {
  return [...signals].sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()).slice(0, limit);
}
