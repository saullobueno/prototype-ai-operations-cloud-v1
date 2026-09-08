"use client";

import { useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { AIInsightCard } from "@/components/domain/ai-insight-card";
import { RiskBadge } from "@/components/domain/badges";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { deals, getAccountById, getDealsAtRisk, getRecentSignals } from "@/data/mock";
import { formatCurrency, formatRelative } from "@/lib/format";

export default function SalesOverviewPage() {
  const router = useRouter();

  const openDeals = deals.filter((d) => d.status === "open");
  const wonDeals = deals.filter((d) => d.status === "won");
  const lostDeals = deals.filter((d) => d.status === "lost");

  const pipelineOpenCents = openDeals.reduce((sum, d) => sum + d.amountCents, 0);
  const weightedForecastCents = openDeals.reduce((sum, d) => sum + d.amountCents * (d.probability / 100), 0);
  const winRate = wonDeals.length + lostDeals.length > 0 ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) : 0;
  const dealsAtRisk = getDealsAtRisk();
  const revenueAtRiskCents = dealsAtRisk.reduce((sum, d) => sum + d.amountCents, 0);
  const recentSignals = getRecentSignals(6);

  return (
    <PageContainer>
      <PageHeader title="Sales Operations" description="AI Revenue Operations — acompanhe todo o processo comercial em um só lugar." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Pipeline aberto" value={formatCurrency(pipelineOpenCents)} />
        <KPIStatCard label="Forecast ponderado" value={formatCurrency(weightedForecastCents)} />
        <KPIStatCard label="Win rate" value={`${winRate}%`} />
        <KPIStatCard label="Receita em risco" value={formatCurrency(revenueAtRiskCents)} />
      </div>

      <div className="mb-6">
        <AIInsightCard
          title={`${dealsAtRisk.length} de ${openDeals.length} oportunidades abertas estão em risco alto`}
          description={`Juntas, representam ${formatCurrency(revenueAtRiskCents)} em receita potencial. A IA já identificou os motivos e a ação recomendada para cada uma.`}
          actionLabel="Ver deals em risco"
          onAction={() => router.push("/modules/sales/deals")}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Sinais recentes</h2>
          <div className="space-y-2">
            {recentSignals.map((signal) => {
              const account = getAccountById(signal.accountId);
              return (
                <Card key={signal.id} className="py-3">
                  <CardContent className="flex items-start gap-2.5 px-4">
                    <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${signal.impact === "positive" ? "bg-success" : "bg-danger"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{account?.name}</span> — {signal.detail}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(signal.detectedAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Deals em risco</h2>
          <div className="space-y-2">
            {dealsAtRisk.map((deal) => {
              const account = getAccountById(deal.accountId);
              return (
                <Card
                  key={deal.id}
                  className="cursor-pointer py-3 transition-colors hover:bg-accent"
                  onClick={() => router.push(`/modules/sales/deals/${deal.id}`)}
                >
                  <CardContent className="flex items-center gap-3 px-4">
                    <EntityAvatar name={account?.name ?? deal.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{account?.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(deal.amountCents)}</p>
                    </div>
                    <RiskBadge level={deal.riskLevel} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
