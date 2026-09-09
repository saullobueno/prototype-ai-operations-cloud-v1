"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Play, Trash2, Upload } from "lucide-react";
import { WorkflowCanvas } from "./workflow-canvas";
import { NODE_TYPE_LABEL } from "./workflow-node-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addWorkflow, agents, deleteWorkflow, getWorkflowById, updateWorkflow, upsertWorkflowVersion } from "@/data/mock";
import type { Workflow, WorkflowEdge, WorkflowNode, WorkflowRunStep, WorkflowStatus } from "@/types";

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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
    if (!name.trim()) return;
    setStatus("active");

    if (workflowId) {
      const existing = getWorkflowById(workflowId);
      const versionId = `${workflowId}_v${Date.now()}`;
      upsertWorkflowVersion({ id: versionId, workflowId, version: (existing?.totalRuns ?? 0) > 0 ? 2 : 1, nodes, edges, publishedAt: new Date().toISOString() });
      if (existing) {
        updateWorkflow({ ...existing, name: name.trim(), status: "active", currentVersionId: versionId });
      }
      toast.success(`${name} publicado`, { description: "As alterações foram salvas." });
    } else {
      const id = `wf_${Date.now()}`;
      const versionId = `${id}_v1`;
      upsertWorkflowVersion({ id: versionId, workflowId: id, version: 1, nodes, edges, publishedAt: new Date().toISOString() });
      const newWorkflow: Workflow = {
        id,
        name: name.trim(),
        description: "",
        status: "active",
        trigger: { type: "manual" },
        currentVersionId: versionId,
        totalRuns: 0,
        successRuns: 0,
        failedRuns: 0,
        waitingRuns: 0,
      };
      addWorkflow(newWorkflow);
      toast.success(`${name} publicado`, { description: "O workflow foi criado." });
      router.push(`/automation/workflows/${id}`);
    }
  }

  function handleDelete() {
    if (!workflowId) return;
    deleteWorkflow(workflowId);
    toast.success("Workflow excluído", { description: `${name} foi removido.` });
    router.push("/automation/workflows");
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
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/automation/workflows/${workflowId}/runs`)}>
                Ver execuções
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setConfirmDeleteOpen(true)}>
                <Trash2 className="size-3.5" /> Excluir
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir workflow?</DialogTitle>
            <DialogDescription>
              &ldquo;{name}&rdquo; será removido permanentemente. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
