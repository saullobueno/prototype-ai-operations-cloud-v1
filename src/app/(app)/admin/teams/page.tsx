"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Button } from "@/components/ui/button";
import { TeamsTable } from "@/features/organization/teams-table";
import { TeamFormDialog } from "@/features/organization/team-form-dialog";
import { teams as teamsStore } from "@/data/mock";
import type { Team } from "@/types";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>(teamsStore);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <SettingsSection
      title="Times"
      description="Todos os times da organização."
      actions={
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus /> Novo time
        </Button>
      }
    >
      <TeamsTable
        teams={teams}
        onUpdate={(updated) => setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))}
        onDelete={(id) => setTeams((prev) => prev.filter((t) => t.id !== id))}
      />
      <TeamFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={(created) => setTeams((prev) => [...prev, created])}
      />
    </SettingsSection>
  );
}
