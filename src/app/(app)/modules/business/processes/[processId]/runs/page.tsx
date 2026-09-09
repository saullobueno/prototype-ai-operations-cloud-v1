"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { StatusBadge } from "@/components/domain/badges";
import { EmptyState } from "@/components/domain/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProcessById } from "@/data/mock/processes";
import { getRunsByProcess } from "@/data/mock/processRuns";
import { formatDateTime } from "@/lib/format";

export default function ProcessRunsPage({ params }: { params: Promise<{ processId: string }> }) {
  const { processId } = use(params);
  const process = getProcessById(processId);
  if (!process) notFound();

  const runs = getRunsByProcess(processId);
  const completed = runs.filter((r) => r.status === "completed").length;
  const exceptions = runs.filter((r) => r.status === "exception").length;
  const active = runs.filter((r) => r.status === "running" || r.status === "waiting_approval").length;

  return (
    <PageContainer>
      <Link href={`/modules/business/processes/${processId}`} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Voltar para {process.name}
      </Link>

      <h1 className="mb-1 text-xl font-semibold tracking-tight text-foreground">{process.name} — Execuções</h1>
      <p className="mb-6 text-sm text-muted-foreground">{process.totalRuns.toLocaleString("pt-BR")} execuções totais (histórico completo simulado neste protótipo com {runs.length} registros)</p>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <KPIStatCard label="Concluídas" value={String(completed)} />
        <KPIStatCard label="Ativas" value={String(active)} />
        <KPIStatCard label="Em exceção" value={String(exceptions)} />
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
                <TableHead>Concluída em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.subject}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(r.startedAt)}</TableCell>
                  <TableCell className="text-muted-foreground">{r.completedAt ? formatDateTime(r.completedAt) : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
