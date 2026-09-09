"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Lightbulb, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/domain/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProcessById } from "@/data/mock/processes";

interface Recommendation {
  id: string;
  processId: string;
  agentName: string;
  title: string;
  description: string;
  impact: "Alto" | "Médio" | "Baixo";
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec_1",
    processId: "proc_data_privacy_review",
    agentName: "Optimization Agent",
    title: "Automatizar o envio do questionário de segurança",
    description: "78% dos runs de Data Privacy Compliance Review ficam parados na etapa de Risk assessment esperando o fornecedor preencher o questionário manualmente. Disparar o envio e os lembretes automaticamente reduziria a duração média em ~35%.",
    impact: "Alto",
  },
  {
    id: "rec_2",
    processId: "proc_vendor_onboarding",
    agentName: "Optimization Agent",
    title: "Elevar o limite de autoaprovação de contratos",
    description: "92% das aprovações de Vendor Onboarding abaixo de €8.000/ano são aprovadas sem alteração. Elevar o limite de autoaprovação de €5.000 para €8.000 removeria uma etapa manual da maioria dos runs sem aumentar o risco.",
    impact: "Médio",
  },
  {
    id: "rec_3",
    processId: "proc_purchase_requisition",
    agentName: "Process Agent",
    title: "Pré-preencher o centro de custo a partir do solicitante",
    description: "63% das solicitações de compra têm o centro de custo corrigido manualmente na etapa de Manager approval. Inferir o centro de custo a partir do time do solicitante eliminaria retrabalho.",
    impact: "Baixo",
  },
  {
    id: "rec_4",
    processId: "proc_incident_response",
    agentName: "Exception Agent",
    title: "Escalonar automaticamente incidentes de severidade alta sem mitigação em 1h",
    description: "Incidentes de alta severidade levam em média 1h40 para serem escalonados manualmente. Reduzir o gatilho automático para 1h alinha com o SLA de 2h e evita casos como a falha de SSO na região EU.",
    impact: "Alto",
  },
  {
    id: "rec_5",
    processId: "proc_expense_reimbursement",
    agentName: "Optimization Agent",
    title: "Expandir a aprovação automática para despesas recorrentes já aprovadas antes",
    description: "Despesas recorrentes do mesmo fornecedor e categoria, já aprovadas manualmente nos últimos 3 meses, poderiam ser aprovadas automaticamente até o limite de política.",
    impact: "Médio",
  },
];

const IMPACT_STYLE: Record<Recommendation["impact"], string> = {
  Alto: "bg-danger/15 text-danger",
  Médio: "bg-warning/15 text-warning-foreground dark:text-warning",
  Baixo: "bg-muted text-muted-foreground",
};

type RecommendationDecision = "applied" | "dismissed";
type FilterTab = "pending" | "applied" | "dismissed";

export default function BusinessRecommendationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<FilterTab>("pending");
  // Recomendações são geradas pela IA a partir do histórico de execuções — não são criadas
  // manualmente neste protótipo, só recebem uma decisão (aplicar/descartar) local à sessão,
  // já que o array RECOMMENDATIONS acima é estático (não vem de um mock file persistido).
  const [decisions, setDecisions] = useState<Record<string, RecommendationDecision>>({});

  function decide(id: string, decision: RecommendationDecision) {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
    toast.success(decision === "applied" ? "Recomendação aplicada" : "Recomendação descartada", {
      description: decision === "applied" ? "A mudança foi registrada para este processo." : "A recomendação não será mais sugerida.",
    });
  }

  const visible = RECOMMENDATIONS.filter((rec) => {
    const decision = decisions[rec.id];
    if (tab === "pending") return !decision;
    return decision === tab;
  });

  return (
    <PageContainer>
      <PageHeader title="Recomendações de IA" description="Oportunidades de automação e otimização identificadas pelo Optimization Agent a partir do histórico de execuções." />

      <div className="mb-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="applied">Aplicadas</TabsTrigger>
            <TabsTrigger value="dismissed">Descartadas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={Lightbulb} title="Nenhuma recomendação nesta categoria" />
      ) : (
        <div className="space-y-3">
          {visible.map((rec) => {
            const process = getProcessById(rec.processId);
            const decision = decisions[rec.id];
            return (
              <Card key={rec.id} className="border-ai-accent/30 bg-ai-accent/[0.03]">
                <CardContent className="flex items-start gap-3 pt-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ai-accent/15 text-ai-accent">
                    <Lightbulb className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{rec.title}</p>
                      <Badge className={IMPACT_STYLE[rec.impact]} variant="secondary">Impacto {rec.impact}</Badge>
                      {decision === "applied" && <Badge className="bg-success/15 text-success">Aplicada</Badge>}
                      {decision === "dismissed" && <Badge variant="outline">Descartada</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{rec.agentName} · {process?.name}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => process && router.push(`/modules/business/processes/${process.id}`)}>
                        Ver processo
                      </Button>
                      {!decision && (
                        <>
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(rec.id, "dismissed")}>
                            <X className="size-3.5" /> Descartar
                          </Button>
                          <Button size="sm" className="gap-1" onClick={() => decide(rec.id, "applied")}>
                            <Check className="size-3.5" /> Aplicar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
