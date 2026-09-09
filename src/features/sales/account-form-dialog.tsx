"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addAccount, updateAccount, users } from "@/data/mock";
import type { Account, AccountStatus, ICPTier } from "@/types";

const ICP_OPTIONS: { value: ICPTier; label: string; score: number }[] = [
  { value: "ideal", label: "Ideal", score: 90 },
  { value: "good", label: "Good", score: 70 },
  { value: "poor", label: "Poor", score: 40 },
];

const STATUS_OPTIONS: { value: AccountStatus; label: string }[] = [
  { value: "prospecting", label: "Prospectando" },
  { value: "qualifying", label: "Qualificando" },
  { value: "active_deal", label: "Deal ativo" },
  { value: "customer", label: "Cliente" },
  { value: "lost", label: "Perdido" },
  { value: "churned", label: "Churn" },
];

interface AccountFormState {
  name: string;
  domain: string;
  industry: string;
  employeeCount: string;
  annualRevenue: string;
  icpTier: ICPTier;
  ownerId: string;
  status: AccountStatus;
  tags: string;
}

function toFormState(account?: Account): AccountFormState {
  return {
    name: account?.name ?? "",
    domain: account?.domain ?? "",
    industry: account?.industry ?? "",
    employeeCount: account?.employeeCount ? String(account.employeeCount) : "",
    annualRevenue: account?.annualRevenueCents ? String(account.annualRevenueCents / 100) : "",
    icpTier: account?.icpTier ?? "good",
    ownerId: account?.ownerId ?? users[0]?.id ?? "",
    status: account?.status ?? "prospecting",
    tags: account?.tags.join(", ") ?? "",
  };
}

interface AccountFormDialogProps {
  /** Presente = modo edição (muta este account). Ausente = modo criação. */
  account?: Account;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (account: Account) => void;
}

export function AccountFormDialog({ account, open, onOpenChange, onSave }: AccountFormDialogProps) {
  const isEdit = Boolean(account);
  const [form, setForm] = useState<AccountFormState>(() => toFormState(account));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(account));
  }

  function handleSave() {
    if (!form.name.trim() || !form.domain.trim() || !form.industry.trim()) return;

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const icpFitScore = ICP_OPTIONS.find((o) => o.value === form.icpTier)?.score ?? 70;
    const employeeCount = form.employeeCount.trim() ? Number(form.employeeCount) : undefined;
    const annualRevenueCents = form.annualRevenue.trim() ? Math.round(Number(form.annualRevenue) * 100) : undefined;

    if (isEdit && account) {
      const updated = updateAccount(account.id, {
        name: form.name.trim(),
        domain: form.domain.trim(),
        industry: form.industry.trim(),
        employeeCount,
        annualRevenueCents,
        icpTier: form.icpTier,
        icpFitScore,
        ownerId: form.ownerId,
        status: form.status,
        tags,
      });
      if (updated) {
        onSave(updated);
        toast.success("Account atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newAccount: Account = {
        id: `acc_${Date.now()}`,
        name: form.name.trim(),
        domain: form.domain.trim(),
        industry: form.industry.trim(),
        employeeCount,
        annualRevenueCents,
        icpFitScore,
        icpTier: form.icpTier,
        ownerId: form.ownerId,
        status: form.status,
        enrichedAt: new Date().toISOString(),
        tags,
        createdAt: new Date().toISOString(),
      };
      addAccount(newAccount);
      onSave(newAccount);
      toast.success("Account criado", { description: `${newAccount.name} foi adicionado ao funil.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar account" : "Novo account"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados deste account." : "Adicione um novo account ao funil de Sales Operations."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="account-name">Nome</Label>
              <Input id="account-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="account-domain">Domínio</Label>
              <Input id="account-domain" value={form.domain} onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))} placeholder="empresa.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="account-industry">Indústria</Label>
              <Input id="account-industry" value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="account-employees">Funcionários</Label>
              <Input
                id="account-employees"
                type="number"
                min={0}
                value={form.employeeCount}
                onChange={(e) => setForm((p) => ({ ...p, employeeCount: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="account-revenue">Receita anual (R$)</Label>
              <Input
                id="account-revenue"
                type="number"
                min={0}
                value={form.annualRevenue}
                onChange={(e) => setForm((p) => ({ ...p, annualRevenue: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>ICP fit</Label>
              <Select value={form.icpTier} onValueChange={(v) => setForm((p) => ({ ...p, icpTier: v as ICPTier }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICP_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Dono</Label>
              <Select value={form.ownerId} onValueChange={(v) => setForm((p) => ({ ...p, ownerId: v }))}>
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
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as AccountStatus }))}>
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
          <div className="space-y-1.5">
            <Label htmlFor="account-tags">Tags (separadas por vírgula)</Label>
            <Input id="account-tags" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="ex: enterprise, vip" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.domain.trim() || !form.industry.trim()}>
            {isEdit ? "Salvar alterações" : "Criar account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
