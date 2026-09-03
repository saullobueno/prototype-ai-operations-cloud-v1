import { SettingsSection } from "@/components/layout/settings-section";
import { PermissionsTable } from "@/features/organization/permissions-table";

export default function AdminPermissionsPage() {
  return (
    <SettingsSection title="Permissões" description="Catálogo completo de permissões.">
      <PermissionsTable />
    </SettingsSection>
  );
}
