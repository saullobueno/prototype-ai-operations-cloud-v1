"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building, MoreHorizontal, Plus } from "lucide-react";
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
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { DepartmentFormDialog } from "@/features/people/department-form-dialog";
import { departments, deleteDepartment } from "@/data/mock/departments";
import { getEmployeeById, getEmployeesByDepartment } from "@/data/mock/employees";
import type { Department } from "@/types";

export default function DepartmentsPage() {
  const router = useRouter();
  // Espelha o array compartilhado `departments` em estado local só para forçar o re-render quando
  // um departamento é criado, editado ou excluído (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  function handleDelete() {
    if (!deleteTarget) return;
    const removed = deleteDepartment(deleteTarget.id);
    if (removed) {
      toast.success("Departamento excluído", { description: `${deleteTarget.name} foi removido.` });
      setVersion((v) => v + 1);
    } else {
      toast.error("Não foi possível excluir", { description: "Este departamento ainda tem colaboradores vinculados." });
    }
    setDeleteTarget(null);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Departamentos"
        description={`${departments.length} departamentos na organização`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo departamento
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" key={version}>
        {departments.map((department) => {
          const members = getEmployeesByDepartment(department.id);
          const head = department.headId ? getEmployeeById(department.headId) : undefined;
          const active = members.filter((m) => m.status !== "terminated").length;
          return (
            <Card key={department.id} className="cursor-pointer transition-colors hover:bg-accent" onClick={() => router.push(`/modules/people/employees?department=${department.id}`)}>
              <CardContent className="flex items-start gap-3 pt-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Building className="size-4.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{department.name}</p>
                  <p className="text-xs text-muted-foreground">{active} colaboradores ativos</p>
                  {head && (
                    <div className="mt-2 flex items-center gap-2">
                      <EntityAvatar name={head.name} size="xs" />
                      <span className="text-xs text-muted-foreground">{head.name} · {head.title}</span>
                    </div>
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal />
                        <span className="sr-only">Ações do departamento</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEditDepartment(department)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(department)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DepartmentFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <DepartmentFormDialog
        department={editDepartment ?? undefined}
        open={editDepartment !== null}
        onOpenChange={(next) => {
          if (!next) setEditDepartment(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(next) => !next && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir departamento?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.name}&rdquo; será removido permanentemente. Só é possível excluir departamentos sem colaboradores vinculados.
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
