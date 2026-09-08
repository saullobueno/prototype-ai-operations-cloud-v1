"use client";

import { use } from "react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { PageContainer } from "@/components/layout/page-header";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { ICPBadge, StatusBadge } from "@/components/domain/badges";
import { getAccountById, getUserById } from "@/data/mock";
import { cn } from "@/lib/utils";

const TABS = [
  { slug: "overview", label: "Visão geral" },
  { slug: "contacts", label: "Contacts" },
  { slug: "interactions", label: "Interactions" },
  { slug: "deals", label: "Deals" },
  { slug: "signals", label: "Signals" },
  { slug: "revenue-graph", label: "Revenue Graph" },
  { slug: "timeline", label: "Timeline" },
];

export default function AccountDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = use(params);
  const account = getAccountById(accountId);
  const pathname = usePathname();

  if (!account) notFound();

  const owner = getUserById(account.ownerId);

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <EntityAvatar name={account.name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{account.name}</h1>
              <StatusBadge status={account.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {account.domain} · {account.industry}
              {account.employeeCount ? ` · ${account.employeeCount} funcionários` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">ICP fit</p>
            <ICPBadge tier={account.icpTier} />
          </div>
          <div>
            <p className="text-muted-foreground">Dono</p>
            <p className="font-medium text-foreground">{owner?.name ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-border">
        <nav className="-mb-px flex gap-5 overflow-x-auto">
          {TABS.map((tab) => {
            const href = `/modules/sales/accounts/${accountId}/${tab.slug}`;
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
