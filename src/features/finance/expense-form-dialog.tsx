"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addExpense, updateExpense } from "@/data/mock/expenses";
import { vendors } from "@/data/mock/vendors";
import { users } from "@/data/mock/users";
import { NOW } from "@/lib/time";
import type { Expense, ExpenseCategory } from "@/types";

const CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: "software", label: "Software" },
  { value: "travel", label: "Viagem" },
  { value: "office", label: "Escritório" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Outros" },
];

const STATUS_OPTIONS: { value: Expense["status"]; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "approved", label: "Aprovada" },
  { value: "rejected", label: "Rejeitada" },
  { value: "flagged", label: "Sinalizada" },
];

const NO_VENDOR = "__none__";

interface ExpenseFormState {
  category: ExpenseCategory;
  amount: string;
  submittedById: string;
  vendorId: string;
  status: Expense["status"];
}

function toFormState(expense?: Expense): ExpenseFormState {
  return {
    category: expense?.category ?? "software",
    amount: expense ? String(expense.amountCents / 100) : "",
    submittedById: expense?.submittedById ?? users[0]?.id ?? "",
    vendorId: expense?.vendorId ?? NO_VENDOR,
    status: expense?.status ?? "pending",
  };
}

interface ExpenseFormDialogProps {
  /** Presente = modo edição (muta esta despesa). Ausente = modo criação. */
  expense?: Expense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Expense) => void;
}

export function ExpenseFormDialog({ expense, open, onOpenChange, onSave }: ExpenseFormDialogProps) {
  const isEdit = Boolean(expense);
  const [form, setForm] = useState<ExpenseFormState>(() => toFormState(expense));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(expense));
  }

  function handleSave() {
    if (!form.submittedById || !form.amount.trim()) return;
    const amountCents = Math.round(Number(form.amount || 0) * 100);
    const vendorId = form.vendorId === NO_VENDOR ? undefined : form.vendorId;
    // Sair de "flagged" via edição manual limpa o motivo — ele só faz sentido enquanto sinalizado pela IA.
    const anomalyReason = form.status === "flagged" ? expense?.anomalyReason : undefined;

    if (isEdit && expense) {
      const updated = updateExpense(expense.id, {
        category: form.category,
        amountCents,
        submittedById: form.submittedById,
        vendorId,
        status: form.status,
        anomalyReason,
      });
      if (updated) {
        onSave(updated);
        toast.success("Despesa atualizada", { description: "Os dados desta despesa foram atualizados." });
      }
    } else {
      const newExpense: Expense = {
        id: `exp_${Date.now()}`,
        category: form.category,
        amountCents,
        submittedById: form.submittedById,
        vendorId,
        status: form.status,
        createdAt: NOW.toISOString(),
      };
      addExpense(newExpense);
      onSave(newExpense);
      toast.success("Despesa registrada", { description: "A despesa foi adicionada." });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar despesa" : "Nova despesa"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados desta despesa." : "Registre uma nova despesa submetida pelo time."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
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
              <Label htmlFor="expense-amount">Valor (€)</Label>
              <Input
                id="expense-amount"
                type="number"
                min={0}
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                autoFocus
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Colaborador</Label>
            <Select value={form.submittedById} onValueChange={(v) => setForm((p) => ({ ...p, submittedById: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Fornecedor (opcional)</Label>
              <Select value={form.vendorId} onValueChange={(v) => setForm((p) => ({ ...p, vendorId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_VENDOR}>Nenhum</SelectItem>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as Expense["status"] }))}>
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
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.submittedById || !form.amount.trim()}>
            {isEdit ? "Salvar alterações" : "Registrar despesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
