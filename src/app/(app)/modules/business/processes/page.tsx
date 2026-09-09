"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Plus, Search, Workflow as WorkflowIcon } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProcessFormDialog } from "@/features/business/process-form-dialog";
import { deleteProcess, processes } from "@/data/mock/processes";
import { toast } from "sonner";
import type { BusinessProcess, BusinessProcessCategory } from "@/types";

const CATEGORY_LABEL: Record<BusinessProcessCategory, string> = {
  procurement: "Procurement",
  onboarding: "Onboarding",
  compliance: "Compliance",
  operations: "Operações",
  finance: "Finanças",
  hr: "RH",
};

type FilterTab = "all" | "active" | "paused" | "draft";

export default function ProcessLibraryPage() {
  const router = useRouter();
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `processes` em estado local só para forçar o re-render
  // quando um processo é criado, editado ou excluído (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProcess, setEditProcess] = useState<BusinessProcess | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusinessProcess | null>(null);

  const filtered = useMemo(() => {
    let list = processes;
    if (tab !== "all") list = list.filter((p) => p.status === tab);
    if (query.trim()) list = list.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  function handleDelete() {
    if (!deleteTarget) return;
    deleteProcess(deleteTarget.id);
    toast.success("Processo excluído", { description: `${deleteTarget.name} foi removido da biblioteca de processos.` });
    setDeleteTarget(null);
    setVersion((v) => v + 1);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Biblioteca de processos"
        description={`${processes.length} processos de negócio modelados neste workspace`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo processo
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="paused">Pausados</TabsTrigger>
            <TabsTrigger value="draft">Rascunho</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar processos..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={WorkflowIcon} title="Nenhum processo corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Execuções totais</TableHead>
                <TableHead>Duração média</TableHead>
                <TableHead>Taxa de exceção</TableHead>
                <TableHead>Automação</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <ClickableTableRow key={p.id} href={`/modules/business/processes/${p.id}`}>
                  <TableCell>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{CATEGORY_LABEL[p.category]}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell>{p.totalRuns.toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="text-muted-foreground">{p.avgDurationHours}h</TableCell>
                  <TableCell className="text-muted-foreground">{p.exceptionRate}%</TableCell>
                  <TableCell className="text-muted-foreground">{p.automationRate}%</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreHorizontal />
                          <span className="sr-only">Ações do processo</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => router.push(`/modules/business/processes/${p.id}`)}>Ver processo</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setEditProcess(p)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(p)}>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ProcessFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <ProcessFormDialog
        process={editProcess ?? undefined}
        open={editProcess !== null}
        onOpenChange={(next) => {
          if (!next) setEditProcess(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(next) => !next && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir processo?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.name}&rdquo; será removido da biblioteca de processos.
              {deleteTarget && deleteTarget.totalRuns > 0
                ? ` As ${deleteTarget.totalRuns} execuções já registradas permanecem no histórico, mas ficarão sem processo vinculado.`
                : ""}{" "}
              Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
