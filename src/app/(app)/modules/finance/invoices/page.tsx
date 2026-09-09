"use client";

import { useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { RiskBadge, StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoiceFormDialog } from "@/features/finance/invoice-form-dialog";
import { RowActionsMenu } from "@/features/finance/row-actions-menu";
import { getCustomerById } from "@/data/mock";
import { invoices, updateInvoice, deleteInvoice } from "@/data/mock/invoices";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Invoice, InvoiceStatus } from "@/types";

type FilterTab = InvoiceStatus | "all";

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviadas" },
  { value: "viewed", label: "Visualizadas" },
  { value: "overdue", label: "Vencidas" },
  { value: "paid", label: "Pagas" },
  { value: "void", label: "Anuladas" },
];

export default function InvoicesPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `invoices` em estado local só para forçar o re-render quando
  // uma fatura é criada, editada, anulada ou excluída — padrão de customers/page.tsx.
  const [version, forceRefresh] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | undefined>(undefined);

  const filtered = useMemo(() => {
    let list = invoices;
    if (tab !== "all") list = list.filter((i) => i.status === tab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((i) => {
        const customer = getCustomerById(i.customerId);
        return i.number.toLowerCase().includes(q) || customer?.company?.toLowerCase().includes(q) || customer?.name.toLowerCase().includes(q);
      });
    }
    return [...list].sort((a, b) => +new Date(b.issueDate) - +new Date(a.issueDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  const totalOpenCents = invoices.filter((i) => i.status !== "paid" && i.status !== "void" && i.status !== "draft").reduce((s, i) => s + i.amountCents, 0);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(invoice: Invoice) {
    setEditing(invoice);
    setFormOpen(true);
  }

  function handleVoid(invoice: Invoice) {
    updateInvoice(invoice.id, { status: "void" });
    forceRefresh((n) => n + 1);
  }

  function handleDelete(invoice: Invoice) {
    deleteInvoice(invoice.id);
    forceRefresh((n) => n + 1);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Faturas"
        description={`${invoices.length} faturas · ${formatCurrency(totalOpenCents)} em aberto`}
        actions={
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="size-4" /> Nova fatura
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
          <Input placeholder="Buscar por número ou cliente..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhuma fatura corresponde aos filtros" description="Tente ajustar sua busca ou filtros." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Atraso</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((invoice) => {
                const customer = getCustomerById(invoice.customerId);
                return (
                  <ClickableTableRow key={invoice.id} href={`/modules/finance/invoices/${invoice.id}`}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell className="text-muted-foreground">{customer?.company}</TableCell>
                    <TableCell><StatusBadge status={invoice.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.daysOverdue ? `${invoice.daysOverdue}d` : "—"}</TableCell>
                    <TableCell>{invoice.riskLevel ? <RiskBadge level={invoice.riskLevel} /> : "—"}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(invoice.amountCents)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <RowActionsMenu
                        actions={[
                          { key: "edit", label: "Editar", onSelect: () => openEdit(invoice) },
                          ...(invoice.status !== "paid" && invoice.status !== "void"
                            ? [
                                {
                                  key: "void",
                                  label: "Anular fatura",
                                  onSelect: () => handleVoid(invoice),
                                  confirm: {
                                    title: "Anular fatura?",
                                    description: `${invoice.number} será marcada como anulada. O histórico é preservado — use isso em vez de excluir faturas já emitidas.`,
                                    confirmLabel: "Anular",
                                  },
                                },
                              ]
                            : []),
                          ...(invoice.status === "draft"
                            ? [
                                {
                                  key: "delete",
                                  label: "Excluir",
                                  destructive: true,
                                  onSelect: () => handleDelete(invoice),
                                  confirm: {
                                    title: "Excluir rascunho?",
                                    description: `O rascunho ${invoice.number} será removido permanentemente — ele ainda não foi enviado ao cliente.`,
                                    confirmLabel: "Excluir",
                                  },
                                },
                              ]
                            : []),
                        ]}
                      />
                    </TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <InvoiceFormDialog key={editing?.id ?? "new"} invoice={editing} open={formOpen} onOpenChange={setFormOpen} onSave={() => forceRefresh((n) => n + 1)} />
    </PageContainer>
  );
}
