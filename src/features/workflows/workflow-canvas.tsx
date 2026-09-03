"use client";

import { useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { WorkflowCanvasNode, type WorkflowCanvasNodeData } from "./workflow-canvas-node";
import type { WorkflowEdge, WorkflowNode, WorkflowRunStep } from "@/types";

const nodeTypes = { workflowNode: WorkflowCanvasNode };

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  runSteps?: WorkflowRunStep[];
  onNodeSelect?: (node: WorkflowNode | null) => void;
  selectedNodeId?: string | null;
}

export function WorkflowCanvas({ nodes, edges, runSteps, onNodeSelect, selectedNodeId }: WorkflowCanvasProps) {
  const flowNodes: Node<WorkflowCanvasNodeData>[] = useMemo(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: "workflowNode",
        position: n.position,
        selected: n.id === selectedNodeId,
        data: {
          label: n.label,
          type: n.type,
          runStatus: runSteps?.find((s) => s.nodeId === n.id)?.status,
        },
      })),
    [nodes, runSteps, selectedNodeId]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.condition,
        animated: Boolean(runSteps),
        style: { stroke: "var(--border)" },
        labelStyle: { fill: "var(--muted-foreground)", fontSize: 11 },
        labelBgStyle: { fill: "var(--background)" },
      })),
    [edges, runSteps]
  );

  return (
    <div className="h-[560px] w-full overflow-hidden rounded-lg border border-border bg-muted/20">
      <ReactFlowProvider>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => onNodeSelect?.(nodes.find((n) => n.id === node.id) ?? null)}
          onPaneClick={() => onNodeSelect?.(null)}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={Boolean(onNodeSelect)}
          nodesConnectable={false}
          elementsSelectable
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
