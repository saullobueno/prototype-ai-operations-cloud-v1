import type { ReactNode } from "react";
import { SecondarySidebarLayout } from "@/components/layout/secondary-sidebar-layout";
import { adminNav } from "@/components/navigation/admin-nav-config";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SecondarySidebarLayout title="Admin" groups={adminNav}>
      {children}
    </SecondarySidebarLayout>
  );
}
