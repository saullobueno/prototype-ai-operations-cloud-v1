"use client";

import { useRouter } from "next/navigation";
import { Building2, ChevronRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { workspaces } from "@/data/mock";

const ENV_LABEL: Record<string, string> = { production: "produção", sandbox: "sandbox" };

export default function WorkspaceSelectionPage() {
  const router = useRouter();
  const { setWorkspaceId } = useWorkspace();

  function select(id: string) {
    setWorkspaceId(id);
    router.push("/overview");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="w-full max-w-sm space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Selecione um workspace</h1>
        <p className="text-sm text-muted-foreground">Escolha em qual workspace você quer trabalhar.</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {workspaces.map((ws) => (
          <Card
            key={ws.id}
            role="button"
            onClick={() => select(ws.id)}
            className="cursor-pointer flex-row items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Building2 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{ws.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{ENV_LABEL[ws.environment]}</p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Card>
        ))}

        <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground" disabled>
          <Plus className="size-4" />
          Criar workspace
        </Button>
      </div>
    </div>
  );
}
