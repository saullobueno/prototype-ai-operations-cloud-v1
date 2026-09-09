"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { AIInsightCard } from "@/components/domain/ai-insight-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { workloadByDepartment, staffingNeedsByDepartment } from "@/data/mock/peopleAnalyticsSeries";
import { onboardings } from "@/data/mock/onboardings";
import { peopleRequests } from "@/data/mock/peopleRequests";

// Recomendações do Workforce Insights Agent — sempre para revisão humana, nunca uma decisão
// automática sobre pessoas (ver docs/AI_OPERATIONS_CLOUD_COMPLETE_SPEC.md §10).
export default function WorkforceInsightsPage() {
  const delayed = onboardings.filter((o) => o.status === "delayed");
  const pendingRequests = peopleRequests.filter((r) => r.status === "pending");
  const busiestDept = [...workloadByDepartment].sort((a, b) => b.tarefasAbertas - a.tarefasAbertas)[0];

  return (
    <PageContainer>
      <PageHeader title="Workforce Insights" description="Sinais de carga de trabalho, capacidade e atrasos operacionais — recomendações para revisão de gestores e People." />

      <div className="mb-6 space-y-3">
        <AIInsightCard
          title={`${busiestDept.departamento} concentra a maior carga de tarefas abertas (${busiestDept.tarefasAbertas})`}
          description="O Workforce Insights Agent recomenda avaliar redistribuição de trabalho ou reforço de headcount com o gestor do departamento."
        />
        {delayed.length > 0 && (
          <AIInsightCard
            title={`${delayed.length} processo(s) de onboarding atrasado(s)`}
            description="Etapas bloqueadas indicam gargalo operacional (equipamento ou acessos) — recomendação de acompanhamento pelo time de People."
          />
        )}
        {pendingRequests.length > 0 && (
          <AIInsightCard
            title={`${pendingRequests.length} solicitação(ões) aguardando decisão humana`}
            description="O People Request Agent já triou o contexto de cada uma — nenhuma decisão é tomada automaticamente."
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Carga de trabalho por departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={workloadByDepartment} xKey="departamento" yKey="tarefasAbertas" horizontal />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Necessidade de staffing por departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={staffingNeedsByDepartment} xKey="departamento" yKey="vagasAbertas" colorIndex={2} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
