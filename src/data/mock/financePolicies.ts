import type { Policy } from "@/types";

// Arquivo próprio porque src/data/mock/policies.ts é compartilhado entre módulos — precisa
// ser mesclado no array `policies` compartilhado pelo orquestrador.
export const financePolicies: Policy[] = [
  {
    id: "policy_bill_payment",
    name: "Política de aprovação de pagamento a fornecedor",
    rules: [
      { id: "rule_bill_1", condition: "valor <= €500", action: "ai_can_execute" },
      { id: "rule_bill_2", condition: "€500 < valor <= €5.000", action: "human_approval" },
      { id: "rule_bill_3", condition: "valor > €5.000", action: "finance_approval" },
      { id: "rule_bill_4", condition: "fornecedor sem PO associada", action: "human_approval" },
    ],
  },
  {
    id: "policy_expense",
    name: "Política de aprovação de despesas",
    rules: [
      { id: "rule_exp_1", condition: "valor <= €200", action: "ai_can_execute" },
      { id: "rule_exp_2", condition: "€200 < valor <= €2.000", action: "human_approval" },
      { id: "rule_exp_3", condition: "despesa sinalizada como anômala", action: "never_execute" },
    ],
  },
];
