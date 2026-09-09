"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { cashFlowForecast, cashFlowTrend90d, cashPositionCents } from "@/data/mock/cashFlowForecast";
import { bills } from "@/data/mock/bills";
import { invoices } from "@/data/mock/invoices";
import { formatCurrency } from "@/lib/format";

const HORIZON_LABEL: Record<number, string> = { 30: "30 dias", 60: "60 dias", 90: "90 dias" };

export default function CashFlowPage() {
  const receivablesCents = invoices.filter((i) => i.status === "sent" || i.status === "viewed" || i.status === "overdue").reduce((s, i) => s + i.amountCents, 0);
  const payablesCents = bills.filter((b) => b.status === "pending_approval" || b.status === "approved").reduce((s, b) => s + b.amountCents, 0);

  return (
    <PageContainer>
      <PageHeader title="Fluxo de caixa" description="Previsão de 30/60/90 dias combinando recebíveis, pagáveis e assinaturas recorrentes — Cash Flow Agent." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Posição de caixa atual" value={formatCurrency(cashPositionCents)} />
        <KPIStatCard label="Recebíveis em aberto" value={formatCurrency(receivablesCents)} />
        <KPIStatCard label="Pagáveis pendentes" value={formatCurrency(payablesCents)} />
        <KPIStatCard label="Net em 90 dias" value={formatCurrency(cashFlowForecast[2].netCents)} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Tendência de fluxo de caixa (13 semanas)</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendLineChart
            data={cashFlowTrend90d}
            xKey="week"
            series={[
              { key: "inflow", label: "Entradas (K)" },
              { key: "outflow", label: "Saídas (K)" },
              { key: "net", label: "Líquido (K)" },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {cashFlowForecast.map((point) => (
          <Card key={point.horizonDays}>
            <CardHeader>
              <CardTitle className="text-base">Horizonte de {HORIZON_LABEL[point.horizonDays]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entradas projetadas</span>
                <span className="font-medium text-success">{formatCurrency(point.projectedInflowCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saídas projetadas</span>
                <span className="font-medium text-danger">{formatCurrency(point.projectedOutflowCents)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Líquido</span>
                <span className="font-semibold text-foreground">{formatCurrency(point.netCents)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
