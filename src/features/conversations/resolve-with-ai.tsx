"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types";
import { CANONICAL_RUN_ID } from "@/data/mock/agentRuns";

interface StepDef {
  label: string;
  doneLabel: string;
}

const CANONICAL_STEPS: StepDef[] = [
  { label: "Verificando pagamento...", doneLabel: "Pagamento verificado" },
  { label: "Verificando política...", doneLabel: "Elegível para reembolso automático" },
  { label: "Emitindo reembolso...", doneLabel: "€42 reembolsados" },
  { label: "Enviando resposta...", doneLabel: "Cliente notificado" },
];

function genericSteps(intent: string): StepDef[] {
  return [
    { label: "Verificando cliente e histórico...", doneLabel: "Contexto reunido" },
    { label: `Verificando política de ${intent.toLowerCase()}...`, doneLabel: "Política verificada" },
    { label: "Gerando resolução...", doneLabel: "Resolução pronta" },
    { label: "Enviando resposta...", doneLabel: "Cliente notificado" },
  ];
}

const escalateSteps = (intent: string): StepDef[] => [
  { label: "Verificando cliente e histórico...", doneLabel: "Contexto reunido" },
  { label: `Verificando política de ${intent.toLowerCase()}...`, doneLabel: "Valor acima do limite de aprovação automática" },
  { label: "Escalando para aprovação...", doneLabel: "Escalado para o gestor" },
];

interface ResolveWithAIProps {
  conversation: Conversation;
  onResolved: (message: string) => void;
  onEscalated: () => void;
}

export function ResolveWithAI({ conversation, onResolved, onEscalated }: ResolveWithAIProps) {
  const [running, setRunning] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const isCanonical = conversation.id === "conv_1842";
  const willEscalate = !isCanonical && (conversation.aiAnalysis?.recommendedAction?.toLowerCase().includes("escal") ?? false);
  const steps = isCanonical
    ? CANONICAL_STEPS
    : willEscalate
      ? escalateSteps(conversation.aiAnalysis?.intent ?? "isto")
      : genericSteps(conversation.aiAnalysis?.intent ?? "isto");

  function start() {
    setRunning(true);
    setDoneCount(0);
    setFinished(false);

    steps.forEach((_, i) => {
      window.setTimeout(() => {
        setDoneCount(i + 1);
        if (i === steps.length - 1) {
          window.setTimeout(() => {
            setFinished(true);
            if (willEscalate) {
              onEscalated();
            } else {
              const message = isCanonical
                ? "Boas notícias — verifiquei a cobrança duplicada, confirmei que é elegível para reembolso automático pela nossa política, e já emiti €42 de volta no seu cartão. Você deve ver o valor em 3 a 5 dias úteis. Me avise se precisar de mais alguma coisa!"
                : `Revisei isso e já resolvi — ${conversation.aiAnalysis?.recommendedAction?.toLowerCase() ?? "problema resolvido"}. Me avise se precisar de mais alguma coisa!`;
              onResolved(message);
            }
          }, 400);
        }
      }, (i + 1) * 550);
    });
  }

  if (!running) {
    return (
      <Button onClick={start} className="gap-1.5 bg-ai-accent text-ai-accent-foreground hover:bg-ai-accent/90">
        <Sparkles className="size-4" />
        Resolver com IA
      </Button>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-1.5 rounded-lg border border-ai-accent/30 bg-ai-accent/[0.04] p-3">
      {steps.map((step, i) => {
        const isDone = i < doneCount;
        const isActive = i === doneCount && !finished;
        return (
          <div key={step.label} className="flex items-center gap-2 text-sm">
            {isActive ? (
              <Loader2 className="size-3.5 shrink-0 animate-spin text-ai-accent" />
            ) : isDone ? (
              <span className="text-success">✓</span>
            ) : (
              <span className="size-3.5 shrink-0" />
            )}
            <span className={isDone ? "text-foreground" : "text-muted-foreground"}>{isDone ? step.doneLabel : step.label}</span>
          </div>
        );
      })}
      {finished && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm font-medium text-foreground">{willEscalate ? "Escalado — aguardando aprovação." : "Ticket resolvido."}</p>
          {isCanonical && (
            <Button asChild variant="link" size="sm" className="h-auto gap-1 px-0 text-ai-accent">
              <Link href={`/ai/agents/agent_billing/runs/${CANONICAL_RUN_ID}`}>
                Ver rastro completo <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
