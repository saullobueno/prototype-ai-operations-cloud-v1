"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { AIInsightCard } from "@/components/domain/ai-insight-card";
import { HiringBoard } from "@/features/people/hiring-board";
import { candidates } from "@/data/mock/candidates";

export default function HiringPipelinePage() {
  const active = candidates.filter((c) => c.stage !== "hired" && c.stage !== "rejected");
  const inOffer = candidates.filter((c) => c.stage === "offer");

  return (
    <PageContainer>
      <PageHeader title="Pipeline de contratação" description={`${active.length} candidatos ativos no funil de contratação`} />

      {inOffer.length > 0 && (
        <div className="mb-6">
          <AIInsightCard
            title={`${inOffer.length} candidato(s) com oferta em aberto`}
            description="O Talent Agent já preparou o resumo de cada candidato — a decisão final de contratação continua sendo do gestor responsável."
          />
        </div>
      )}

      <HiringBoard candidates={candidates} />
    </PageContainer>
  );
}
