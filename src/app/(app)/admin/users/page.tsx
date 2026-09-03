import { SettingsSection } from "@/components/layout/settings-section";
import { UsersTable } from "@/features/organization/users-table";

export default function AdminUsersPage() {
  return (
    <SettingsSection title="Usuários" description="Todos os usuários da organização.">
      <UsersTable />
    </SettingsSection>
  );
}
