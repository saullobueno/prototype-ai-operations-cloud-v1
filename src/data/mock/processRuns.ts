import type { ProcessRun } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

// Só Vendor Onboarding tem o caminho completo (5 runs, incluindo os 2 exemplos citados na spec:
// ven_007 aguardando aprovação e ven_008 bloqueado em AI validation). As demais famílias de
// processo têm 2 runs cada, o bastante para popular Runs/Board/Analytics sem inflar o dataset.
export const processRuns: ProcessRun[] = [
  // ---------- Vendor Onboarding ----------
  {
    id: "run_vo_001",
    processId: "proc_vendor_onboarding",
    subject: "Vendor: Nordic Supplies AB",
    status: "completed",
    relatedType: "vendor",
    relatedId: "ven_001",
    startedAt: "2026-08-02T09:00:00Z",
    completedAt: "2026-08-14T10:00:00Z",
    steps: [
      { stageId: "stage_vo_1", label: "Request", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-08-02T09:00:00Z", completedAt: "2026-08-02T09:30:00Z" },
      { stageId: "stage_vo_2", label: "Vendor information", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-08-02T09:30:00Z", completedAt: "2026-08-02T15:00:00Z" },
      { stageId: "stage_vo_3", label: "Document collection", status: "completed", ownerType: "system", startedAt: "2026-08-02T15:00:00Z", completedAt: "2026-08-05T11:00:00Z" },
      { stageId: "stage_vo_4", label: "AI validation", status: "completed", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: "2026-08-05T11:00:00Z", completedAt: "2026-08-05T11:20:00Z", detail: "Documentos validados automaticamente — CNPJ/VAT e certidão negativa conferem." },
      { stageId: "stage_vo_5", label: "Compliance check", status: "completed", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: "2026-08-05T11:20:00Z", completedAt: "2026-08-05T12:00:00Z", detail: "Sem sanções ou vínculos de risco encontrados nas bases de compliance." },
      { stageId: "stage_vo_6", label: "Approval", status: "completed", ownerType: "human", ownerId: "usr_thomas", startedAt: "2026-08-05T12:00:00Z", completedAt: "2026-08-11T09:00:00Z" },
      { stageId: "stage_vo_7", label: "Vendor creation", status: "completed", ownerType: "system", startedAt: "2026-08-11T09:00:00Z", completedAt: "2026-08-11T09:05:00Z" },
      { stageId: "stage_vo_8", label: "Finance setup", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-08-11T09:05:00Z", completedAt: "2026-08-14T09:30:00Z" },
      { stageId: "stage_vo_9", label: "Completion", status: "completed", ownerType: "system", startedAt: "2026-08-14T09:30:00Z", completedAt: "2026-08-14T10:00:00Z" },
    ],
  },
  {
    id: "run_vo_002",
    processId: "proc_vendor_onboarding",
    subject: "Vendor: CloudEdge Infrastructure",
    status: "completed",
    relatedType: "vendor",
    relatedId: "ven_002",
    startedAt: "2026-07-10T09:00:00Z",
    completedAt: "2026-07-20T14:30:00Z",
    steps: [
      { stageId: "stage_vo_1", label: "Request", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-07-10T09:00:00Z", completedAt: "2026-07-10T09:30:00Z" },
      { stageId: "stage_vo_2", label: "Vendor information", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-07-10T09:30:00Z", completedAt: "2026-07-10T16:00:00Z" },
      { stageId: "stage_vo_3", label: "Document collection", status: "completed", ownerType: "system", startedAt: "2026-07-10T16:00:00Z", completedAt: "2026-07-13T10:00:00Z" },
      { stageId: "stage_vo_4", label: "AI validation", status: "completed", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: "2026-07-13T10:00:00Z", completedAt: "2026-07-13T10:15:00Z" },
      { stageId: "stage_vo_5", label: "Compliance check", status: "completed", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: "2026-07-13T10:15:00Z", completedAt: "2026-07-13T11:00:00Z" },
      { stageId: "stage_vo_6", label: "Approval", status: "completed", ownerType: "human", ownerId: "usr_thomas", startedAt: "2026-07-13T11:00:00Z", completedAt: "2026-07-17T09:00:00Z" },
      { stageId: "stage_vo_7", label: "Vendor creation", status: "completed", ownerType: "system", startedAt: "2026-07-17T09:00:00Z", completedAt: "2026-07-17T09:05:00Z" },
      { stageId: "stage_vo_8", label: "Finance setup", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-07-17T09:05:00Z", completedAt: "2026-07-20T14:00:00Z" },
      { stageId: "stage_vo_9", label: "Completion", status: "completed", ownerType: "system", startedAt: "2026-07-20T14:00:00Z", completedAt: "2026-07-20T14:30:00Z" },
    ],
  },
  {
    id: "run_vo_003",
    processId: "proc_vendor_onboarding",
    subject: "Vendor: Solaris Facilities Management",
    status: "waiting_approval",
    relatedType: "vendor",
    relatedId: "ven_007",
    startedAt: daysAgo(6),
    steps: [
      { stageId: "stage_vo_1", label: "Request", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(6), completedAt: daysAgo(6) },
      { stageId: "stage_vo_2", label: "Vendor information", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(6), completedAt: daysAgo(5) },
      { stageId: "stage_vo_3", label: "Document collection", status: "completed", ownerType: "system", startedAt: daysAgo(5), completedAt: daysAgo(4) },
      { stageId: "stage_vo_4", label: "AI validation", status: "completed", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: daysAgo(4), completedAt: daysAgo(4), detail: "Documentos validados automaticamente — CNPJ/VAT e certidão negativa conferem." },
      { stageId: "stage_vo_5", label: "Compliance check", status: "completed", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: daysAgo(4), completedAt: daysAgo(3), detail: "Sem sanções ou vínculos de risco encontrados nas bases de compliance." },
      { stageId: "stage_vo_6", label: "Approval", status: "in_progress", ownerType: "human", ownerId: "usr_thomas", startedAt: daysAgo(3), detail: "Aguardando aprovação do gestor de Procurement — valor de contrato acima do limite de autoaprovação (€5.000/ano)." },
      { stageId: "stage_vo_7", label: "Vendor creation", status: "pending", ownerType: "system" },
      { stageId: "stage_vo_8", label: "Finance setup", status: "pending", ownerType: "human" },
      { stageId: "stage_vo_9", label: "Completion", status: "pending", ownerType: "system" },
    ],
  },
  {
    id: "run_vo_004",
    processId: "proc_vendor_onboarding",
    subject: "Vendor: Vantage Compliance Consulting",
    status: "exception",
    relatedType: "vendor",
    relatedId: "ven_008",
    startedAt: daysAgo(4),
    steps: [
      { stageId: "stage_vo_1", label: "Request", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(4), completedAt: daysAgo(4) },
      { stageId: "stage_vo_2", label: "Vendor information", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(4), completedAt: daysAgo(4) },
      { stageId: "stage_vo_3", label: "Document collection", status: "completed", ownerType: "system", startedAt: daysAgo(4), completedAt: daysAgo(3) },
      { stageId: "stage_vo_4", label: "AI validation", status: "blocked", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: daysAgo(3), detail: "Certidão de regularidade fiscal ausente — impossível validar automaticamente." },
      { stageId: "stage_vo_5", label: "Compliance check", status: "pending", ownerType: "agent" },
      { stageId: "stage_vo_6", label: "Approval", status: "pending", ownerType: "human" },
      { stageId: "stage_vo_7", label: "Vendor creation", status: "pending", ownerType: "system" },
      { stageId: "stage_vo_8", label: "Finance setup", status: "pending", ownerType: "human" },
      { stageId: "stage_vo_9", label: "Completion", status: "pending", ownerType: "system" },
    ],
  },
  {
    id: "run_vo_005",
    processId: "proc_vendor_onboarding",
    subject: "Vendor: Atlas Marketing Group",
    status: "completed",
    relatedType: "vendor",
    relatedId: "ven_004",
    startedAt: "2026-04-01T09:00:00Z",
    completedAt: "2026-04-11T09:00:00Z",
    steps: [
      { stageId: "stage_vo_1", label: "Request", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-04-01T09:00:00Z", completedAt: "2026-04-01T09:30:00Z" },
      { stageId: "stage_vo_2", label: "Vendor information", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-04-01T09:30:00Z", completedAt: "2026-04-01T15:00:00Z" },
      { stageId: "stage_vo_3", label: "Document collection", status: "completed", ownerType: "system", startedAt: "2026-04-01T15:00:00Z", completedAt: "2026-04-03T10:00:00Z" },
      { stageId: "stage_vo_4", label: "AI validation", status: "completed", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: "2026-04-03T10:00:00Z", completedAt: "2026-04-03T10:15:00Z" },
      { stageId: "stage_vo_5", label: "Compliance check", status: "completed", ownerType: "agent", ownerId: "agent_biz_compliance", startedAt: "2026-04-03T10:15:00Z", completedAt: "2026-04-03T11:00:00Z" },
      { stageId: "stage_vo_6", label: "Approval", status: "completed", ownerType: "human", ownerId: "usr_thomas", startedAt: "2026-04-03T11:00:00Z", completedAt: "2026-04-08T09:00:00Z" },
      { stageId: "stage_vo_7", label: "Vendor creation", status: "completed", ownerType: "system", startedAt: "2026-04-08T09:00:00Z", completedAt: "2026-04-08T09:05:00Z" },
      { stageId: "stage_vo_8", label: "Finance setup", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: "2026-04-08T09:05:00Z", completedAt: "2026-04-11T08:30:00Z" },
      { stageId: "stage_vo_9", label: "Completion", status: "completed", ownerType: "system", startedAt: "2026-04-11T08:30:00Z", completedAt: "2026-04-11T09:00:00Z" },
    ],
  },

  // ---------- Purchase Requisition & Procurement ----------
  {
    id: "run_pr_001",
    processId: "proc_purchase_requisition",
    subject: "PR-2041: Office furniture restock",
    status: "completed",
    startedAt: daysAgo(20),
    completedAt: daysAgo(19),
    steps: [
      { stageId: "stage_pr_1", label: "Request", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(20), completedAt: daysAgo(20) },
      { stageId: "stage_pr_2", label: "Budget check", status: "completed", ownerType: "agent", startedAt: daysAgo(20), completedAt: daysAgo(20) },
      { stageId: "stage_pr_3", label: "Manager approval", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(20), completedAt: daysAgo(19), detail: "Aprovado com ressalva — valor acima do orçamento trimestral do time." },
      { stageId: "stage_pr_4", label: "PO issued", status: "completed", ownerType: "system", startedAt: daysAgo(19), completedAt: daysAgo(19) },
      { stageId: "stage_pr_5", label: "Goods received", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(19), completedAt: daysAgo(19) },
    ],
  },
  {
    id: "run_pr_002",
    processId: "proc_purchase_requisition",
    subject: "PR-2058: Laptop refresh — Engineering",
    status: "running",
    startedAt: daysAgo(1),
    steps: [
      { stageId: "stage_pr_1", label: "Request", status: "completed", ownerType: "human", ownerId: "usr_pedro", startedAt: daysAgo(1), completedAt: daysAgo(1) },
      { stageId: "stage_pr_2", label: "Budget check", status: "completed", ownerType: "agent", startedAt: daysAgo(1), completedAt: daysAgo(1) },
      { stageId: "stage_pr_3", label: "Manager approval", status: "in_progress", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(1), detail: "Solicitação de compra acima do limite de aprovação padrão do gestor." },
      { stageId: "stage_pr_4", label: "PO issued", status: "pending", ownerType: "system" },
      { stageId: "stage_pr_5", label: "Goods received", status: "pending", ownerType: "human" },
    ],
  },

  // ---------- Data Privacy Compliance Review ----------
  {
    id: "run_dpr_001",
    processId: "proc_data_privacy_review",
    subject: "DPA Review: Praxis Data Center Services (sub-processor)",
    status: "completed",
    startedAt: daysAgo(60),
    completedAt: daysAgo(57),
    steps: [
      { stageId: "stage_dpr_1", label: "Intake", status: "completed", ownerType: "human", ownerId: "usr_sofia", startedAt: daysAgo(60), completedAt: daysAgo(60) },
      { stageId: "stage_dpr_2", label: "Data mapping", status: "completed", ownerType: "agent", startedAt: daysAgo(60), completedAt: daysAgo(59) },
      { stageId: "stage_dpr_3", label: "Risk assessment", status: "completed", ownerType: "agent", startedAt: daysAgo(59), completedAt: daysAgo(58) },
      { stageId: "stage_dpr_4", label: "Legal review", status: "completed", ownerType: "human", ownerId: "usr_sofia", startedAt: daysAgo(58), completedAt: daysAgo(57) },
      { stageId: "stage_dpr_5", label: "Sign-off", status: "completed", ownerType: "human", ownerId: "usr_thomas", startedAt: daysAgo(57), completedAt: daysAgo(57) },
    ],
  },
  {
    id: "run_dpr_002",
    processId: "proc_data_privacy_review",
    subject: "DPA Review: novo fornecedor de analytics (expansão CloudEdge)",
    status: "exception",
    startedAt: daysAgo(15),
    steps: [
      { stageId: "stage_dpr_1", label: "Intake", status: "completed", ownerType: "human", ownerId: "usr_sofia", startedAt: daysAgo(15), completedAt: daysAgo(15) },
      { stageId: "stage_dpr_2", label: "Data mapping", status: "completed", ownerType: "agent", startedAt: daysAgo(15), completedAt: daysAgo(14) },
      { stageId: "stage_dpr_3", label: "Risk assessment", status: "blocked", ownerType: "agent", startedAt: daysAgo(14), detail: "Fornecedor não respondeu ao questionário de segurança em 10 dias." },
      { stageId: "stage_dpr_4", label: "Legal review", status: "pending", ownerType: "human" },
      { stageId: "stage_dpr_5", label: "Sign-off", status: "pending", ownerType: "human" },
    ],
  },

  // ---------- Operational Incident Response ----------
  {
    id: "run_ir_001",
    processId: "proc_incident_response",
    subject: "Incident: API latency spike (checkout service)",
    status: "completed",
    startedAt: hoursAgo(30),
    completedAt: hoursAgo(24),
    steps: [
      { stageId: "stage_ir_1", label: "Report", status: "completed", ownerType: "system", startedAt: hoursAgo(30), completedAt: hoursAgo(30) },
      { stageId: "stage_ir_2", label: "Triage", status: "completed", ownerType: "agent", startedAt: hoursAgo(30), completedAt: hoursAgo(29) },
      { stageId: "stage_ir_3", label: "Investigation", status: "completed", ownerType: "human", ownerId: "usr_pedro", startedAt: hoursAgo(29), completedAt: hoursAgo(26), detail: "Causa raiz identificada após reabertura da investigação." },
      { stageId: "stage_ir_4", label: "Resolution", status: "completed", ownerType: "human", ownerId: "usr_pedro", startedAt: hoursAgo(26), completedAt: hoursAgo(25) },
      { stageId: "stage_ir_5", label: "Postmortem", status: "completed", ownerType: "human", ownerId: "usr_pedro", startedAt: hoursAgo(25), completedAt: hoursAgo(24) },
    ],
  },
  {
    id: "run_ir_002",
    processId: "proc_incident_response",
    subject: "Incident: falhas de SSO (região EU)",
    status: "running",
    startedAt: hoursAgo(3),
    steps: [
      { stageId: "stage_ir_1", label: "Report", status: "completed", ownerType: "system", startedAt: hoursAgo(3), completedAt: hoursAgo(3) },
      { stageId: "stage_ir_2", label: "Triage", status: "completed", ownerType: "agent", startedAt: hoursAgo(3), completedAt: hoursAgo(2.7) },
      { stageId: "stage_ir_3", label: "Investigation", status: "in_progress", ownerType: "human", ownerId: "usr_pedro", startedAt: hoursAgo(2.7), detail: "Sem mitigação identificada — clientes Enterprise da região EU afetados." },
      { stageId: "stage_ir_4", label: "Resolution", status: "pending", ownerType: "human" },
      { stageId: "stage_ir_5", label: "Postmortem", status: "pending", ownerType: "human" },
    ],
  },

  // ---------- Expense Reimbursement Approval ----------
  {
    id: "run_er_001",
    processId: "proc_expense_reimbursement",
    subject: "Expense report — Rafaela Nunes (viagem Q3)",
    status: "completed",
    startedAt: daysAgo(9),
    completedAt: daysAgo(8),
    steps: [
      { stageId: "stage_er_1", label: "Submission", status: "completed", ownerType: "human", ownerId: "usr_rafaela", startedAt: daysAgo(9), completedAt: daysAgo(9) },
      { stageId: "stage_er_2", label: "Policy check", status: "completed", ownerType: "agent", startedAt: daysAgo(9), completedAt: daysAgo(9) },
      { stageId: "stage_er_3", label: "Manager approval", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(9), completedAt: daysAgo(8) },
      { stageId: "stage_er_4", label: "Finance approval", status: "completed", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(8), completedAt: daysAgo(8) },
      { stageId: "stage_er_5", label: "Reimbursement", status: "completed", ownerType: "system", startedAt: daysAgo(8), completedAt: daysAgo(8) },
    ],
  },
  {
    id: "run_er_002",
    processId: "proc_expense_reimbursement",
    subject: "Expense report — Diego Farias (jantar com cliente)",
    status: "waiting_approval",
    startedAt: daysAgo(2),
    steps: [
      { stageId: "stage_er_1", label: "Submission", status: "completed", ownerType: "human", ownerId: "usr_diego", startedAt: daysAgo(2), completedAt: daysAgo(2) },
      { stageId: "stage_er_2", label: "Policy check", status: "completed", ownerType: "agent", startedAt: daysAgo(2), completedAt: daysAgo(2), detail: "Despesa individual acima do limite de auto-aprovação (€300)." },
      { stageId: "stage_er_3", label: "Manager approval", status: "in_progress", ownerType: "human", ownerId: "usr_maria", startedAt: daysAgo(2) },
      { stageId: "stage_er_4", label: "Finance approval", status: "pending", ownerType: "human" },
      { stageId: "stage_er_5", label: "Reimbursement", status: "pending", ownerType: "system" },
    ],
  },
];

export function getProcessRunById(id: string) {
  return processRuns.find((r) => r.id === id);
}

export function getRunsByProcess(processId: string) {
  return processRuns.filter((r) => r.processId === processId).sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
}

export function getActiveRuns() {
  return processRuns.filter((r) => r.status === "running" || r.status === "waiting_approval");
}
