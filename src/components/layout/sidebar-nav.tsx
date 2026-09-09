"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  adminNav,
  commandCenterItem,
  footerNav,
  intelligenceNav,
  isNavGroup,
  operationsModules,
  platformNav,
  type ModuleSubGroup,
  type NavLeaf,
} from "@/components/navigation/nav-config";
import { WorkspaceSwitcher } from "@/components/navigation/workspace-switcher";
import { cn } from "@/lib/utils";
import { canAccessAdmin } from "@/core/permissions";
import {
  conversations,
  getDealsAtRisk,
  getOpenExceptions,
  getOverdueInvoices,
  getPendingApprovals,
  onboardings,
  tasks,
  tickets,
} from "@/data/mock";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** A "Visão geral" de um módulo compartilha o href do próprio módulo — só deve acender no match exato,
 * senão ficaria "ativa" em toda e qualquer subpágina do módulo (prefix-match trataria o home como pai de tudo). */
function isModuleItemActive(pathname: string, itemHref: string, homeHref: string) {
  if (itemHref === homeHref) return pathname === itemHref;
  return isActive(pathname, itemHref);
}

function useBadges(): Record<string, number> {
  const openConversations = conversations.filter((c) => c.status === "open" || c.status === "pending").length;
  const openTickets = tickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length;
  const openTasks = tasks.filter((t) => t.status !== "done" && t.status !== "canceled").length;
  const pendingApprovals = getPendingApprovals().length;
  const openExceptions = getOpenExceptions().length;
  const overdueInvoices = getOverdueInvoices().length;
  const delayedOnboardings = onboardings.filter((o) => o.status === "delayed").length;
  const dealsAtRisk = getDealsAtRisk().length;

  return {
    "/inbox": openConversations,
    "/tickets": openTickets,
    "/tasks": openTasks,
    "/approvals": pendingApprovals,
    "/modules/business/exceptions": openExceptions,
    "/modules/finance/overdue": overdueInvoices,
    "/modules/people/onboarding": delayedOnboardings,
    "/modules/sales/deals": dealsAtRisk,
  };
}

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return <span className="ml-auto shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">{count}</span>;
}

function NavLink({
  item,
  collapsed,
  active,
  badge,
  indent = false,
}: {
  item: { label: string; href: string; icon?: NavLeaf["icon"] };
  collapsed: boolean;
  active: boolean;
  badge?: number;
  indent?: boolean;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
        collapsed && "justify-center px-0",
        indent && !collapsed && "font-normal"
      )}
    >
      {Icon && <Icon className={cn("size-4 shrink-0", active && "text-primary")} />}
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && <NavBadge count={badge ?? 0} />}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">
        {item.label}
        {badge ? ` · ${badge}` : ""}
      </TooltipContent>
    </Tooltip>
  );
}

/** Trilho vertical que conecta os itens internos de um accordion ao pai — substitui a necessidade de ícone em cada item. */
function IndentedGroup({ children }: { children: ReactNode }) {
  return <div className="ml-[19px] space-y-0.5 border-l border-border py-0.5 pl-3">{children}</div>;
}

function SectionLabel({ children, collapsed }: { children: string; collapsed: boolean }) {
  if (collapsed) return <div className="mx-2 my-1.5 border-t border-border" />;
  return <p className="px-2.5 pb-1 text-[11px] font-light uppercase tracking-wide text-muted-foreground/50">{children}</p>;
}

/** Grupo de itens dentro de um módulo — o label só aparece quando não vazio (ex.: Customer Operations não tem subgrupos). */
function ModuleGroups({
  groups,
  homeHref,
  pathname,
  badges,
}: {
  groups: ModuleSubGroup[];
  homeHref: string;
  pathname: string;
  badges: Record<string, number>;
}) {
  return (
    <IndentedGroup>
      {groups.map((group) => {
        const items = group.items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={false}
            indent
            active={isModuleItemActive(pathname, item.href, homeHref)}
            badge={badges[item.href]}
          />
        ));

        // Sem label (ex.: Customer Operations, que não tem subgrupos) — fica só no trilho do módulo, sem um segundo nível.
        if (!group.label) {
          return (
            <div key="root" className="space-y-0.5">
              {items}
            </div>
          );
        }

        return (
          <div key={group.label} className="space-y-0.5">
            <p className="px-2.5 pt-1 pb-0.5 text-[11px] font-light uppercase tracking-wide text-muted-foreground/50">{group.label}</p>
            <IndentedGroup>{items}</IndentedGroup>
          </div>
        );
      })}
    </IndentedGroup>
  );
}

