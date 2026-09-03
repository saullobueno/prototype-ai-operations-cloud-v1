"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { addKnowledgeDocument } from "@/data/mock";
import type { KnowledgeDocument } from "@/types";

interface CreateArticleDialogProps {
  /** Tópico/gap de IA que motivou a criação do artigo — usado para pré-preencher o formulário. */
  topic: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (doc: KnowledgeDocument) => void;
}

export function CreateArticleDialog({ topic, open, onOpenChange, onCreated }: CreateArticleDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState(topic);
  const [content, setContent] = useState(`# ${topic}\n\n`);

  // O tópico muda conforme o ponto de entrada que abriu o dialog — reseta o formulário quando
  // ele transiciona de fechado para aberto. Ajuste de estado durante a renderização (em vez de
  // useEffect) conforme https://react.dev/learn/you-might-not-need-an-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTitle(topic);
      setContent(`# ${topic}\n\n`);
    }
  }

  function handleCreate() {
    if (!title.trim()) return;
    const doc: KnowledgeDocument = {
      id: `doc_${Date.now()}`,
      sourceId: "ks_onboarding_kit",
      title: title.trim(),
      content: content.trim() || `# ${title.trim()}`,
      status: "ready",
      confidence: 80,
      updatedAt: new Date().toISOString(),
      collection: "Geral",
      published: true,
    };
    addKnowledgeDocument(doc);
    onCreated?.(doc);
    onOpenChange(false);
    toast.success("Artigo criado", {
      description: `"${doc.title}" foi publicado na base de conhecimento.`,
      action: {
        label: "Ver artigo →",
        onClick: () => router.push(`/knowledge/${doc.id}`),
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar artigo na base de conhecimento</DialogTitle>
          <DialogDescription>Preencha um artigo para cobrir esta lacuna identificada pela IA.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="article-title">Título</Label>
            <Input id="article-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="article-content">Conteúdo</Label>
            <Textarea id="article-content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="font-mono text-xs" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Criar artigo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
