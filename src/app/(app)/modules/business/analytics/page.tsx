"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { processes } from "@/data/mock/processes";
import {
  automationRateByProcess,
  exceptionRateTrend6m,
  processDurationByCategory,
  runStatusBreakdown,
  throughputTrend6m,
} from "@/data/mock/businessAnalyticsSeries";

export default function BusinessAnalyticsPage() {
  const avgExceptionRate = Math.round(processes.reduce((s, p) => s + p.exceptionRate, 0) / processes.length);
  const avgAutomationRate = Math.round(processes.reduce((s, p) => s + p.automationRate, 0) / processes.length);
  const avgDuration = Math.round(processes.reduce((s, p) => s + p.avgDurationHours, 0) / processes.length);
  const totalRuns = processes.reduce((s, p) => s + p.totalRuns, 0);

  return (
    <PageContainer>
      <PageHeader title="Analytics de processos" description="Duração, throughput, gargalos, taxa de exceção e oportunidades de automação." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Execuções totais" value={totalRuns.toLocaleString("pt-BR")} />
        <KPIStatCard label="Duração média" value={`${avgDuration}h`} />
        <KPIStatCard label="Taxa de exceção média" value={`${avgExceptionRate}%`} trend={{ direction: "down", value: "2pp", positive: true }} />
        <KPIStatCard label="Automação média" value={`${avgAutomationRate}%`} trend={{ direction: "up", value: "5pp", positive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Duração média por categoria</CardTitle></CardHeader>
          <CardContent>
            <SimpleBarChart data={processDurationByCategory} xKey="category" yKey="horas" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Execuções por status</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={runStatusBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Taxa de exceção (tendência)</CardTitle></CardHeader>
          <CardContent>
            <TrendLineChart data={exceptionRateTrend6m} xKey="month" series={[{ key: "taxa", label: "Taxa de exceção (%)" }]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Throughput (execuções/mês)</CardTitle></CardHeader>
          <CardContent>
            <TrendLineChart data={throughputTrend6m} xKey="month" series={[{ key: "execucoes", label: "Execuções" }]} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Automação por processo</CardTitle></CardHeader>
          <CardContent>
            <SimpleBarChart data={automationRateByProcess} xKey="processo" yKey="taxa" horizontal />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
