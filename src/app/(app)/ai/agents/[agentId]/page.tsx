"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/page-header";
import { AutonomyBadge, RiskBadge, StatusBadge } from "@/components/domain/badges";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EmptyState } from "@/components/domain/empty-state";
import { PolicyRuleRow } from "@/components/domain/policy-rule-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import {
  agents,
  getAgentRunsByAgent,
  getEvaluationsForTarget,
  knowledgeSources,
  policies,
  tools,
} from "@/data/mock";
import { avg } from "@/data/mock/evaluations";
import { formatDateTime } from "@/lib/format";
import { History } from "lucide-react";

export default function AgentDetailPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = use(params);
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) notFound();

  const runs = getAgentRunsByAgent(agent.id).sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
  const agentKnowledge = knowledgeSources.filter((k) => agent.knowledgeSourceIds.includes(k.id));
  const agentTools = tools.filter((t) => agent.toolIds.includes(t.id));
  const agentPolicies = policies.filter((p) => agent.policyIds.includes(p.id));
  const runEvals = runs.flatMap((r) => getEvaluationsForTarget("agent_run", r.id));

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{agent.name}</h1>
            <StatusBadge status={agent.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>
          <div className="mt-2"><AutonomyBadge level={agent.autonomyLevel} /></div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/ai/agents/${agent.id}/edit`}>Editar</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast(agent.status === "active" ? `${agent.name} pausado` : `${agent.name} ativado`)}
          >
            {agent.status === "active" ? "Pausar" : "Ativar"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="knowledge">Conhecimento</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
          <TabsTrigger value="runs">Execuções</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardContent className="space-y-2 pt-4 text-sm">
              <p><span className="text-muted-foreground">Objetivo:</span> {agent.goal}</p>
              <p className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground">Personalidade:</span>
                {agent.personality.map((p) => (
                  <Badge key={p} variant="secondary">{p}</Badge>
                ))}
              </p>
            </CardContent>
          </Card>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Execuções recentes</p>
            {runs.slice(0, 5).map((r) => (
              <Link key={r.id} href={`/ai/agents/${agent.id}/runs/${r.id}`} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
                <span className="text-foreground">Execução {r.id}</span>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="mt-4">
          {agentKnowledge.length === 0 ? (
            <EmptyState icon={History} title="Nenhuma fonte de conhecimento vinculada" />
          ) : (
            <div className="space-y-2">
              {agentKnowledge.map((k) => (
                <Card key={k.id} className="flex-row items-center justify-between px-4 py-3">
                  <span className="text-sm text-foreground">{k.name}</span>
                  <StatusBadge status={k.syncStatus} />
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tools" className="mt-4">
          <div className="space-y-2">
            {agentTools.map((t) => (
              <Card key={t.id} className="flex-row items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                <RiskBadge level={t.riskLevel} />
              </Card>
            ))}
            {agentTools.length === 0 && <EmptyState icon={History} title="Nenhuma ferramenta habilitada" />}
          </div>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          {agentPolicies.length === 0 ? (
            <EmptyState icon={History} title="Nenhuma política associada a este agente" />
          ) : (
            <div className="space-y-4">
              {agentPolicies.map((p) => (
                <Card key={p.id}>
                  <CardContent className="pt-4">
                    <p className="mb-2 text-sm font-medium text-foreground">{p.name}</p>
                    <div className="space-y-1.5 text-sm">
                      {p.rules.map((rule) => (
                        <PolicyRuleRow key={rule.id} rule={rule} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="runs" className="mt-4">
          {runs.length === 0 ? (
            <EmptyState icon={History} title="Nenhuma execução ainda" />
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Execução</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Iniciada em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((r) => (
                    <ClickableTableRow key={r.id} href={`/ai/agents/${agent.id}/runs/${r.id}`}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-muted-foreground">{formatDateTime(r.startedAt)}</TableCell>
                    </ClickableTableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPIStatCard label="Execuções totais" value={String(runs.length)} />
            <KPIStatCard label="Resolvidas" value={String(runs.filter((r) => r.status === "completed").length)} />
            <KPIStatCard label="Escaladas" value={String(runs.filter((r) => r.status === "escalated").length)} />
            <KPIStatCard label="Precisão média" value={`${avg(runEvals.map((e) => e.accuracy))}%`} />
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
