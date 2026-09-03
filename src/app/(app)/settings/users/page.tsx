"use client";

import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/features/organization/users-table";

export default function UsersSettingsPage() {
  return (
    <SettingsSection
      title="Usuários"
      description="Todos com acesso a este workspace."
      actions={<Button size="sm" onClick={() => toast("Convidar usuários não está disponível neste protótipo.")}><UserPlus /> Convidar usuário</Button>}
    >
      <UsersTable />
    </SettingsSection>
  );
}
