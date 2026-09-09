"use client";

import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { processRuns } from "@/data/mock/processRuns";
import { getProcessById } from "@/data/mock/processes";
import { formatDateTime } from "@/lib/format";

export default function AllProcessRunsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const runs = useMemo(() => {
    const list = [...processRuns].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
    return statusFilter === "all" ? list : list.filter((r) => r.status === statusFilter);
  }, [statusFilter]);

  return (
    <PageContainer>
      <PageHeader title="Execuções" description="Execuções recentes de todos os processos de negócio neste workspace." />

      <div className="mb-4 flex justify-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="running">Em execução</SelectItem>
            <SelectItem value="waiting_approval">Aguardando aprovação</SelectItem>
            <SelectItem value="exception">Exceção</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {runs.length === 0 ? (
        <EmptyState icon={History} title="Nenhuma execução corresponde a este filtro" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Execução</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Iniciada em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((r) => {
                const process = getProcessById(r.processId);
                return (
                  <ClickableTableRow key={r.id} href={`/modules/business/processes/${r.processId}`}>
                    <TableCell className="font-medium">{r.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{process?.name ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(r.startedAt)}</TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
