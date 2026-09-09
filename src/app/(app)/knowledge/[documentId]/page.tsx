"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/domain/badges";
import { EmptyState } from "@/components/domain/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeDocumentFormDialog } from "@/features/knowledge/knowledge-document-form-dialog";
import { agents, deleteKnowledgeDocument, getKnowledgeDocumentById, getUserById, knowledgeSources } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import { History } from "lucide-react";

export default function KnowledgeDocumentPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = use(params);
  const router = useRouter();
  const doc = getKnowledgeDocumentById(documentId);
  if (!doc) notFound();

  const source = knowledgeSources.find((s) => s.id === doc.sourceId);
  const usedByAgents = agents.filter((a) => a.knowledgeSourceIds.includes(doc.sourceId));

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(doc.content);
  const [editMetaOpen, setEditMetaOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // Força o re-render do header após editar os metadados (o objeto é mutado in-place na mesma
  // referência do array compartilhado — precisamos apenas de um gatilho de re-render).
  const [, setVersion] = useState(0);

  function save() {
    // Persistência simplificada: grava de volta no mock compartilhado para que a
    // edição sobreviva à navegação dentro da sessão (não sobrevive a um reload).
    doc!.content = content;
    setEditing(false);
    toast.success("Documento atualizado");
  }

  function handleDelete() {
    deleteKnowledgeDocument(doc!.id);
    toast.success("Documento excluído");
    router.push("/knowledge");
  }

  return (
    <PageContainer>
      <Link href="/knowledge" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Voltar para Base de conhecimento
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{doc.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fonte: {source?.name} · Atualizado {formatRelative(doc.updatedAt)} · Confiança {doc.confidence}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={doc.status} />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditMetaOpen(true)}>
            <Pencil className="size-3.5" /> Editar
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="size-3.5" /> Excluir
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="used-by">Usado por</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4 space-y-3">
          {editing ? (
            <>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} className="font-mono text-sm" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
                <Button onClick={save}>Salvar</Button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <pre className="whitespace-pre-wrap break-words font-sans text-sm text-foreground">{content}</pre>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditing(true)}>
                <Pencil className="size-3.5" /> Editar conteúdo
              </Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="used-by" className="mt-4">
          {usedByAgents.length === 0 ? (
            <EmptyState icon={History} title="Nenhum agente usa este documento atualmente" />
          ) : (
            <div className="space-y-2">
              {usedByAgents.map((a) => (
                <Link key={a.id} href={`/ai/agents/${a.id}`} className="block rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-accent">
                  {a.name}
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-2 text-sm">
          <p className="text-foreground">v3 — atualizado por {getUserById("usr_sofia")?.name} — {formatRelative(doc.updatedAt)}</p>
          <p className="text-muted-foreground">v2 — atualizado por {getUserById("usr_thomas")?.name}</p>
          <p className="text-muted-foreground">v1 — criado</p>
        </TabsContent>
      </Tabs>

      <KnowledgeDocumentFormDialog
        doc={doc}
        open={editMetaOpen}
        onOpenChange={setEditMetaOpen}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir documento?</DialogTitle>
            <DialogDescription>
              &ldquo;{doc.title}&rdquo; será removido permanentemente da base de conhecimento. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
