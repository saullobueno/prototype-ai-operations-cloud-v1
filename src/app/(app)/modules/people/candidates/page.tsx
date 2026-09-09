"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Search, UserSearch } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
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
import { CandidateStageBadge } from "@/features/people/people-badges";
import { CandidateFormDialog } from "@/features/people/candidate-form-dialog";
import { candidates, deleteCandidate } from "@/data/mock/candidates";
import { formatDate } from "@/lib/format";
import type { Candidate, CandidateStage } from "@/types";

type FilterTab = "all" | CandidateStage;

export default function CandidatesPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `candidates` em estado local só para forçar o re-render quando um
  // candidato é criado, editado ou excluído (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    let list = candidates;
    if (tab !== "all") list = list.filter((c) => c.stage === tab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  function handleDelete() {
    if (!deleteTarget) return;
    deleteCandidate(deleteTarget.id);
    toast.success("Candidato excluído", { description: `${deleteTarget.name} foi removido do funil.` });
    setDeleteTarget(null);
    setVersion((v) => v + 1);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Candidatos"
        description={`${candidates.length} candidatos no funil de contratação`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo candidato
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="applied">Aplicou</TabsTrigger>
            <TabsTrigger value="screening">Triagem</TabsTrigger>
            <TabsTrigger value="interview">Entrevista</TabsTrigger>
            <TabsTrigger value="offer">Oferta</TabsTrigger>
            <TabsTrigger value="hired">Contratado</TabsTrigger>
            <TabsTrigger value="rejected">Rejeitado</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar candidatos..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserSearch} title="Nenhum candidato corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Vaga</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Aplicou em</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((candidate) => (
                <ClickableTableRow key={candidate.id} href={`/modules/people/candidates/${candidate.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <EntityAvatar name={candidate.name} size="sm" />
                      <p className="font-medium text-foreground">{candidate.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{candidate.role}</TableCell>
                  <TableCell>
                    <CandidateStageBadge stage={candidate.stage} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(candidate.appliedAt)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreHorizontal />
                          <span className="sr-only">Ações do candidato</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditCandidate(candidate)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(candidate)}>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CandidateFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <CandidateFormDialog
        candidate={editCandidate ?? undefined}
        open={editCandidate !== null}
        onOpenChange={(next) => {
          if (!next) setEditCandidate(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(next) => !next && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir candidato?</DialogTitle>
            <DialogDescription>&ldquo;{deleteTarget?.name}&rdquo; será removido permanentemente do funil de contratação.</DialogDescription>
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
