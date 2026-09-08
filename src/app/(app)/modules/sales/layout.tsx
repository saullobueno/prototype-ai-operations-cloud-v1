import type { ReactNode } from "react";
import { SecondarySidebarLayout } from "@/components/layout/secondary-sidebar-layout";
import { salesNav } from "@/components/navigation/sales-nav-config";

export default function SalesLayout({ children }: { children: ReactNode }) {
  return (
    <SecondarySidebarLayout title="Sales Operations" groups={salesNav}>
      {children}
    </SecondarySidebarLayout>
  );
}
