"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addInteraction } from "@/data/mock";
import type { Interaction, InteractionType } from "@/types";

const TYPE_OPTIONS: { value: InteractionType; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "meeting", label: "Reunião" },
  { value: "call", label: "Ligação" },
];

const DIRECTION_OPTIONS: { value: Interaction["direction"]; label: string }[] = [
  { value: "outbound", label: "Enviado por nós" },
  { value: "inbound", label: "Recebido do cliente" },
];

interface InteractionFormState {
  type: InteractionType;
  direction: Interaction["direction"];
  subject: string;
  summary: string;
}

function emptyForm(): InteractionFormState {
  return { type: "call", direction: "outbound", subject: "", summary: "" };
}

interface InteractionFormDialogProps {
  /** Toda interação manual precisa estar vinculada a um account; dealId é opcional. */
  accountId: string;
  dealId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (interaction: Interaction) => void;
}

export function InteractionFormDialog({ accountId, dealId, open, onOpenChange, onSave }: InteractionFormDialogProps) {
  const [form, setForm] = useState<InteractionFormState>(emptyForm());

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(emptyForm());
  }

  function handleSave() {
    if (!form.summary.trim()) return;
    const newInteraction: Interaction = {
      id: `int_${Date.now()}`,
      accountId,
      dealId,
      type: form.type,
      direction: form.direction,
      subject: form.subject.trim() || undefined,
      summary: form.summary.trim(),
      occurredAt: new Date().toISOString(),
    };
    addInteraction(newInteraction);
    onSave(newInteraction);
    toast.success("Interação registrada", { description: "A interação manual foi adicionada ao histórico." });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar interação</DialogTitle>
          <DialogDescription>Adicione manualmente um email, ligação ou reunião ao histórico deste account.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as InteractionType }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Direção</Label>
              <Select value={form.direction} onValueChange={(v) => setForm((p) => ({ ...p, direction: v as Interaction["direction"] }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIRECTION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="interaction-subject">Assunto (opcional)</Label>
            <Input id="interaction-subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="interaction-summary">Resumo</Label>
            <Textarea
              id="interaction-summary"
              rows={3}
              value={form.summary}
              onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              placeholder="O que foi discutido ou combinado?"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.summary.trim()}>
            Registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
