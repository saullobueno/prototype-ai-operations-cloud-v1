"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { StatusBadge } from "@/components/domain/badges";
import { EmptyState } from "@/components/domain/empty-state";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getWorkflowById, getWorkflowRunsByWorkflow } from "@/data/mock";
import { formatDateTime } from "@/lib/format";
import { History } from "lucide-react";

export default function WorkflowRunsPage({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = use(params);
  const workflow = getWorkflowById(workflowId);
  if (!workflow) notFound();

  const runs = getWorkflowRunsByWorkflow(workflowId).sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));

  return (
    <PageContainer>
      <Link href={`/automation/workflows/${workflowId}`} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Voltar para {workflow.name}
      </Link>

      <h1 className="mb-1 text-xl font-semibold tracking-tight text-foreground">{workflow.name} — Execuções</h1>
      <p className="mb-6 text-sm text-muted-foreground">{workflow.totalRuns.toLocaleString("pt-BR")} execuções</p>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <KPIStatCard label="Sucesso" value={workflow.successRuns.toLocaleString("pt-BR")} />
        <KPIStatCard label="Falhas" value={workflow.failedRuns.toLocaleString("pt-BR")} />
        <KPIStatCard label="Aguardando" value={workflow.waitingRuns.toLocaleString("pt-BR")} />
      </div>

      {runs.length === 0 ? (
        <EmptyState icon={History} title="Nenhuma execução registrada ainda" />
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
                <ClickableTableRow key={r.id} href={`/automation/workflows/${workflowId}/runs/${r.id}`}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(r.startedAt)}</TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
