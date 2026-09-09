"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Workflow as WorkflowIcon } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TemplateFormDialog } from "@/features/automation/template-form-dialog";
import { addWorkflow, deleteWorkflow, getWorkflowVersion, upsertWorkflowVersion, workflows as workflowsStore } from "@/data/mock";
import type { Workflow } from "@/types";

export default function TemplatesPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowsStore);
  const templates = workflows.filter((w) => w.isTemplate);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Workflow | undefined>(undefined);
  const [toDelete, setToDelete] = useState<Workflow | null>(null);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(t: Workflow) {
    setEditing(t);
    setFormOpen(true);
  }

  function handleSave(saved: Workflow) {
    setWorkflows((prev) => {
      const exists = prev.some((w) => w.id === saved.id);
      return exists ? prev.map((w) => (w.id === saved.id ? saved : w)) : [...prev, saved];
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    deleteWorkflow(toDelete.id);
    setWorkflows((prev) => prev.filter((w) => w.id !== toDelete.id));
    toast.success("Modelo excluído", { description: `${toDelete.name} foi removido dos modelos.` });
    setToDelete(null);
  }

  function useTemplate(t: Workflow) {
    const version = getWorkflowVersion(t.currentVersionId);
    const id = `wf_${Date.now()}`;
    const versionId = `${id}_v1`;
    upsertWorkflowVersion({
      id: versionId,
      workflowId: id,
      version: 1,
      nodes: version?.nodes ?? [],
      edges: version?.edges ?? [],
    });
    const newWorkflow: Workflow = {
      id,
      name: `${t.name} (cópia)`,
      description: t.description,
      status: "draft",
      trigger: t.trigger,
      currentVersionId: versionId,
      totalRuns: 0,
      successRuns: 0,
      failedRuns: 0,
      waitingRuns: 0,
    };
    addWorkflow(newWorkflow);
    toast.success("Workflow criado a partir do modelo", { description: newWorkflow.name });
    router.push(`/automation/workflows/${id}`);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Modelos"
        description="Comece a partir de um workflow validado em vez de um canvas em branco."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Novo modelo
          </Button>
        }
      />

      {templates.length === 0 ? (
        <EmptyState icon={WorkflowIcon} title="Nenhum modelo cadastrado" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id}>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <WorkflowIcon className="size-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {t.templateCategory && <Badge variant="outline">{t.templateCategory}</Badge>}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreHorizontal />
                          <span className="sr-only">Ações do modelo</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => openEdit(t)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setToDelete(t)}>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => useTemplate(t)}>
                  Usar modelo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TemplateFormDialog key={editing?.id ?? "new"} template={editing} open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />

      <Dialog open={Boolean(toDelete)} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir modelo?</DialogTitle>
            <DialogDescription>
              &ldquo;{toDelete?.name}&rdquo; será removido permanentemente dos modelos. Essa ação não pode ser desfeita.
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
