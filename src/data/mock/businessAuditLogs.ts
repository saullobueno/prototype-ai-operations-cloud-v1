import type { AuditLog } from "@/types";
import { daysAgo } from "@/lib/time";

// Trilha de auditoria de Business Operations. Arquivo novo e isolado — mesclar em
// src/data/mock/auditLogs.ts depois (mesmo motivo de businessAgents.ts).
export const businessAuditLogs: AuditLog[] = [
  { id: "audit_biz_1", actorType: "agent", actorId: "agent_biz_compliance", action: "run_compliance_check", targetType: "process_run", targetId: "run_vo_003", createdAt: daysAgo(3) },
  { id: "audit_biz_2", actorType: "human", actorId: "usr_thomas", action: "request_vendor_approval", targetType: "approval", targetId: "appr_biz_1", createdAt: daysAgo(3) },
  { id: "audit_biz_3", actorType: "agent", actorId: "agent_biz_exception", action: "flag_process_exception", targetType: "process_run", targetId: "run_vo_004", createdAt: daysAgo(3) },
  { id: "audit_biz_4", actorType: "system", actorId: "system", action: "process_run_completed", targetType: "process_run", targetId: "run_vo_001", createdAt: "2026-08-14T10:00:00Z" },
  { id: "audit_biz_5", actorType: "human", actorId: "usr_sofia", action: "reject_exception_request", targetType: "approval", targetId: "appr_biz_5", createdAt: daysAgo(11) },
  { id: "audit_biz_6", actorType: "agent", actorId: "agent_biz_optimization", action: "flag_automation_opportunity", targetType: "process", targetId: "proc_data_privacy_review", createdAt: daysAgo(5) },
  { id: "audit_biz_7", actorType: "human", actorId: "usr_edivan", action: "update_policy", targetType: "policy", targetId: "policy_biz_vendor_onboarding", createdAt: daysAgo(45) },
];

export function getBusinessAuditLogsByTarget(targetType: string, targetId: string) {
  return businessAuditLogs.filter((a) => a.targetType === targetType && a.targetId === targetId);
}
