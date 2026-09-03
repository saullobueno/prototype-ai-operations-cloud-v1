export interface SettingsGroup {
  label: string;
  items: { label: string; href: string }[];
}

export const settingsNav: SettingsGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Geral", href: "/settings/general" },
      { label: "Identidade visual", href: "/settings/branding" },
      { label: "Localização", href: "/settings/localization" },
      { label: "Horário de atendimento", href: "/settings/business-hours" },
    ],
  },
  {
    label: "Organização",
    items: [
      { label: "Times", href: "/settings/teams" },
      { label: "Usuários", href: "/settings/users" },
      { label: "Papéis", href: "/settings/roles" },
      { label: "Permissões", href: "/settings/permissions" },
    ],
  },
  {
    label: "Customer Operations",
    items: [{ label: "Atribuição, SLA, tags e campos", href: "/settings/customer-operations" }],
  },
  {
    label: "IA",
    items: [{ label: "Modelos, políticas e guardrails", href: "/settings/ai" }],
  },
  {
    label: "Plataforma",
    items: [
      { label: "Canais", href: "/settings/channels" },
      { label: "Integrações", href: "/settings/integrations" },
      { label: "Segurança", href: "/settings/security" },
      { label: "Faturamento", href: "/settings/billing" },
    ],
  },
];
