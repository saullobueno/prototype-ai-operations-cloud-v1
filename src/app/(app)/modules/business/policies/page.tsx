"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Plus, ShieldCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { PolicyRuleRow } from "@/components/domain/policy-rule-row";
import { EmptyState } from "@/components/domain/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PolicyFormDialog } from "@/features/business/policy-form-dialog";
import { businessPolicies, deleteBusinessPolicy } from "@/data/mock/businessPolicies";
import { businessApprovals } from "@/data/mock/businessApprovals";
import type { Policy } from "@/types";

export default function BusinessPoliciesPage() {
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPolicy, setEditPolicy] = useState<Policy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Policy | null>(null);

  const pendingApprovals = businessApprovals.filter((a) => a.status === "pending");
  const totalRules = businessPolicies.reduce((s, p) => s + p.rules.length, 0);

  function handleDelete() {
    if (!deleteTarget) return;
    deleteBusinessPolicy(deleteTarget.id);
    toast.success("Política excluída", { description: `${deleteTarget.name} foi removida.` });
    setDeleteTarget(null);
    setVersion((v) => v + 1);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Políticas"
        description="Regras de governança que restringem o AI Workforce de Business Operations."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Nova política
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <KPIStatCard label="Políticas ativas" value={String(businessPolicies.length)} />
        <KPIStatCard label="Regras configuradas" value={String(totalRules)} />
        <KPIStatCard label="Aprovações pendentes" value={String(pendingApprovals.length)} />
      </div>

      {businessPolicies.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nenhuma política configurada ainda" />
      ) : (
        <div className="space-y-4">
          {businessPolicies.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontal />
                      <span className="sr-only">Ações da política</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditPolicy(p)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(p)}>Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {p.rules.map((r) => <PolicyRuleRow key={r.id} rule={r} />)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PolicyFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <PolicyFormDialog
        policy={editPolicy ?? undefined}
        open={editPolicy !== null}
        onOpenChange={(next) => {
          if (!next) setEditPolicy(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(next) => !next && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir política?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.name}&rdquo; será removida e deixará de restringir o AI Workforce. Essa ação não pode ser desfeita.
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
