"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import {
  headcountTrend6m,
  onboardingDurationTrend,
  performanceCompletionByCycle,
  requestsByType,
  workloadByDepartment,
} from "@/data/mock/peopleAnalyticsSeries";
import { getActiveHeadcount } from "@/data/mock/employees";
import { onboardings } from "@/data/mock/onboardings";
import { peopleRequests } from "@/data/mock/peopleRequests";

export default function PeopleAnalyticsPage() {
  const headcount = getActiveHeadcount();
  const activeOnboardings = onboardings.filter((o) => o.status !== "completed").length;
  const pendingRequests = peopleRequests.filter((r) => r.status === "pending").length;

  return (
    <PageContainer>
      <PageHeader title="Analytics" description="Headcount, onboarding, carga de trabalho, solicitações e performance." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Headcount ativo" value={String(headcount)} trend={{ direction: "up", value: "3%", positive: true }} />
        <KPIStatCard label="Onboardings ativos" value={String(activeOnboardings)} />
        <KPIStatCard label="Solicitações pendentes" value={String(pendingRequests)} />
        <KPIStatCard label="Duração média onboarding" value={`${onboardingDurationTrend[onboardingDurationTrend.length - 1].dias} dias`} trend={{ direction: "down", value: "2 dias", positive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Headcount (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={headcountTrend6m} xKey="month" series={[{ key: "headcount", label: "Headcount" }]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Duração do onboarding (dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={onboardingDurationTrend} xKey="month" series={[{ key: "dias", label: "Dias" }]} valueSuffix=" dias" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Carga de trabalho por departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={workloadByDepartment} xKey="departamento" yKey="tarefasAbertas" horizontal />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Solicitações por tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={requestsByType} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Conclusão de avaliações por ciclo (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={performanceCompletionByCycle} xKey="ciclo" yKey="concluidas" colorIndex={3} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
