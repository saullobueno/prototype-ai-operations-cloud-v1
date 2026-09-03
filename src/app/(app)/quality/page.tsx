"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { EmptyState } from "@/components/domain/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { avg, evaluations, getUserById, users } from "@/data/mock";

const TARGET_TYPE_LABEL: Record<string, string> = { agent_run: "execução de agente", conversation: "conversa" };
const RESOLUTION_LABEL: Record<string, string> = { resolved: "Resolvido", escalated: "Escalado", unresolved: "Não resolvido" };

export default function QualityPage() {
  const aiEvals = evaluations.filter((e) => e.targetType === "agent_run");
  const humanEvals = evaluations.filter((e) => e.targetType === "conversation");
  const pendingReviews = humanEvals.filter((e) => e.resolution === "unresolved");

  const agentScores = users
    .filter((u) => u.roleId === "role_agent" || u.roleId === "role_manager")
    .map((u) => ({ user: u, evals: humanEvals.filter((e) => e.reviewerId === u.id) }))
    .filter((row) => row.evals.length > 0);

  return (
    <PageContainer>
      <PageHeader title="Qualidade" description="Qualidade de IA, qualidade humana, revisões e coaching em um só lugar." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Precisão média" value={`${avg(evaluations.map((e) => e.accuracy))}%`} />
        <KPIStatCard label="Tom médio" value={`${avg(evaluations.map((e) => e.tone))}%`} />
        <KPIStatCard label="Aderência à política" value={`${avg(evaluations.map((e) => e.policyAdherence))}%`} />
        <KPIStatCard label="Revisões pendentes" value={String(pendingReviews.length)} />
      </div>

      <Tabs defaultValue="ai">
        <TabsList>
          <TabsTrigger value="ai">AI Quality</TabsTrigger>
          <TabsTrigger value="human">Human Quality</TabsTrigger>
          <TabsTrigger value="reviews">Revisões de conversas</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="coaching">Coaching</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-4">
          <p className="text-sm text-muted-foreground">
            {aiEvals.length} execuções de IA avaliadas · precisão média {avg(aiEvals.map((e) => e.accuracy))}%. Veja{" "}
            <Link href="/ai/evaluations" className="text-primary hover:underline">AI Evaluations</Link> para o detalhamento completo.
          </p>
        </TabsContent>

        <TabsContent value="human" className="mt-4">
          {agentScores.length === 0 ? (
            <EmptyState icon={BadgeCheck} title="Nenhuma avaliação humana ainda" />
          ) : (
            <div className="space-y-2">
              {agentScores.map(({ user, evals }) => (
                <Card key={user.id} className="flex-row items-center justify-between px-4 py-3">
                  <span className="flex items-center gap-2 text-sm"><EntityAvatar name={user.name} size="xs" />{user.name}</span>
                  <span className="text-sm text-muted-foreground">precisão média {avg(evals.map((e) => e.accuracy))}% · tom médio {avg(evals.map((e) => e.tone))}%</span>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          {pendingReviews.length === 0 ? (
            <EmptyState icon={BadgeCheck} title="Nenhuma revisão pendente" />
          ) : (
            <div className="space-y-2">
              {pendingReviews.map((e) => (
                <Card key={e.id} className="flex-row items-center justify-between px-4 py-3">
                  <span className="text-sm text-foreground">Conversa {e.targetId} sinalizada para revisão</span>
                  <span className="text-xs text-muted-foreground">Precisão {e.accuracy}%</span>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="evaluations" className="mt-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alvo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Revisor</TableHead>
                  <TableHead>Precisão</TableHead>
                  <TableHead>Resolução</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.targetId}</TableCell>
                    <TableCell className="text-muted-foreground">{TARGET_TYPE_LABEL[e.targetType]}</TableCell>
                    <TableCell>{e.reviewerId ? getUserById(e.reviewerId)?.name : "IA (automatizado)"}</TableCell>
                    <TableCell>{e.accuracy}%</TableCell>
                    <TableCell>{RESOLUTION_LABEL[e.resolution]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="coaching" className="mt-4">
          <Card>
            <CardContent className="space-y-3 pt-4 text-sm">
              <p className="text-foreground">Billing Agent frequentemente erra exceções da política de reembolso — 4 ocorrências essa semana.</p>
              <p className="text-foreground">Pedro Santos — nota de tom levemente abaixo da média do time em Technical Support essa semana.</p>
              <p className="text-muted-foreground">Recomendado: atualizar a base de conhecimento e revisar a configuração de política.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
