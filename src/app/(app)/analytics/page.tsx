"use client";

import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import {
  csat30d,
  responseResolutionTime,
  sentimentTrend,
  ticketVolume7d,
  workflowRunsByDay,
} from "@/data/mock/analyticsSeries";
import { customers, users, evaluations, workflows, avg } from "@/data/mock";

export default function AnalyticsPage() {
  const atRisk = customers.filter((c) => c.health === "at_risk" || c.health === "critical");
  const agentWorkload = users
    .filter((u) => u.roleId === "role_agent" || u.roleId === "role_manager")
    .map((u) => ({ user: u, evals: evaluations.filter((e) => e.reviewerId === u.id) }));

  return (
    <PageContainer>
      <PageHeader title="Analytics" description="Performance de operações, clientes, IA, agentes e automação em um só lugar." />

      <Tabs defaultValue="operations">
        <TabsList>
          <TabsTrigger value="operations">Operações</TabsTrigger>
          <TabsTrigger value="customer">Clientes</TabsTrigger>
          <TabsTrigger value="ai">IA</TabsTrigger>
          <TabsTrigger value="agent">Agentes</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPIStatCard label="Volume de tickets (7d)" value="262" trend={{ direction: "up", value: "8%", positive: true }} />
            <KPIStatCard label="Backlog" value="42" />
            <KPIStatCard label="Cumprimento de SLA" value="94%" trend={{ direction: "up", value: "2%", positive: true }} />
            <KPIStatCard label="Resolução média" value="4,4h" trend={{ direction: "down", value: "6%", positive: true }} />
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Volume de tickets</CardTitle></CardHeader>
            <CardContent><SimpleBarChart data={ticketVolume7d} xKey="day" yKey="tickets" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Tempo de resposta e resolução</CardTitle></CardHeader>
            <CardContent>
              <TrendLineChart
                data={responseResolutionTime}
                xKey="day"
                series={[
                  { key: "firstResponseMin", label: "Primeira resposta (min)" },
                  { key: "resolutionHrs", label: "Resolução (hrs)" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPIStatCard label="CSAT" value="94,2%" trend={{ direction: "up", value: "2,1%", positive: true }} />
            <KPIStatCard label="Sentimento (positivo)" value="63%" trend={{ direction: "up", value: "5%", positive: true }} />
            <KPIStatCard label="Clientes em risco" value={String(atRisk.length)} />
            <KPIStatCard label="Esforço do cliente" value="Baixo" />
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Tendência de CSAT</CardTitle></CardHeader>
            <CardContent><TrendLineChart data={csat30d} xKey="day" series={[{ key: "csat", label: "CSAT" }]} valueSuffix="%" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Sentimento ao longo do tempo</CardTitle></CardHeader>
            <CardContent>
              <TrendLineChart
                data={sentimentTrend}
                xKey="day"
                series={[
                  { key: "positive", label: "Positivo" },
                  { key: "neutral", label: "Neutro" },
                  { key: "frustrated", label: "Frustrado" },
                  { key: "angry", label: "Irritado" },
                ]}
                valueSuffix="%"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Clientes em risco</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {atRisk.map((c) => (
                <Link key={c.id} href={`/customers/${c.id}`} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent">
                  <span className="flex items-center gap-2"><EntityAvatar name={c.name} size="xs" />{c.name}</span>
                  <span className="text-muted-foreground">{c.health === "at_risk" ? "Em risco" : "Crítico"}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-4 space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">Para a análise completa de performance de IA, veja o painel dedicado AI Performance.</p>
              <Link href="/analytics/ai" className="text-sm font-medium text-primary hover:underline">Abrir AI Performance →</Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Qualidade dos agentes humanos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {agentWorkload.map(({ user, evals }) => (
                <div key={user.id} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm">
                  <span className="flex items-center gap-2"><EntityAvatar name={user.name} size="xs" />{user.name}</span>
                  <span className="text-muted-foreground">{evals.length} avaliações · média {avg(evals.map((e) => e.accuracy)) || "—"}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPIStatCard label="Workflows ativos" value={String(workflows.filter((w) => w.status === "active").length)} />
            <KPIStatCard label="Execuções (7d)" value="1.325" />
            <KPIStatCard label="Execuções com falha" value={String(workflows.reduce((a, w) => a + w.failedRuns, 0))} />
            <KPIStatCard label="Tempo economizado (est.)" value="≈340h" />
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Execuções de workflow por dia</CardTitle></CardHeader>
            <CardContent><SimpleBarChart data={workflowRunsByDay} xKey="day" yKey="runs" colorIndex={2} /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
