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
import { addCandidate, updateCandidate } from "@/data/mock/candidates";
import type { Candidate, CandidateStage } from "@/types";

const STAGE_OPTIONS: { value: CandidateStage; label: string }[] = [
  { value: "applied", label: "Aplicou" },
  { value: "screening", label: "Triagem" },
  { value: "interview", label: "Entrevista" },
  { value: "offer", label: "Oferta" },
  { value: "hired", label: "Contratado" },
  { value: "rejected", label: "Rejeitado" },
];

interface CandidateFormState {
  name: string;
  role: string;
  stage: CandidateStage;
}

function toFormState(candidate?: Candidate): CandidateFormState {
  return {
    name: candidate?.name ?? "",
    role: candidate?.role ?? "",
    stage: candidate?.stage ?? "applied",
  };
}

interface CandidateFormDialogProps {
  /** Presente = modo edição (muta este candidato). Ausente = modo criação. */
  candidate?: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (candidate: Candidate) => void;
}

export function CandidateFormDialog({ candidate, open, onOpenChange, onSave }: CandidateFormDialogProps) {
  const isEdit = Boolean(candidate);
  const [form, setForm] = useState<CandidateFormState>(() => toFormState(candidate));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(candidate));
  }

  function handleSave() {
    if (!form.name.trim() || !form.role.trim()) return;

    if (isEdit && candidate) {
      const updated = updateCandidate(candidate.id, {
        name: form.name.trim(),
        role: form.role.trim(),
        stage: form.stage,
      });
      if (updated) {
        onSave(updated);
        toast.success("Candidato atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newCandidate: Candidate = {
        id: `cand_${Date.now()}`,
        name: form.name.trim(),
        role: form.role.trim(),
        stage: form.stage,
        appliedAt: new Date().toISOString(),
      };
      addCandidate(newCandidate);
      onSave(newCandidate);
      toast.success("Candidato criado", { description: `${newCandidate.name} foi adicionado ao funil de contratação.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar candidato" : "Novo candidato"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados deste candidato." : "Adicione um novo candidato ao funil de contratação."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="candidate-name">Nome</Label>
            <Input id="candidate-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="candidate-role">Vaga</Label>
            <Input id="candidate-role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Etapa</Label>
            <Select value={form.stage} onValueChange={(v) => setForm((p) => ({ ...p, stage: v as CandidateStage }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGE_OPTIONS.map((o) => (
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
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.role.trim()}>
            {isEdit ? "Salvar alterações" : "Criar candidato"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
