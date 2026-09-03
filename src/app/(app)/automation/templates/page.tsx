"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ShieldCheck, Ticket } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  { id: "wf_ticket_triage", icon: Ticket, name: "Ticket Triage", description: "Classifique e roteie tickets recebidos com IA.", category: "Suporte" },
  { id: "wf_sla_escalation", icon: AlertTriangle, name: "SLA Escalation", description: "Alerte as pessoas certas quando um ticket estiver em risco.", category: "Operações" },
  { id: "wf_refund_approval", icon: ShieldCheck, name: "Refund Approval", description: "Roteie solicitações de reembolso por verificação de política e aprovação.", category: "Billing" },
];

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <PageHeader title="Modelos" description="Comece a partir de um workflow validado em vez de um canvas em branco." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.id}>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <Badge variant="outline">{t.category}</Badge>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => router.push(`/automation/workflows/${t.id}`)}>
                  Usar modelo
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
