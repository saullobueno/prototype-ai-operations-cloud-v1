import type { ReactNode } from "react";
import { SecondarySidebarLayout } from "@/components/layout/secondary-sidebar-layout";
import { settingsNav } from "@/components/navigation/settings-nav-config";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <SecondarySidebarLayout title="Settings" groups={settingsNav}>
      {children}
    </SecondarySidebarLayout>
  );
}
