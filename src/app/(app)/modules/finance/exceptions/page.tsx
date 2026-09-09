"use client";

import { useRouter } from "next/navigation";
import { AlertOctagon } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/domain/badges";
import { financialAnomalies } from "@/data/mock/financialAnomalies";
import { formatCurrency, formatDate } from "@/lib/format";

const TYPE_LABEL: Record<string, string> = {
  duplicate_payment: "Pagamento duplicado",
  unusual_expense: "Despesa incomum",
  unexpected_amount: "Valor inesperado",
  vendor_anomaly: "Anomalia de fornecedor",
  reconciliation_mismatch: "Divergência de reconciliação",
};

export default function ExceptionsPage() {
  const router = useRouter();
  const openExceptions = financialAnomalies.filter((a) => a.status === "open");

  return (
    <PageContainer>
      <PageHeader title="Exceções financeiras" description="Anomalias abertas que ainda exigem revisão humana." />

      {openExceptions.length === 0 ? (
        <EmptyState icon={AlertOctagon} title="Nenhuma exceção em aberto" />
      ) : (
        <div className="space-y-2">
          {openExceptions.map((a) => (
            <Card
              key={a.id}
              className="cursor-pointer py-3 transition-colors hover:bg-accent"
              onClick={() => router.push("/modules/finance/anomalies")}
            >
              <CardContent className="flex items-start justify-between gap-3 px-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">{TYPE_LABEL[a.type] ?? a.type}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 text-sm text-foreground">{a.detail}</p>
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
