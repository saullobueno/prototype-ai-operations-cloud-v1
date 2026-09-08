"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { DealRiskPanel } from "@/features/sales/deal-risk-panel";
import {
  getAccountById,
  getDealById,
  getInteractionsByDeal,
  getPipelineStageById,
  getProposalByDeal,
  getUserById,
} from "@/data/mock";
import { formatCurrency, formatDate, formatDateTime, formatRelative } from "@/lib/format";

export default function DealDetailPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = use(params);
  const deal = getDealById(dealId);

  if (!deal) notFound();

  const account = getAccountById(deal.accountId);
  const stage = getPipelineStageById(deal.stageId);
  const owner = getUserById(deal.ownerId);
  const interactions = getInteractionsByDeal(deal.id);
  const proposal = getProposalByDeal(deal.id);

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
          <p className="text-xl font-semibold text-foreground">{formatCurrency(deal.amountCents)}</p>
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
                    <span className="text-xs text-muted-foreground">{formatDateTime(i.occurredAt)}</span>
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
              <CardContent className="space-y-2 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={proposal.status} />
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
            <EmptyState
              icon={Mail}
              title="Nenhuma proposta gerada ainda"
              action={{ label: "Gerar proposta", onClick: () => toast.success("Proposta gerada em rascunho") }}
            />
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
    </PageContainer>
  );
}
