"use client";

import { use, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { HealthBadge } from "@/components/domain/badges";
import { CustomerFormDialog } from "@/features/customers/customer-form-dialog";
import { getCustomerById } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const TABS = [
  { slug: "overview", label: "Visão geral" },
  { slug: "activity", label: "Atividade" },
  { slug: "conversations", label: "Conversas" },
  { slug: "tickets", label: "Tickets" },
  { slug: "orders", label: "Pedidos" },
  { slug: "payments", label: "Pagamentos" },
  { slug: "tasks", label: "Tarefas" },
  { slug: "notes", label: "Notas" },
  { slug: "files", label: "Arquivos" },
  { slug: "timeline", label: "Linha do tempo" },
];

export default function CustomerDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = use(params);
  const customer = getCustomerById(customerId);
  const pathname = usePathname();
  // Força o re-render do header após editar o cliente (o objeto é mutado in-place na mesma
  // referência do array compartilhado — precisamos apenas de um gatilho de re-render).
  const [, setVersion] = useState(0);
  const [editOpen, setEditOpen] = useState(false);

  if (!customer) notFound();

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <EntityAvatar name={customer.name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{customer.name}</h1>
              <HealthBadge health={customer.health} />
            </div>
            <p className="text-sm text-muted-foreground">
              {customer.email} · {customer.company}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Cliente desde</p>
            <p className="font-medium text-foreground">{formatDate(customer.customerSince)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Valor vitalício</p>
            <p className="font-medium text-foreground">{formatCurrency(customer.lifetimeValueCents)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Plano</p>
            <p className="font-medium text-foreground">{customer.plan}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Editar
          </Button>
        </div>
      </div>

      <CustomerFormDialog customer={customer} open={editOpen} onOpenChange={setEditOpen} onSave={() => setVersion((v) => v + 1)} />

      <div className="mb-6 border-b border-border">
        <nav className="-mb-px flex gap-5 overflow-x-auto">
          {TABS.map((tab) => {
            const href = `/customers/${customerId}/${tab.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={tab.slug}
                href={href}
                className={cn(
                  "whitespace-nowrap border-b-2 px-0.5 py-2.5 text-sm font-medium transition-colors",
                  active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </PageContainer>
  );
}
