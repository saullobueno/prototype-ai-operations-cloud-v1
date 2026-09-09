"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/core/auth/AuthProvider";
import { useAskAI } from "@/components/layout/ask-ai-context";
import {
  activities,
  agentRuns,
  agents,
  businessApprovals,
  conversations,
  formatCents,
  getActiveRuns,
  getCustomerById,
  getDealsAtRisk,
  getOpenDeals,
  getOpenExceptions,
  getOverdueInvoices,
  getPendingApprovals,
  getUserById,
  onboardings,
  tickets,
} from "@/data/mock";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

type ModuleHealthStatus = "healthy" | "attention" | "critical";

const HEALTH_LABEL: Record<ModuleHealthStatus, string> = {
  healthy: "Saudável",
  attention: "Atenção",
  critical: "Crítico",
};

const HEALTH_TONE: Record<ModuleHealthStatus, string> = {
  healthy: "bg-success/15 text-success",
  attention: "bg-warning/15 text-warning-foreground dark:text-warning",
  critical: "bg-danger/15 text-danger",
};

function actorName(actorType: string, actorId: string): string {
  if (actorType === "human") return getUserById(actorId)?.name ?? actorId;
  if (actorType === "agent") return agents.find((a) => a.id === actorId)?.name ?? actorId;
  return "Sistema";
}

export default function OverviewPage() {
  const { user } = useAuth();
  const { setOpen: setAskAIOpen } = useAskAI();

  const activeAgents = agents.filter((a) => a.status === "active").length;
  const breachingSoon = tickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length;
  const openConversations = conversations.filter((c) => c.status === "open" || c.status === "pending").length;

  const dealsAtRisk = getDealsAtRisk();
  const pipelineAtRiskCents = dealsAtRisk.reduce((sum, d) => sum + d.amountCents, 0);
  const overdueInvoices = getOverdueInvoices();
  const seriouslyOverdueInvoices = overdueInvoices.filter((i) => (i.daysOverdue ?? 0) > 30);
  const openExceptions = getOpenExceptions();
  const delayedOnboardings = onboardings.filter((o) => o.status === "delayed");
  const pendingVendorApproval = businessApprovals.find((a) => a.type === "vendor_onboarding" && a.status === "pending");
  const pendingApprovals = getPendingApprovals();

  const moduleHealth: { label: string; href: string; status: ModuleHealthStatus; detail: string }[] = [
    {
      label: "Customer Operations",
      href: "/modules/customer",
      status: breachingSoon > 20 ? "attention" : "healthy",
      detail: `${breachingSoon} tickets em aberto`,
    },
    {
      label: "Business Operations",
      href: "/modules/business",
      status: openExceptions.length > 0 ? "attention" : "healthy",
      detail: `${openExceptions.length} exceções abertas`,
    },
    {
      label: "Sales Operations",
      href: "/modules/sales",
      status: dealsAtRisk.length > 0 ? "attention" : "healthy",
      detail: `${dealsAtRisk.length} deals em risco`,
    },
    {
      label: "Finance Operations",
      href: "/modules/finance",
      status: seriouslyOverdueInvoices.length > 5 ? "critical" : seriouslyOverdueInvoices.length > 0 ? "attention" : "healthy",
      detail: `${overdueInvoices.length} faturas vencidas`,
    },
    {
      label: "People Operations",
      href: "/modules/people",
      status: delayedOnboardings.length > 0 ? "attention" : "healthy",
      detail: `${delayedOnboardings.length} onboardings atrasados`,
    },
  ];

  const healthyModules = moduleHealth.filter((m) => m.status === "healthy").length;
  const activeOperations = openConversations + breachingSoon + getOpenDeals().length + getActiveRuns().length + pendingApprovals.length;
  const overallHealthPct = Math.round((healthyModules / moduleHealth.length) * 100);
  const aiAutomationPct = agentRuns.length > 0 ? Math.round((agentRuns.filter((r) => r.status === "completed").length / agentRuns.length) * 100) : 0;

  const attentionItems = [
    { text: `${breachingSoon} conversas/tickets estão perto de romper o SLA.`, href: "/tickets" },
    dealsAtRisk.length > 0 && {
      text: `${formatCents(pipelineAtRiskCents)} em pipeline de vendas está em risco (${dealsAtRisk.length} deals).`,
      href: "/modules/sales/deals",
    },
    seriouslyOverdueInvoices.length > 0 && {
      text: `${seriouslyOverdueInvoices.length} faturas estão vencidas há mais de 30 dias.`,
      href: "/modules/finance/overdue",
    },
    delayedOnboardings.length > 0 && {
      text: `${delayedOnboardings.length} processos de onboarding de colaboradores estão atrasados.`,
      href: "/modules/people/onboarding",
    },
    pendingVendorApproval && {
      text: `Aprovação de fornecedor aguardando decisão — ${pendingVendorApproval.context ?? "vendor onboarding"}`,
      href: "/modules/business/approvals",
    },
  ].filter((item): item is { text: string; href: string } => Boolean(item));

  const recentActivity = [...activities].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

  return (
    <PageContainer>
      <PageHeader
        title={`Bom dia, ${user?.name.split(" ")[0] ?? "por aí"}`}
        description="O que está acontecendo em todos os módulos hoje."
        actions={
          <Button variant="outline" className="gap-1.5 text-ai-accent" onClick={() => setAskAIOpen(true)}>
            <Sparkles className="size-4" />
            Ask Operations AI
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Operações ativas" value={String(activeOperations)} />
        <KPIStatCard label="Saúde operacional geral" value={`${overallHealthPct}%`} />
        <KPIStatCard label="Taxa de automação por IA" value={`${aiAutomationPct}%`} />
        <KPIStatCard label="Requer atenção" value={String(attentionItems.length)} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Saúde por módulo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {moduleHealth.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className="flex flex-col gap-2 rounded-lg border border-border px-3 py-3 transition-colors hover:bg-accent"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{m.label}</span>
                <span className={cn("shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium", HEALTH_TONE[m.status])}>
                  {HEALTH_LABEL[m.status]}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{m.detail}</span>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-ai-accent/30 bg-ai-accent/[0.04]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-ai-accent" />
              AI Operations Brief
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {attentionItems.length > 0
                ? `Sua operação está saudável no geral. ${attentionItems.length} coisas precisam de atenção:`
                : "Sua operação está saudável — nada precisa de atenção imediata."}
            </p>
            <ul className="space-y-2 text-sm">
              {attentionItems.map((item) => (
                <li key={item.text} className="flex gap-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                  <Link href={item.href} className="hover:underline">
                    {item.text}
                  </Link>
                </li>
              ))}
              {attentionItems.length === 0 && (
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>Todos os módulos estão dentro do esperado.</span>
                </li>
              )}
            </ul>
            <Button asChild variant="link" className="h-auto gap-1 px-0 text-ai-accent">
              <Link href="/analytics/ai">
                Ver recomendações <ArrowRight className="size-3.5" />
              </Link>
            </Button>
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

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Atividade recente</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/activity">Ver tudo</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.map((activity) => {
            const customer = activity.customerId ? getCustomerById(activity.customerId) : undefined;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <EntityAvatar name={actorName(activity.actorType, activity.actorId)} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{actorName(activity.actorType, activity.actorId)}</span> {activity.action}
                    {customer && <> · {customer.name}</>}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatRelative(activity.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
