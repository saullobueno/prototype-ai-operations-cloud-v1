"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { HealthMeterRow } from "@/components/domain/health-meter";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/core/auth/AuthProvider";
import { useAskAI } from "@/components/layout/ask-ai-context";
import { agents, getActivitiesByCustomer, getCustomerById, tickets } from "@/data/mock";
import { formatRelative } from "@/lib/format";

const RECENT_CUSTOMER_IDS = ["cus_001", "cus_010", "cus_007", "cus_012", "cus_002"];

export default function OverviewPage() {
  const { user } = useAuth();
  const { setOpen: setAskAIOpen } = useAskAI();

  const activeAgents = agents.filter((a) => a.status === "active").length;
  const breachingSoon = tickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length;

  const recentActivity = RECENT_CUSTOMER_IDS.flatMap((id) => getActivitiesByCustomer(id).slice(0, 1))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <PageContainer>
      <PageHeader
        title={`Bom dia, ${user?.name.split(" ")[0] ?? "por aí"}`}
        description="Veja o que precisa da sua atenção hoje."
        actions={
          <Button variant="outline" className="gap-1.5 text-ai-accent" onClick={() => setAskAIOpen(true)}>
            <Sparkles className="size-4" />
            Ask Operations AI
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Conversas" value="1.248" trend={{ direction: "up", value: "12,4%", positive: true }} />
        <KPIStatCard label="Resolução por IA" value="68,2%" trend={{ direction: "up", value: "5,8%", positive: true }} />
        <KPIStatCard label="Primeira resposta" value="4min 21s" trend={{ direction: "down", value: "18%", positive: true }} />
        <KPIStatCard label="CSAT" value="94,2%" trend={{ direction: "up", value: "2,1%", positive: true }} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
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

        <Card className="border-ai-accent/30 bg-ai-accent/[0.04]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-ai-accent" />
              AI Operations Brief
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Sua operação está saudável no geral. 3 coisas precisam de atenção:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                <span>18 conversas estão perto de romper o SLA.</span>
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                <span>Problemas relacionados a pagamento aumentaram 27% essa semana.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                <span>A taxa de resolução por IA melhorou 8,4%.</span>
              </li>
            </ul>
            <Button asChild variant="link" className="h-auto gap-1 px-0 text-ai-accent">
              <Link href="/analytics/ai">
                Ver recomendações <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

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
            <CardTitle className="text-base">AI Workforce</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/ai/agents">Ver tudo</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{activeAgents} agentes ativos</p>
            <div className="mt-3 space-y-2">
              {agents.slice(0, 5).map((agent) => (
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
