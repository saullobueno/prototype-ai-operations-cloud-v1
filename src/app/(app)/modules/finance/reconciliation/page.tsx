"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Scale } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/domain/badges";
import { EmptyState } from "@/components/domain/empty-state";
import { reconciliations, markReconciliationReviewed } from "@/data/mock/reconciliations";
import { financialAnomalies } from "@/data/mock/financialAnomalies";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ReconciliationPage() {
  // Espelha o array compartilhado `reconciliations` em estado local só para forçar o re-render
  // após marcar um período como revisado (mesma referência mutada) — padrão de approvals/page.tsx.
  const [, forceRefresh] = useState(0);
  const latest = reconciliations[0];
  const openMismatches = reconciliations.reduce((s, r) => s + r.mismatches, 0);
  const totalUnmatchedCents = reconciliations.reduce((s, r) => s + r.unmatchedCents, 0);
  const mismatchExamples = financialAnomalies.filter((a) => a.type === "reconciliation_mismatch" || a.type === "duplicate_payment");

  function handleMarkReviewed(id: string, period: string) {
    markReconciliationReviewed(id);
    forceRefresh((n) => n + 1);
    toast.success(`Período ${period} marcado como revisado`);
  }

  return (
    <PageContainer>
      <PageHeader title="Reconciliação" description="Concilia transações internas com o extrato bancário — Reconciliation Agent." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPIStatCard label={`Conciliado (${latest.period})`} value={formatCurrency(latest.matchedCents)} />
        <KPIStatCard label="Não conciliado (total)" value={formatCurrency(totalUnmatchedCents)} />
        <KPIStatCard label="Divergências abertas" value={String(openMismatches)} />
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Período</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium text-right">Conciliado</th>
              <th className="px-4 py-2.5 font-medium text-right">Não conciliado</th>
              <th className="px-4 py-2.5 font-medium text-right">Divergências</th>
              <th className="px-4 py-2.5 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reconciliations.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2.5 font-medium text-foreground">{r.period}</td>
                <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">{formatCurrency(r.matchedCents)}</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">{formatCurrency(r.unmatchedCents)}</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">{r.mismatches}</td>
                <td className="px-4 py-2.5 text-right">
                  {r.status === "discrepancy" && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkReviewed(r.id, r.period)}>
                      Marcar como revisado
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-foreground">Exemplos de divergência</h2>
      {mismatchExamples.length === 0 ? (
        <EmptyState icon={Scale} title="Nenhuma divergência registrada" />
      ) : (
        <div className="space-y-2">
          {mismatchExamples.map((a) => (
            <Card key={a.id} className="py-3">
              <CardContent className="flex items-start justify-between gap-3 px-4">
                <div>
                  <p className="text-sm text-foreground">{a.detail}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(a.detectedAt)}</p>
                </div>
                {a.amountCents && <span className="shrink-0 font-medium text-foreground">{formatCurrency(a.amountCents)}</span>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
