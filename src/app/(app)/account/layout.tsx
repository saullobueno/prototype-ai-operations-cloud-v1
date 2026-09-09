import type { ReactNode } from "react";
import { SecondarySidebarLayout } from "@/components/layout/secondary-sidebar-layout";
import { accountNav } from "@/components/navigation/account-nav-config";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <SecondarySidebarLayout title="Configurações da Conta" groups={accountNav}>
      {children}
    </SecondarySidebarLayout>
  );
}
