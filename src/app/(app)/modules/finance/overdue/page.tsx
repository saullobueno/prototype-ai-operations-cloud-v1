"use client";

import { AlertTriangle } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EmptyState } from "@/components/domain/empty-state";
import { RiskBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCustomerById } from "@/data/mock";
import { getOverdueInvoices } from "@/data/mock/invoices";
import { formatCurrency, formatDate } from "@/lib/format";

export default function OverduePage() {
  const overdueInvoices = getOverdueInvoices();
  const totalCents = overdueInvoices.reduce((s, i) => s + i.amountCents, 0);
  const highRiskCount = overdueInvoices.filter((i) => i.riskLevel === "high").length;

  return (
    <PageContainer>
      <PageHeader title="Faturas vencidas" description="Ordenadas por dias de atraso — priorização direta para o Payment Recovery Agent." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPIStatCard label="Total vencido" value={formatCurrency(totalCents)} />
        <KPIStatCard label="Faturas vencidas" value={String(overdueInvoices.length)} />
        <KPIStatCard label="Risco alto" value={String(highRiskCount)} />
      </div>

      {overdueInvoices.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="Nenhuma fatura vencida" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Dias vencida</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueInvoices.map((invoice) => {
                const customer = getCustomerById(invoice.customerId);
                return (
                  <ClickableTableRow key={invoice.id} href={`/modules/finance/invoices/${invoice.id}`}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell className="text-muted-foreground">{customer?.company}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.daysOverdue} dias</TableCell>
                    <TableCell>{invoice.riskLevel && <RiskBadge level={invoice.riskLevel} />}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(invoice.amountCents)}</TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
