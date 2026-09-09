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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addProcess, updateProcess } from "@/data/mock/processes";
import { users } from "@/data/mock/users";
import type { BusinessProcess, BusinessProcessCategory, BusinessProcessStatus } from "@/types";

const CATEGORY_OPTIONS: { value: BusinessProcessCategory; label: string }[] = [
  { value: "onboarding", label: "Onboarding" },
  { value: "procurement", label: "Procurement" },
  { value: "compliance", label: "Compliance" },
  { value: "operations", label: "Operações" },
  { value: "finance", label: "Finanças" },
  { value: "hr", label: "RH" },
];

const STATUS_OPTIONS: { value: BusinessProcessStatus; label: string }[] = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "paused", label: "Pausado" },
];

interface ProcessFormState {
  name: string;
  description: string;
  category: BusinessProcessCategory;
  status: BusinessProcessStatus;
  ownerId: string;
  slaHours: string;
}

function toFormState(process?: BusinessProcess): ProcessFormState {
  return {
    name: process?.name ?? "",
    description: process?.description ?? "",
    category: process?.category ?? "operations",
    status: process?.status ?? "draft",
    ownerId: process?.ownerId ?? users[0]?.id ?? "",
    slaHours: process?.slaHours ? String(process.slaHours) : "",
  };
}

interface ProcessFormDialogProps {
  /** Presente = modo edição (muta este processo). Ausente = modo criação. */
  process?: BusinessProcess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (process: BusinessProcess) => void;
}

export function ProcessFormDialog({ process, open, onOpenChange, onSave }: ProcessFormDialogProps) {
  const isEdit = Boolean(process);
  const [form, setForm] = useState<ProcessFormState>(() => toFormState(process));

  // Recarrega o formulário sempre que o dialog transiciona de fechado para aberto, no mesmo
  // padrão de src/features/customers/customer-form-dialog.tsx (ajuste durante a renderização
  // em vez de useEffect, conforme https://react.dev/learn/you-might-not-need-an-effect).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(process));
  }

  function handleSave() {
    if (!form.name.trim() || !form.ownerId) return;
    const slaHours = form.slaHours.trim() ? Number(form.slaHours) : undefined;

    if (isEdit && process) {
      const updated = updateProcess(process.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        ownerId: form.ownerId,
        slaHours,
      });
      if (updated) {
        onSave(updated);
        toast.success("Processo atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newProcess: BusinessProcess = {
        id: `proc_${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        ownerId: form.ownerId,
        slaHours,
        totalRuns: 0,
        activeRuns: 0,
        avgDurationHours: 0,
        exceptionRate: 0,
        automationRate: 0,
        createdAt: new Date().toISOString(),
      };
      addProcess(newProcess);
      onSave(newProcess);
      toast.success("Processo criado", { description: `${newProcess.name} foi adicionado à biblioteca de processos.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar processo" : "Novo processo"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize a definição deste processo de negócio." : "Modele um novo processo de negócio neste workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="process-name">Nome</Label>
            <Input id="process-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="process-description">Descrição</Label>
            <Textarea
              id="process-description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as BusinessProcessCategory }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as BusinessProcessStatus }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Dono do processo</Label>
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
              <Label htmlFor="process-sla">SLA (horas, opcional)</Label>
              <Input
                id="process-sla"
                type="number"
                min={0}
                value={form.slaHours}
                onChange={(e) => setForm((p) => ({ ...p, slaHours: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.ownerId}>
            {isEdit ? "Salvar alterações" : "Criar processo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
