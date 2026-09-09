"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search, Siren } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { RiskBadge, StatusBadge } from "@/components/domain/badges";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CaseFormDialog } from "@/features/business/case-form-dialog";
import { operationalCases } from "@/data/mock/operationalCases";
import { getProcessById } from "@/data/mock/processes";
import { getUserById } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import type { OperationalCase, OperationalCaseStatus } from "@/types";

type FilterTab = "all" | OperationalCaseStatus;

export default function OperationalCasesPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `operationalCases` em estado local só para forçar o
  // re-render quando um caso é criado ou editado (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCase, setEditCase] = useState<OperationalCase | null>(null);

  const filtered = useMemo(() => {
    let list = operationalCases;
    if (tab !== "all") list = list.filter((c) => c.status === tab);
    if (query.trim()) list = list.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()));
    return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  return (
    <PageContainer>
      <PageHeader
        title="Casos operacionais"
        description={`${operationalCases.length} casos registrados neste workspace`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo caso
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="open">Aberto</TabsTrigger>
            <TabsTrigger value="in_progress">Em andamento</TabsTrigger>
            <TabsTrigger value="resolved">Resolvido</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar casos..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Siren} title="Nenhum caso corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caso</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const process = c.processId ? getProcessById(c.processId) : undefined;
                const assignee = c.assigneeId ? getUserById(c.assigneeId) : undefined;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">{process?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{assignee?.name ?? "—"}</TableCell>
                    <TableCell><RiskBadge level={c.severity} /></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatRelative(c.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                            <span className="sr-only">Ações do caso</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setEditCase(c)}>Editar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <CaseFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <CaseFormDialog
        operationalCase={editCase ?? undefined}
        open={editCase !== null}
        onOpenChange={(next) => {
          if (!next) setEditCase(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />
    </PageContainer>
  );
}
