"use client";

import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { HealthMeterRow } from "@/components/domain/health-meter";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { agents, getActivitiesByCustomer, getCustomerById, tickets } from "@/data/mock";
import { formatRelative } from "@/lib/format";

const RECENT_CUSTOMER_IDS = ["cus_001", "cus_010", "cus_007", "cus_012", "cus_002"];

export default function CustomerOperationsOverviewPage() {
  const customerAgents = agents.filter((a) => !a.module || a.module === "customer_operations");
  const activeAgents = customerAgents.filter((a) => a.status === "active").length;
  const breachingSoon = tickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length;

  const recentActivity = RECENT_CUSTOMER_IDS.flatMap((id) => getActivitiesByCustomer(id).slice(0, 1))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <PageContainer>
      <PageHeader title="Customer Operations" description="Engajamento, atendimento e saúde de clientes." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Conversas" value="1.248" trend={{ direction: "up", value: "12,4%", positive: true }} />
        <KPIStatCard label="Resolução por IA" value="68,2%" trend={{ direction: "up", value: "5,8%", positive: true }} />
        <KPIStatCard label="Primeira resposta" value="4min 21s" trend={{ direction: "down", value: "18%", positive: true }} />
        <KPIStatCard label="CSAT" value="94,2%" trend={{ direction: "up", value: "2,1%", positive: true }} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Saúde das operações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0.5">
          <HealthMeterRow label="Resolução por IA" value={68} />
          <HealthMeterRow label="Cumprimento de SLA" value={94} />
          <HealthMeterRow label="Sentimento do cliente" value={91} />
          <HealthMeterRow label="Backlog" value={breachingSoon} isCount />
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Atividade recente</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/activity">Ver tudo</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => {
              const customer = getCustomerById(activity.customerId ?? "");
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  {customer && <EntityAvatar name={customer.name} size="sm" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{customer?.name}</span> — {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatRelative(activity.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Agentes de IA</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/ai/agents">Ver tudo</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{activeAgents} agentes ativos</p>
            <div className="mt-3 space-y-2">
              {customerAgents.slice(0, 5).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{agent.name}</span>
                  <span className={agent.status === "active" ? "text-success" : "text-warning"}>●</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
