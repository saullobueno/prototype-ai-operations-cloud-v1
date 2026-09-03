import type { Workflow } from "@/types";

// Os 4 primeiros têm WorkflowVersion completa (canvas) em workflowVersions.ts.
export const FEATURED_WORKFLOW_IDS = ["wf_ticket_triage", "wf_escalation", "wf_sla_escalation", "wf_refund_approval"];

const extraNames = [
  "New Customer Onboarding",
  "Payment Retry Sequence",
  "At-Risk Customer Outreach",
  "Knowledge Gap Alert",
  "Weekly CSAT Survey",
  "VIP Customer Fast Lane",
  "API Rate Limit Notice",
  "Password Reset Automation",
  "Invoice Reminder",
  "Churn Risk Escalation",
  "Feature Request Router",
  "Compliance Export Handler",
  "Duplicate Charge Detector",
  "SSO Domain Verification",
  "Shipment Delay Notifier",
  "Subscription Downgrade Review",
  "Quarterly Business Review Scheduler",
  "Agent Handoff Summary",
  "Negative Sentiment Alert",
  "First Response SLA Guard",
  "Refund Threshold Router",
  "Data Export Compliance Check",
  "New Integration Health Check",
  "Trial Expiration Reminder",
  "Support CSAT Follow-up",
  "Billing Dispute Router",
  "Knowledge Article Review Cycle",
  "Agent Quality Sampling",
  "Weekend Coverage Router",
  "Enterprise Escalation Path",
];

function seededRuns(seed: number) {
  const totalRuns = 40 + ((seed * 37) % 500);
  const failedRuns = 1 + (seed % 6);
  const waitingRuns = seed % 4;
  const successRuns = totalRuns - failedRuns - waitingRuns;
  return { totalRuns, successRuns, failedRuns, waitingRuns };
}

const extraWorkflows: Workflow[] = extraNames.map((name, i) => {
  const id = `wf_extra_${i + 1}`;
  const { totalRuns, successRuns, failedRuns, waitingRuns } = seededRuns(i + 1);
  return {
    id,
    name,
    description: `Automatiza: ${name.toLowerCase()}.`,
    status: i % 9 === 0 ? "paused" : i % 11 === 0 ? "draft" : "active",
    trigger: { type: i % 2 === 0 ? "ticket_created" : "manual" },
    currentVersionId: `${id}_v1`,
    totalRuns,
    successRuns,
    failedRuns,
    waitingRuns,
  };
});

export const workflows: Workflow[] = [
  {
    id: "wf_ticket_triage",
    name: "New Ticket Triage",
    description: "Classifica novos tickets com IA e os roteia para o agente certo com base na intenção.",
    status: "active",
    trigger: { type: "ticket_created" },
    currentVersionId: "wf_ticket_triage_v3",
    totalRuns: 2148,
    successRuns: 2074,
    failedRuns: 28,
    waitingRuns: 46,
  },
  {
    id: "wf_escalation",
    name: "Customer Escalation Workflow",
    description: "Detecta conversas de alto risco e as roteia por análise de IA, verificação de política e aprovação humana quando necessário.",
    status: "active",
    trigger: { type: "conversation_created" },
    currentVersionId: "wf_escalation_v5",
    totalRuns: 1284,
    successRuns: 1241,
    failedRuns: 12,
    waitingRuns: 31,
  },
  {
    id: "wf_sla_escalation",
    name: "SLA Escalation",
    description: "Alerta o time e o gestor certos quando um ticket está perto do prazo de SLA.",
    status: "active",
    trigger: { type: "sla_approaching" },
    currentVersionId: "wf_sla_escalation_v2",
    totalRuns: 861,
    successRuns: 843,
    failedRuns: 6,
    waitingRuns: 12,
  },
  {
    id: "wf_refund_approval",
    name: "Refund Approval",
    description: "Roteia solicitações de reembolso pelo Billing Agent, verifica limites de política e solicita aprovação humana ou do financeiro quando necessário.",
    status: "active",
    trigger: { type: "payment_failed" },
    currentVersionId: "wf_refund_approval_v4",
    totalRuns: 573,
    successRuns: 551,
    failedRuns: 4,
    waitingRuns: 18,
  },
  ...extraWorkflows,
];

export function getWorkflow(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}
