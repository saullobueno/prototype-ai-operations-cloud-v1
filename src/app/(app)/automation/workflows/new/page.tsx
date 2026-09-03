import { PageContainer } from "@/components/layout/page-header";
import { WorkflowBuilder } from "@/features/workflows/workflow-builder";

export default function NewWorkflowPage() {
  return (
    <PageContainer className="max-w-none">
      <WorkflowBuilder />
    </PageContainer>
  );
}
