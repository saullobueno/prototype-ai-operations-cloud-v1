"use client";

import { ClipboardCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EmptyState } from "@/components/domain/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { agentRuns, agents, avg, evaluations, getUserById } from "@/data/mock";

const RESOLUTION_LABEL: Record<string, string> = {
  resolved: "Resolvido",
  escalated: "Escalado",
  unresolved: "Não resolvido",
};

export default function EvaluationsPage() {
  const aiEvals = evaluations.filter((e) => e.targetType === "agent_run");
  const humanEvals = evaluations.filter((e) => e.targetType === "conversation");

  return (
    <PageContainer>
      <PageHeader title="Avaliações" description="Pontuação de qualidade para agentes de IA e agentes humanos." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Precisão média" value={`${avg(evaluations.map((e) => e.accuracy))}%`} />
        <KPIStatCard label="Tom médio" value={`${avg(evaluations.map((e) => e.tone))}%`} />
        <KPIStatCard label="Aderência à política" value={`${avg(evaluations.map((e) => e.policyAdherence))}%`} />
        <KPIStatCard label="Total de avaliações" value={String(evaluations.length)} />
      </div>

      <Tabs defaultValue="ai">
        <TabsList>
          <TabsTrigger value="ai">AI Quality</TabsTrigger>
          <TabsTrigger value="human">Human Quality</TabsTrigger>
          <TabsTrigger value="reviews">Revisões</TabsTrigger>
          <TabsTrigger value="coaching">Coaching</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-4">
          {aiEvals.length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="Nenhuma avaliação de IA ainda" />
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Execução</TableHead>
                    <TableHead>Agente</TableHead>
                    <TableHead>Precisão</TableHead>
                    <TableHead>Tom</TableHead>
                    <TableHead>Política</TableHead>
                    <TableHead>Resolução</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiEvals.map((e) => {
                    const run = agentRuns.find((r) => r.id === e.targetId);
                    const agent = agents.find((a) => a.id === run?.agentId);
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.targetId}</TableCell>
                        <TableCell>{agent?.name ?? "—"}</TableCell>
                        <TableCell>{e.accuracy}%</TableCell>
                        <TableCell>{e.tone}%</TableCell>
                        <TableCell>{e.policyAdherence}%</TableCell>
                        <TableCell>{RESOLUTION_LABEL[e.resolution]}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="human" className="mt-4">
          {humanEvals.length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="Nenhuma conversa avaliada por humano ainda" />
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conversa</TableHead>
                    <TableHead>Revisor</TableHead>
                    <TableHead>Precisão</TableHead>
                    <TableHead>Tom</TableHead>
                    <TableHead>Resolução</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {humanEvals.map((e) => {
                    const reviewer = e.reviewerId ? getUserById(e.reviewerId) : undefined;
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.targetId}</TableCell>
                        <TableCell>{reviewer?.name ?? "—"}</TableCell>
                        <TableCell>{e.accuracy}%</TableCell>
                        <TableCell>{e.tone}%</TableCell>
                        <TableCell>{RESOLUTION_LABEL[e.resolution]}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          {humanEvals.filter((e) => e.resolution === "unresolved").length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="Nenhuma revisão pendente" />
          ) : (
            <div className="space-y-2">
              {humanEvals
                .filter((e) => e.resolution === "unresolved")
                .map((e) => (
                  <Card key={e.id} className="flex-row items-center justify-between px-4 py-3">
                    <span className="text-sm text-foreground">Conversa {e.targetId} sinalizada para revisão</span>
                    <span className="text-xs text-muted-foreground">Precisão {e.accuracy}%</span>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="coaching" className="mt-4">
          <Card>
            <CardContent className="space-y-3 pt-4 text-sm">
              <p className="text-foreground">Billing Agent frequentemente erra exceções da política de reembolso — 4 ocorrências essa semana.</p>
              <p className="text-foreground">Pedro Santos — nota de tom levemente abaixo da média do time em Technical Support essa semana.</p>
              <p className="text-muted-foreground">Recomendado: atualizar o artigo de conhecimento &quot;Refund Policy Exceptions&quot; e revisar a configuração de política do Billing Agent.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
