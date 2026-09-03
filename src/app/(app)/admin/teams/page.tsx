import { SettingsSection } from "@/components/layout/settings-section";
import { TeamsTable } from "@/features/organization/teams-table";

export default function AdminTeamsPage() {
  return (
    <SettingsSection title="Times" description="Todos os times da organização.">
      <TeamsTable />
    </SettingsSection>
  );
}
