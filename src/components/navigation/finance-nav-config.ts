export interface FinanceGroup {
  label: string;
  items: { label: string; href: string }[];
}

export const financeNav: FinanceGroup[] = [
  {
    label: "Contas a receber",
    items: [
      { label: "Visão geral", href: "/modules/finance" },
      { label: "Faturas", href: "/modules/finance/invoices" },
      { label: "Pagamentos", href: "/modules/finance/payments" },
      { label: "Cobranças", href: "/modules/finance/collections" },
      { label: "Vencidas", href: "/modules/finance/overdue" },
    ],
  },
  {
    label: "Contas a pagar",
    items: [
      { label: "Contas", href: "/modules/finance/bills" },
      { label: "Despesas", href: "/modules/finance/expenses" },
      { label: "Fornecedores", href: "/modules/finance/vendors" },
    ],
  },
  {
    label: "Operações",
    items: [
      { label: "Reconciliação", href: "/modules/finance/reconciliation" },
      { label: "Exceções", href: "/modules/finance/exceptions" },
      { label: "Aprovações", href: "/modules/finance/approvals" },
    ],
  },
  {
    label: "Inteligência",
    items: [
      { label: "Fluxo de caixa", href: "/modules/finance/cash-flow" },
      { label: "Risco de pagamento", href: "/modules/finance/payment-risk" },
      { label: "Anomalias", href: "/modules/finance/anomalies" },
      { label: "Previsão", href: "/modules/finance/forecast" },
    ],
  },
  {
    label: "Analytics",
    items: [{ label: "Performance financeira", href: "/modules/finance/analytics" }],
  },
];
