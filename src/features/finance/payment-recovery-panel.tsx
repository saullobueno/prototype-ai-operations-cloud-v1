"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/domain/badges";
import { addTask, CURRENT_USER_ID } from "@/data/mock";
import { addCollectionCase, getCollectionCaseByInvoice } from "@/data/mock/collectionCases";
import type { Invoice } from "@/types";

// Espelha a estrutura de src/features/sales/deal-risk-panel.tsx — mesmo padrão visual de
// "AI Moment" (badge de risco + motivos + ação recomendada + CTA), aplicado a Payment Recovery.
function recommendedStrategy(invoice: Invoice): string {
  if (invoice.riskLevel === "high") return "Escalar para Customer Success e propor parcelamento para preservar a conta";
  if (invoice.riskLevel === "medium") return "Reenviar cobrança com prazo adicional e confirmar recebimento por telefone";
  return "Enviar lembrete automático padrão de cobrança";
}

export function PaymentRecoveryPanel({ invoice, customerHref }: { invoice: Invoice; customerHref: string }) {
  const router = useRouter();
  const [collectionCase, setCollectionCase] = useState(() => getCollectionCaseByInvoice(invoice.id));

  if (!invoice.riskLevel || invoice.riskLevel === "low" || !invoice.riskReasons || invoice.riskReasons.length === 0) {
    return (
      <Card className="border-success/30 bg-success/[0.04]">
        <CardContent className="flex items-center gap-3 pt-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <p className="font-medium text-foreground">Sem sinais de risco de pagamento</p>
            <p className="text-sm text-muted-foreground">A IA não encontrou motivos para preocupação com esta fatura.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const strategy = recommendedStrategy(invoice);

  function handleStartCollection() {
    if (!collectionCase) {
      const created = {
        id: `case_${invoice.id}_${Date.now()}`,
        invoiceId: invoice.id,
        customerId: invoice.customerId,
        status: "contacted" as const,
        strategy,
        agentId: "agent_payment_recovery",
        createdAt: new Date().toISOString(),
      };
      addCollectionCase(created);
      setCollectionCase(created);
    }
    addTask({
      id: `task_${Date.now()}`,
      title: `Cobrar fatura ${invoice.number}`,
      relatedType: "invoice",
      relatedId: invoice.id,
      assigneeId: CURRENT_USER_ID,
      status: "todo",
    });
    toast.success("Cobrança iniciada", { description: strategy });
  }

  return (
    <Card className="border-danger/30 bg-danger/[0.04]">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-danger/15 text-danger">
            <ShieldAlert className="size-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">Risco de não recebimento desta fatura</p>
              <RiskBadge level={invoice.riskLevel} />
            </div>
            <ul className="mt-2 space-y-1">
              {invoice.riskReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-danger" />
                  {reason}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              <span className="font-medium text-foreground">Estratégia recomendada: </span>
              <span className="text-muted-foreground">{strategy}</span>
            </p>
            {collectionCase && (
              <p className="mt-1 text-xs text-muted-foreground">
                Caso de cobrança criado — status atual: <span className="font-medium text-foreground">{collectionCase.status}</span>
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={handleStartCollection}>
                {collectionCase ? "Criar task de follow-up" : "Iniciar cobrança"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => router.push(customerHref)}>
                Ver cliente →
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
