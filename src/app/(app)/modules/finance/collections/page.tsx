"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HandCoins, Pencil } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/domain/empty-state";
import { CollectionCaseFormDialog } from "@/features/finance/collection-case-form-dialog";
import { getCustomerById } from "@/data/mock";
import { collectionCases } from "@/data/mock/collectionCases";
import { getInvoiceById } from "@/data/mock/invoices";
import { formatCurrency, formatDate } from "@/lib/format";
import type { CollectionCase, CollectionCaseStatus } from "@/types";

const COLUMNS: { status: CollectionCaseStatus; label: string }[] = [
  { status: "monitoring", label: "Monitorando" },
  { status: "contacted", label: "Contatado" },
  { status: "escalated", label: "Escalado" },
  { status: "resolved", label: "Resolvido" },
];

export default function CollectionsPage() {
  const router = useRouter();
  // Espelha o array compartilhado `collectionCases` em estado local só para forçar o re-render
  // após editar um caso (mesma referência mutada) — padrão de customers/page.tsx.
  const [, forceRefresh] = useState(0);
  const [editing, setEditing] = useState<CollectionCase | undefined>(undefined);

  return (
    <PageContainer>
      <PageHeader title="Cobranças" description={`${collectionCases.length} casos de cobrança ativos, gerenciados pelo Payment Recovery Agent.`} />

      {collectionCases.length === 0 ? (
        <EmptyState icon={HandCoins} title="Nenhum caso de cobrança aberto" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => {
            const cases = collectionCases.filter((c) => c.status === col.status);
            return (
              <div key={col.status}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold text-foreground">{col.label}</h2>
                  <span className="text-xs text-muted-foreground">{cases.length}</span>
                </div>
                <div className="space-y-2">
                  {cases.map((c) => {
                    const invoice = getInvoiceById(c.invoiceId);
                    const customer = getCustomerById(c.customerId);
                    return (
                      <Card
                        key={c.id}
                        className="cursor-pointer py-3 transition-colors hover:bg-accent"
                        onClick={() => router.push(`/modules/finance/invoices/${c.invoiceId}`)}
                      >
                        <CardContent className="px-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-foreground">{customer?.company ?? "—"}</p>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditing(c);
                              }}
                            >
                              <Pencil className="size-3.5" />
                              <span className="sr-only">Editar caso</span>
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">{invoice?.number} · {invoice ? formatCurrency(invoice.amountCents) : ""}</p>
                          <p className="mt-1.5 text-xs text-muted-foreground">{c.strategy}</p>
                          <p className="mt-1.5 text-[11px] text-muted-foreground">Aberto em {formatDate(c.createdAt)}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <CollectionCaseFormDialog
          collectionCase={editing}
          open={editing !== undefined}
          onOpenChange={(next) => !next && setEditing(undefined)}
          onSave={() => {
            forceRefresh((n) => n + 1);
            setEditing(undefined);
          }}
        />
      )}
    </PageContainer>
  );
}
