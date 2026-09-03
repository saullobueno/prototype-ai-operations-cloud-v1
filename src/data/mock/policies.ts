import type { Policy } from "@/types";

export const policies: Policy[] = [
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
