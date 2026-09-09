"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { accounts, addDeal, pipelineStages, updateDeal, users } from "@/data/mock";
import type { Deal, DealStatus } from "@/types";

const STATUS_OPTIONS: { value: DealStatus; label: string }[] = [
  { value: "open", label: "Aberto" },
  { value: "won", label: "Ganho" },
  { value: "lost", label: "Perdido" },
];

interface DealFormState {
  name: string;
  accountId: string;
  stageId: string;
  amount: string;
  expectedCloseDate: string;
  ownerId: string;
  status: DealStatus;
}

function toFormState(deal?: Deal, defaultAccountId?: string): DealFormState {
  return {
    name: deal?.name ?? "",
    accountId: deal?.accountId ?? defaultAccountId ?? accounts[0]?.id ?? "",
    stageId: deal?.stageId ?? pipelineStages[0]?.id ?? "",
    amount: deal ? String(deal.amountCents / 100) : "",
    expectedCloseDate: deal?.expectedCloseDate ? deal.expectedCloseDate.slice(0, 10) : "",
    ownerId: deal?.ownerId ?? users[0]?.id ?? "",
    status: deal?.status ?? "open",
  };
}

interface DealFormDialogProps {
  /** Presente = modo edição (muta este deal). Ausente = modo criação. */
  deal?: Deal;
  /** Pré-seleciona o account quando o dialog é aberto a partir da página de um account específico. */
  defaultAccountId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (deal: Deal) => void;
}

export function DealFormDialog({ deal, defaultAccountId, open, onOpenChange, onSave }: DealFormDialogProps) {
  const isEdit = Boolean(deal);
  const [form, setForm] = useState<DealFormState>(() => toFormState(deal, defaultAccountId));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(deal, defaultAccountId));
  }

  function handleSave() {
    if (!form.name.trim() || !form.accountId || !form.expectedCloseDate) return;

    const amountCents = Math.round(Number(form.amount || 0) * 100);
    const stage = pipelineStages.find((s) => s.id === form.stageId);
    const probability = stage?.defaultProbability ?? 10;
    const expectedCloseDate = new Date(form.expectedCloseDate).toISOString();
    const now = new Date().toISOString();

    if (isEdit && deal) {
      const wasOpen = deal.status === "open";
      const closesNow = wasOpen && form.status !== "open";
      const reopens = !wasOpen && form.status === "open";
      const updated = updateDeal(deal.id, {
        name: form.name.trim(),
        accountId: form.accountId,
        stageId: form.stageId,
        amountCents,
        probability,
        expectedCloseDate,
        ownerId: form.ownerId,
        status: form.status,
        lastActivityAt: now,
        closedAt: closesNow ? now : reopens ? undefined : deal.closedAt,
      });
      if (updated) {
        onSave(updated);
        toast.success("Deal atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newDeal: Deal = {
        id: `deal_${Date.now()}`,
        name: form.name.trim(),
        accountId: form.accountId,
        stageId: form.stageId,
        amountCents,
        probability,
        expectedCloseDate,
        ownerId: form.ownerId,
        status: form.status,
        riskLevel: "low",
        riskReasons: [],
        lastActivityAt: now,
        createdAt: now,
        closedAt: form.status !== "open" ? now : undefined,
      };
      addDeal(newDeal);
      onSave(newDeal);
      toast.success("Deal criado", { description: `${newDeal.name} foi adicionado ao pipeline.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar deal" : "Novo deal"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados desta oportunidade." : "Adicione uma nova oportunidade ao pipeline."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="deal-name">Nome</Label>
            <Input id="deal-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Account</Label>
            <Select value={form.accountId} onValueChange={(v) => setForm((p) => ({ ...p, accountId: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Estágio</Label>
              <Select value={form.stageId} onValueChange={(v) => setForm((p) => ({ ...p, stageId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...pipelineStages]
                    .sort((a, b) => a.order - b.order)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deal-amount">Valor (R$)</Label>
              <Input id="deal-amount" type="number" min={0} value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="deal-close-date">Previsão de fechamento</Label>
              <Input
                id="deal-close-date"
                type="date"
                value={form.expectedCloseDate}
                onChange={(e) => setForm((p) => ({ ...p, expectedCloseDate: e.target.value }))}
              />
            </div>
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
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as DealStatus }))}>
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
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.accountId || !form.expectedCloseDate}>
            {isEdit ? "Salvar alterações" : "Criar deal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
