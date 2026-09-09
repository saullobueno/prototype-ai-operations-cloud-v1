"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Plus, Search, Workflow as WorkflowIcon } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteWorkflow, workflows as workflowsStore } from "@/data/mock";
import type { Workflow } from "@/types";

const TRIGGER_LABEL: Record<string, string> = {
  conversation_created: "conversa criada",
  ticket_created: "ticket criado",
  customer_created: "cliente criado",
  message_received: "mensagem recebida",
  payment_failed: "pagamento falhou",
  sla_approaching: "SLA se aproximando",
  webhook: "webhook",
  schedule: "agendamento",
  manual: "manual",
};

type FilterTab = "all" | "active" | "paused" | "draft";

export default function WorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowsStore);
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<Workflow | null>(null);

  const filtered = useMemo(() => {
    let list = workflows;
    if (tab !== "all") list = list.filter((w) => w.status === tab);
    if (query.trim()) list = list.filter((w) => w.name.toLowerCase().includes(query.trim().toLowerCase()));
    return list;
  }, [workflows, tab, query]);

  function confirmDelete() {
    if (!toDelete) return;
    deleteWorkflow(toDelete.id);
    setWorkflows((prev) => prev.filter((w) => w.id !== toDelete.id));
    toast.success("Workflow excluído", { description: `${toDelete.name} foi removido.` });
    setToDelete(null);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Workflows"
        description={`${workflows.length} workflows neste workspace`}
        actions={
          <Button asChild>
            <Link href="/automation/workflows/new"><Plus /> Criar workflow</Link>
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
          <Input placeholder="Buscar workflows..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={WorkflowIcon} title="Nenhum workflow corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gatilho</TableHead>
                <TableHead>Execuções</TableHead>
                <TableHead>Taxa de sucesso</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((w) => (
                <TableRow key={w.id} className="cursor-pointer" onClick={() => router.push(`/automation/workflows/${w.id}`)}>
                  <TableCell>
                    <p className="font-medium text-foreground">{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.description}</p>
                  </TableCell>
                  <TableCell><StatusBadge status={w.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{TRIGGER_LABEL[w.trigger.type] ?? w.trigger.type}</TableCell>
                  <TableCell>{w.totalRuns.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{w.totalRuns > 0 ? ((w.successRuns / w.totalRuns) * 100).toFixed(1) : "0.0"}%</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreHorizontal />
                          <span className="sr-only">Ações do workflow</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => router.push(`/automation/workflows/${w.id}`)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setToDelete(w)}>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={Boolean(toDelete)} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir workflow?</DialogTitle>
            <DialogDescription>
              &ldquo;{toDelete?.name}&rdquo; será removido permanentemente. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
