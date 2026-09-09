"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, CheckCircle2, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { EmptyState } from "@/components/domain/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { peopleApprovals as peopleApprovalsStore } from "@/data/mock/peopleApprovals";
import { decidePeopleApproval } from "@/features/people/decide-people-approval";
import { CURRENT_USER_ID } from "@/data/mock";
import { formatDate } from "@/lib/format";

const APPROVAL_TYPE_LABEL: Record<string, string> = {
  time_off: "Day off / Férias",
  hiring: "Contratação",
};

export default function PeopleApprovalsPage() {
  const [approvals, setApprovals] = useState(peopleApprovalsStore);
  const pending = approvals.filter((a) => a.status === "pending");
  const decided = approvals.filter((a) => a.status !== "pending");

  function decide(id: string, status: "approved" | "rejected") {
    decidePeopleApproval(id, status, CURRENT_USER_ID);
    setApprovals([...peopleApprovalsStore]);
    toast.success(status === "approved" ? "Aprovado" : "Rejeitado", {
      description: status === "approved" ? "A solicitação foi aprovada." : "A solicitação foi rejeitada.",
    });
  }

  return (
    <PageContainer>
      <PageHeader title="Aprovações" description="Solicitações de day off e contratação que aguardam decisão humana." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPIStatCard label="Aprovações pendentes" value={String(pending.length)} />
        <KPIStatCard label="Aprovações decididas" value={String(decided.length)} />
        <KPIStatCard label="Total" value={String(approvals.length)} />
      </div>

      {pending.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Nenhuma aprovação pendente" description="Todas as solicitações de People Operations foram decididas." />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aprovações pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/[0.06] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {APPROVAL_TYPE_LABEL[a.type] ?? a.type} · {formatDate(a.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.context}</p>
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
            ))}
          </CardContent>
        </Card>
      )}

      {decided.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Histórico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {decided.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {APPROVAL_TYPE_LABEL[a.type] ?? a.type} · {formatDate(a.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.context}</p>
                </div>
                <span className={`text-xs font-medium ${a.status === "approved" ? "text-success" : "text-danger"}`}>{a.status === "approved" ? "Aprovado" : "Rejeitado"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
