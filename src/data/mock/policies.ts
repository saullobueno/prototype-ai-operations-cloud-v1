import type { Policy } from "@/types";
import { financePolicies } from "./financePolicies";
import { businessPolicies } from "./businessPolicies";

const corePolicies: Policy[] = [
  {
    id: "policy_refund",
    name: "Política de reembolso",
    rules: [
      { id: "rule_refund_1", condition: "valor <= €50", action: "ai_can_execute" },
      { id: "rule_refund_2", condition: "€50 < valor <= €200", action: "human_approval" },
      { id: "rule_refund_3", condition: "valor > €200", action: "finance_approval" },
      { id: "rule_refund_4", condition: "suspeita de fraude", action: "never_execute" },
    ],
  },
  {
    id: "policy_subscription",
    name: "Política de mudança de assinatura",
    rules: [
      { id: "rule_sub_1", condition: "upgrade solicitado pelo cliente", action: "ai_can_execute" },
      { id: "rule_sub_2", condition: "downgrade ou cancelamento", action: "human_approval" },
    ],
  },
  {
    id: "policy_account_deletion",
    name: "Política de exclusão de conta",
    rules: [{ id: "rule_del_1", condition: "qualquer solicitação de exclusão de conta", action: "human_approval" }],
  },
  {
    id: "policy_legal",
    name: "Política de escalonamento jurídico / compliance",
    rules: [{ id: "rule_legal_1", condition: "reclamação jurídica ou solicitação de compliance", action: "human_approval" }],
  },
];

export const policies: Policy[] = [...corePolicies, ...financePolicies, ...businessPolicies];

// Persistência simplificada, mesmo padrão de tasks.ts: a tela /policies muta este array
// compartilhado para que o efeito sobreviva à navegação dentro da sessão — não sobrevive a um reload.
export function addPolicy(policy: Policy) {
  policies.push(policy);
}

export function updatePolicy(updated: Policy) {
  const idx = policies.findIndex((p) => p.id === updated.id);
  if (idx !== -1) policies[idx] = updated;
}

export function deletePolicy(id: string) {
  const idx = policies.findIndex((p) => p.id === id);
  if (idx !== -1) policies.splice(idx, 1);
}
