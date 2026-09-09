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
import { addOperationalCase, updateOperationalCase } from "@/data/mock/operationalCases";
import { users } from "@/data/mock/users";
import type { OperationalCase, OperationalCaseStatus, RiskLevel } from "@/types";

const STATUS_OPTIONS: { value: OperationalCaseStatus; label: string }[] = [
  { value: "open", label: "Aberto" },
  { value: "in_progress", label: "Em andamento" },
  { value: "resolved", label: "Resolvido" },
];

const SEVERITY_OPTIONS: { value: RiskLevel; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

interface CaseFormState {
  title: string;
  status: OperationalCaseStatus;
  severity: RiskLevel;
  assigneeId: string;
}

function toFormState(operationalCase?: OperationalCase): CaseFormState {
  return {
    title: operationalCase?.title ?? "",
    status: operationalCase?.status ?? "open",
    severity: operationalCase?.severity ?? "medium",
    assigneeId: operationalCase?.assigneeId ?? "",
  };
}

interface CaseFormDialogProps {
  /** Presente = modo edição (muta este caso). Ausente = modo criação. */
  operationalCase?: OperationalCase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (operationalCase: OperationalCase) => void;
}

export function CaseFormDialog({ operationalCase, open, onOpenChange, onSave }: CaseFormDialogProps) {
  const isEdit = Boolean(operationalCase);
  const [form, setForm] = useState<CaseFormState>(() => toFormState(operationalCase));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(operationalCase));
  }

  function handleSave() {
    if (!form.title.trim()) return;

    if (isEdit && operationalCase) {
      const wasResolved = operationalCase.status === "resolved";
      const nowResolved = form.status === "resolved";
      const updated = updateOperationalCase(operationalCase.id, {
        title: form.title.trim(),
        status: form.status,
        severity: form.severity,
        assigneeId: form.assigneeId || undefined,
        resolvedAt: !wasResolved && nowResolved ? new Date().toISOString() : wasResolved && !nowResolved ? undefined : operationalCase.resolvedAt,
      });
      if (updated) {
        onSave(updated);
        toast.success("Caso atualizado", { description: `${updated.title} foi atualizado.` });
      }
    } else {
      const newCase: OperationalCase = {
        id: `case_${Date.now()}`,
        title: form.title.trim(),
        status: form.status,
        severity: form.severity,
        assigneeId: form.assigneeId || undefined,
        createdAt: new Date().toISOString(),
        resolvedAt: form.status === "resolved" ? new Date().toISOString() : undefined,
      };
      addOperationalCase(newCase);
      onSave(newCase);
      toast.success("Caso criado", { description: `${newCase.title} foi registrado no quadro de operações.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar caso" : "Novo caso operacional"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize o status, a severidade ou o responsável por este caso." : "Registre manualmente um caso operacional que precisa de acompanhamento."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="case-title">Título</Label>
            <Input id="case-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as OperationalCaseStatus }))}>
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
            <div className="space-y-1.5">
              <Label>Severidade</Label>
              <Select value={form.severity} onValueChange={(v) => setForm((p) => ({ ...p, severity: v as RiskLevel }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Responsável (opcional)</Label>
            <Select value={form.assigneeId || "__none__"} onValueChange={(v) => setForm((p) => ({ ...p, assigneeId: v === "__none__" ? "" : v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sem responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sem responsável</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
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
          <Button onClick={handleSave} disabled={!form.title.trim()}>
            {isEdit ? "Salvar alterações" : "Criar caso"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