export function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const badges = useBadges();
  // Estado apenas para overrides manuais (usuário abriu/fechou algo); o default é derivado do
  // pathname a cada render, sem efeito — abrir uma seção não decide sozinho fechar as outras.
  const [openOverride, setOpenOverride] = useState<Record<string, boolean>>({});

  const activeModuleKey = operationsModules.find((m) =>
    m.groups.some((g) => g.items.some((i) => isModuleItemActive(pathname, i.href, m.homeHref)))
  )?.key;

  function isModuleOpen(key: string) {
    if (key in openOverride) return openOverride[key];
    return key === activeModuleKey;
  }

  function toggleModule(key: string, open: boolean) {
    // Comportamento de accordion: abrir um módulo fecha os demais que não foram explicitamente reabertos.
    if (open) {
      const next: Record<string, boolean> = {};
      for (const m of operationsModules) next[m.key] = m.key === key;
      setOpenOverride((prev) => ({ ...prev, ...next }));
    } else {
      setOpenOverride((prev) => ({ ...prev, [key]: false }));
    }
  }

  function isGroupOpen(label: string, defaultOpen: boolean) {
    return openOverride[label] ?? defaultOpen;
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2 px-3 pt-4 pb-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        {!collapsed && <span className="truncate text-sm font-semibold tracking-tight text-foreground">AI Operations Cloud</span>}
      </div>

      <div className="px-2">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2 pt-2 pb-2">
        <div className="space-y-0.5">
          <NavLink item={commandCenterItem} collapsed={collapsed} active={isActive(pathname, commandCenterItem.href)} />
        </div>

        <div className="space-y-0.5">
          <SectionLabel collapsed={collapsed}>Módulos</SectionLabel>
          {operationsModules.map((mod) => {
            const Icon = mod.icon;
            const moduleActive = mod.key === activeModuleKey;

            if (collapsed) {
              return <NavLink key={mod.key} item={{ label: mod.label, href: mod.homeHref, icon: Icon }} collapsed active={moduleActive} />;
            }

            return (
              <Collapsible key={mod.key} open={isModuleOpen(mod.key)} onOpenChange={(open) => toggleModule(mod.key, open)}>
                <CollapsibleTrigger
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                    moduleActive ? "text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", moduleActive && "text-primary")} />
                  <span className="flex-1 truncate text-left">{mod.label}</span>
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ModuleGroups groups={mod.groups} homeHref={mod.homeHref} pathname={pathname} badges={badges} />
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        <div className="space-y-0.5">
          <SectionLabel collapsed={collapsed}>Inteligência</SectionLabel>
          {intelligenceNav.map((entry) => {
            if (!isNavGroup(entry)) {
              return <NavLink key={entry.href} item={entry} collapsed={collapsed} active={isActive(pathname, entry.href)} />;
            }

            const groupActive = entry.items.some((item) => isActive(pathname, item.href));
            const GroupIcon = entry.icon;

            if (collapsed) {
              return (
                <div key={entry.label} className="space-y-0.5">
                  {entry.items.map((item) => (
                    <NavLink key={item.href} item={item} collapsed active={isActive(pathname, item.href)} />
                  ))}
                </div>
              );
            }

            return (
              <Collapsible
                key={entry.label}
                open={isGroupOpen(entry.label, groupActive)}
                onOpenChange={(open) => setOpenOverride((prev) => ({ ...prev, [entry.label]: open }))}
              >
                <CollapsibleTrigger
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                    groupActive ? "text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <GroupIcon className="size-4 shrink-0" />
                  <span className="flex-1 text-left">{entry.label}</span>
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <IndentedGroup>
                    {entry.items.map((item) => (
                      <NavLink key={item.href} item={item} collapsed={false} indent active={isActive(pathname, item.href)} />
                    ))}
                  </IndentedGroup>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        <div className="space-y-0.5">
          <SectionLabel collapsed={collapsed}>Plataforma</SectionLabel>
          {platformNav.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} active={isActive(pathname, item.href)} badge={badges[item.href]} />
          ))}
        </div>
      </nav>

      <div className="space-y-0.5 border-t border-border px-2 py-2">
        {footerNav.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} active={isActive(pathname, item.href)} />
        ))}
        {canAccessAdmin() && <NavLink item={adminNav} collapsed={collapsed} active={isActive(pathname, adminNav.href)} />}
      </div>
    </div>
  );
}
