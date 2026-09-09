export interface PeopleGroup {
  label: string;
  items: { label: string; href: string }[];
}

export const peopleNav: PeopleGroup[] = [
  {
    label: "Pessoas",
    items: [
      { label: "Visão geral", href: "/modules/people" },
      { label: "Colaboradores", href: "/modules/people/employees" },
      { label: "Times", href: "/modules/people/teams" },
      { label: "Departamentos", href: "/modules/people/departments" },
    ],
  },
  {
    label: "Ciclo de vida",
    items: [
      { label: "Onboarding", href: "/modules/people/onboarding" },
      { label: "Mobilidade interna", href: "/modules/people/mobility" },
      { label: "Offboarding", href: "/modules/people/offboarding" },
    ],
  },
  {
    label: "Talento",
    items: [
      { label: "Candidatos", href: "/modules/people/candidates" },
      { label: "Pipeline de contratação", href: "/modules/people/hiring" },
    ],
  },
  {
    label: "Performance",
    items: [
      { label: "Metas", href: "/modules/people/goals" },
      { label: "Avaliações", href: "/modules/people/reviews" },
    ],
  },
  {
    label: "Operações",
    items: [
      { label: "Solicitações", href: "/modules/people/requests" },
      { label: "Aprovações", href: "/modules/people/approvals" },
    ],
  },
  {
    label: "Inteligência",
    items: [
      { label: "Workforce insights", href: "/modules/people/insights" },
      { label: "Risco de retenção", href: "/modules/people/retention-risk" },
      { label: "Analytics", href: "/modules/people/analytics" },
    ],
  },
];
