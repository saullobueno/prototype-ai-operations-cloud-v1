"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, FileWarning, RotateCcw, Search } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { RiskBadge, StatusBadge } from "@/components/domain/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { processExceptions, updateExceptionStatus } from "@/data/mock/processExceptions";
import { getProcessById } from "@/data/mock/processes";
import { getProcessRunById } from "@/data/mock/processRuns";
import { formatRelative } from "@/lib/format";

type FilterTab = "all" | "open" | "resolved";

export default function ProcessExceptionsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `processExceptions` em estado local só para forçar o
  // re-render quando uma exceção é resolvida/reaberta (mesma referência mutada).
  const [version, setVersion] = useState(0);

  const filtered = useMemo(() => {
    let list = processExceptions;
    if (tab !== "all") list = list.filter((e) => e.status === tab);
    if (query.trim()) list = list.filter((e) => e.reason.toLowerCase().includes(query.trim().toLowerCase()));
    return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  function toggleStatus(id: string, current: "open" | "resolved") {
    const next = current === "open" ? "resolved" : "open";
    updateExceptionStatus(id, next);
    toast.success(next === "resolved" ? "Exceção marcada como resolvida" : "Exceção reaberta");
    setVersion((v) => v + 1);
  }

  return (
    <PageContainer>
      <PageHeader title="Exceções" description={`${processExceptions.filter((e) => e.status === "open").length} exceções abertas de ${processExceptions.length} registradas`} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="open">Abertas</TabsTrigger>
            <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar exceções..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileWarning} title="Nenhuma exceção corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motivo</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Execução</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada</TableHead>
                <TableHead className="w-40" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => {
                const process = getProcessById(e.processId);
                const run = getProcessRunById(e.processRunId);
                return (
                  <TableRow key={e.id}>
                    <TableCell className="max-w-md font-medium">{e.reason}</TableCell>
                    <TableCell className="text-muted-foreground">{process?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{run?.subject ?? "—"}</TableCell>
                    <TableCell><RiskBadge level={e.severity} /></TableCell>
                    <TableCell><StatusBadge status={e.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatRelative(e.createdAt)}</TableCell>
                    <TableCell>
                      {e.status === "open" ? (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => toggleStatus(e.id, e.status)}>
                          <Check className="size-3.5" /> Marcar resolvida
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground" onClick={() => toggleStatus(e.id, e.status)}>
                          <RotateCcw className="size-3.5" /> Reabrir
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
