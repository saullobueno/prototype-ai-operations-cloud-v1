export interface AccountGroup {
  label: string;
  items: { label: string; href: string }[];
}

export const accountNav: AccountGroup[] = [
  {
    label: "Minha conta",
    items: [
      { label: "Segurança", href: "/account/security" },
      { label: "Preferências", href: "/account/preferences" },
      { label: "Notificações", href: "/account/notifications" },
    ],
  },
];
