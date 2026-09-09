"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/features/organization/users-table";
import { UserFormDialog } from "@/features/organization/user-form-dialog";
import { users as usersStore } from "@/data/mock";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(usersStore);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <SettingsSection
      title="Usuários"
      description="Todos os usuários da organização."
      actions={
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlus /> Convidar usuário
        </Button>
      }
    >
      <UsersTable
        users={users}
        onUpdate={(updated) => setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))}
        onDelete={(id) => setUsers((prev) => prev.filter((u) => u.id !== id))}
      />
      <UserFormDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSave={(created) => setUsers((prev) => [...prev, created])}
      />
    </SettingsSection>
  );
}
