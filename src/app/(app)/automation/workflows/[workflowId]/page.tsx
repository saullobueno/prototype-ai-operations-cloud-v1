"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-header";
import { WorkflowBuilder } from "@/features/workflows/workflow-builder";
import { getWorkflowById, getWorkflowVersion } from "@/data/mock";

export default function WorkflowBuilderPage({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = use(params);
  const workflow = getWorkflowById(workflowId);
  if (!workflow) notFound();

  const version = getWorkflowVersion(workflow.currentVersionId);

  return (
    <PageContainer className="max-w-none">
      <WorkflowBuilder
        workflowId={workflow.id}
        initialName={workflow.name}
        initialStatus={workflow.status}
        initialNodes={version?.nodes}
        initialEdges={version?.edges}
      />
    </PageContainer>
  );
}
