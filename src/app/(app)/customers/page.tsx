"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Plus, Search, Users } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { HealthBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerFormDialog } from "@/features/customers/customer-form-dialog";
import { customers, getTicketsByCustomer } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import { NOW } from "@/lib/time";
import type { Customer } from "@/types";

type FilterTab = "all" | "at_risk" | "vip" | "new";

export default function CustomersPage() {
  const router = useRouter();
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `customers` em estado local só para forçar o re-render
  // quando um cliente é criado ou editado (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    let list = customers;
    if (tab === "at_risk") list = list.filter((c) => c.health === "at_risk" || c.health === "critical");
    if (tab === "vip") list = list.filter((c) => c.tags.includes("vip"));
    if (tab === "new") {
      const cutoff = new Date(NOW);
      cutoff.setDate(cutoff.getDate() - 30);
      list = list.filter((c) => new Date(c.customerSince) >= cutoff);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  return (
    <PageContainer>
      <PageHeader
        title="Clientes"
        description={`${customers.length} clientes neste workspace`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo cliente
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="at_risk">Em risco</TabsTrigger>
            <TabsTrigger value="vip">VIP</TabsTrigger>
            <TabsTrigger value="new">Novos</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar clientes..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum cliente corresponde aos filtros" description="Tente ajustar sua busca ou filtros." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Saúde</TableHead>
                <TableHead>Tickets abertos</TableHead>
                <TableHead>Cliente desde</TableHead>
                <TableHead className="text-right">Valor vitalício</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer) => {
                const openTickets = getTicketsByCustomer(customer.id).filter((t) => t.status !== "resolved" && t.status !== "closed").length;
                return (
                  <ClickableTableRow key={customer.id} href={`/customers/${customer.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <EntityAvatar name={customer.name} size="sm" />
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.company}</TableCell>
                    <TableCell>{customer.plan}</TableCell>
                    <TableCell>
                      <HealthBadge health={customer.health} />
                    </TableCell>
                    <TableCell>{openTickets}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(customer.customerSince)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(customer.lifetimeValueCents)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                            <span className="sr-only">Ações do cliente</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => router.push(`/customers/${customer.id}`)}>Ver perfil</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setEditCustomer(customer)}>Editar</DropdownMenuItem>
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

      <CustomerFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={() => setVersion((v) => v + 1)}
      />
      <CustomerFormDialog
        customer={editCustomer ?? undefined}
        open={editCustomer !== null}
        onOpenChange={(next) => {
          if (!next) setEditCustomer(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />
    </PageContainer>
  );
}
