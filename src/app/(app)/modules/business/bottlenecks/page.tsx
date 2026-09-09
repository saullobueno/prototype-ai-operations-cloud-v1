"use client";

import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthMeterRow } from "@/components/domain/health-meter";
import { processes } from "@/data/mock/processes";
import { rankBottlenecks } from "@/features/business/process-intelligence";

export default function ProcessBottlenecksPage() {
  const ranked = rankBottlenecks(processes);

  return (
    <PageContainer>
      <PageHeader
        title="Gargalos"
        description="Processos ranqueados por sinais de gargalo: taxa de exceção, duração média acima do esperado, baixa automação e exceções abertas."
      />

      <div className="space-y-3">
        {ranked.map((entry, i) => (
          <Card key={entry.process.id}>
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">{i + 1}</span>
                  <div>
                    <Link href={`/modules/business/processes/${entry.process.id}`} className="font-medium text-foreground hover:underline">
                      {entry.process.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {entry.reasons.map((r) => (
                        <Badge key={r} variant="outline" className="font-normal text-muted-foreground">{r}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold tracking-tight text-foreground">{entry.score}</p>
                  <p className="text-xs text-muted-foreground">score de gargalo</p>
                </div>
              </div>
              <div className="mt-3 grid gap-1 sm:grid-cols-2">
                <HealthMeterRow label="Taxa de exceção" value={entry.process.exceptionRate} tone={entry.process.exceptionRate >= 15 ? "danger" : "warning"} />
                <HealthMeterRow label="Automação" value={entry.process.automationRate} tone={entry.process.automationRate <= 40 ? "warning" : "default"} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
