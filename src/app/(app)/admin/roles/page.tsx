import { SettingsSection } from "@/components/layout/settings-section";
import { RolesPanel } from "@/features/organization/roles-panel";

export default function AdminRolesPage() {
  return (
    <SettingsSection title="Papéis" description="Definições de papéis em toda a organização.">
      <RolesPanel />
    </SettingsSection>
  );
}
