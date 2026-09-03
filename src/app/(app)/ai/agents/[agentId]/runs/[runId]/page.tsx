"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/domain/badges";
import { AgentRunTrace } from "@/features/agents/agent-run-trace";
import { agents, getAgentRun, getCustomerById } from "@/data/mock";

export default function AgentRunPage({ params }: { params: Promise<{ agentId: string; runId: string }> }) {
  const { agentId, runId } = use(params);
  const agent = agents.find((a) => a.id === agentId);
  const run = getAgentRun(runId);
  if (!agent || !run) notFound();

  const customer = run.customerId ? getCustomerById(run.customerId) : undefined;

  return (
    <PageContainer>
      <Link href={`/ai/agents/${agent.id}`} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Voltar para {agent.name}
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Execução do agente</p>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{run.id}</h1>
          {customer && <p className="text-sm text-muted-foreground">Cliente: {customer.name}</p>}
        </div>
        <StatusBadge status={run.status} />
      </div>

      <AgentRunTrace run={run} />
    </PageContainer>
  );
}
