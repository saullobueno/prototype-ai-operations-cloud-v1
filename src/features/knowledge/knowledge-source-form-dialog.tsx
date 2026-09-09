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
import { addKnowledgeSource, updateKnowledgeSource } from "@/data/mock";
import type { KnowledgeSource, KnowledgeSourceType } from "@/types";

const TYPE_OPTIONS: KnowledgeSourceType[] = ["website", "pdf", "notion", "google_drive", "url", "manual", "api"];
const TYPE_LABEL: Record<KnowledgeSourceType, string> = {
  website: "Website",
  pdf: "PDF",
  notion: "Notion",
  google_drive: "Google Drive",
  url: "URL",
  manual: "Manual",
  api: "API",
};

interface KnowledgeSourceFormState {
  name: string;
  type: KnowledgeSourceType;
}

function toFormState(source?: KnowledgeSource): KnowledgeSourceFormState {
  return {
    name: source?.name ?? "",
    type: source?.type ?? "manual",
  };
}

interface KnowledgeSourceFormDialogProps {
  /** Presente = modo edição (renomeia/reclassifica esta fonte). Ausente = modo criação (conecta uma nova fonte). */
  source?: KnowledgeSource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (source: KnowledgeSource) => void;
}

export function KnowledgeSourceFormDialog({ source, open, onOpenChange, onSave }: KnowledgeSourceFormDialogProps) {
  const isEdit = Boolean(source);
  const [form, setForm] = useState<KnowledgeSourceFormState>(() => toFormState(source));

  // Recarrega o formulário sempre que o dialog transiciona de fechado para aberto. Ajuste de
  // estado durante a renderização (em vez de useEffect) conforme
  // https://react.dev/learn/you-might-not-need-an-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(source));
  }

  function handleSave() {
    if (!form.name.trim()) return;

    if (isEdit && source) {
      const updated = updateKnowledgeSource(source.id, { name: form.name.trim(), type: form.type });
      if (updated) {
        onSave(updated);
        toast.success("Fonte atualizada", { description: `"${updated.name}" foi atualizada.` });
      }
    } else {
      const newSource: KnowledgeSource = {
        id: `ks_${Date.now()}`,
        type: form.type,
        name: form.name.trim(),
        syncStatus: "syncing",
      };
      addKnowledgeSource(newSource);
      onSave(newSource);
      toast("Conectando fonte...");
      window.setTimeout(() => {
        updateKnowledgeSource(newSource.id, { syncStatus: "synced", lastSyncedAt: new Date().toISOString() });
        toast.success("Fonte conectada");
      }, 1200);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar fonte" : "Adicionar fonte"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize o nome e o tipo desta fonte de conhecimento." : "Conecte uma nova fonte de conhecimento aos seus agentes de IA."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="source-name">Nome</Label>
            <Input id="source-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as KnowledgeSourceType }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TYPE_LABEL[t]}
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
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {isEdit ? "Salvar alterações" : "Conectar fonte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
