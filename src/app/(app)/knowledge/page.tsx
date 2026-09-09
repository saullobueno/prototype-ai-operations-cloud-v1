"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle, BookOpen, MoreHorizontal, Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { HealthMeterRow } from "@/components/domain/health-meter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { CreateArticleDialog } from "@/features/knowledge/create-article-dialog";
import { KnowledgeDocumentFormDialog } from "@/features/knowledge/knowledge-document-form-dialog";
import { KnowledgeSourceFormDialog } from "@/features/knowledge/knowledge-source-form-dialog";
import { deleteKnowledgeDocument, deleteKnowledgeSource, knowledgeDocuments as knowledgeDocumentsStore, knowledgeSources } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import type { KnowledgeDocument, KnowledgeSource } from "@/types";

const MISSING_TOPICS = ["Exceções da política de reembolso", "Faturamento multi-moeda", "Mapeamento de grupos de SSO empresarial", "Limites de exportação em massa"];

export default function KnowledgePage() {
  const [sources, setSources] = useState(knowledgeSources);
  const [knowledgeDocuments, setKnowledgeDocuments] = useState(knowledgeDocumentsStore);
  const [articleTopic, setArticleTopic] = useState<string | null>(null);
  const [createSourceOpen, setCreateSourceOpen] = useState(false);
  const [editSource, setEditSource] = useState<KnowledgeSource | null>(null);
  const [deleteSourceCandidate, setDeleteSourceCandidate] = useState<KnowledgeSource | null>(null);
  const [editDoc, setEditDoc] = useState<KnowledgeDocument | null>(null);
  const [deleteDocCandidate, setDeleteDocCandidate] = useState<KnowledgeDocument | null>(null);
  const collections = Array.from(new Set(knowledgeDocuments.map((d) => d.collection).filter(Boolean))) as string[];

  return (
    <PageContainer>
      <PageHeader title="Base de conhecimento" description="O que seus agentes de IA sabem — e o que ainda está faltando." />

      <Card className="mb-6 border-ai-accent/30 bg-ai-accent/[0.04]">
        <CardHeader>
          <CardTitle className="text-base">AI Knowledge Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0.5">
          <HealthMeterRow label="Cobertura" value={92} />
          <HealthMeterRow label="Atualidade" value={81} />
          <HealthMeterRow label="Conflitos" value={7} isCount tone="warning" />
          <HealthMeterRow label="Tópicos faltando" value={14} isCount tone="danger" />
          <HealthMeterRow label="Docs de baixa confiança" value={3} isCount tone="warning" />
          <p className="pt-2 text-sm text-muted-foreground">
            14 perguntas de clientes não podem ser respondidas de forma confiável pela sua base de conhecimento no momento.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="sources">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="sources">Fontes</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="articles">Artigos</TabsTrigger>
            <TabsTrigger value="collections">Coleções</TabsTrigger>
            <TabsTrigger value="sync">Sincronização</TabsTrigger>
            <TabsTrigger value="readiness">AI Readiness</TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={() => setCreateSourceOpen(true)}><Plus /> Adicionar fonte</Button>
        </div>

        <TabsContent value="sources">
          {sources.length === 0 ? (
            <EmptyState icon={BookOpen} title="Conecte sua primeira fonte de conhecimento" />
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última sincronização</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="uppercase text-muted-foreground">{s.type.replace("_", " ")}</TableCell>
                      <TableCell><StatusBadge status={s.syncStatus} /></TableCell>
                      <TableCell className="text-muted-foreground">{s.lastSyncedAt ? formatRelative(s.lastSyncedAt) : "—"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <MoreHorizontal />
                              <span className="sr-only">Ações da fonte</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditSource(s)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onSelect={() => setDeleteSourceCandidate(s)}>
                              Remover fonte
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confiança</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {knowledgeDocuments.map((d) => (
                  <ClickableTableRow key={d.id} href={`/knowledge/${d.id}`}>
                    <TableCell className="font-medium">{d.title}</TableCell>
                    <TableCell><StatusBadge status={d.status} /></TableCell>
                    <TableCell>{d.confidence}%</TableCell>
                    <TableCell className="text-muted-foreground">{formatRelative(d.updatedAt)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                            <span className="sr-only">Ações do documento</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setEditDoc(d)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteDocCandidate(d)}>
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </ClickableTableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <div className="space-y-2">
            {knowledgeDocuments.filter((d) => d.published).map((d) => (
              <Link key={d.id} href={`/knowledge/${d.id}`}>
                <Card className="flex-row items-center justify-between px-4 py-3 transition-colors hover:bg-accent">
                  <span className="text-sm font-medium text-foreground">{d.title}</span>
                  <span className="text-xs text-muted-foreground">{d.collection}</span>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collections">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <Card key={c}>
                <CardContent className="pt-4">
                  <p className="font-medium text-foreground">{c}</p>
                  <p className="text-sm text-muted-foreground">
                    {knowledgeDocuments.filter((d) => d.collection === c).length} documentos
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync">
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                {["Documentos", "Parsing", "Divisão em blocos", "Embeddings", "Índice", "Busca", "Agente"].map((step, i, arr) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="rounded-md border border-border px-2.5 py-1.5">{step}</span>
                    {i < arr.length - 1 && <span>→</span>}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readiness">
          <div className="space-y-2">
            {MISSING_TOPICS.map((topic) => (
              <Card key={topic} className="flex-row items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-warning" />
                  <span className="text-sm text-foreground">{topic}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => setArticleTopic(topic)}>
                  Criar artigo
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateArticleDialog
        topic={articleTopic ?? ""}
        open={articleTopic !== null}
        onOpenChange={(next) => {
          if (!next) setArticleTopic(null);
        }}
        onCreated={(doc) => setKnowledgeDocuments((prev) => [doc, ...prev])}
      />

      <KnowledgeSourceFormDialog
        open={createSourceOpen}
        onOpenChange={setCreateSourceOpen}
        onSave={(created) => setSources((prev) => [created, ...prev])}
      />
      {editSource && (
        <KnowledgeSourceFormDialog
          source={editSource}
          open={editSource !== null}
          onOpenChange={(next) => {
            if (!next) setEditSource(null);
          }}
          onSave={(updated) => setSources((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))}
        />
      )}

      {editDoc && (
        <KnowledgeDocumentFormDialog
          doc={editDoc}
          open={editDoc !== null}
          onOpenChange={(next) => {
            if (!next) setEditDoc(null);
          }}
          onSave={(updated) => setKnowledgeDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))}
        />
      )}

      <Dialog open={deleteSourceCandidate !== null} onOpenChange={(next) => !next && setDeleteSourceCandidate(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover fonte?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteSourceCandidate?.name}&rdquo; será desconectada e os documentos vinculados a ela deixarão de ser sincronizados. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSourceCandidate(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteSourceCandidate) return;
                deleteKnowledgeSource(deleteSourceCandidate.id);
                setSources((prev) => prev.filter((s) => s.id !== deleteSourceCandidate.id));
                toast.success("Fonte removida");
                setDeleteSourceCandidate(null);
              }}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDocCandidate !== null} onOpenChange={(next) => !next && setDeleteDocCandidate(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir documento?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteDocCandidate?.title}&rdquo; será removido permanentemente da base de conhecimento. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDocCandidate(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteDocCandidate) return;
                deleteKnowledgeDocument(deleteDocCandidate.id);
                setKnowledgeDocuments((prev) => prev.filter((d) => d.id !== deleteDocCandidate.id));
                toast.success("Documento excluído");
                setDeleteDocCandidate(null);
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
