"use client";

import { useMemo, useState } from "react";
import { Handshake, Search } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { RiskBadge, StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PipelineBoard } from "@/features/sales/pipeline-board";
import { deals, getAccountById, getPipelineStageById } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";

type ViewMode = "pipeline" | "list";
type FilterTab = "open" | "won" | "lost" | "all";

export default function DealsPage() {
  const [view, setView] = useState<ViewMode>("pipeline");
  const [tab, setTab] = useState<FilterTab>("open");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = deals;
    if (tab !== "all") list = list.filter((d) => d.status === tab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((d) => {
        const account = getAccountById(d.accountId);
        return d.name.toLowerCase().includes(q) || account?.name.toLowerCase().includes(q);
      });
    }
    return list;
  }, [tab, query]);

  const openTotalCents = filtered.filter((d) => d.status === "open").reduce((s, d) => s + d.amountCents, 0);

  return (
    <PageContainer>
      <PageHeader title="Deals" description={`${deals.filter((d) => d.status === "open").length} oportunidades abertas · ${formatCurrency(openTotalCents)} em pipeline`} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="open">Abertos</TabsTrigger>
            <TabsTrigger value="won">Ganhos</TabsTrigger>
            <TabsTrigger value="lost">Perdidos</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar deals..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Handshake} title="Nenhum deal corresponde aos filtros" description="Tente ajustar sua busca ou filtros." />
      ) : view === "pipeline" ? (
        <PipelineBoard deals={filtered} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Estágio</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Previsão de fechamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((deal) => {
                const account = getAccountById(deal.accountId);
                const stage = getPipelineStageById(deal.stageId);
                return (
                  <ClickableTableRow key={deal.id} href={`/modules/sales/deals/${deal.id}`}>
                    <TableCell className="font-medium">{deal.name}</TableCell>
                    <TableCell className="text-muted-foreground">{account?.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={deal.status === "open" ? (stage?.name ?? "open") : deal.status} />
                    </TableCell>
                    <TableCell>
                      <RiskBadge level={deal.riskLevel} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(deal.expectedCloseDate)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(deal.amountCents)}</TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
