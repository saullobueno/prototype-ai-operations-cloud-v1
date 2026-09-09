export interface BusinessGroup {
  label: string;
  items: { label: string; href: string }[];
}

export const businessNav: BusinessGroup[] = [
  {
    label: "Processos",
    items: [
      { label: "Visão geral", href: "/modules/business" },
      { label: "Biblioteca de processos", href: "/modules/business/processes" },
      { label: "Execuções", href: "/modules/business/runs" },
      { label: "Modelos", href: "/modules/business/templates" },
    ],
  },
  {
    label: "Operações",
    items: [
      { label: "Quadro de operações", href: "/modules/business/board" },
      { label: "Casos operacionais", href: "/modules/business/cases" },
      { label: "Exceções", href: "/modules/business/exceptions" },
      { label: "Gargalos", href: "/modules/business/bottlenecks" },
    ],
  },
  {
    label: "Governança",
    items: [
      { label: "Políticas", href: "/modules/business/policies" },
      { label: "Aprovações", href: "/modules/business/approvals" },
      { label: "Compliance", href: "/modules/business/compliance" },
    ],
  },
  {
    label: "Otimização",
    items: [
      { label: "Analytics de processos", href: "/modules/business/analytics" },
      { label: "Recomendações de IA", href: "/modules/business/recommendations" },
    ],
  },
];
