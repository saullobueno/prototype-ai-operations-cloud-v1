"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ClipboardCheck, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { StatusBadge } from "@/components/domain/badges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CURRENT_USER_ID, agents, approvals as approvalsStore, getCustomerById, getUserById } from "@/data/mock";
import { decideApproval } from "@/features/governance/decide-approval";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { Approval, ApprovalType, ModuleKey } from "@/types";

const TYPE_LABEL: Record<ApprovalType, string> = {
  refund: "Reembolso",
  account_deletion: "Exclusão de conta",
  subscription_change: "Mudança de assinatura",
  escalation: "Escalonamento",
  vendor_onboarding: "Onboarding de fornecedor",
  bill_payment: "Pagamento a fornecedor",
  expense: "Despesa",
  purchase_order: "Ordem de compra",
  time_off: "Ausência",
  hiring: "Contratação",
  process_exception: "Exceção de processo",
};

const MODULE_LABEL: Record<ModuleKey, string> = {
  customer_operations: "Customer Operations",
  business_operations: "Business Operations",
  sales_operations: "Sales Operations",
  finance_operations: "Finance Operations",
  people_operations: "People Operations",
};

type Filter = "pending" | "approved" | "rejected" | "all";

function requesterName(approval: Approval): string {
  if (approval.requestedByType === "agent") return agents.find((a) => a.id === approval.requestedById)?.name ?? approval.requestedById;
  return getUserById(approval.requestedById)?.name ?? approval.requestedById;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(approvalsStore);
  const [filter, setFilter] = useState<Filter>("pending");

  const pendingCount = approvals.filter((a) => a.status === "pending").length;
  const filtered = approvals
    .filter((a) => filter === "all" || a.status === filter)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  function decide(id: string, status: "approved" | "rejected") {
    decideApproval(id, status, CURRENT_USER_ID);
    setApprovals([...approvalsStore]);
    toast.success(status === "approved" ? "Aprovado" : "Rejeitado");
  }

  return (
    <PageContainer>
      <PageHeader
        title="Aprovações"
        description="Toda decisão que humanos, agentes de IA e workflows pediram para revisar, entre todos os módulos."
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList>
          <TabsTrigger value="pending">Pendentes {pendingCount > 0 && `(${pendingCount})`}</TabsTrigger>
          <TabsTrigger value="approved">Aprovadas</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="Nenhuma aprovação por aqui" description="Não há aprovações para este filtro." className="mt-4" />
      ) : (
        <div className="mt-4 space-y-2">
          {filtered.map((a) => {
            const customer = a.customerId ? getCustomerById(a.customerId) : undefined;
            return (
              <Card key={a.id} className="flex-row items-center justify-between gap-4 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <EntityAvatar name={requesterName(a)} size="sm" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{TYPE_LABEL[a.type]}</p>
                      {a.amountCents !== undefined && <span className="text-sm text-muted-foreground">{formatCurrency(a.amountCents)}</span>}
                      <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {MODULE_LABEL[a.module ?? "customer_operations"]}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {a.context ?? "Sem contexto adicional"}
                      {customer && (
                        <>
                          {" · "}
                          <Link href={`/customers/${customer.id}`} className="text-primary hover:underline">
                            {customer.name}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-muted-foreground">{formatRelative(a.createdAt)}</span>
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
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
