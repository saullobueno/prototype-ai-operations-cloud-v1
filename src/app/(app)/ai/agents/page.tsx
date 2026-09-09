"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { AutonomyBadge } from "@/components/domain/badges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { agents as agentsStore, deleteAgent, getAgentRunsByAgent } from "@/data/mock";
import type { Agent } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<string, string> = { active: "bg-success", paused: "bg-warning", draft: "bg-muted-foreground" };

export default function AIWorkforcePage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>(agentsStore);
  const [toDelete, setToDelete] = useState<Agent | null>(null);
  const activeCount = agents.filter((a) => a.status === "active").length;

  function confirmDelete() {
    if (!toDelete) return;
    deleteAgent(toDelete.id);
    setAgents((prev) => prev.filter((a) => a.id !== toDelete.id));
    toast.success("Agente excluído", { description: `${toDelete.name} foi removido do AI Workforce.` });
    setToDelete(null);
  }

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
            <Card key={agent.id} className="h-full transition-colors hover:bg-accent">
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/ai/agents/${agent.id}`} className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[agent.status])} />
                      <p className="truncate font-medium text-foreground">{agent.name}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{agent.description}</p>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs" className="shrink-0">
                        <MoreHorizontal />
                        <span className="sr-only">Ações do agente</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => router.push(`/ai/agents/${agent.id}/edit`)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setToDelete(agent)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link href={`/ai/agents/${agent.id}`} className="flex items-center justify-between">
                  <AutonomyBadge level={agent.autonomyLevel} />
                  <span className="text-xs text-muted-foreground">{runs.length} execuções recentes</span>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={Boolean(toDelete)} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir agente?</DialogTitle>
            <DialogDescription>
              &ldquo;{toDelete?.name}&rdquo; será removido permanentemente do AI Workforce. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
