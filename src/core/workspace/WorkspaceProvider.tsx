"use client";

import { createContext, useContext, type ReactNode } from "react";
import { workspaces } from "@/data/mock";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import type { Workspace } from "@/types";

interface WorkspaceContextValue {
  workspace: Workspace;
  setWorkspaceId: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const STORAGE_KEY = "aiops.workspace.id";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useLocalStorageState(STORAGE_KEY, workspaces[0].id);
  const workspace = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0];

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
