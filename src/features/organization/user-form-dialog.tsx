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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addUser, updateUser, roles, teams } from "@/data/mock";
import type { User } from "@/types";

interface UserFormState {
  name: string;
  email: string;
  roleId: string;
  teamIds: string[];
  status: User["status"];
}

function toFormState(user?: User): UserFormState {
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    roleId: user?.roleId ?? roles[roles.length - 1]?.id ?? "",
    teamIds: user?.teamIds ?? [],
    status: user?.status ?? "invited",
  };
}

interface UserFormDialogProps {
  /** Presente = modo edição (muta este usuário). Ausente = modo criação (convite). */
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
}

export function UserFormDialog({ user, open, onOpenChange, onSave }: UserFormDialogProps) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState<UserFormState>(() => toFormState(user));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(user));
  }

  function toggleTeam(teamId: string) {
    setForm((p) => ({
      ...p,
      teamIds: p.teamIds.includes(teamId) ? p.teamIds.filter((t) => t !== teamId) : [...p.teamIds, teamId],
    }));
  }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim() || !form.roleId) return;

    if (isEdit && user) {
      const updated: User = {
        ...user,
        name: form.name.trim(),
        email: form.email.trim(),
        roleId: form.roleId,
        teamIds: form.teamIds,
        status: form.status,
      };
      updateUser(updated);
      onSave(updated);
      toast.success("Usuário atualizado", { description: `${updated.name} foi atualizado.` });
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        roleId: form.roleId,
        teamIds: form.teamIds,
        status: "invited",
      };
      addUser(newUser);
      onSave(newUser);
      toast.success("Convite enviado", { description: `${newUser.name} foi convidado para o workspace.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar usuário" : "Convidar usuário"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize papel, times e status deste usuário." : "Envie um convite para um novo usuário entrar no workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="user-name">Nome</Label>
            <Input id="user-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Papel</Label>
              <Select value={form.roleId} onValueChange={(v) => setForm((p) => ({ ...p, roleId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isEdit && (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as User["status"] }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="invited">Convidado</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Times</Label>
            <div className="max-h-36 space-y-1 overflow-y-auto rounded-md border border-border p-2">
              {teams.map((t) => (
                <label key={t.id} className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm">
                  <Checkbox checked={form.teamIds.includes(t.id)} onCheckedChange={() => toggleTeam(t.id)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim() || !form.roleId}>
            {isEdit ? "Salvar alterações" : "Enviar convite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
