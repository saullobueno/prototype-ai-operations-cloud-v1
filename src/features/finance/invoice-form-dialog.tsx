"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addInvoice, updateInvoice } from "@/data/mock/invoices";
import { customers } from "@/data/mock/customers";
import { NOW } from "@/lib/time";
import { differenceInCalendarDays } from "date-fns";
import type { Invoice, InvoiceStatus } from "@/types";

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviada" },
  { value: "viewed", label: "Visualizada" },
  { value: "overdue", label: "Vencida" },
  { value: "paid", label: "Paga" },
  { value: "void", label: "Anulada" },
];

interface InvoiceFormState {
  number: string;
  customerId: string;
  amount: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
}

function toFormState(invoice?: Invoice): InvoiceFormState {
  return {
    number: invoice?.number ?? `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: invoice?.customerId ?? customers[0]?.id ?? "",
    amount: invoice ? String(invoice.amountCents / 100) : "",
    status: invoice?.status ?? "draft",
    issueDate: invoice?.issueDate ? invoice.issueDate.slice(0, 10) : NOW.toISOString().slice(0, 10),
    dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
  };
}

interface InvoiceFormDialogProps {
  /** Presente = modo edição (muta esta fatura). Ausente = modo criação. */
  invoice?: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (invoice: Invoice) => void;
}

export function InvoiceFormDialog({ invoice, open, onOpenChange, onSave }: InvoiceFormDialogProps) {
  const isEdit = Boolean(invoice);
  const [form, setForm] = useState<InvoiceFormState>(() => toFormState(invoice));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(invoice));
  }

  function handleSave() {
    if (!form.number.trim() || !form.customerId || !form.dueDate || !form.amount.trim()) return;
    const amountCents = Math.round(Number(form.amount || 0) * 100);
    const issueDate = new Date(form.issueDate).toISOString();
    const dueDate = new Date(form.dueDate).toISOString();

    // Um único line item que reflete o valor total — este formulário edita o resumo da fatura,
    // não a composição por item (aba "Itens" na tela de detalhe). Mantém total e itens consistentes.
    const lineItems = [{ id: "li_1", description: "Valor da fatura", quantity: 1, unitAmountCents: amountCents }];

    // Deriva os campos de atraso/risco a partir do status escolhido, mesma lógica usada pelo
    // Payment Recovery Agent nos dados gerados (src/data/mock/invoices.ts).
    const daysOverdue = form.status === "overdue" ? Math.max(differenceInCalendarDays(NOW, new Date(dueDate)), 1) : undefined;
    const paidAt = form.status === "paid" ? NOW.toISOString() : undefined;
    const clearsRisk = form.status !== "overdue";

    if (isEdit && invoice) {
      const updated = updateInvoice(invoice.id, {
        number: form.number.trim(),
        customerId: form.customerId,
        amountCents,
        status: form.status,
        issueDate,
        dueDate,
        lineItems,
        daysOverdue,
        paidAt,
        riskLevel: clearsRisk ? undefined : invoice.riskLevel,
        riskReasons: clearsRisk ? undefined : invoice.riskReasons,
      });
      if (updated) {
        onSave(updated);
        toast.success("Fatura atualizada", { description: `${updated.number} foi atualizada.` });
      }
    } else {
      const newInvoice: Invoice = {
        id: `inv_${Date.now()}`,
        number: form.number.trim(),
        customerId: form.customerId,
        amountCents,
        status: form.status,
        issueDate,
        dueDate,
        lineItems,
        daysOverdue,
        paidAt,
      };
      addInvoice(newInvoice);
      onSave(newInvoice);
      toast.success("Fatura criada", { description: `${newInvoice.number} foi adicionada.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar fatura" : "Nova fatura"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados desta fatura." : "Crie uma nova fatura para um cliente."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="invoice-number">Número</Label>
              <Input id="invoice-number" value={form.number} onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invoice-amount">Valor (€)</Label>
              <Input id="invoice-amount" type="number" min={0} value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Cliente</Label>
            <Select value={form.customerId} onValueChange={(v) => setForm((p) => ({ ...p, customerId: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.company ?? c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="invoice-issue-date">Emissão</Label>
              <Input id="invoice-issue-date" type="date" value={form.issueDate} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invoice-due-date">Vencimento</Label>
              <Input id="invoice-due-date" type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as InvoiceStatus }))}>
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
          <Button onClick={handleSave} disabled={!form.number.trim() || !form.customerId || !form.dueDate || !form.amount.trim()}>
            {isEdit ? "Salvar alterações" : "Criar fatura"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
