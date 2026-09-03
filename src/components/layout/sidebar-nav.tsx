"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { adminNav, footerNav, isNavGroup, modulesNav, primaryNav, type NavLeaf } from "@/components/navigation/nav-config";
import { WorkspaceSwitcher } from "@/components/navigation/workspace-switcher";
import { cn } from "@/lib/utils";
import { canAccessAdmin } from "@/core/permissions";

function isActive(pathname: string, href: string) {
  if (href === "/overview") return pathname === "/overview";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, collapsed, active }: { item: NavLeaf; collapsed: boolean; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  // Estado apenas para overrides manuais (usuário abriu/fechou um grupo); o grupo do
  // item ativo é derivado diretamente do pathname a cada render, sem efeito.
  const [manualOverride, setManualOverride] = useState<Record<string, boolean>>({});

  function isGroupOpen(label: string, defaultOpen: boolean) {
    return manualOverride[label] ?? defaultOpen;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="px-2 pt-2">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
        <div className="space-y-0.5">
          {primaryNav.map((entry) => {
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
                onOpenChange={(open) => setManualOverride((prev) => ({ ...prev, [entry.label]: open }))}
              >
                <CollapsibleTrigger
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                    groupActive ? "text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <GroupIcon className="size-4 shrink-0" />
                  <span className="flex-1 text-left">{entry.label}</span>
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5 py-0.5 pl-4">
                  {entry.items.map((item) => (
                    <NavLink key={item.href} item={item} collapsed={false} active={isActive(pathname, item.href)} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        <div className="space-y-1 border-t border-border pt-3">
          {!collapsed && <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Módulos</p>}
          {modulesNav.map((mod) => {
            const Icon = mod.icon;
            const active = isActive(pathname, mod.href) && mod.status === "active";
            return (
              <Link
                key={mod.href}
                href={mod.href}
                title={collapsed ? mod.label : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <span className={cn("size-1.5 shrink-0 rounded-full", mod.status === "active" ? "bg-success" : "bg-muted-foreground/40")} />
                {!collapsed && <Icon className="size-4 shrink-0" />}
                {!collapsed && <span className="flex-1 truncate">{mod.label}</span>}
                {!collapsed && mod.status === "coming_soon" && (
                  <Badge variant="outline" className="shrink-0 px-1.5 py-0 text-[10px] font-normal text-muted-foreground">
                    Em breve
                  </Badge>
                )}
              </Link>
            );
          })}
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
