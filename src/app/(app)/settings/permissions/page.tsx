import { SettingsSection } from "@/components/layout/settings-section";
import { PermissionsTable } from "@/features/organization/permissions-table";

export default function PermissionsSettingsPage() {
  return (
    <SettingsSection title="Permissões" description="Catálogo completo de permissões disponíveis na plataforma.">
      <PermissionsTable />
    </SettingsSection>
  );
}
