"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { DealRiskPanel } from "@/features/sales/deal-risk-panel";
import { DealFormDialog } from "@/features/sales/deal-form-dialog";
import { InteractionFormDialog } from "@/features/sales/interaction-form-dialog";
import {
  addProposal,
  deleteDeal,
  deleteInteraction,
  getAccountById,
  getDealById,
  getInteractionsByDeal,
  getPipelineStageById,
  getProposalByDeal,
  getUserById,
  updateProposal,
} from "@/data/mock";
import { formatCurrency, formatDate, formatDateTime, formatRelative } from "@/lib/format";
import type { Interaction, Proposal, ProposalStatus } from "@/types";

const PROPOSAL_STATUS_OPTIONS: { value: ProposalStatus; label: string }[] = [
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviada" },
  { value: "viewed", label: "Visualizada" },
  { value: "accepted", label: "Aceita" },
  { value: "rejected", label: "Rejeitada" },
];

export default function DealDetailPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = use(params);
  const router = useRouter();
  const [version, setVersion] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [interactionOpen, setInteractionOpen] = useState(false);
  const [deleteInteractionTarget, setDeleteInteractionTarget] = useState<Interaction | null>(null);
  const deal = getDealById(dealId);

  if (!deal) notFound();

  const account = getAccountById(deal.accountId);
  const stage = getPipelineStageById(deal.stageId);
  const owner = getUserById(deal.ownerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const interactions = useMemo(() => getInteractionsByDeal(deal.id), [deal.id, version]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const proposal = useMemo(() => getProposalByDeal(deal.id), [deal.id, version]);

  function handleDelete() {
    if (!deal) return;
    deleteDeal(deal.id);
    toast.success("Deal excluído", { description: `${deal.name} foi removido.` });
    router.push("/modules/sales/deals");
  }

  function handleGenerateProposal() {
    if (!deal) return;
    const newProposal: Proposal = {
      id: `prop_${Date.now()}`,
      dealId: deal.id,
      status: "draft",
      valueCents: deal.amountCents,
    };
    addProposal(newProposal);
    toast.success("Proposta gerada em rascunho");
    setVersion((v) => v + 1);
  }

  function handleProposalStatusChange(next: ProposalStatus) {
    if (!proposal) return;
    updateProposal(proposal.id, { status: next, sentAt: next !== "draft" && !proposal.sentAt ? new Date().toISOString() : proposal.sentAt });
    toast.success("Status da proposta atualizado");
    setVersion((v) => v + 1);
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {account && (
            <Link href={`/modules/sales/accounts/${account.id}`} className="text-primary hover:underline">
              {account.name}
            </Link>
          )}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{deal.name}</h1>
          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold text-foreground">{formatCurrency(deal.amountCents)}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal />
                  <span className="sr-only">Ações do deal</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setEditOpen(true)}>Editar</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDeleteOpen(true)}>
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={deal.status === "open" ? (stage?.name ?? "open") : deal.status} />
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Probabilidade</span>
            {deal.probability}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Dono</span>
            {owner?.name ?? "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Previsão de fechamento</span>
            {formatDate(deal.expectedCloseDate)}
          </span>
        </div>
      </div>

      {account && (
        <div className="mb-6">
          <DealRiskPanel deal={deal} accountHref={`/modules/sales/accounts/${account.id}/revenue-graph`} />
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="proposal">Proposal</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardContent className="space-y-2 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account</span>
                <span className="font-medium text-foreground">{account?.name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estágio</span>
                <span className="font-medium text-foreground">{stage?.name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criado em</span>
                <span className="font-medium text-foreground">{formatDate(deal.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atividade</span>
                <span className="font-medium text-foreground">{formatRelative(deal.lastActivityAt)}</span>
              </div>
              {deal.closedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fechado em</span>
                  <span className="font-medium text-foreground">{formatDate(deal.closedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => setInteractionOpen(true)}>
              <Plus /> Registrar interação
            </Button>
          </div>
          {interactions.length === 0 ? (
            <EmptyState icon={Mail} title="Nenhuma interação vinculada a este deal" />
          ) : (
            interactions.map((i) => (
              <Card key={i.id} className="py-3">
                <CardContent className="px-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium capitalize text-foreground">
                      {i.type} · {i.subject ?? "Sem assunto"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{formatDateTime(i.occurredAt)}</span>
                      <Button variant="ghost" size="icon-xs" onClick={() => setDeleteInteractionTarget(i)}>
                        <Trash2 />
                        <span className="sr-only">Excluir interação</span>
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{i.summary}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="proposal" className="mt-4">
          {proposal ? (
            <Card>
              <CardContent className="space-y-3 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={proposal.status} />
                    <Select value={proposal.status} onValueChange={(v) => handleProposalStatusChange(v as ProposalStatus)}>
                      <SelectTrigger size="sm" className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPOSAL_STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-medium text-foreground">{formatCurrency(proposal.valueCents)}</span>
                </div>
                {proposal.sentAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enviada em</span>
                    <span className="font-medium text-foreground">{formatDate(proposal.sentAt)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <EmptyState icon={Mail} title="Nenhuma proposta gerada ainda" action={{ label: "Gerar proposta", onClick: handleGenerateProposal }} />
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="pt-4 text-sm text-muted-foreground">
              <p>Deal criado em {formatDateTime(deal.createdAt)}.</p>
              <p className="mt-1">Última atividade {formatRelative(deal.lastActivityAt)}.</p>
              {deal.closedAt && <p className="mt-1">Fechado ({deal.status === "won" ? "ganho" : "perdido"}) em {formatDateTime(deal.closedAt)}.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DealFormDialog deal={deal} open={editOpen} onOpenChange={setEditOpen} onSave={() => setVersion((v) => v + 1)} />

      {account && (
        <InteractionFormDialog
          accountId={account.id}
          dealId={deal.id}
          open={interactionOpen}
          onOpenChange={setInteractionOpen}
          onSave={() => setVersion((v) => v + 1)}
        />
      )}

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir deal?</DialogTitle>
            <DialogDescription>
              &ldquo;{deal.name}&rdquo; será removido permanentemente. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteInteractionTarget !== null} onOpenChange={(next) => !next && setDeleteInteractionTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir interação?</DialogTitle>
            <DialogDescription>Este registro de interação será removido permanentemente. Essa ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteInteractionTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteInteractionTarget) {
                  deleteInteraction(deleteInteractionTarget.id);
                  toast.success("Interação excluída");
                  setDeleteInteractionTarget(null);
                  setVersion((v) => v + 1);
                }
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
