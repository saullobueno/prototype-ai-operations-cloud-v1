"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addBill, updateBill } from "@/data/mock/bills";
import { vendors } from "@/data/mock/vendors";
import { NOW } from "@/lib/time";
import type { Bill, BillStatus } from "@/types";

const STATUS_OPTIONS: { value: BillStatus; label: string }[] = [
  { value: "pending_approval", label: "Aguardando aprovação" },
  { value: "approved", label: "Aprovada" },
  { value: "paid", label: "Paga" },
  { value: "rejected", label: "Rejeitada" },
];

interface BillFormState {
  vendorId: string;
  amount: string;
  status: BillStatus;
  dueDate: string;
}

function toFormState(bill?: Bill): BillFormState {
  return {
    vendorId: bill?.vendorId ?? vendors[0]?.id ?? "",
    amount: bill ? String(bill.amountCents / 100) : "",
    status: bill?.status ?? "pending_approval",
    dueDate: bill?.dueDate ? bill.dueDate.slice(0, 10) : "",
  };
}

interface BillFormDialogProps {
  /** Presente = modo edição (muta esta bill). Ausente = modo criação. */
  bill?: Bill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bill: Bill) => void;
}

export function BillFormDialog({ bill, open, onOpenChange, onSave }: BillFormDialogProps) {
  const isEdit = Boolean(bill);
  const [form, setForm] = useState<BillFormState>(() => toFormState(bill));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(bill));
  }

  function handleSave() {
    if (!form.vendorId || !form.dueDate || !form.amount.trim()) return;
    const amountCents = Math.round(Number(form.amount || 0) * 100);
    const dueDate = new Date(form.dueDate).toISOString();

    if (isEdit && bill) {
      const updated = updateBill(bill.id, { vendorId: form.vendorId, amountCents, status: form.status, dueDate });
      if (updated) {
        onSave(updated);
        toast.success("Bill atualizada", { description: "Os dados desta conta a pagar foram atualizados." });
      }
    } else {
      const newBill: Bill = {
        id: `bill_${Date.now()}`,
        vendorId: form.vendorId,
        amountCents,
        status: form.status,
        dueDate,
        createdAt: NOW.toISOString(),
      };
      addBill(newBill);
      onSave(newBill);
      toast.success("Bill criada", { description: "A conta a pagar foi adicionada." });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar bill" : "Nova bill"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados desta conta a pagar." : "Registre uma nova conta a pagar para um fornecedor."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Fornecedor</Label>
            <Select value={form.vendorId} onValueChange={(v) => setForm((p) => ({ ...p, vendorId: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bill-amount">Valor (€)</Label>
              <Input
                id="bill-amount"
                type="number"
                min={0}
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bill-due-date">Vencimento</Label>
              <Input id="bill-due-date" type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as BillStatus }))}>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.vendorId || !form.dueDate || !form.amount.trim()}>
            {isEdit ? "Salvar alterações" : "Criar bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
