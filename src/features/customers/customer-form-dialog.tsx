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
import { addCustomer, updateCustomer } from "@/data/mock";
import type { Customer, CustomerPlan } from "@/types";

const PLAN_OPTIONS: CustomerPlan[] = ["Starter", "Professional", "Business", "Enterprise"];

interface CustomerFormState {
  name: string;
  email: string;
  company: string;
  plan: CustomerPlan;
  tags: string;
}

function toFormState(customer?: Customer): CustomerFormState {
  return {
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    company: customer?.company ?? "",
    plan: customer?.plan ?? "Starter",
    tags: customer?.tags.join(", ") ?? "",
  };
}

interface CustomerFormDialogProps {
  /** Presente = modo edição (muta este cliente). Ausente = modo criação. */
  customer?: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customer: Customer) => void;
}

export function CustomerFormDialog({ customer, open, onOpenChange, onSave }: CustomerFormDialogProps) {
  const isEdit = Boolean(customer);
  const [form, setForm] = useState<CustomerFormState>(() => toFormState(customer));

  // Recarrega o formulário sempre que o dialog transiciona de fechado para aberto (troca de
  // cliente em edição, ou reset em criação). Ajuste de estado durante a renderização (em vez de
  // useEffect) conforme https://react.dev/learn/you-might-not-need-an-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(customer));
  }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim()) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEdit && customer) {
      const updated = updateCustomer(customer.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        plan: form.plan,
        tags,
      });
      if (updated) {
        onSave(updated);
        toast.success("Cliente atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newCustomer: Customer = {
        id: `cus_${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        plan: form.plan,
        lifetimeValueCents: 0,
        customerSince: new Date().toISOString(),
        health: "healthy",
        tags,
      };
      addCustomer(newCustomer);
      onSave(newCustomer);
      toast.success("Cliente criado", { description: `${newCustomer.name} foi adicionado ao workspace.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar cliente" : "Novo cliente"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados básicos deste cliente." : "Adicione um novo cliente ao workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="customer-name">Nome</Label>
            <Input id="customer-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customer-email">Email</Label>
            <Input id="customer-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="customer-company">Empresa</Label>
              <Input id="customer-company" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Plano</Label>
              <Select value={form.plan} onValueChange={(v) => setForm((p) => ({ ...p, plan: v as CustomerPlan }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customer-tags">Tags (separadas por vírgula)</Label>
            <Input id="customer-tags" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="ex: vip, novo" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim()}>
            {isEdit ? "Salvar alterações" : "Criar cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
