"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, FileWarning, MoreHorizontal, Plus, Receipt, ShieldCheck, Siren, UserMinus, type LucideIcon } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProcessFormDialog } from "@/features/business/process-form-dialog";
import { deleteProcess, processes } from "@/data/mock/processes";
import type { BusinessProcess, BusinessProcessCategory } from "@/types";

const CATEGORY_LABEL: Record<BusinessProcessCategory, string> = {
  procurement: "Procurement",
  onboarding: "Onboarding",
  compliance: "Compliance",
  operations: "Operações",
  finance: "Finanças",
  hr: "RH",
};

const CATEGORY_ICON: Record<BusinessProcessCategory, LucideIcon> = {
  onboarding: Building2,
  procurement: Receipt,
  compliance: ShieldCheck,
  operations: Siren,
  finance: FileWarning,
  hr: UserMinus,
};

export default function ProcessTemplatesPage() {
  const router = useRouter();
  // Espelha o array compartilhado `processes` em estado local só para forçar o re-render
  // quando um modelo (processo) é criado, editado ou excluído (mesma referência mutada) —
  // mesmo padrão de src/app/(app)/modules/business/processes/page.tsx. Os "modelos" aqui são
  // os próprios processos da biblioteca, exibidos como galeria para começar um novo run a partir
  // de um processo já validado, em vez de uma entidade de template separada.
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProcess, setEditProcess] = useState<BusinessProcess | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusinessProcess | null>(null);

  function handleDelete() {
    if (!deleteTarget) return;
    deleteProcess(deleteTarget.id);
    toast.success("Modelo excluído", { description: `${deleteTarget.name} foi removido da biblioteca de processos.` });
    setDeleteTarget(null);
    setVersion((v) => v + 1);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Modelos"
        description="Comece a partir de um processo validado em vez de desenhar do zero."
        actions={
          <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
            <Plus /> Criar processo em branco
          </Button>
        }
      />

      <div key={version} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {processes.map((p) => {
          const Icon = CATEGORY_ICON[p.category];
          return (
            <Card key={p.id}>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline">{CATEGORY_LABEL[p.category]}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreHorizontal />
                          <span className="sr-only">Ações do modelo</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditProcess(p)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(p)}>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => router.push(`/modules/business/processes/${p.id}`)}>
                  Usar modelo
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ProcessFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={(process: BusinessProcess) => router.push(`/modules/business/processes/${process.id}`)}
      />

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
            <DialogTitle>Excluir modelo?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.name}&rdquo; será removido da biblioteca de processos e deixará de aparecer como modelo.
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
