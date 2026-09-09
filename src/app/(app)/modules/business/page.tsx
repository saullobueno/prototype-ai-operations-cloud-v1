"use client";

import { useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { AIInsightCard } from "@/components/domain/ai-insight-card";
import { HealthMeterRow } from "@/components/domain/health-meter";
import { StatusBadge, RiskBadge } from "@/components/domain/badges";
import { processes } from "@/data/mock/processes";
import { processRuns, getActiveRuns } from "@/data/mock/processRuns";
import { getOpenExceptions } from "@/data/mock/processExceptions";
import { getPendingEscalations } from "@/data/mock/escalations";
import { formatRelative } from "@/lib/format";

export default function BusinessOverviewPage() {
  const router = useRouter();

  const activeProcesses = processes.filter((p) => p.status === "active");
  const activeRuns = getActiveRuns();
  const openExceptions = getOpenExceptions();
  const pendingEscalations = getPendingEscalations();

  const avgExceptionRate = Math.round(processes.reduce((s, p) => s + p.exceptionRate, 0) / processes.length);
  const avgAutomationRate = Math.round(processes.reduce((s, p) => s + p.automationRate, 0) / processes.length);

  const recentRuns = [...processRuns].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt)).slice(0, 6);

  return (
    <PageContainer>
      <PageHeader title="Business Operations" description="Orquestração de processos de negócio — do pedido de compra ao onboarding de fornecedores." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Processos ativos" value={String(activeProcesses.length)} />
        <KPIStatCard label="Execuções ativas" value={String(activeRuns.length)} />
        <KPIStatCard label="Taxa de exceção média" value={`${avgExceptionRate}%`} />
        <KPIStatCard label="Taxa de automação média" value={`${avgAutomationRate}%`} />
      </div>

      {openExceptions.length > 0 && (
        <div className="mb-6">
          <AIInsightCard
            title={`${openExceptions.length} exceções de processo precisam de atenção`}
            description={`${pendingEscalations.length} escalonamentos pendentes. O Exception Agent já classificou cada uma e sugeriu o próximo passo.`}
            actionLabel="Ver exceções"
            onAction={() => router.push("/modules/business/exceptions")}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Saúde dos processos</h2>
          <Card>
            <CardContent className="pt-4">
              {activeProcesses.map((p) => (
                <HealthMeterRow key={p.id} label={p.name} value={p.automationRate} tone={p.exceptionRate >= 15 ? "danger" : p.exceptionRate >= 10 ? "warning" : "default"} />
              ))}
            </CardContent>
          </Card>

          <h2 className="mb-3 mt-6 text-sm font-semibold text-foreground">Escalonamentos pendentes</h2>
          <div className="space-y-2">
            {pendingEscalations.length === 0 && <p className="text-sm text-muted-foreground">Nenhum escalonamento pendente.</p>}
            {pendingEscalations.map((esc) => (
              <Card key={esc.id} className="py-3">
                <CardContent className="px-4">
                  <p className="text-sm text-foreground">{esc.reason}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(esc.createdAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Execuções recentes</h2>
          <div className="space-y-2">
            {recentRuns.map((run) => {
              const process = processes.find((p) => p.id === run.processId);
              return (
                <Card
                  key={run.id}
                  className="cursor-pointer py-3 transition-colors hover:bg-accent"
                  onClick={() => router.push(`/modules/business/processes/${run.processId}`)}
                >
                  <CardContent className="flex items-center justify-between gap-3 px-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{run.subject}</p>
                      <p className="text-xs text-muted-foreground">{process?.name} · {formatRelative(run.startedAt)}</p>
                    </div>
                    <StatusBadge status={run.status} />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <h2 className="mb-3 mt-6 text-sm font-semibold text-foreground">Exceções recentes</h2>
          <div className="space-y-2">
            {openExceptions.slice(0, 5).map((exc) => {
              const process = processes.find((p) => p.id === exc.processId);
              return (
                <Card key={exc.id} className="py-3">
                  <CardContent className="flex items-start justify-between gap-3 px-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">{exc.reason}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{process?.name} · {formatRelative(exc.createdAt)}</p>
                    </div>
                    <RiskBadge level={exc.severity} />
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
