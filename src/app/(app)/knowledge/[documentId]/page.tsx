"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Pencil } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/domain/badges";
import { EmptyState } from "@/components/domain/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { agents, getKnowledgeDocumentById, getUserById, knowledgeSources } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import { History } from "lucide-react";

export default function KnowledgeDocumentPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = use(params);
  const doc = getKnowledgeDocumentById(documentId);
  if (!doc) notFound();

  const source = knowledgeSources.find((s) => s.id === doc.sourceId);
  const usedByAgents = agents.filter((a) => a.knowledgeSourceIds.includes(doc.sourceId));

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(doc.content);

  function save() {
    // Persistência simplificada: grava de volta no mock compartilhado para que a
    // edição sobreviva à navegação dentro da sessão (não sobrevive a um reload).
    doc!.content = content;
    setEditing(false);
    toast.success("Documento atualizado");
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
        <StatusBadge status={doc.status} />
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
                <Pencil className="size-3.5" /> Editar
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
    </PageContainer>
  );
}
