"use client";

import { useMemo, useState } from "react";
import { Plus, Receipt, Search } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BillFormDialog } from "@/features/finance/bill-form-dialog";
import { RowActionsMenu } from "@/features/finance/row-actions-menu";
import { getVendorById } from "@/data/mock/vendors";
import { bills, deleteBill } from "@/data/mock/bills";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Bill, BillStatus } from "@/types";

type FilterTab = BillStatus | "all";

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending_approval", label: "Aguardando aprovação" },
  { value: "approved", label: "Aprovadas" },
  { value: "paid", label: "Pagas" },
  { value: "rejected", label: "Rejeitadas" },
];

export default function BillsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `bills` em estado local só para forçar o re-render quando uma
  // bill é criada, editada ou excluída (mesma referência mutada) — padrão de customers/page.tsx.
  const [version, forceRefresh] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Bill | undefined>(undefined);

  const filtered = useMemo(() => {
    let list = bills;
    if (tab !== "all") list = list.filter((b) => b.status === tab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((b) => getVendorById(b.vendorId)?.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  const pendingCents = bills.filter((b) => b.status === "pending_approval").reduce((s, b) => s + b.amountCents, 0);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(bill: Bill) {
    setEditing(bill);
    setFormOpen(true);
  }

  function handleDelete(bill: Bill) {
    deleteBill(bill.id);
    forceRefresh((n) => n + 1);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Contas a pagar"
        description={`${bills.length} bills · ${formatCurrency(pendingCents)} aguardando aprovação`}
        actions={
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="size-4" /> Nova bill
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por fornecedor..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="Nenhuma bill corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bill) => {
                const vendor = getVendorById(bill.vendorId);
                return (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{vendor?.name ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={bill.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(bill.dueDate)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(bill.amountCents)}</TableCell>
                    <TableCell>
                      <RowActionsMenu
                        actions={[
                          { key: "edit", label: "Editar", onSelect: () => openEdit(bill) },
                          ...(bill.status !== "paid"
                            ? [
                                {
                                  key: "delete",
                                  label: "Excluir",
                                  destructive: true,
                                  onSelect: () => handleDelete(bill),
                                  confirm: {
                                    title: "Excluir bill?",
                                    description: `A bill de ${vendor?.name ?? "fornecedor"} (${formatCurrency(bill.amountCents)}) será removida permanentemente.`,
                                    confirmLabel: "Excluir",
                                  },
                                },
                              ]
                            : []),
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <BillFormDialog key={editing?.id ?? "new"} bill={editing} open={formOpen} onOpenChange={setFormOpen} onSave={() => forceRefresh((n) => n + 1)} />
    </PageContainer>
  );
}
