"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addTeam, updateTeam, users } from "@/data/mock";
import type { Team } from "@/types";

interface TeamFormState {
  name: string;
  memberIds: string[];
}

function toFormState(team?: Team): TeamFormState {
  return {
    name: team?.name ?? "",
    memberIds: team?.memberIds ?? [],
  };
}

interface TeamFormDialogProps {
  /** Presente = modo edição (muta este time). Ausente = modo criação. */
  team?: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (team: Team) => void;
}

export function TeamFormDialog({ team, open, onOpenChange, onSave }: TeamFormDialogProps) {
  const isEdit = Boolean(team);
  const [form, setForm] = useState<TeamFormState>(() => toFormState(team));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(team));
  }

  function toggleMember(userId: string) {
    setForm((p) => ({
      ...p,
      memberIds: p.memberIds.includes(userId) ? p.memberIds.filter((id) => id !== userId) : [...p.memberIds, userId],
    }));
  }

  function handleSave() {
    if (!form.name.trim()) return;

    if (isEdit && team) {
      const updated: Team = { ...team, name: form.name.trim(), memberIds: form.memberIds };
      updateTeam(updated);
      onSave(updated);
      toast.success("Time atualizado", { description: `${updated.name} foi atualizado.` });
    } else {
      const newTeam: Team = { id: `team_${Date.now()}`, name: form.name.trim(), memberIds: form.memberIds };
      addTeam(newTeam);
      onSave(newTeam);
      toast.success("Time criado", { description: `${newTeam.name} foi adicionado ao workspace.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar time" : "Novo time"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize o nome e os membros deste time." : "Crie um novo time e adicione membros."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="team-name">Nome</Label>
            <Input id="team-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Membros</Label>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border p-2">
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm">
                  <Checkbox checked={form.memberIds.includes(u.id)} onCheckedChange={() => toggleMember(u.id)} />
                  {u.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {isEdit ? "Salvar alterações" : "Criar time"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
