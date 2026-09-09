"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ShieldCheck, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PolicyRuleRow } from "@/components/domain/policy-rule-row";
import { EmptyState } from "@/components/domain/empty-state";
import { AgentRunTrace } from "@/features/agents/agent-run-trace";
import { CURRENT_USER_ID } from "@/data/mock";
import { financeApprovals, decideFinanceApproval } from "@/data/mock/financeApprovals";
import { financePolicies } from "@/data/mock/financePolicies";
import { getFinanceAgentRun } from "@/data/mock/financeAgentRuns";
import { formatCurrency, formatDateTime } from "@/lib/format";

const APPROVAL_TYPE_LABEL: Record<string, string> = {
  bill_payment: "Pagamento de fornecedor",
  expense: "Despesa",
  purchase_order: "Ordem de compra",
  escalation: "Escalonamento de cobrança",
};

export default function FinanceApprovalsPage() {
  const [approvals, setApprovals] = useState(financeApprovals);
  const pending = approvals.filter((a) => a.status === "pending");

  function decide(id: string, decision: "approved" | "rejected") {
    decideFinanceApproval(id, decision, CURRENT_USER_ID);
    setApprovals([...financeApprovals]);
    toast.success(decision === "approved" ? "Aprovado" : "Rejeitado");
  }

  return (
    <PageContainer>
      <PageHeader title="Aprovações" description="Pagamentos de fornecedores, despesas e ordens de compra que exigem aprovação humana." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPIStatCard label="Aprovações pendentes" value={String(pending.length)} />
        <KPIStatCard label="Valor pendente" value={formatCurrency(pending.reduce((s, a) => s + (a.amountCents ?? 0), 0))} />
        <KPIStatCard label="Políticas ativas" value={String(financePolicies.length)} />
      </div>

      {pending.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nenhuma aprovação pendente" />
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Aprovações pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.map((a) => {
              const run = a.runId ? getFinanceAgentRun(a.runId) : undefined;
              return (
                <div key={a.id} className="rounded-lg border border-warning/30 bg-warning/[0.06] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {APPROVAL_TYPE_LABEL[a.type] ?? a.type} {a.amountCents ? `— ${formatCurrency(a.amountCents)}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">{a.context}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Solicitado {formatDateTime(a.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(a.id, "rejected")}>
                        <X className="size-3.5" /> Rejeitar
                      </Button>
                      <Button size="sm" className="gap-1" onClick={() => decide(a.id, "approved")}>
                        <Check className="size-3.5" /> Aprovar
                      </Button>
                    </div>
                  </div>
                  {run && (
                    <div className="mt-3">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Trace do Invoice Processing Agent</p>
                      <AgentRunTrace run={run} />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Políticas ativas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {financePolicies.map((p) => (
            <div key={p.id}>
              <p className="mb-1.5 text-sm font-medium text-foreground">{p.name}</p>
              <div className="space-y-1">
                {p.rules.map((r) => (
                  <PolicyRuleRow key={r.id} rule={r} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
