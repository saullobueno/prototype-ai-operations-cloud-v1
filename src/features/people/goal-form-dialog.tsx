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
import { addGoal, updateGoal } from "@/data/mock/goals";
import { employees } from "@/data/mock/employees";
import type { Goal } from "@/types";

const STATUS_OPTIONS: { value: Goal["status"]; label: string }[] = [
  { value: "on_track", label: "No prazo" },
  { value: "at_risk", label: "Em risco" },
  { value: "achieved", label: "Alcançada" },
];

interface GoalFormState {
  employeeId: string;
  title: string;
  status: Goal["status"];
  progress: string;
  dueDate: string;
}

function toFormState(goal?: Goal, defaultEmployeeId?: string): GoalFormState {
  return {
    employeeId: goal?.employeeId ?? defaultEmployeeId ?? employees[0]?.id ?? "",
    title: goal?.title ?? "",
    status: goal?.status ?? "on_track",
    progress: String(goal?.progress ?? 0),
    dueDate: goal?.dueDate ? goal.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

interface GoalFormDialogProps {
  /** Presente = modo edição (muta esta meta). Ausente = modo criação. */
  goal?: Goal;
  /** Fixa o colaborador (usado dentro da página do colaborador) — esconde o seletor. */
  defaultEmployeeId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: Goal) => void;
}

export function GoalFormDialog({ goal, defaultEmployeeId, open, onOpenChange, onSave }: GoalFormDialogProps) {
  const isEdit = Boolean(goal);
  const [form, setForm] = useState<GoalFormState>(() => toFormState(goal, defaultEmployeeId));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(goal, defaultEmployeeId));
  }

  function handleSave() {
    if (!form.title.trim() || !form.employeeId || !form.dueDate) return;
    const progress = Math.min(100, Math.max(0, Math.round(Number(form.progress) || 0)));

    if (isEdit && goal) {
      const updated = updateGoal(goal.id, {
        employeeId: form.employeeId,
        title: form.title.trim(),
        status: form.status,
        progress,
        dueDate: new Date(form.dueDate).toISOString(),
      });
      if (updated) {
        onSave(updated);
        toast.success("Meta atualizada", { description: `${updated.title} foi atualizada.` });
      }
    } else {
      const newGoal: Goal = {
        id: `goal_${Date.now()}`,
        employeeId: form.employeeId,
        title: form.title.trim(),
        status: form.status,
        progress,
        dueDate: new Date(form.dueDate).toISOString(),
      };
      addGoal(newGoal);
      onSave(newGoal);
      toast.success("Meta criada", { description: `${newGoal.title} foi adicionada ao acompanhamento.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar meta" : "Nova meta"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados desta meta." : "Defina uma nova meta de performance para um colaborador."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {!defaultEmployeeId && (
            <div className="space-y-1.5">
              <Label>Colaborador</Label>
              <Select value={form.employeeId} onValueChange={(v) => setForm((p) => ({ ...p, employeeId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="goal-title">Título</Label>
            <Input id="goal-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as Goal["status"] }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-progress">Progresso (%)</Label>
              <Input
                id="goal-progress"
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => setForm((p) => ({ ...p, progress: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="goal-due">Prazo</Label>
            <Input id="goal-due" type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.title.trim()}>
            {isEdit ? "Salvar alterações" : "Criar meta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
