"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Sparkles, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { financialAnomalies, updateAnomalyStatus } from "@/data/mock/financialAnomalies";
import { formatCurrency, formatDate } from "@/lib/format";
import type { FinancialAnomalyType } from "@/types";

type FilterTab = FinancialAnomalyType | "all";

const TYPE_LABEL: Record<FinancialAnomalyType, string> = {
  duplicate_payment: "Pagamento duplicado",
  unusual_expense: "Despesa incomum",
  unexpected_amount: "Valor inesperado",
  vendor_anomaly: "Anomalia de fornecedor",
  reconciliation_mismatch: "Divergência de reconciliação",
};

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "duplicate_payment", label: TYPE_LABEL.duplicate_payment },
  { value: "unusual_expense", label: TYPE_LABEL.unusual_expense },
  { value: "unexpected_amount", label: TYPE_LABEL.unexpected_amount },
  { value: "vendor_anomaly", label: TYPE_LABEL.vendor_anomaly },
  { value: "reconciliation_mismatch", label: TYPE_LABEL.reconciliation_mismatch },
];

export default function AnomaliesPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  // Espelha o array compartilhado `financialAnomalies` em estado local só para forçar o re-render
  // quando uma anomalia é confirmada/descartada (mesma referência mutada) — padrão de approvals/page.tsx.
  const [version, forceRefresh] = useState(0);

  const filtered = useMemo(
    () => (tab === "all" ? financialAnomalies : financialAnomalies.filter((a) => a.type === tab)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, version],
  );
  const openCount = financialAnomalies.filter((a) => a.status === "open").length;

  function decide(id: string, status: "confirmed" | "dismissed") {
    updateAnomalyStatus(id, status);
    forceRefresh((n) => n + 1);
    toast.success(status === "confirmed" ? "Anomalia confirmada" : "Anomalia descartada");
  }

  return (
    <PageContainer>
      <PageHeader title="Anomalias financeiras" description="Detectadas pelo Financial Anomaly Agent — pagamentos duplicados, despesas incomuns, valores inesperados e mais." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPIStatCard label="Anomalias abertas" value={String(openCount)} />
        <KPIStatCard label="Total detectado" value={String(financialAnomalies.length)} />
        <KPIStatCard label="Tipos monitorados" value="5" />
      </div>

      <div className="mb-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList className="flex-wrap">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Sparkles} title="Nenhuma anomalia deste tipo" />
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <Card key={a.id} className="py-3">
              <CardContent className="flex items-start justify-between gap-3 px-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-ai-accent">{TYPE_LABEL[a.type]}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 text-sm text-foreground">{a.detail}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(a.detectedAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {a.amountCents && <span className="font-medium text-foreground">{formatCurrency(a.amountCents)}</span>}
                  {a.status === "open" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(a.id, "dismissed")}>
                        <X className="size-3.5" /> Descartar
                      </Button>
                      <Button size="sm" className="gap-1" onClick={() => decide(a.id, "confirmed")}>
                        <Check className="size-3.5" /> Confirmar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
