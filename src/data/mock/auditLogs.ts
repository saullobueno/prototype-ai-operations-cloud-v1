import type { AuditLog } from "@/types";
import { hoursAgo, minutesAgo, daysAgo } from "@/lib/time";

export const auditLogs: AuditLog[] = [
  { id: "audit_1", actorType: "agent", actorId: "agent_billing", action: "issue_refund", targetType: "payment", targetId: "pay_order_cus_001_0", createdAt: hoursAgo(3.9) },
  { id: "audit_2", actorType: "human", actorId: "usr_maria", action: "update_ticket", targetType: "ticket", targetId: "SUP-1842", createdAt: hoursAgo(3) },
  { id: "audit_3", actorType: "agent", actorId: "agent_support", action: "create_ticket", targetType: "ticket", targetId: "SUP-1845", createdAt: hoursAgo(9) },
  { id: "audit_4", actorType: "human", actorId: "usr_pedro", action: "reassign_ticket", targetType: "ticket", targetId: "SUP-1849", createdAt: hoursAgo(5) },
  { id: "audit_5", actorType: "agent", actorId: "agent_billing", action: "request_approval", targetType: "approval", targetId: "appr_1", createdAt: minutesAgo(90) },
  { id: "audit_6", actorType: "human", actorId: "usr_maria", action: "approve_refund", targetType: "approval", targetId: "appr_2", createdAt: hoursAgo(3.1) },
  { id: "audit_7", actorType: "system", actorId: "system", action: "workflow_published", targetType: "workflow", targetId: "wf_refund_approval", createdAt: daysAgo(21) },
  { id: "audit_8", actorType: "agent", actorId: "agent_knowledge", action: "flag_knowledge_gap", targetType: "knowledge_document", targetId: "doc_refund_exceptions", createdAt: hoursAgo(12) },
  { id: "audit_9", actorType: "human", actorId: "usr_thomas", action: "invite_user", targetType: "user", targetId: "usr_sofia", createdAt: daysAgo(200) },
  { id: "audit_10", actorType: "human", actorId: "usr_maria", action: "reject_refund", targetType: "approval", targetId: "appr_5", createdAt: hoursAgo(30) },
  { id: "audit_11", actorType: "agent", actorId: "agent_success", action: "trigger_export", targetType: "customer", targetId: "cus_011", createdAt: daysAgo(2) },
  { id: "audit_12", actorType: "system", actorId: "system", action: "integration_connected", targetType: "integration", targetId: "int_mixpanel", createdAt: daysAgo(180) },
  { id: "audit_13", actorType: "human", actorId: "usr_edivan", action: "update_policy", targetType: "policy", targetId: "policy_refund", createdAt: daysAgo(21) },
  { id: "audit_14", actorType: "agent", actorId: "agent_billing", action: "escalate_conversation", targetType: "conversation", targetId: "conv_1007", createdAt: minutesAgo(90) },
];
