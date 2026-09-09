"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Plus, ScrollText } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { PolicyRuleRow } from "@/components/domain/policy-rule-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PolicyFormDialog } from "@/features/ai/policy-form-dialog";
import { deletePolicy, policies as policiesStore } from "@/data/mock";
import type { Policy } from "@/types";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(policiesStore);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Policy | undefined>(undefined);
  const [toDelete, setToDelete] = useState<Policy | null>(null);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(p: Policy) {
    setEditing(p);
    setFormOpen(true);
  }

  function handleSave(saved: Policy) {
    setPolicies((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    deletePolicy(toDelete.id);
    setPolicies((prev) => prev.filter((p) => p.id !== toDelete.id));
    toast.success("Política excluída", { description: `${toDelete.name} foi removida.` });
    setToDelete(null);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Políticas"
        description="O que humanos, workflows e agentes de IA podem fazer sozinhos — entre todos os módulos."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Nova política
          </Button>
        }
      />

      {policies.length === 0 ? (
        <EmptyState icon={ScrollText} title="Nenhuma política configurada" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {policies.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontal />
                      <span className="sr-only">Ações da política</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => openEdit(p)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => setToDelete(p)}>
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {p.rules.map((r) => (
                  <PolicyRuleRow key={r.id} rule={r} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PolicyFormDialog key={editing?.id ?? "new"} policy={editing} open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />

      <Dialog open={Boolean(toDelete)} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir política?</DialogTitle>
            <DialogDescription>
              &ldquo;{toDelete?.name}&rdquo; será removida permanentemente. Agentes e workflows vinculados a ela perderão essa restrição.
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
