"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
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
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { HealthMeterRow } from "@/components/domain/health-meter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoalStatusBadge } from "@/features/people/people-badges";
import { GoalFormDialog } from "@/features/people/goal-form-dialog";
import { goals, deleteGoal } from "@/data/mock/goals";
import { getEmployeeById } from "@/data/mock/employees";
import { formatDate } from "@/lib/format";
import type { Goal } from "@/types";

type FilterTab = "all" | Goal["status"];

export default function GoalsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<FilterTab>("all");
  // Espelha o array compartilhado `goals` em estado local só para forçar o re-render quando uma
  // meta é criada, editada ou excluída (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);

  const filtered = useMemo(() => {
    const list = tab === "all" ? goals : goals.filter((g) => g.status === tab);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, version]);

  function handleDelete() {
    if (!deleteTarget) return;
    deleteGoal(deleteTarget.id);
    toast.success("Meta excluída", { description: `"${deleteTarget.title}" foi removida.` });
    setVersion((v) => v + 1);
    setDeleteTarget(null);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Metas"
        description={`${goals.length} metas em acompanhamento`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Nova meta
          </Button>
        }
      />

      <div className="mb-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="on_track">No prazo</TabsTrigger>
            <TabsTrigger value="at_risk">Em risco</TabsTrigger>
            <TabsTrigger value="achieved">Alcançadas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Target} title="Nenhuma meta corresponde ao filtro" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((goal) => {
            const employee = getEmployeeById(goal.employeeId);
            return (
              <Card
                key={goal.id}
                className="cursor-pointer px-4 py-3.5 transition-colors hover:bg-accent"
                onClick={() => router.push(`/modules/people/employees/${goal.employeeId}/goals`)}
              >
                <CardContent className="space-y-2 px-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {employee && <EntityAvatar name={employee.name} size="xs" />}
                      <span className="truncate text-xs text-muted-foreground">{employee?.name}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <GoalStatusBadge status={goal.status} />
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <MoreHorizontal />
                              <span className="sr-only">Ações da meta</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditGoal(goal)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(goal)}>
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">{goal.title}</p>
                  <HealthMeterRow label="Progresso" value={goal.progress} tone={goal.status === "at_risk" ? "danger" : "default"} />
                  <p className="text-xs text-muted-foreground">Prazo: {formatDate(goal.dueDate)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <GoalFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <GoalFormDialog
        goal={editGoal ?? undefined}
        open={editGoal !== null}
        onOpenChange={(next) => {
          if (!next) setEditGoal(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(next) => !next && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir meta?</DialogTitle>
            <DialogDescription>&ldquo;{deleteTarget?.title}&rdquo; será removida permanentemente. Essa ação não pode ser desfeita.</DialogDescription>
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
