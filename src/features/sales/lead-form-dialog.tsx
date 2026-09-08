"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addLead, updateLead } from "@/data/mock";
import type { ICPTier, Lead, LeadSource } from "@/types";

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Indicação" },
  { value: "outbound", label: "Outbound" },
  { value: "event", label: "Evento" },
  { value: "import", label: "Importação" },
  { value: "partner", label: "Parceiro" },
];

const ICP_OPTIONS: { value: ICPTier; label: string }[] = [
  { value: "ideal", label: "Ideal" },
  { value: "good", label: "Good" },
  { value: "poor", label: "Poor" },
];

interface LeadFormState {
  name: string;
  email: string;
  company: string;
  title: string;
  source: LeadSource;
  icpFit: ICPTier;
}

function toFormState(lead?: Lead): LeadFormState {
  return {
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    company: lead?.company ?? "",
    title: lead?.title ?? "",
    source: lead?.source ?? "website",
    icpFit: lead?.icpFit ?? "good",
  };
}

interface LeadFormDialogProps {
  lead?: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lead: Lead) => void;
}

export function LeadFormDialog({ lead, open, onOpenChange, onSave }: LeadFormDialogProps) {
  const isEdit = Boolean(lead);
  const [form, setForm] = useState<LeadFormState>(() => toFormState(lead));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(lead));
  }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim() || !form.company.trim()) return;

    if (isEdit && lead) {
      const updated = updateLead(lead.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        title: form.title.trim() || undefined,
        source: form.source,
        icpFit: form.icpFit,
      });
      if (updated) {
        onSave(updated);
        toast.success("Lead atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newLead: Lead = {
        id: `lead_${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        title: form.title.trim() || undefined,
        source: form.source,
        status: "new",
        leadScore: 50,
        scoreReasons: ["Lead criado manualmente"],
        icpFit: form.icpFit,
        createdAt: new Date().toISOString(),
      };
      addLead(newLead);
      onSave(newLead);
      toast.success("Lead criado", { description: `${newLead.name} foi adicionado ao funil.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar lead" : "Novo lead"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados deste lead." : "Adicione um novo lead ao funil de Sales Operations."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="lead-name">Nome</Label>
            <Input id="lead-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lead-company">Empresa</Label>
              <Input id="lead-company" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-title">Cargo</Label>
              <Input id="lead-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Fonte</Label>
              <Select value={form.source} onValueChange={(v) => setForm((p) => ({ ...p, source: v as LeadSource }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>ICP fit</Label>
              <Select value={form.icpFit} onValueChange={(v) => setForm((p) => ({ ...p, icpFit: v as ICPTier }))}>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim() || !form.company.trim()}>
            {isEdit ? "Salvar alterações" : "Criar lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
