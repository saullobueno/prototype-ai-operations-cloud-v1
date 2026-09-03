import type { WorkflowRun, WorkflowRunStatus } from "@/types";
import { hoursAgo, minutesAgo } from "@/lib/time";
import { workflowVersions } from "./workflowVersions";

function stepsFor(workflowVersionId: string, status: WorkflowRunStatus, failAt?: number) {
  const version = workflowVersions.find((v) => v.id === workflowVersionId);
  if (!version) return [];
  const nodes = version.nodes.filter((n) => n.type !== "condition" && n.type !== "branch");
  return nodes.map((node, i) => {
    let stepStatus: "success" | "failed" | "waiting" | "skipped" = "success";
    if (status === "waiting" && i === nodes.length - 1) stepStatus = "waiting";
    if (status === "failed" && failAt !== undefined && i === failAt) stepStatus = "failed";
    if (status === "failed" && failAt !== undefined && i > failAt) stepStatus = "skipped";
    return {
      nodeId: node.id,
      label: node.label,
      status: stepStatus,
      detail: stepStatus === "failed" ? "Tool call timed out after 3 retries." : undefined,
      timestamp: minutesAgo((nodes.length - i) * 2),
    };
  });
}

const RUN_BASE = 12900;

function buildRuns(
  workflowId: string,
  workflowVersionId: string,
  count: number,
  failedCount: number,
  waitingCount: number
): WorkflowRun[] {
  const runs: WorkflowRun[] = [];
  for (let i = 0; i < count; i++) {
    const runNumber = RUN_BASE + i + (workflowId.length % 7) * 100;
    let status: WorkflowRunStatus = "success";
    if (i < failedCount) status = "failed";
    else if (i < failedCount + waitingCount) status = "waiting";

    const startedAt = hoursAgo(i + 1);
    runs.push({
      id: `run_wf_${runNumber}`,
      workflowId,
      workflowVersionId,
      status,
      startedAt,
      completedAt: status === "waiting" ? undefined : hoursAgo(i + 1 - 0.02),
      steps: stepsFor(workflowVersionId, status, status === "failed" ? 2 : undefined),
    });
  }
  return runs;
}

export const workflowRuns: WorkflowRun[] = [
  ...buildRuns("wf_escalation", "wf_escalation_v5", 24, 2, 4),
  ...buildRuns("wf_ticket_triage", "wf_ticket_triage_v3", 22, 2, 3),
  ...buildRuns("wf_sla_escalation", "wf_sla_escalation_v2", 14, 1, 2),
  ...buildRuns("wf_refund_approval", "wf_refund_approval_v4", 16, 1, 3),
];

// Run canônico citado em docs/05-telas/04-automation-workflows.md (#12931).
export const CANONICAL_WORKFLOW_RUN_ID = workflowRuns.find((r) => r.workflowId === "wf_escalation")?.id ?? "";

export function getWorkflowRunsByWorkflow(workflowId: string): WorkflowRun[] {
  return workflowRuns.filter((r) => r.workflowId === workflowId);
}

export function getWorkflowRun(runId: string): WorkflowRun | undefined {
  return workflowRuns.find((r) => r.id === runId);
}
