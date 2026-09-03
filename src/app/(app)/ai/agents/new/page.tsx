import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { AgentBuilder } from "@/features/agents/agent-builder";

export default function NewAgentPage() {
  return (
    <PageContainer>
      <PageHeader title="Criar agente" description="Configure identidade, objetivo, personalidade, conhecimento, ferramentas e políticas." />
      <AgentBuilder />
    </PageContainer>
  );
}
