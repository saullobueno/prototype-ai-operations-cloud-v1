"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addBudget, updateBudget } from "@/data/mock/budgets";
import { NOW, monthsAgo } from "@/lib/time";
import type { Budget, ExpenseCategory } from "@/types";

const CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: "software", label: "Software" },
  { value: "travel", label: "Viagem" },
  { value: "office", label: "Escritório" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Outros" },
];

interface BudgetFormState {
  name: string;
  category: ExpenseCategory;
  allocated: string;
  periodStart: string;
  periodEnd: string;
}

function toFormState(budget?: Budget): BudgetFormState {
  return {
    name: budget?.name ?? "",
    category: budget?.category ?? "software",
    allocated: budget ? String(budget.allocatedCents / 100) : "",
    periodStart: budget?.periodStart ? budget.periodStart.slice(0, 10) : monthsAgo(0).slice(0, 10),
    periodEnd: budget?.periodEnd ? budget.periodEnd.slice(0, 10) : "",
  };
}

interface BudgetFormDialogProps {
  /** Presente = modo edição (muta este orçamento). Ausente = modo criação. */
  budget?: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (budget: Budget) => void;
}

export function BudgetFormDialog({ budget, open, onOpenChange, onSave }: BudgetFormDialogProps) {
  const isEdit = Boolean(budget);
  const [form, setForm] = useState<BudgetFormState>(() => toFormState(budget));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(budget));
  }

  function handleSave() {
    if (!form.name.trim() || !form.allocated.trim() || !form.periodEnd) return;
    const allocatedCents = Math.round(Number(form.allocated || 0) * 100);
    const periodStart = new Date(form.periodStart).toISOString();
    const periodEnd = new Date(form.periodEnd).toISOString();

    if (isEdit && budget) {
      const updated = updateBudget(budget.id, { name: form.name.trim(), category: form.category, allocatedCents, periodStart, periodEnd });
      if (updated) {
        onSave(updated);
        toast.success("Orçamento atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newBudget: Budget = {
        id: `budget_${Date.now()}`,
        name: form.name.trim(),
        category: form.category,
        allocatedCents,
        spentCents: 0,
        periodStart,
        periodEnd,
      };
      addBudget(newBudget);
      onSave(newBudget);
      toast.success("Orçamento criado", { description: `${newBudget.name} foi adicionado.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar orçamento" : "Novo orçamento"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize a meta de gasto desta categoria." : "Defina uma meta de gasto para uma categoria de despesa."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="budget-name">Nome</Label>
            <Input id="budget-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Software & Cloud — Q4 2026" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as ExpenseCategory }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget-allocated">Valor alocado (€)</Label>
              <Input id="budget-allocated" type="number" min={0} value={form.allocated} onChange={(e) => setForm((p) => ({ ...p, allocated: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="budget-start">Início do período</Label>
              <Input id="budget-start" type="date" value={form.periodStart} onChange={(e) => setForm((p) => ({ ...p, periodStart: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget-end">Fim do período</Label>
              <Input id="budget-end" type="date" value={form.periodEnd} onChange={(e) => setForm((p) => ({ ...p, periodEnd: e.target.value }))} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.allocated.trim() || !form.periodEnd}>
            {isEdit ? "Salvar alterações" : "Criar orçamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
