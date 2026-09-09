"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ShieldCheck, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { StatusBadge } from "@/components/domain/badges";
import { EmptyState } from "@/components/domain/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { businessApprovals as businessApprovalsStore } from "@/data/mock/businessApprovals";
import { decideBusinessApproval } from "@/features/business/decide-business-approval";
import { CURRENT_USER_ID } from "@/data/mock";
import { formatCurrency, formatRelative } from "@/lib/format";

const TYPE_LABEL: Record<string, string> = {
  vendor_onboarding: "Onboarding de fornecedor",
  process_exception: "Exceção de processo",
  expense: "Reembolso de despesa",
};

export default function BusinessApprovalsPage() {
  const [approvals, setApprovals] = useState(businessApprovalsStore);
  const pending = approvals.filter((a) => a.status === "pending");
  const decided = approvals.filter((a) => a.status !== "pending").sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  function decide(id: string, decision: "approved" | "rejected") {
    decideBusinessApproval(id, decision, CURRENT_USER_ID);
    setApprovals([...businessApprovalsStore]);
    toast.success(decision === "approved" ? "Aprovado" : "Rejeitado", {
      description: decision === "approved" ? "O processo foi liberado para a próxima etapa." : "O run permanece bloqueado até nova decisão.",
    });
  }

  return (
    <PageContainer>
      <PageHeader title="Aprovações" description="Aprovações de Business Operations — onboarding de fornecedores, exceções de processo e despesas." />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <KPIStatCard label="Pendentes" value={String(pending.length)} />
        <KPIStatCard label="Aprovadas" value={String(approvals.filter((a) => a.status === "approved").length)} />
        <KPIStatCard label="Rejeitadas" value={String(approvals.filter((a) => a.status === "rejected").length)} />
      </div>

      {pending.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nenhuma aprovação pendente" description="Tudo em dia — a IA não encontrou nada aguardando decisão humana." />
      ) : (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Pendentes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pending.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/[0.06] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {TYPE_LABEL[a.type] ?? a.type} {a.amountCents ? `— ${formatCurrency(a.amountCents)}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.context}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(a.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(a.id, "rejected")}><X className="size-3.5" /> Rejeitar</Button>
                  <Button size="sm" className="gap-1" onClick={() => decide(a.id, "approved")}><Check className="size-3.5" /> Aprovar</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Histórico</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {decided.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {TYPE_LABEL[a.type] ?? a.type} {a.amountCents ? `— ${formatCurrency(a.amountCents)}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">{a.context}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
