"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { AgentBuilder } from "@/features/agents/agent-builder";
import { agents } from "@/data/mock";

export default function EditAgentPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = use(params);
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) notFound();

  return (
    <PageContainer>
      <PageHeader title={`Editar ${agent.name}`} description="Atualize identidade, objetivo, personalidade, conhecimento, ferramentas e políticas." />
      <AgentBuilder agent={agent} />
    </PageContainer>
  );
}
