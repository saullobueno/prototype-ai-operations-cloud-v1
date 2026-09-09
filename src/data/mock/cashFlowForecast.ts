import type { CashFlowForecastPoint } from "@/types";
import { daysAgo } from "@/lib/time";

// Previsão de fluxo de caixa — inputs: recebíveis (invoices em aberto), pagáveis (bills
// pendentes/aprovadas) e histórico de assinaturas recorrentes (spec §9 "Cash flow intelligence").
export const cashFlowForecast: CashFlowForecastPoint[] = [
  { horizonDays: 30, projectedInflowCents: 18_400_000, projectedOutflowCents: 11_200_000, netCents: 7_200_000 },
  { horizonDays: 60, projectedInflowCents: 34_600_000, projectedOutflowCents: 22_800_000, netCents: 11_800_000 },
  { horizonDays: 90, projectedInflowCents: 49_100_000, projectedOutflowCents: 34_500_000, netCents: 14_600_000 },
];

// Série diária/semanal para o gráfico de tendência de Cash Flow Insights — não faz parte do
// tipo CashFlowForecastPoint (que representa apenas os 3 pontos de horizonte), é um recorte
// analítico auxiliar só desta tela, mesmo padrão de src/data/mock/salesAnalyticsSeries.ts.
export const cashFlowTrend90d = Array.from({ length: 13 }).map((_, i) => {
  const weeksAgo = 12 - i;
  const inflowK = 380 + ((i * 23) % 140);
  const outflowK = 260 + ((i * 17) % 110);
  return {
    week: `S-${weeksAgo === 0 ? "atual" : weeksAgo}`,
    date: daysAgo(weeksAgo * 7),
    inflow: inflowK,
    outflow: outflowK,
    net: inflowK - outflowK,
  };
});

export const cashPositionCents = 22_480_000;
