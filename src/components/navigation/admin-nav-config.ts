export const adminNav = [
  {
    label: "Visão geral",
    items: [{ label: "Visão geral", href: "/admin" }],
  },
  {
    label: "Organização",
    items: [
      { label: "Organizações", href: "/admin/organizations" },
      { label: "Usuários", href: "/admin/users" },
      { label: "Times", href: "/admin/teams" },
      { label: "Papéis", href: "/admin/roles" },
      { label: "Permissões", href: "/admin/permissions" },
    ],
  },
  {
    label: "Governança",
    items: [
      { label: "Governança de IA", href: "/admin/ai-governance" },
      { label: "Logs de auditoria", href: "/admin/audit-logs" },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { label: "Segurança", href: "/admin/security" },
      { label: "Faturamento", href: "/admin/billing" },
      { label: "Uso", href: "/admin/usage" },
      { label: "Status do sistema", href: "/admin/system-health" },
    ],
  },
];
