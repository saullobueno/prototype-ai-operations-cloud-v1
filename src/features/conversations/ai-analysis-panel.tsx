import { Sparkles } from "lucide-react";
import { PriorityBadge } from "@/components/domain/badges";
import { formatCurrency } from "@/lib/format";
import type { AIAnalysis } from "@/types";

const SENTIMENT_LABEL: Record<AIAnalysis["sentiment"], string> = {
  positive: "Positivo",
  neutral: "Neutro",
  frustrated: "Frustrado",
  angry: "Irritado",
};

export function AIAnalysisPanel({ analysis }: { analysis: AIAnalysis }) {
  return (
    <div className="space-y-2.5 border-b border-border bg-ai-accent/[0.04] px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ai-accent">
        <Sparkles className="size-3.5" />
        Análise de IA
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <div className="flex items-center justify-between gap-2 col-span-2 sm:col-span-1">
          <dt className="text-muted-foreground">Intenção</dt>
          <dd className="font-medium text-foreground">{analysis.intent}</dd>
        </div>
        <div className="flex items-center justify-between gap-2 col-span-2 sm:col-span-1">
          <dt className="text-muted-foreground">Sentimento</dt>
          <dd className="font-medium text-foreground">{SENTIMENT_LABEL[analysis.sentiment]}</dd>
        </div>
        <div className="flex items-center justify-between gap-2 col-span-2 sm:col-span-1">
          <dt className="text-muted-foreground">Prioridade</dt>
          <dd><PriorityBadge priority={analysis.priority} /></dd>
        </div>
        <div className="flex items-center justify-between gap-2 col-span-2 sm:col-span-1">
          <dt className="text-muted-foreground">Confiança</dt>
          <dd className="font-medium text-foreground">{analysis.confidence}%</dd>
        </div>
        {analysis.customerValueCents !== undefined && (
          <div className="flex items-center justify-between gap-2 col-span-2 sm:col-span-1">
            <dt className="text-muted-foreground">Valor do cliente</dt>
            <dd className="font-medium text-foreground">{formatCurrency(analysis.customerValueCents)}</dd>
          </div>
        )}
      </dl>
      {analysis.recommendedAction && (
        <div className="rounded-md bg-background/60 px-2.5 py-2 text-sm">
          <p className="font-medium text-foreground">Ação recomendada</p>
          <p className="text-muted-foreground">{analysis.recommendedAction}</p>
          {analysis.reason && <p className="mt-1 text-xs text-muted-foreground">{analysis.reason}</p>}
        </div>
      )}
    </div>
  );
}
