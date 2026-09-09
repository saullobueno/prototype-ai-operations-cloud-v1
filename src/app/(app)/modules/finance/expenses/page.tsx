"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Wallet2 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseFormDialog } from "@/features/finance/expense-form-dialog";
import { BudgetFormDialog } from "@/features/finance/budget-form-dialog";
import { RowActionsMenu } from "@/features/finance/row-actions-menu";
import { getUserById } from "@/data/mock";
import { getVendorById } from "@/data/mock/vendors";
import { expenses, deleteExpense } from "@/data/mock/expenses";
import { budgets } from "@/data/mock/budgets";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Budget, Expense } from "@/types";

type FilterTab = "all" | "pending" | "approved" | "rejected" | "flagged";

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "flagged", label: "Sinalizadas" },
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovadas" },
  { value: "rejected", label: "Rejeitadas" },
];

export default function ExpensesPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  // Espelha os arrays compartilhados `expenses`/`budgets` em estado local só para forçar o
  // re-render quando um registro é criado, editado ou excluído — padrão de customers/page.tsx.
  const [version, forceRefresh] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | undefined>(undefined);
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);

  const filtered = useMemo(() => {
    let list = expenses;
    if (tab !== "all") list = list.filter((e) => e.status === tab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((e) => e.category.toLowerCase().includes(q) || getUserById(e.submittedById)?.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  const flaggedCount = expenses.filter((e) => e.status === "flagged").length;
  const totalCents = expenses.reduce((s, e) => s + e.amountCents, 0);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditing(expense);
    setFormOpen(true);
  }

  function handleDelete(expense: Expense) {
    deleteExpense(expense.id);
    forceRefresh((n) => n + 1);
  }

  function openCreateBudget() {
    setEditingBudget(undefined);
    setBudgetFormOpen(true);
  }

  function openEditBudget(budget: Budget) {
    setEditingBudget(budget);
    setBudgetFormOpen(true);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Despesas"
        description="Despesas submetidas pelo time — anomalias sinalizadas pelo Financial Anomaly Agent."
        actions={
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="size-4" /> Nova despesa
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPIStatCard label="Total de despesas" value={formatCurrency(totalCents)} />
        <KPIStatCard label="Sinalizadas" value={String(flaggedCount)} />
        <KPIStatCard label="Registros" value={String(expenses.length)} />
      </div>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Orçamentos por categoria</CardTitle>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={openCreateBudget}>
            <Plus className="size-3.5" /> Novo orçamento
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.map((budget) => {
            const pct = budget.allocatedCents > 0 ? Math.min(Math.round((budget.spentCents / budget.allocatedCents) * 100), 999) : 0;
            const overBudget = budget.spentCents > budget.allocatedCents;
            return (
              <div key={budget.id}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{budget.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${overBudget ? "text-danger" : "text-muted-foreground"}`}>
                      {formatCurrency(budget.spentCents)} de {formatCurrency(budget.allocatedCents)} ({pct}%)
                    </span>
                    <Button variant="ghost" size="icon-xs" onClick={() => openEditBudget(budget)}>
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Editar orçamento</span>
                    </Button>
                  </div>
                </div>
                <Progress value={Math.min(pct, 100)} className={overBudget ? "[&>div]:bg-danger" : undefined} />
              </div>
            );
          })}
        </CardContent>
      </Card>

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
          <Input placeholder="Buscar por categoria ou colaborador..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Wallet2} title="Nenhuma despesa corresponde aos filtros" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((expense) => {
                const submitter = getUserById(expense.submittedById);
                const vendor = expense.vendorId ? getVendorById(expense.vendorId) : undefined;
                return (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium capitalize">{expense.category}</TableCell>
                    <TableCell className="text-muted-foreground">{submitter?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{vendor?.name ?? "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={expense.status} />
                      {expense.anomalyReason && <p className="mt-1 max-w-xs text-xs text-danger">{expense.anomalyReason}</p>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(expense.createdAt)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(expense.amountCents)}</TableCell>
                    <TableCell>
                      <RowActionsMenu
                        actions={[
                          { key: "edit", label: "Editar", onSelect: () => openEdit(expense) },
                          {
                            key: "delete",
                            label: "Excluir",
                            destructive: true,
                            onSelect: () => handleDelete(expense),
                            confirm: {
                              title: "Excluir despesa?",
                              description: `A despesa de ${formatCurrency(expense.amountCents)} (${expense.category}) será removida permanentemente.`,
                              confirmLabel: "Excluir",
                            },
                          },
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

      <ExpenseFormDialog key={editing?.id ?? "new"} expense={editing} open={formOpen} onOpenChange={setFormOpen} onSave={() => forceRefresh((n) => n + 1)} />
      <BudgetFormDialog
        key={editingBudget?.id ?? "new-budget"}
        budget={editingBudget}
        open={budgetFormOpen}
        onOpenChange={setBudgetFormOpen}
        onSave={() => forceRefresh((n) => n + 1)}
      />
    </PageContainer>
  );
}
