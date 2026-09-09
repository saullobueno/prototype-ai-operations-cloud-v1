"use client";

import { useMemo, useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInvoiceById } from "@/data/mock/invoices";
import { transactions } from "@/data/mock/transactions";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { TransactionType } from "@/types";

type FilterTab = TransactionType | "all";

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "charge", label: "Cobranças" },
  { value: "refund", label: "Reembolsos" },
  { value: "payout", label: "Repasses" },
  { value: "adjustment", label: "Ajustes" },
];

export default function PaymentsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = transactions;
    if (tab !== "all") list = list.filter((t) => t.type === tab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((t) => t.invoiceId?.toLowerCase().includes(q) || getInvoiceById(t.invoiceId ?? "")?.number.toLowerCase().includes(q));
    }
    return list;
  }, [tab, query]);

  const completedCents = transactions.filter((t) => t.type === "charge" && t.status === "completed").reduce((s, t) => s + t.amountCents, 0);
  const failedCount = transactions.filter((t) => t.status === "failed").length;
  const payoutCents = transactions.filter((t) => t.type === "payout" && t.status === "completed").reduce((s, t) => s + t.amountCents, 0);

  return (
    <PageContainer>
      <PageHeader title="Pagamentos" description="Cobranças, reembolsos e repasses processados." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPIStatCard label="Cobranças concluídas" value={formatCurrency(completedCents)} />
        <KPIStatCard label="Repasses" value={formatCurrency(payoutCents)} />
        <KPIStatCard label="Cobranças falhas" value={String(failedCount)} />
      </div>

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
          <Input placeholder="Buscar por fatura..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CreditCard} title="Nenhuma transação corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Fatura</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const invoice = t.invoiceId ? getInvoiceById(t.invoiceId) : undefined;
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium capitalize">{t.type}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice?.number ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(t.createdAt)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(t.amountCents)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
