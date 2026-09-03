"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Play, Upload } from "lucide-react";
import { WorkflowCanvas } from "./workflow-canvas";
import { NODE_TYPE_LABEL } from "./workflow-node-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { agents } from "@/data/mock";
import type { WorkflowEdge, WorkflowNode, WorkflowRunStep, WorkflowStatus } from "@/types";

const BLANK_NODES: WorkflowNode[] = [{ id: "n1", type: "trigger", label: "Novo gatilho", position: { x: 240, y: 20 } }];

const STATUS_LABEL: Record<WorkflowStatus, string> = { active: "Ativo", paused: "Pausado", draft: "Rascunho" };

interface WorkflowBuilderProps {
  workflowId?: string;
  initialName?: string;
  initialStatus?: WorkflowStatus;
  initialNodes?: WorkflowNode[];
  initialEdges?: WorkflowEdge[];
}

export function WorkflowBuilder({
  workflowId,
  initialName = "Workflow sem título",
  initialStatus = "draft",
  initialNodes,
  initialEdges = [],
}: WorkflowBuilderProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<WorkflowStatus>(initialStatus);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [runSteps, setRunSteps] = useState<WorkflowRunStep[] | undefined>(undefined);
  const [testing, setTesting] = useState(false);

  const nodes = initialNodes ?? BLANK_NODES;
  const edges = initialEdges;

  function runTest() {
    setTesting(true);
    setRunSteps([]);
    nodes.forEach((node, i) => {
      window.setTimeout(() => {
        setRunSteps((prev) => [...(prev ?? []), { nodeId: node.id, label: node.label, status: "success", timestamp: new Date().toISOString() }]);
        if (i === nodes.length - 1) {
          window.setTimeout(() => {
            setTesting(false);
            toast.success("Execução de teste concluída", { description: `Todas as ${nodes.length} etapas foram executadas com sucesso.` });
          }, 400);
        }
      }, (i + 1) * 500);
    });
  }

  function publish() {
    setStatus("active");
    toast.success(`${name} publicado`, { description: "Este protótipo não persiste alterações após recarregar a página." });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-64 font-medium" />
          <Badge variant={status === "active" ? "default" : "secondary"}>{STATUS_LABEL[status]}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={runTest} disabled={testing}>
            <Play className="size-3.5" /> Testar
          </Button>
          <Button size="sm" className="gap-1.5" onClick={publish}>
            <Upload className="size-3.5" /> Publicar
          </Button>
          {workflowId && (
            <Button variant="ghost" size="sm" onClick={() => router.push(`/automation/workflows/${workflowId}/runs`)}>
              Ver execuções
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
        <WorkflowCanvas nodes={nodes} edges={edges} runSteps={runSteps} onNodeSelect={setSelectedNode} selectedNodeId={selectedNode?.id ?? null} />

        <Card>
          <CardContent className="space-y-3 pt-4">
            <p className="text-sm font-medium text-foreground">Configuração do nó</p>
            {!selectedNode ? (
              <p className="text-sm text-muted-foreground">Selecione um nó no canvas para configurá-lo.</p>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="font-medium text-foreground">{NODE_TYPE_LABEL[selectedNode.type]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rótulo</p>
                  <p className="font-medium text-foreground">{selectedNode.label}</p>
                </div>
                {selectedNode.type === "ai_agent" && selectedNode.config?.agentId ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Agente</p>
                    <p className="font-medium text-foreground">
                      {agents.find((a) => a.id === selectedNode.config?.agentId)?.name ?? String(selectedNode.config.agentId)}
                    </p>
                  </div>
                ) : null}
                {selectedNode.config && Object.keys(selectedNode.config).length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Configuração</p>
                    <pre className="mt-1 whitespace-pre-wrap break-words rounded-md bg-muted p-2 font-mono text-xs text-muted-foreground">
                      {JSON.stringify(selectedNode.config, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
