"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useLocalStorageState } from "@/lib/use-local-storage-state";

interface SidebarContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const STORAGE_KEY = "aiops.sidebar.collapsed";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsedValue, setCollapsedValue] = useLocalStorageState<"true" | "false">(STORAGE_KEY, "false");
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = collapsedValue === "true";

  const toggleCollapsed = () => setCollapsedValue(collapsed ? "false" : "true");

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}
