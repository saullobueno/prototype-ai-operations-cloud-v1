import type { Policy } from "@/types";

// Políticas de governança de Business Operations. Arquivo novo e isolado — mesclar em
// src/data/mock/policies.ts depois (mesmo motivo de businessAgents.ts).
export const businessPolicies: Policy[] = [
  {
    id: "policy_biz_vendor_onboarding",
    name: "Política de aprovação de Vendor Onboarding",
    rules: [
      { id: "rule_biz_vo_1", condition: "valor de contrato <= €5.000/ano", action: "ai_can_execute" },
      { id: "rule_biz_vo_2", condition: "€5.000/ano < valor de contrato <= €50.000/ano", action: "human_approval" },
      { id: "rule_biz_vo_3", condition: "valor de contrato > €50.000/ano", action: "finance_approval" },
      { id: "rule_biz_vo_4", condition: "fornecedor em lista de sanções ou compliance reprovado", action: "never_execute" },
    ],
  },
  {
    id: "policy_biz_process_exception",
    name: "Política de exceção de processo",
    rules: [
      { id: "rule_biz_exc_1", condition: "exceção de severidade baixa", action: "ai_can_execute" },
      { id: "rule_biz_exc_2", condition: "exceção de severidade média", action: "human_approval" },
      { id: "rule_biz_exc_3", condition: "exceção de severidade alta", action: "human_approval" },
    ],
  },
  {
    id: "policy_biz_expense",
    name: "Política de reembolso de despesas",
    rules: [
      { id: "rule_biz_exp_1", condition: "despesa <= €300", action: "ai_can_execute" },
      { id: "rule_biz_exp_2", condition: "€300 < despesa <= €2.000", action: "human_approval" },
      { id: "rule_biz_exp_3", condition: "despesa > €2.000", action: "finance_approval" },
    ],
  },
];

export function getBusinessPolicyById(id: string) {
  return businessPolicies.find((p) => p.id === id);
}

// Persistência simplificada, mesmo padrão de src/data/mock/tasks.ts.
export function addBusinessPolicy(policy: Policy) {
  businessPolicies.push(policy);
}

export function updateBusinessPolicy(id: string, patch: Partial<Policy>) {
  const policy = businessPolicies.find((p) => p.id === id);
  if (policy) Object.assign(policy, patch);
  return policy;
}

export function deleteBusinessPolicy(id: string) {
  const idx = businessPolicies.findIndex((p) => p.id === id);
  if (idx !== -1) businessPolicies.splice(idx, 1);
}
