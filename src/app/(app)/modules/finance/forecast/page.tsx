"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { cashFlowForecast } from "@/data/mock/cashFlowForecast";
import { receivablesTrend6m, revenueByPlan, revenueForecast6m } from "@/data/mock/financeAnalyticsSeries";
import { formatCurrency } from "@/lib/format";

// Variante de /cash-flow focada em previsão de receita (revenue forecast), não em caixa —
// decisão documentada em docs/IMPLEMENTATION-NOTES.md: /cash-flow cobre entradas/saídas de
// caixa (recebíveis + pagáveis + assinaturas); /forecast cobre a previsão de receita em si.
export default function ForecastPage() {
  const lastForecast = revenueForecast6m[revenueForecast6m.length - 1];
  const lastActual = [...revenueForecast6m].reverse().find((p) => p.actual > 0);

  return (
    <PageContainer>
      <PageHeader title="Previsão" description="Revenue forecasting — projeção de receita com base em recebíveis, assinaturas e histórico de fechamento." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Forecast do mês" value={`${formatCurrency(lastForecast.forecast * 1000)}`} />
        <KPIStatCard label="Realizado (último mês fechado)" value={lastActual ? formatCurrency(lastActual.actual * 1000) : "—"} />
        <KPIStatCard label="Net em 90 dias (caixa)" value={formatCurrency(cashFlowForecast[2].netCents)} />
        <KPIStatCard label="Receita recorrente — Enterprise" value={`${revenueByPlan[0].value}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Forecast vs. realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={revenueForecast6m}
              xKey="month"
              series={[
                { key: "forecast", label: "Forecast (K)" },
                { key: "actual", label: "Realizado (K)" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita por plano</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={revenueByPlan} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recebíveis em aberto (tendência)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={receivablesTrend6m} xKey="month" series={[{ key: "receivables", label: "Recebíveis (K)" }]} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
