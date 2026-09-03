"use client";

import { Sparkles } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAskAI } from "@/components/layout/ask-ai-context";

const SUGGESTIONS = [
  "Por que a performance do suporte caiu essa semana?",
  "Quais clientes estão em risco?",
  "O que está travando a taxa de resolução por IA?",
];

export default function CopilotPage() {
  const { setOpen } = useAskAI();

  return (
    <PageContainer>
      <PageHeader title="Copilot" description="Seu assistente de IA para clientes, tickets e operações." />

      <Card className="border-ai-accent/30 bg-ai-accent/[0.04]">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-ai-accent/15 text-ai-accent">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">Pergunte sobre este cliente, ticket ou operação...</p>
            <p className="text-sm text-muted-foreground">O Copilot é contextual — abra a partir de qualquer conversa, ticket ou página de cliente.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <Button key={s} variant="outline" size="sm" onClick={() => setOpen(true)}>
                {s}
              </Button>
            ))}
          </div>
          <Button onClick={() => setOpen(true)} className="gap-1.5">
            <Sparkles className="size-4" /> Abrir Copilot
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
