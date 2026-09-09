"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { SettingsSection } from "@/components/layout/settings-section";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { approvals as approvalsStore, CURRENT_USER_ID, getCustomerById, policies } from "@/data/mock";
import { decideApproval } from "@/features/governance/decide-approval";
import { formatCurrency } from "@/lib/format";

const APPROVAL_TYPE_LABEL: Record<string, string> = {
  refund: "Reembolso",
  account_deletion: "Exclusão de conta",
  subscription_change: "Mudança de assinatura",
  escalation: "Escalonamento",
};

export default function AIGovernancePage() {
  const [approvals, setApprovals] = useState(approvalsStore);
  const pending = approvals.filter((a) => a.status === "pending");

  function decide(id: string, status: "approved" | "rejected") {
    decideApproval(id, status, CURRENT_USER_ID);
    setApprovals([...approvalsStore]);
    toast.success(status === "approved" ? "Aprovado" : "Rejeitado", {
      description:
        status === "approved"
          ? "A execução do agente foi marcada como concluída e uma atividade foi registrada na timeline do cliente."
          : "A execução do agente foi encerrada sem ação e uma atividade foi registrada na timeline do cliente.",
    });
  }

  return (
    <SettingsSection title="AI Governance" description="Toda política, guardrail e aprovação que restringe seu AI Workforce.">
      <div className="grid grid-cols-3 gap-4">
        <KPIStatCard label="Aprovações pendentes" value={String(pending.length)} />
        <KPIStatCard label="Políticas ativas" value={String(policies.length)} />
        <KPIStatCard label="Violações de guardrail (30d)" value="0" />
      </div>

      {pending.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Aprovações pendentes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pending.map((a) => {
              const customer = a.customerId ? getCustomerById(a.customerId) : undefined;
              return (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/[0.06] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {APPROVAL_TYPE_LABEL[a.type] ?? a.type} {a.amountCents ? `— ${formatCurrency(a.amountCents)}` : ""} {customer && `— ${customer.name}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{a.context}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(a.id, "rejected")}><X className="size-3.5" /> Rejeitar</Button>
                    <Button size="sm" className="gap-1" onClick={() => decide(a.id, "approved")}><Check className="size-3.5" /> Aprovar</Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Políticas ativas</CardTitle>
          <Button asChild size="sm" variant="outline" className="gap-1">
            <Link href="/settings/ai">Editar em Configurações <ArrowRight className="size-3.5" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {policies.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{p.name}</span>
              <span className="text-muted-foreground">{p.rules.length} regra(s)</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
