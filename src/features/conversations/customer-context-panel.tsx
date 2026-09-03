import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { HealthBadge, StatusBadge } from "@/components/domain/badges";
import { Button } from "@/components/ui/button";
import { getTicketsByCustomer, getActivitiesByCustomer } from "@/data/mock";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { Customer } from "@/types";

export function CustomerContextPanel({ customer }: { customer: Customer }) {
  const tickets = getTicketsByCustomer(customer.id).slice(0, 3);
  const activities = getActivitiesByCustomer(customer.id).slice(0, 3);
  const openTickets = getTicketsByCustomer(customer.id).filter((t) => t.status !== "resolved" && t.status !== "closed").length;

  return (
    <div className="hidden h-full w-72 shrink-0 flex-col gap-5 overflow-y-auto border-l border-border p-4 lg:flex">
      <div className="flex flex-col items-center gap-2 text-center">
        <EntityAvatar name={customer.name} size="lg" />
        <div>
          <p className="font-medium text-foreground">{customer.name}</p>
          <p className="text-xs text-muted-foreground">{customer.company}</p>
        </div>
        <HealthBadge health={customer.health} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Plano</p>
          <p className="font-medium text-foreground">{customer.plan}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">LTV</p>
          <p className="font-medium text-foreground">{formatCurrency(customer.lifetimeValueCents)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tickets abertos</p>
          <p className="font-medium text-foreground">{openTickets}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tags</p>
          <p className="font-medium text-foreground">{customer.tags.join(", ") || "—"}</p>
        </div>
      </div>

      <Button asChild variant="outline" size="sm" className="gap-1.5">
        <Link href={`/customers/${customer.id}`}>
          Ver perfil completo <ArrowRight className="size-3.5" />
        </Link>
      </Button>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tickets recentes</p>
        <div className="space-y-2">
          {tickets.length === 0 && <p className="text-sm text-muted-foreground">Nenhum ticket ainda.</p>}
          {tickets.map((t) => (
            <Link key={t.id} href={`/tickets/${t.id}`} className="block rounded-md border border-border px-2.5 py-2 text-sm transition-colors hover:bg-accent">
              <p className="truncate font-medium text-foreground">{t.title}</p>
              <StatusBadge status={t.status} />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Atividade recente</p>
        <div className="space-y-2">
          {activities.map((a) => (
            <div key={a.id} className="text-xs">
              <p className="text-foreground">{a.action}</p>
              <p className="text-muted-foreground">{formatRelative(a.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
