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
import { addSop, updateSop } from "@/data/mock/sops";
import type { SOP } from "@/types";

interface SopFormState {
  title: string;
  content: string;
}

function toFormState(sop?: SOP): SopFormState {
  return {
    title: sop?.title ?? "",
    content: sop?.content ?? "",
  };
}

interface SopFormDialogProps {
  /** Processo ao qual esta SOP pertence (fixo — uma SOP é sempre 1:1 com um processo). */
  processId: string;
  /** Presente = modo edição (muta esta SOP). Ausente = modo criação. */
  sop?: SOP;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (sop: SOP) => void;
}

export function SopFormDialog({ processId, sop, open, onOpenChange, onSave }: SopFormDialogProps) {
  const isEdit = Boolean(sop);
  const [form, setForm] = useState<SopFormState>(() => toFormState(sop));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(sop));
  }

  function handleSave() {
    if (!form.title.trim() || !form.content.trim()) return;

    if (isEdit && sop) {
      const updated = updateSop(sop.id, {
        title: form.title.trim(),
        content: form.content.trim(),
        updatedAt: new Date().toISOString(),
      });
      if (updated) {
        onSave(updated);
        toast.success("SOP atualizada", { description: `${updated.title} foi atualizada.` });
      }
    } else {
      const newSop: SOP = {
        id: `sop_${processId}_${Date.now()}`,
        processId,
        title: form.title.trim(),
        content: form.content.trim(),
        updatedAt: new Date().toISOString(),
      };
      addSop(newSop);
      onSave(newSop);
      toast.success("SOP criada", { description: `${newSop.title} foi publicada para este processo.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar SOP" : "Nova SOP"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize o procedimento operacional padrão deste processo." : "Documente o procedimento operacional padrão deste processo."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="sop-title">Título</Label>
            <Input id="sop-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sop-content">Conteúdo</Label>
            <Textarea
              id="sop-content"
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.title.trim() || !form.content.trim()}>
            {isEdit ? "Salvar alterações" : "Criar SOP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
