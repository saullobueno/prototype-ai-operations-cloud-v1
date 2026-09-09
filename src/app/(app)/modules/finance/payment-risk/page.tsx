"use client";

import { ShieldAlert } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { RiskBadge, HealthBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCustomerById } from "@/data/mock";
import { invoices } from "@/data/mock/invoices";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RiskLevel } from "@/types";

const RISK_ORDER: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };

export default function PaymentRiskPage() {
  const riskyInvoices = invoices
    .filter((i) => i.riskLevel && (i.status === "overdue" || i.status === "sent" || i.status === "viewed"))
    .sort((a, b) => RISK_ORDER[a.riskLevel as RiskLevel] - RISK_ORDER[b.riskLevel as RiskLevel]);

  const totalAtRiskCents = riskyInvoices.filter((i) => i.riskLevel !== "low").reduce((s, i) => s + i.amountCents, 0);

  return (
    <PageContainer>
      <PageHeader
        title="Risco de pagamento"
        description={`${riskyInvoices.filter((i) => i.riskLevel !== "low").length} faturas em risco somam ${formatCurrency(totalAtRiskCents)} — ranqueadas pelo Payment Recovery Agent.`}
      />

      {riskyInvoices.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="Nenhuma fatura com risco de pagamento identificado" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Saúde da conta</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskyInvoices.map((invoice) => {
                const customer = getCustomerById(invoice.customerId);
                return (
                  <ClickableTableRow key={invoice.id} href={`/modules/finance/invoices/${invoice.id}`}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell className="text-muted-foreground">{customer?.company}</TableCell>
                    <TableCell>{customer && <HealthBadge health={customer.health} />}</TableCell>
                    <TableCell>{invoice.riskLevel && <RiskBadge level={invoice.riskLevel} />}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(invoice.dueDate)}</TableCell>
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
