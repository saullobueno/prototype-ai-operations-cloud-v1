"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/domain/badges";
import type { Deal } from "@/types";

export function DealRiskPanel({ deal, accountHref }: { deal: Deal; accountHref: string }) {
  const router = useRouter();

  if (deal.riskLevel === "low" || deal.riskReasons.length === 0) {
    return (
      <Card className="border-success/30 bg-success/[0.04]">
        <CardContent className="flex items-center gap-3 pt-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <p className="font-medium text-foreground">Sem sinais de risco identificados</p>
            <p className="text-sm text-muted-foreground">A IA não encontrou motivos para preocupação neste deal.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-danger/30 bg-danger/[0.04]">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-danger/15 text-danger">
            <ShieldAlert className="size-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">Risco de perder este deal</p>
              <RiskBadge level={deal.riskLevel} />
            </div>
            <ul className="mt-2 space-y-1">
              {deal.riskReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-danger" />
                  {reason}
                </li>
              ))}
            </ul>
            {deal.recommendedAction && (
              <p className="mt-3 text-sm">
                <span className="font-medium text-foreground">Ação recomendada: </span>
                <span className="text-muted-foreground">{deal.recommendedAction}</span>
              </p>
            )}
            <div className="mt-3 flex gap-2">
              {deal.recommendedAction && (
                <Button
                  size="sm"
                  onClick={() => toast.success("Follow-up agendado", { description: deal.recommendedAction })}
                >
                  {deal.recommendedAction}
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => router.push(accountHref)}>
                Ver Revenue Graph →
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
