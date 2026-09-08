"use client";

import Link from "next/link";
import { Activity as ActivityIcon, Handshake, Mail, Radio, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { ICPBadge, RiskBadge, StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { RevenueGraph } from "@/features/sales/revenue-graph";
import { groupActivitiesByDay } from "@/core/activity";
import { formatCurrency, formatDate, formatRelative } from "@/lib/format";
import { getAccountById, getContactsByAccount, getDealsByAccount, getInteractionsByAccount, getSignalsByAccount } from "@/data/mock";
import type { Activity } from "@/types";

function accountActivities(accountId: string): Activity[] {
  const deals = getDealsByAccount(accountId);
  const activities: Activity[] = [];

  activities.push({
    id: `act_acc_${accountId}_created`,
    actorType: "human",
    actorId: "system",
    action: "Account criado",
    relatedType: "account",
    relatedId: accountId,
    createdAt: getAccountById(accountId)?.createdAt ?? new Date().toISOString(),
  });

  for (const deal of deals) {
    activities.push({
      id: `act_deal_${deal.id}_created`,
      actorType: "human",
      actorId: deal.ownerId,
      action: `Deal "${deal.name}" criado`,
      relatedType: "deal",
      relatedId: deal.id,
      createdAt: deal.createdAt,
    });
    if (deal.status !== "open") {
      activities.push({
        id: `act_deal_${deal.id}_closed`,
        actorType: "human",
        actorId: deal.ownerId,
        action: `Deal "${deal.name}" marcado como ${deal.status === "won" ? "ganho" : "perdido"}`,
        relatedType: "deal",
        relatedId: deal.id,
        createdAt: deal.closedAt ?? deal.lastActivityAt,
      });
    }
  }

  return activities;
}

export function OverviewTab({ accountId }: { accountId: string }) {
  const account = getAccountById(accountId)!;
  const deals = getDealsByAccount(accountId).filter((d) => d.status === "open");
  const signals = getSignalsByAccount(accountId).slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrichment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Indústria</span>
            <span className="font-medium text-foreground">{account.industry}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Funcionários</span>
            <span className="font-medium text-foreground">{account.employeeCount ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Receita estimada</span>
            <span className="font-medium text-foreground">{account.annualRevenueCents ? formatCurrency(account.annualRevenueCents) : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ICP fit</span>
            <ICPBadge tier={account.icpTier} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deals abertos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {deals.length === 0 && <p className="text-sm text-muted-foreground">Nenhum deal aberto.</p>}
          {deals.map((d) => (
            <Link key={d.id} href={`/modules/sales/deals/${d.id}`} className="block text-sm">
              <p className="font-medium text-foreground">{d.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{formatCurrency(d.amountCents)}</span>
                <RiskBadge level={d.riskLevel} />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos sinais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {signals.length === 0 && <p className="text-sm text-muted-foreground">Nenhum sinal ainda.</p>}
          {signals.map((s) => (
            <div key={s.id} className="text-sm">
              <p className="text-foreground">{s.detail}</p>
              <p className="text-xs text-muted-foreground">{formatRelative(s.detectedAt)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function ContactsTab({ accountId }: { accountId: string }) {
  const contacts = getContactsByAccount(accountId);
  if (contacts.length === 0) return <EmptyState icon={Users} title="Nenhum contato ainda" />;
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {contacts.map((c) => (
        <div key={c.id} className="flex items-center gap-3 px-4 py-3">
          <EntityAvatar name={c.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-foreground">{c.name}</p>
            <p className="text-xs text-muted-foreground">
              {c.role} · {c.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const SENTIMENT_TONE: Record<string, string> = { positive: "text-success", neutral: "text-muted-foreground", negative: "text-danger" };

export function InteractionsTab({ accountId }: { accountId: string }) {
  const interactions = getInteractionsByAccount(accountId);
  if (interactions.length === 0) return <EmptyState icon={Mail} title="Nenhuma interação registrada ainda" />;
  return (
    <div className="space-y-3">
      {interactions.map((i) => (
        <Card key={i.id} className="py-3">
          <CardContent className="px-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium capitalize text-foreground">
                {i.type} · {i.subject ?? "Sem assunto"}
              </p>
              <span className="text-xs text-muted-foreground">{formatRelative(i.occurredAt)}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{i.summary}</p>
            {i.aiAnalysis && (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <span className={SENTIMENT_TONE[i.aiAnalysis.sentiment]}>Sentimento: {i.aiAnalysis.sentiment}</span>
                <span className="text-muted-foreground">Intenção: {i.aiAnalysis.intent}</span>
                <span className="text-muted-foreground">Engajamento: {i.aiAnalysis.engagementScore}/100</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DealsTab({ accountId }: { accountId: string }) {
  const deals = getDealsByAccount(accountId);
  if (deals.length === 0) return <EmptyState icon={Handshake} title="Nenhum deal ainda" />;
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risco</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((d) => (
            <ClickableTableRow key={d.id} href={`/modules/sales/deals/${d.id}`}>
              <TableCell className="font-medium">{d.name}</TableCell>
              <TableCell>
                <StatusBadge status={d.status} />
              </TableCell>
              <TableCell>
                <RiskBadge level={d.riskLevel} />
              </TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(d.amountCents)}</TableCell>
            </ClickableTableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function SignalsTab({ accountId }: { accountId: string }) {
  const signals = getSignalsByAccount(accountId);
  if (signals.length === 0) return <EmptyState icon={Radio} title="Nenhum sinal detectado ainda" />;
  return (
    <div className="space-y-2">
      {signals.map((s) => (
        <Card key={s.id} className="py-3">
          <CardContent className="flex items-start gap-2.5 px-4">
            <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${s.impact === "positive" ? "bg-success" : "bg-danger"}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm capitalize text-foreground">{s.type.replace(/_/g, " ")}</p>
              <p className="text-xs text-muted-foreground">{s.detail}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(s.detectedAt)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RevenueGraphTab({ accountId }: { accountId: string }) {
  const account = getAccountById(accountId)!;
  return <RevenueGraph account={account} />;
}

export function TimelineTab({ accountId }: { accountId: string }) {
  const groups = groupActivitiesByDay(accountActivities(accountId));

  if (groups.length === 0) {
    return <EmptyState icon={ActivityIcon} title="Nenhuma atividade ainda" />;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
          <div className="space-y-4 border-l border-border pl-4">
            {group.items.map((activity) => (
              <div key={activity.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{formatDate(activity.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
