"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { Check, CreditCard, X } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge, HealthBadge } from "@/components/domain/badges";
import { PaymentRecoveryPanel } from "@/features/finance/payment-recovery-panel";
import { InvoiceFormDialog } from "@/features/finance/invoice-form-dialog";
import { RowActionsMenu } from "@/features/finance/row-actions-menu";
import { getCustomerById, CURRENT_USER_ID } from "@/data/mock";
import { getInvoiceById, updateInvoice } from "@/data/mock/invoices";
import { getTransactionsByInvoice } from "@/data/mock/transactions";
import { getCollectionCaseByInvoice } from "@/data/mock/collectionCases";
import { financeApprovals, decideFinanceApproval } from "@/data/mock/financeApprovals";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

export default function InvoiceDetailPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = use(params);
  const invoice = getInvoiceById(invoiceId);

  if (!invoice) notFound();

  const customer = getCustomerById(invoice.customerId);
  const transactions = getTransactionsByInvoice(invoice.id);
  const collectionCase = getCollectionCaseByInvoice(invoice.id);
  const [approvals, setApprovals] = useState(() => financeApprovals.filter((a) => a.relatedType === "invoice" && a.relatedId === invoice.id));
  // Reflete o array compartilhado `invoices` (mutado por referência) — força o re-render após
  // editar/anular a fatura, mesmo padrão de version counters usados nas listagens de Finance.
  const [, forceRefresh] = useState(0);
  const [editOpen, setEditOpen] = useState(false);

  function decide(id: string, decision: "approved" | "rejected") {
    decideFinanceApproval(id, decision, CURRENT_USER_ID);
    setApprovals(financeApprovals.filter((a) => a.relatedType === "invoice" && a.relatedId === invoiceId));
    toast.success(decision === "approved" ? "Aprovado" : "Rejeitado");
  }

  function handleVoid() {
    if (!invoice) return;
    updateInvoice(invoice.id, { status: "void" });
    forceRefresh((n) => n + 1);
    toast.success("Fatura anulada");
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {customer && (
            <Link href={`/customers/${customer.id}`} className="text-primary hover:underline">
              {customer.company}
            </Link>
          )}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{invoice.number}</h1>
          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold text-foreground">{formatCurrency(invoice.amountCents)}</p>
            <RowActionsMenu
              actions={[
                { key: "edit", label: "Editar", onSelect: () => setEditOpen(true) },
                ...(invoice.status !== "paid" && invoice.status !== "void"
                  ? [
                      {
                        key: "void",
                        label: "Anular fatura",
                        onSelect: handleVoid,
                        confirm: {
                          title: "Anular fatura?",
                          description: `${invoice.number} será marcada como anulada. O histórico é preservado.`,
                          confirmLabel: "Anular",
                        },
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={invoice.status} />
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Emissão</span>
            {formatDate(invoice.issueDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Vencimento</span>
            {formatDate(invoice.dueDate)}
          </span>
          {invoice.daysOverdue ? (
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Atraso</span>
              {invoice.daysOverdue} dias
            </span>
          ) : null}
        </div>
      </div>

      {customer && (
        <div className="mb-6">
          <PaymentRecoveryPanel invoice={invoice} customerHref={`/customers/${customer.id}`} />
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="line-items">Itens</TabsTrigger>
          <TabsTrigger value="customer">Cliente</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="approval">Aprovação</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="ai-analysis">Análise de IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardContent className="space-y-2 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cliente</span>
                <span className="font-medium text-foreground">{customer?.company ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Número</span>
                <span className="font-medium text-foreground">{invoice.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor total</span>
                <span className="font-medium text-foreground">{formatCurrency(invoice.amountCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Emitida em</span>
                <span className="font-medium text-foreground">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vencimento</span>
                <span className="font-medium text-foreground">{formatDate(invoice.dueDate)}</span>
              </div>
              {invoice.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paga em</span>
                  <span className="font-medium text-foreground">{formatDate(invoice.paidAt)}</span>
                </div>
              )}
              {collectionCase && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Caso de cobrança</span>
                  <StatusBadge status={collectionCase.status} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line-items" className="mt-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Valor unitário</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(item.unitAmountCents)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.unitAmountCents * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="mt-4">
          {customer ? (
            <Card>
              <CardContent className="space-y-2 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Empresa</span>
                  <span className="font-medium text-foreground">{customer.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contato</span>
                  <span className="font-medium text-foreground">{customer.name} · {customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plano</span>
                  <span className="font-medium text-foreground">{customer.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saúde da conta</span>
                  <HealthBadge health={customer.health} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LTV</span>
                  <span className="font-medium text-foreground">{formatCurrency(customer.lifetimeValueCents)}</span>
                </div>
                <div className="pt-2">
                  <Link href={`/customers/${customer.id}`} className="text-sm text-primary hover:underline">
                    Ver Customer 360 →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState icon={CreditCard} title="Cliente não encontrado" />
          )}
        </TabsContent>

        <TabsContent value="payments" className="mt-4 space-y-2">
          {transactions.length === 0 ? (
            <EmptyState icon={CreditCard} title="Nenhuma transação registrada para esta fatura" />
          ) : (
            transactions.map((t) => (
              <Card key={t.id} className="py-3">
                <CardContent className="flex items-center justify-between gap-3 px-4">
                  <div>
                    <p className="text-sm font-medium capitalize text-foreground">{t.type}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={t.status} />
                    <span className="font-medium text-foreground">{formatCurrency(t.amountCents)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approval" className="mt-4 space-y-2">
          {approvals.length === 0 ? (
            <EmptyState icon={Check} title="Nenhuma aprovação vinculada a esta fatura" description="Faturas de recebíveis geralmente não exigem aprovação, exceto em escalonamentos de cobrança." />
          ) : (
            approvals.map((a) => (
              <Card key={a.id} className="py-3">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.context}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(a.createdAt)} {a.amountCents ? `· ${formatCurrency(a.amountCents)}` : ""}
                    </p>
                  </div>
                  {a.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(a.id, "rejected")}>
                        <X className="size-3.5" /> Rejeitar
                      </Button>
                      <Button size="sm" className="gap-1" onClick={() => decide(a.id, "approved")}>
                        <Check className="size-3.5" /> Aprovar
                      </Button>
                    </div>
                  ) : (
                    <StatusBadge status={a.status} />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="pt-4 text-sm text-muted-foreground">
              <p>Fatura {invoice.number} emitida em {formatDateTime(invoice.issueDate)}.</p>
              <p className="mt-1">Vencimento em {formatDate(invoice.dueDate)}.</p>
              {invoice.paidAt && <p className="mt-1">Pagamento confirmado em {formatDateTime(invoice.paidAt)}.</p>}
              {invoice.status === "overdue" && <p className="mt-1">Fatura vencida há {invoice.daysOverdue} dias — sem pagamento confirmado até o momento.</p>}
              {collectionCase && <p className="mt-1">Caso de cobrança aberto em {formatDateTime(collectionCase.createdAt)} — status atual: {collectionCase.status}.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-analysis" className="mt-4">
          {customer ? (
            <PaymentRecoveryPanel invoice={invoice} customerHref={`/customers/${customer.id}`} />
          ) : (
            <EmptyState icon={CreditCard} title="Sem dados suficientes para análise de IA" />
          )}
        </TabsContent>
      </Tabs>

      <InvoiceFormDialog invoice={invoice} open={editOpen} onOpenChange={setEditOpen} onSave={() => forceRefresh((n) => n + 1)} />
    </PageContainer>
  );
}
