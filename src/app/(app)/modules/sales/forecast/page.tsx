"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { deals, dealsByOwner, forecastVsClosed6m, pipelineByStage, revenueAtRiskBreakdown, winRateTrend } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

export default function ForecastPage() {
  const openDeals = deals.filter((d) => d.status === "open");
  const wonDeals = deals.filter((d) => d.status === "won");
  const lostDeals = deals.filter((d) => d.status === "lost");
  const pipelineOpenCents = openDeals.reduce((s, d) => s + d.amountCents, 0);
  const weightedForecastCents = openDeals.reduce((s, d) => s + d.amountCents * (d.probability / 100), 0);
  const winRate = wonDeals.length + lostDeals.length > 0 ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) : 0;

  return (
    <PageContainer>
      <PageHeader title="Forecast" description="Revenue Analytics — previsão, win rate e receita em risco." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Pipeline aberto" value={formatCurrency(pipelineOpenCents)} />
        <KPIStatCard label="Forecast ponderado" value={formatCurrency(weightedForecastCents)} />
        <KPIStatCard label="Win rate" value={`${winRate}%`} trend={{ direction: "up", value: "3%", positive: true }} />
        <KPIStatCard label="Deals fechados (won)" value={String(wonDeals.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline por estágio</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={pipelineByStage} xKey="stage" yKey="valueK" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita por nível de risco</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={revenueAtRiskBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Forecast vs. fechado</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={forecastVsClosed6m}
              xKey="month"
              series={[
                { key: "forecast", label: "Forecast" },
                { key: "closed", label: "Fechado" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Win rate (tendência)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={winRateTrend} xKey="month" series={[{ key: "winRate", label: "Win rate (%)" }]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deals por dono</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={dealsByOwner} xKey="owner" yKey="deals" />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
