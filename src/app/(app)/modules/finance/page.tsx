"use client";

import { useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { AIInsightCard } from "@/components/domain/ai-insight-card";
import { RiskBadge } from "@/components/domain/badges";
import { DonutChart } from "@/components/charts/donut-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { getCustomerById } from "@/data/mock";
import { getOverdueInvoices, invoices } from "@/data/mock/invoices";
import { getOpenAnomalies } from "@/data/mock/financialAnomalies";
import { cashFlowTrend90d, cashPositionCents } from "@/data/mock/cashFlowForecast";
import { formatCurrency, formatDate } from "@/lib/format";

export default function FinanceOverviewPage() {
  const router = useRouter();

  const receivableInvoices = invoices.filter((i) => i.status === "sent" || i.status === "viewed" || i.status === "overdue");
  const totalReceivablesCents = receivableInvoices.reduce((sum, i) => sum + i.amountCents, 0);
  const overdueInvoices = getOverdueInvoices();
  const overdueAmountCents = overdueInvoices.reduce((sum, i) => sum + i.amountCents, 0);
  const avgDaysOverdue = overdueInvoices.length > 0 ? Math.round(overdueInvoices.reduce((sum, i) => sum + (i.daysOverdue ?? 0), 0) / overdueInvoices.length) : 0;
  const openAnomalies = getOpenAnomalies();

  const agingBuckets = [
    { name: "No prazo", value: receivableInvoices.filter((i) => (i.daysOverdue ?? 0) === 0).length },
    { name: "1-30 dias", value: receivableInvoices.filter((i) => (i.daysOverdue ?? 0) > 0 && (i.daysOverdue ?? 0) <= 30).length },
    { name: "31-60 dias", value: receivableInvoices.filter((i) => (i.daysOverdue ?? 0) > 30 && (i.daysOverdue ?? 0) <= 60).length },
    { name: "60+ dias", value: receivableInvoices.filter((i) => (i.daysOverdue ?? 0) > 60).length },
  ].filter((b) => b.value > 0);

  return (
    <PageContainer>
      <PageHeader title="Finance Operations" description="Orquestre contas a receber, contas a pagar e inteligência financeira em um só lugar." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Total a receber" value={formatCurrency(totalReceivablesCents)} />
        <KPIStatCard label="Valor vencido" value={formatCurrency(overdueAmountCents)} />
        <KPIStatCard label="Atraso médio (dias)" value={String(avgDaysOverdue)} />
        <KPIStatCard label="Posição de caixa" value={formatCurrency(cashPositionCents)} />
      </div>

      {overdueInvoices.length > 0 && (
        <div className="mb-6">
          <AIInsightCard
            title={`${overdueInvoices.length} faturas vencidas somam ${formatCurrency(overdueAmountCents)}`}
            description="A IA já identificou os motivos de risco e a estratégia de cobrança recomendada para cada uma."
            actionLabel="Ver faturas vencidas"
            onAction={() => router.push("/modules/finance/overdue")}
          />
        </div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
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
            <CardTitle className="text-base">Aging de recebíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={agingBuckets} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Faturas que precisam de atenção</h2>
          <div className="space-y-2">
            {overdueInvoices.slice(0, 6).map((invoice) => {
              const customer = getCustomerById(invoice.customerId);
              return (
                <Card
                  key={invoice.id}
                  className="cursor-pointer py-3 transition-colors hover:bg-accent"
                  onClick={() => router.push(`/modules/finance/invoices/${invoice.id}`)}
                >
                  <CardContent className="flex items-center gap-3 px-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{invoice.number} — {customer?.company ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{invoice.daysOverdue} dias vencida · {formatCurrency(invoice.amountCents)}</p>
                    </div>
                    {invoice.riskLevel && <RiskBadge level={invoice.riskLevel} />}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Anomalias recentes</h2>
          <div className="space-y-2">
            {openAnomalies.slice(0, 6).map((anomaly) => (
              <Card
                key={anomaly.id}
                className="cursor-pointer py-3 transition-colors hover:bg-accent"
                onClick={() => router.push("/modules/finance/anomalies")}
              >
                <CardContent className="flex items-start gap-2.5 px-4">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{anomaly.detail}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(anomaly.detectedAt)}{anomaly.amountCents ? ` · ${formatCurrency(anomaly.amountCents)}` : ""}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
