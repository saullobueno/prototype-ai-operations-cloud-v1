"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Button } from "@/components/ui/button";
import { TeamsTable } from "@/features/organization/teams-table";

export default function TeamsSettingsPage() {
  return (
    <SettingsSection
      title="Times"
      description="Agrupe atendentes em times para roteamento e relatórios."
      actions={<Button size="sm" onClick={() => toast("Criar times não está disponível neste protótipo.")}><Plus /> Novo time</Button>}
    >
      <TeamsTable />
    </SettingsSection>
  );
}
