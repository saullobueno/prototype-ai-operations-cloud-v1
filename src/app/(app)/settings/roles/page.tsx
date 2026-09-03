import { SettingsSection } from "@/components/layout/settings-section";
import { RolesPanel } from "@/features/organization/roles-panel";

export default function RolesSettingsPage() {
  return (
    <SettingsSection title="Papéis" description="Cada papel agrupa um conjunto de permissões em toda a plataforma.">
      <RolesPanel />
    </SettingsSection>
  );
}
