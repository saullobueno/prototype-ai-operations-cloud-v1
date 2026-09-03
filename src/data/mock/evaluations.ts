import type { Evaluation } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const evaluations: Evaluation[] = [
  { id: "eval_1", targetType: "agent_run", targetId: "run_84291", accuracy: 96, tone: 94, policyAdherence: 100, resolution: "resolved", createdAt: hoursAgo(3.8) },
  { id: "eval_2", targetType: "agent_run", targetId: "run_84120", accuracy: 91, tone: 90, policyAdherence: 100, resolution: "escalated", createdAt: hoursAgo(5.7) },
  { id: "eval_3", targetType: "agent_run", targetId: "run_83920", accuracy: 89, tone: 88, policyAdherence: 95, resolution: "resolved", createdAt: daysAgo(1) },
  { id: "eval_4", targetType: "agent_run", targetId: "run_83811", accuracy: 93, tone: 95, policyAdherence: 100, resolution: "resolved", createdAt: daysAgo(2) },
  { id: "eval_5", targetType: "agent_run", targetId: "run_83998", accuracy: 84, tone: 82, policyAdherence: 90, resolution: "escalated", createdAt: hoursAgo(1.5) },
  { id: "eval_6", targetType: "conversation", targetId: "conv_1849", accuracy: 88, tone: 96, policyAdherence: 100, resolution: "resolved", reviewerId: "usr_thomas", createdAt: daysAgo(1) },
  { id: "eval_7", targetType: "conversation", targetId: "conv_1010", accuracy: 79, tone: 85, policyAdherence: 92, resolution: "unresolved", reviewerId: "usr_thomas", createdAt: hoursAgo(4) },
  { id: "eval_8", targetType: "conversation", targetId: "conv_1012", accuracy: 90, tone: 93, policyAdherence: 100, resolution: "unresolved", reviewerId: "usr_edivan", createdAt: hoursAgo(2) },
];

export function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}
