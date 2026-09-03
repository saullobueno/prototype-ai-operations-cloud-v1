"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { AskAIProvider, useAskAI } from "@/components/layout/ask-ai-context";
import { AskOperationsAI } from "@/components/domain/ask-operations-ai";

function AskAIPanel() {
  const { open, setOpen } = useAskAI();
  return <AskOperationsAI open={open} onOpenChange={setOpen} />;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AskAIProvider>
        <div className="flex min-h-svh w-full bg-background">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </div>
        <AskAIPanel />
      </AskAIProvider>
    </SidebarProvider>
  );
}
