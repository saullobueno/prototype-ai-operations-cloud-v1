import Link from "next/link";
import { Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { AutonomyBadge } from "@/components/domain/badges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { agents, getAgentRunsByAgent } from "@/data/mock";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<string, string> = { active: "bg-success", paused: "bg-warning", draft: "bg-muted-foreground" };

export default function AIWorkforcePage() {
  const activeCount = agents.filter((a) => a.status === "active").length;

  return (
    <PageContainer>
      <PageHeader
        title="AI Workforce"
        description={`${activeCount} agentes ativos`}
        actions={
          <Button asChild>
            <Link href="/ai/agents/new"><Plus /> Criar agente</Link>
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Tarefas hoje" value="2.481" />
        <KPIStatCard label="Autônomas" value="1.823" />
        <KPIStatCard label="Assistidas" value="412" />
        <KPIStatCard label="Escaladas" value="246" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => {
          const runs = getAgentRunsByAgent(agent.id);
          return (
            <Link key={agent.id} href={`/ai/agents/${agent.id}`}>
              <Card className="h-full transition-colors hover:bg-accent">
                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("size-1.5 rounded-full", STATUS_DOT[agent.status])} />
                        <p className="font-medium text-foreground">{agent.name}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{agent.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <AutonomyBadge level={agent.autonomyLevel} />
                    <span className="text-xs text-muted-foreground">{runs.length} execuções recentes</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
