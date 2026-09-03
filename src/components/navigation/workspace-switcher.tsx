"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { workspaces } from "@/data/mock";
import { cn } from "@/lib/utils";

const ENV_LABEL: Record<string, string> = { production: "produção", sandbox: "sandbox" };

export function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }) {
  const { workspace, setWorkspaceId } = useWorkspace();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-left transition-colors hover:bg-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            AC
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{workspace.name}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">Workspace de {ENV_LABEL[workspace.environment]}</p>
            </div>
          )}
          {!collapsed && <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {workspaces.map((ws) => (
          <DropdownMenuItem key={ws.id} onClick={() => { setWorkspaceId(ws.id); toast.success(`Alternado para ${ws.name} — ${ENV_LABEL[ws.environment]}`); }}>
            <Check className={cn("size-4", ws.id === workspace.id ? "opacity-100" : "opacity-0")} />
            <div className="flex flex-col">
              <span>{ws.name}</span>
              <span className="text-xs capitalize text-muted-foreground">{ENV_LABEL[ws.environment]}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast("Criar novos workspaces não está disponível neste protótipo.")}>
          <Plus className="size-4" />
          Criar workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
