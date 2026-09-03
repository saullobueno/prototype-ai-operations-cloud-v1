"use client";

import Link from "next/link";
import { Activity as ActivityIcon } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { activities, agents, getCustomerById, getUserById } from "@/data/mock";
import { formatDateTime } from "@/lib/format";

function actorName(actorType: string, actorId: string): string {
  if (actorType === "human") return getUserById(actorId)?.name ?? actorId;
  if (actorType === "agent") return agents.find((a) => a.id === actorId)?.name ?? actorId;
  return "Sistema";
}

export default function ActivityPage() {
  const sorted = [...activities].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 100);

  return (
    <PageContainer>
      <PageHeader title="Atividade" description="Um feed entre clientes de tudo o que está acontecendo na sua operação." />

      {sorted.length === 0 ? (
        <EmptyState icon={ActivityIcon} title="Nenhuma atividade ainda" />
      ) : (
        <div className="space-y-1 rounded-lg border border-border">
          {sorted.map((a) => {
            const customer = a.customerId ? getCustomerById(a.customerId) : undefined;
            return (
              <div key={a.id} className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0">
                <EntityAvatar name={actorName(a.actorType, a.actorId)} size="xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    <span className="font-medium">{actorName(a.actorType, a.actorId)}</span> {a.action}
                    {customer && (
                      <>
                        {" "}
                        ·{" "}
                        <Link href={`/customers/${customer.id}`} className="text-primary hover:underline">
                          {customer.name}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(a.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
