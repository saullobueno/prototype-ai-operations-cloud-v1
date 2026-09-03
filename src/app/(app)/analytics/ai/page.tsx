"use client";

import { useState } from "react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { AIInsightCard } from "@/components/domain/ai-insight-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@/components/charts/donut-chart";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { CreateArticleDialog } from "@/features/knowledge/create-article-dialog";
import { aiResolutionBreakdown, aiResolutionTrend, topUnresolvedIntents } from "@/data/mock/analyticsSeries";

export default function AIPerformancePage() {
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);

  return (
    <PageContainer>
      <PageHeader title="AI Performance" description="O quão bem seu AI Workforce está resolvendo as operações de clientes." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Taxa de resolução" value="68,4%" trend={{ direction: "up", value: "5,8%", positive: true }} />
        <KPIStatCard label="Escalonamento humano" value="21,3%" />
        <KPIStatCard label="Custo / resolução" value="€0,14" trend={{ direction: "down", value: "9%", positive: true }} />
        <KPIStatCard label="Confiança média" value="91,2%" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Detalhamento de resolução</CardTitle></CardHeader>
          <CardContent><DonutChart data={aiResolutionBreakdown} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Tendência da taxa de resolução</CardTitle></CardHeader>
          <CardContent><TrendLineChart data={aiResolutionTrend} xKey="day" series={[{ key: "resolution", label: "Taxa de resolução" }]} valueSuffix="%" /></CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-base">Por que a IA não resolve mais?</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">Principais intenções não resolvidas</p>
          <SimpleBarChart data={topUnresolvedIntents} xKey="intent" yKey="share" horizontal height={220} colorIndex={7} />
        </CardContent>
      </Card>

      <div className="mt-4">
        <AIInsightCard
          title="Ação recomendada"
          description="Crie um artigo na base de conhecimento sobre exceções de reembolso — isso responde por 31% das conversas que a IA não consegue resolver sozinha."
          actionLabel="Criar artigo"
          onAction={() => setArticleDialogOpen(true)}
        />
      </div>

      <CreateArticleDialog topic="Exceções da política de reembolso" open={articleDialogOpen} onOpenChange={setArticleDialogOpen} />
    </PageContainer>
  );
}
