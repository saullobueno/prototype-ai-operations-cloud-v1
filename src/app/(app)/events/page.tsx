"use client";

import { Radio } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { events } from "@/data/mock";
import { formatDateTime } from "@/lib/format";

const DOMAIN_STYLE: Record<string, string> = {
  customer: "bg-info/15 text-info",
  conversation: "bg-info/15 text-info",
  ticket: "bg-warning/15 text-warning-foreground dark:text-warning",
  payment: "bg-success/15 text-success dark:text-success",
  workflow: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  agent: "bg-ai-accent/15 text-ai-accent",
};

function domainOf(type: string) {
  return type.split(".")[0];
}

export default function EventsPage() {
  const sorted = [...events].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 150);

  return (
    <PageContainer>
      <PageHeader title="Eventos" description="O backbone de orquestração — cada evento pode disparar um workflow." />

      {sorted.length === 0 ? (
        <EmptyState icon={Radio} title="Nenhum evento ainda" />
      ) : (
        <div className="rounded-lg border border-border">
          {sorted.map((e) => (
            <div key={e.id} className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0">
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-medium ${DOMAIN_STYLE[domainOf(e.type)] ?? "bg-muted text-muted-foreground"}`}
              >
                {e.type}
              </span>
              <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {Object.entries(e.payload)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · ")}
              </p>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(e.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
