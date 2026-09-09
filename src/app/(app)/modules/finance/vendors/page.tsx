"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Truck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VendorFormDialog } from "@/features/finance/vendor-form-dialog";
import { RowActionsMenu } from "@/features/finance/row-actions-menu";
import { vendors, deleteVendor } from "@/data/mock/vendors";
import { getBillsByVendor } from "@/data/mock/bills";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Vendor } from "@/types";

export default function VendorsPage() {
  const [query, setQuery] = useState("");
  // Espelha o array compartilhado `vendors` em estado local só para forçar o re-render quando um
  // fornecedor é criado, editado ou excluído (mesma referência mutada) — padrão de customers/page.tsx.
  const [version, forceRefresh] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | undefined>(undefined);

  const filtered = useMemo(() => {
    if (!query.trim()) return vendors;
    const q = query.trim().toLowerCase();
    return vendors.filter((v) => v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, version]);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(vendor: Vendor) {
    setEditing(vendor);
    setFormOpen(true);
  }

  function handleDelete(vendor: Vendor) {
    deleteVendor(vendor.id);
    forceRefresh((n) => n + 1);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Fornecedores"
        description="Mesma base de fornecedores usada pelo Vendor Onboarding de Business Operations — visão de contas a pagar."
        actions={
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="size-4" /> Novo fornecedor
          </Button>
        }
      />

      <div className="mb-4">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar fornecedor..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Truck} title="Nenhum fornecedor corresponde à busca" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead className="text-right">Total em bills</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vendor) => {
                const vendorBills = getBillsByVendor(vendor.id);
                const totalCents = vendorBills.reduce((s, b) => s + b.amountCents, 0);
                return (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <EntityAvatar name={vendor.name} size="sm" />
                        <div>
                          <p className="font-medium text-foreground">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground">{vendor.contactEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vendor.category}</TableCell>
                    <TableCell><StatusBadge status={vendor.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{vendor.onboardedAt ? formatDate(vendor.onboardedAt) : "—"}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(totalCents)}</TableCell>
                    <TableCell>
                      <RowActionsMenu
                        actions={[
                          { key: "edit", label: "Editar", onSelect: () => openEdit(vendor) },
                          {
                            key: "delete",
                            label: "Excluir",
                            destructive: true,
                            onSelect: () => handleDelete(vendor),
                            confirm: {
                              title: "Excluir fornecedor?",
                              description: `"${vendor.name}" será removido permanentemente do cadastro. Bills já registradas para ele não são afetadas.`,
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

      <VendorFormDialog
        key={editing?.id ?? "new"}
        vendor={editing}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={() => forceRefresh((n) => n + 1)}
      />
    </PageContainer>
  );
}
