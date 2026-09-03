"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Check, X } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/domain/badges";
import { Button } from "@/components/ui/button";
import { WorkflowCanvas } from "@/features/workflows/workflow-canvas";
import { WorkflowRunTrace } from "@/features/workflows/workflow-run-trace";
import { getWorkflowById, getWorkflowRun, getWorkflowVersion } from "@/data/mock";

export default function WorkflowRunDetailPage({ params }: { params: Promise<{ workflowId: string; runId: string }> }) {
  const { workflowId, runId } = use(params);
  const workflow = getWorkflowById(workflowId);
  const run = getWorkflowRun(runId);
  if (!workflow || !run) notFound();

  const version = getWorkflowVersion(run.workflowVersionId);
  const [resolved, setResolved] = useState(false);
  const waitingStep = run.steps.find((s) => s.status === "waiting");

  function decide(decision: "approved" | "rejected") {
    setResolved(true);
    toast.success(decision === "approved" ? "Aprovação concedida — o workflow vai continuar." : "Aprovação rejeitada — o workflow foi interrompido.");
  }

  return (
    <PageContainer>
      <Link href={`/automation/workflows/${workflowId}/runs`} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Voltar para execuções
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{workflow.name}</p>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Execução {run.id}</h1>
        </div>
        <StatusBadge status={resolved ? "success" : run.status} />
      </div>

      {waitingStep && !resolved && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/[0.06] px-4 py-3">
          <p className="text-sm text-foreground">
            Aguardando: <span className="font-medium">{waitingStep.label}</span>
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1" onClick={() => decide("rejected")}>
              <X className="size-3.5" /> Rejeitar
            </Button>
            <Button size="sm" className="gap-1" onClick={() => decide("approved")}>
              <Check className="size-3.5" /> Aprovar
            </Button>
          </div>
        </div>
      )}

      {version && (
        <div className="mb-6">
          <WorkflowCanvas nodes={version.nodes} edges={version.edges} runSteps={run.steps} />
        </div>
      )}

      <WorkflowRunTrace steps={run.steps} />
    </PageContainer>
  );
}
