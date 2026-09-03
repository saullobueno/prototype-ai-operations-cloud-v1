"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Workflow as WorkflowIcon } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { workflows } from "@/data/mock";

const TRIGGER_LABEL: Record<string, string> = {
  conversation_created: "conversa criada",
  ticket_created: "ticket criado",
  customer_created: "cliente criado",
  message_received: "mensagem recebida",
  payment_failed: "pagamento falhou",
  sla_approaching: "SLA se aproximando",
  webhook: "webhook",
  schedule: "agendamento",
  manual: "manual",
};

type FilterTab = "all" | "active" | "paused" | "draft";

export default function WorkflowsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = workflows;
    if (tab !== "all") list = list.filter((w) => w.status === tab);
    if (query.trim()) list = list.filter((w) => w.name.toLowerCase().includes(query.trim().toLowerCase()));
    return list;
  }, [tab, query]);

  return (
    <PageContainer>
      <PageHeader
        title="Workflows"
        description={`${workflows.length} workflows neste workspace`}
        actions={
          <Button asChild>
            <Link href="/automation/workflows/new"><Plus /> Criar workflow</Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="paused">Pausados</TabsTrigger>
            <TabsTrigger value="draft">Rascunho</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar workflows..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={WorkflowIcon} title="Nenhum workflow corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gatilho</TableHead>
                <TableHead>Execuções</TableHead>
                <TableHead>Taxa de sucesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((w) => (
                <ClickableTableRow key={w.id} href={`/automation/workflows/${w.id}`}>
                  <TableCell>
                    <p className="font-medium text-foreground">{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.description}</p>
                  </TableCell>
                  <TableCell><StatusBadge status={w.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{TRIGGER_LABEL[w.trigger.type] ?? w.trigger.type}</TableCell>
                  <TableCell>{w.totalRuns.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{((w.successRuns / w.totalRuns) * 100).toFixed(1)}%</TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
