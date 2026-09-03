"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/core/auth/AuthProvider";
import { WorkspaceProvider } from "@/core/workspace/WorkspaceProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <WorkspaceProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
