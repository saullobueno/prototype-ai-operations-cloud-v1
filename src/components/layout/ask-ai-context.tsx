"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AskAIContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AskAIContext = createContext<AskAIContextValue | null>(null);

export function AskAIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <AskAIContext.Provider value={{ open, setOpen }}>{children}</AskAIContext.Provider>;
}

export function useAskAI() {
  const ctx = useContext(AskAIContext);
  if (!ctx) throw new Error("useAskAI must be used within an AskAIProvider");
  return ctx;
}
