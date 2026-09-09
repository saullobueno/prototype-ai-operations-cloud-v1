"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { cashFlowTrend90d } from "@/data/mock/cashFlowForecast";
import { dsoTrend6m, expenseByCategory, monthlyExpenses6m, revenueByPlan } from "@/data/mock/financeAnalyticsSeries";
import { invoices } from "@/data/mock/invoices";
import { formatCurrency } from "@/lib/format";

export default function FinanceAnalyticsPage() {
  const paidCents = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amountCents, 0);
  const avgDso = Math.round(dsoTrend6m.reduce((s, p) => s + p.dso, 0) / dsoTrend6m.length);

  return (
    <PageContainer>
      <PageHeader title="Performance financeira" description="Cash flow, receita, despesas e recebíveis em um só painel." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Receita reconhecida" value={formatCurrency(paidCents)} />
        <KPIStatCard label="DSO médio (6 meses)" value={`${avgDso} dias`} trend={{ direction: "down", value: "7d", positive: true }} />
        <KPIStatCard label="Despesas (último mês)" value={formatCurrency(monthlyExpenses6m[monthlyExpenses6m.length - 1].expenses * 1000)} />
        <KPIStatCard label="Receita Enterprise" value={`${revenueByPlan[0].value}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fluxo de caixa (13 semanas)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={cashFlowTrend90d}
              xKey="week"
              series={[
                { key: "inflow", label: "Entradas (K)" },
                { key: "outflow", label: "Saídas (K)" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">DSO — Days Sales Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={dsoTrend6m} xKey="month" series={[{ key: "dso", label: "DSO (dias)" }]} valueSuffix="d" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Despesas por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={expenseByCategory} xKey="category" yKey="valueK" horizontal />
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
            <CardTitle className="text-base">Despesas mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={monthlyExpenses6m} xKey="month" series={[{ key: "expenses", label: "Despesas (K)" }]} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
