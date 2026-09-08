"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/domain/badges";
import { pipelineStages, getAccountById } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import type { Deal } from "@/types";

export function PipelineBoard({ deals }: { deals: Deal[] }) {
  const router = useRouter();
  const stages = pipelineStages.filter((s) => s.id !== "stage_closed_won" && s.id !== "stage_closed_lost").sort((a, b) => a.order - b.order);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {stages.map((stage) => {
        const stageDeals = deals.filter((d) => d.stageId === stage.id);
        const stageTotalCents = stageDeals.reduce((s, d) => s + d.amountCents, 0);
        return (
          <div key={stage.id} className="w-72 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-foreground">{stage.name}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(stageTotalCents)}</p>
            </div>
            <div className="space-y-2">
              {stageDeals.length === 0 && (
                <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">Sem deals</div>
              )}
              {stageDeals.map((deal) => {
                const account = getAccountById(deal.accountId);
                return (
                  <Card
                    key={deal.id}
                    className="cursor-pointer py-3 transition-colors hover:bg-accent"
                    onClick={() => router.push(`/modules/sales/deals/${deal.id}`)}
                  >
                    <CardContent className="space-y-2 px-3">
                      <p className="truncate text-sm font-medium text-foreground">{account?.name ?? deal.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(deal.amountCents)}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                        {deal.riskLevel !== "low" && <RiskBadge level={deal.riskLevel} />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
