import type { ProcessStage } from "@/types";

export const processStages: ProcessStage[] = [
  // ---------- Vendor Onboarding ----------
  { id: "stage_vo_1", processId: "proc_vendor_onboarding", name: "Request", order: 1 },
  { id: "stage_vo_2", processId: "proc_vendor_onboarding", name: "Vendor information", order: 2 },
  { id: "stage_vo_3", processId: "proc_vendor_onboarding", name: "Document collection", order: 3 },
  { id: "stage_vo_4", processId: "proc_vendor_onboarding", name: "AI validation", order: 4 },
  { id: "stage_vo_5", processId: "proc_vendor_onboarding", name: "Compliance check", order: 5 },
  { id: "stage_vo_6", processId: "proc_vendor_onboarding", name: "Approval", order: 6 },
  { id: "stage_vo_7", processId: "proc_vendor_onboarding", name: "Vendor creation", order: 7 },
  { id: "stage_vo_8", processId: "proc_vendor_onboarding", name: "Finance setup", order: 8 },
  { id: "stage_vo_9", processId: "proc_vendor_onboarding", name: "Completion", order: 9 },

  // ---------- Purchase Requisition & Procurement ----------
  { id: "stage_pr_1", processId: "proc_purchase_requisition", name: "Request", order: 1 },
  { id: "stage_pr_2", processId: "proc_purchase_requisition", name: "Budget check", order: 2 },
  { id: "stage_pr_3", processId: "proc_purchase_requisition", name: "Manager approval", order: 3 },
  { id: "stage_pr_4", processId: "proc_purchase_requisition", name: "PO issued", order: 4 },
  { id: "stage_pr_5", processId: "proc_purchase_requisition", name: "Goods received", order: 5 },

  // ---------- Data Privacy Compliance Review ----------
  { id: "stage_dpr_1", processId: "proc_data_privacy_review", name: "Intake", order: 1 },
  { id: "stage_dpr_2", processId: "proc_data_privacy_review", name: "Data mapping", order: 2 },
  { id: "stage_dpr_3", processId: "proc_data_privacy_review", name: "Risk assessment", order: 3 },
  { id: "stage_dpr_4", processId: "proc_data_privacy_review", name: "Legal review", order: 4 },
  { id: "stage_dpr_5", processId: "proc_data_privacy_review", name: "Sign-off", order: 5 },

  // ---------- Operational Incident Response ----------
  { id: "stage_ir_1", processId: "proc_incident_response", name: "Report", order: 1 },
  { id: "stage_ir_2", processId: "proc_incident_response", name: "Triage", order: 2 },
  { id: "stage_ir_3", processId: "proc_incident_response", name: "Investigation", order: 3 },
  { id: "stage_ir_4", processId: "proc_incident_response", name: "Resolution", order: 4 },
  { id: "stage_ir_5", processId: "proc_incident_response", name: "Postmortem", order: 5 },

  // ---------- Expense Reimbursement Approval ----------
  { id: "stage_er_1", processId: "proc_expense_reimbursement", name: "Submission", order: 1 },
  { id: "stage_er_2", processId: "proc_expense_reimbursement", name: "Policy check", order: 2 },
  { id: "stage_er_3", processId: "proc_expense_reimbursement", name: "Manager approval", order: 3 },
  { id: "stage_er_4", processId: "proc_expense_reimbursement", name: "Finance approval", order: 4 },
  { id: "stage_er_5", processId: "proc_expense_reimbursement", name: "Reimbursement", order: 5 },

  // ---------- Employee Offboarding ----------
  { id: "stage_eo_1", processId: "proc_employee_offboarding", name: "Notice received", order: 1 },
  { id: "stage_eo_2", processId: "proc_employee_offboarding", name: "Access revocation", order: 2 },
  { id: "stage_eo_3", processId: "proc_employee_offboarding", name: "Asset return", order: 3 },
  { id: "stage_eo_4", processId: "proc_employee_offboarding", name: "Final settlement", order: 4 },
  { id: "stage_eo_5", processId: "proc_employee_offboarding", name: "Exit complete", order: 5 },
];

export function getStagesByProcess(processId: string) {
  return processStages.filter((s) => s.processId === processId).sort((a, b) => a.order - b.order);
}
