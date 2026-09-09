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
import { updateKnowledgeDocument } from "@/data/mock";
import type { KnowledgeDocument, KnowledgeDocumentStatus } from "@/types";

const STATUS_LABEL: Record<KnowledgeDocumentStatus, string> = {
  ready: "Pronto",
  processing: "Processando",
  conflict: "Conflito",
  outdated: "Desatualizado",
};

interface KnowledgeDocumentFormState {
  title: string;
  collection: string;
  status: KnowledgeDocumentStatus;
  published: boolean;
}

function toFormState(doc: KnowledgeDocument): KnowledgeDocumentFormState {
  return {
    title: doc.title,
    collection: doc.collection ?? "",
    status: doc.status,
    published: doc.published ?? false,
  };
}

interface KnowledgeDocumentFormDialogProps {
  doc: KnowledgeDocument;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (doc: KnowledgeDocument) => void;
}

/** Edita metadados de um artigo/documento existente (título, coleção, status, publicação).
 * O conteúdo em si é editado inline na página de detalhe. Não há modo de criação aqui —
 * artigos nascem a partir de um gap de IA (ver CreateArticleDialog). */
export function KnowledgeDocumentFormDialog({ doc, open, onOpenChange, onSave }: KnowledgeDocumentFormDialogProps) {
  const [form, setForm] = useState<KnowledgeDocumentFormState>(() => toFormState(doc));

  // Recarrega o formulário sempre que o dialog transiciona de fechado para aberto. Ajuste de
  // estado durante a renderização (em vez de useEffect) conforme
  // https://react.dev/learn/you-might-not-need-an-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(doc));
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const updated = updateKnowledgeDocument(doc.id, {
      title: form.title.trim(),
      collection: form.collection.trim() || undefined,
      status: form.status,
      published: form.published,
    });
    if (updated) {
      onSave(updated);
      toast.success("Documento atualizado", { description: `"${updated.title}" foi atualizado.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar documento</DialogTitle>
          <DialogDescription>Atualize o título, a coleção e o status deste documento.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="doc-title">Título</Label>
            <Input id="doc-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="doc-collection">Coleção</Label>
              <Input id="doc-collection" value={form.collection} onChange={(e) => setForm((p) => ({ ...p, collection: e.target.value }))} placeholder="ex: Billing" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as KnowledgeDocumentStatus }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABEL) as KnowledgeDocumentStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Publicação</Label>
            <Select value={form.published ? "published" : "draft"} onValueChange={(v) => setForm((p) => ({ ...p, published: v === "published" }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.title.trim()}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
