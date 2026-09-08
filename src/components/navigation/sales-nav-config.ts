export interface SalesGroup {
  label: string;
  items: { label: string; href: string }[];
}

export const salesNav: SalesGroup[] = [
  {
    label: "Pipeline",
    items: [
      { label: "Visão geral", href: "/modules/sales" },
      { label: "Deals", href: "/modules/sales/deals" },
    ],
  },
  {
    label: "Prospecção",
    items: [
      { label: "Leads", href: "/modules/sales/leads" },
      { label: "Accounts", href: "/modules/sales/accounts" },
    ],
  },
  {
    label: "Insights",
    items: [{ label: "Forecast", href: "/modules/sales/forecast" }],
  },
];
