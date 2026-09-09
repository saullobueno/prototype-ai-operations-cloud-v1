"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDepartment, updateDepartment } from "@/data/mock/departments";
import { employees } from "@/data/mock/employees";
import type { Department } from "@/types";

const NO_HEAD = "__none__";

interface DepartmentFormState {
  name: string;
  headId: string;
}

function toFormState(department?: Department): DepartmentFormState {
  return {
    name: department?.name ?? "",
    headId: department?.headId ?? NO_HEAD,
  };
}

interface DepartmentFormDialogProps {
  /** Presente = modo edição (muta este departamento). Ausente = modo criação. */
  department?: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (department: Department) => void;
}

export function DepartmentFormDialog({ department, open, onOpenChange, onSave }: DepartmentFormDialogProps) {
  const isEdit = Boolean(department);
  const [form, setForm] = useState<DepartmentFormState>(() => toFormState(department));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(department));
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const headId = form.headId === NO_HEAD ? undefined : form.headId;

    if (isEdit && department) {
      const updated = updateDepartment(department.id, { name: form.name.trim(), headId });
      if (updated) {
        onSave(updated);
        toast.success("Departamento atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newDepartment: Department = {
        id: `dept_${Date.now()}`,
        name: form.name.trim(),
        headId,
      };
      addDepartment(newDepartment);
      onSave(newDepartment);
      toast.success("Departamento criado", { description: `${newDepartment.name} foi adicionado à organização.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar departamento" : "Novo departamento"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados deste departamento." : "Adicione um novo departamento à organização."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="department-name">Nome</Label>
            <Input id="department-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Responsável</Label>
            <Select value={form.headId} onValueChange={(v) => setForm((p) => ({ ...p, headId: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_HEAD}>Sem responsável definido</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {isEdit ? "Salvar alterações" : "Criar departamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
