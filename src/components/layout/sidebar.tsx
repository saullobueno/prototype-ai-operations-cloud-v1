"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-svh shrink-0 border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:block",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarNav collapsed={collapsed} />
    </aside>
  );
}
