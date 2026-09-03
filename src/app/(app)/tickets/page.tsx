"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Search, Ticket as TicketIcon } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { PriorityBadge, StatusBadge } from "@/components/domain/badges";
import { SLABadge } from "@/components/domain/sla-badge";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCustomerById, getUserById, minutesUntilBreach, tickets } from "@/data/mock";
import { escalateTicket, resolveTicket } from "@/features/tickets/ticket-actions";

type FilterTab = "all" | "open" | "unassigned" | "breaching";

export default function TicketsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `tickets` em estado local só para forçar o re-render da
  // tabela quando uma ação do menu ("Resolver"/"Escalar") muta um ticket in-place.
  const [version, setVersion] = useState(0);

  const filtered = useMemo(() => {
    let list = [...tickets].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (tab === "open") list = list.filter((t) => t.status !== "resolved" && t.status !== "closed");
    if (tab === "unassigned") list = list.filter((t) => !t.assigneeId && t.status !== "resolved" && t.status !== "closed");
    if (tab === "breaching") list = list.filter((t) => minutesUntilBreach(t) !== null && (minutesUntilBreach(t) as number) < 60);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  return (
    <PageContainer>
      <PageHeader title="Tickets" description={`${tickets.length} tickets neste workspace`} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="open">Abertos</TabsTrigger>
            <TabsTrigger value="unassigned">Sem responsável</TabsTrigger>
            <TabsTrigger value="breaching">Rompendo SLA</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar tickets..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={TicketIcon} title="Nenhum ticket corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const customer = getCustomerById(t.customerId);
                const assignee = t.assigneeId ? getUserById(t.assigneeId) : undefined;
                const isDone = t.status === "resolved" || t.status === "closed";
                return (
                  <ClickableTableRow key={t.id} href={`/tickets/${t.id}`}>
                    <TableCell className="font-medium">{t.id}</TableCell>
                    <TableCell>
                      <p className="text-foreground">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{customer?.name}</p>
                    </TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                    <TableCell><SLABadge ticket={t} /></TableCell>
                    <TableCell>
                      {assignee ? (
                        <div className="flex items-center gap-1.5">
                          <EntityAvatar name={assignee.name} size="xs" />
                          <span className="text-sm text-foreground">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sem responsável</span>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                            <span className="sr-only">Ações do ticket</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => router.push(`/tickets/${t.id}`)}>Ver detalhe</DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={isDone}
                            onSelect={() => {
                              resolveTicket(t);
                              setVersion((v) => v + 1);
                              toast.success(`${t.id} marcado como resolvido`);
                            }}
                          >
                            Resolver
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              escalateTicket(t);
                              setVersion((v) => v + 1);
                              toast("Escalado — prioridade elevada para urgente");
                            }}
                          >
                            Escalar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
