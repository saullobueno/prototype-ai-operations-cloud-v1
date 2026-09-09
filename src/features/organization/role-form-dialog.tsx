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
import { addRole, updateRole, permissions } from "@/data/mock";
import type { Role } from "@/types";

interface RoleFormState {
  name: string;
  permissionIds: string[];
}

function toFormState(role?: Role): RoleFormState {
  return {
    name: role?.name ?? "",
    permissionIds: role?.permissionIds ?? [],
  };
}

interface RoleFormDialogProps {
  /** Presente = modo edição (muta este papel). Ausente = modo criação (papel customizado). */
  role?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (role: Role) => void;
}

export function RoleFormDialog({ role, open, onOpenChange, onSave }: RoleFormDialogProps) {
  const isEdit = Boolean(role);
  const [form, setForm] = useState<RoleFormState>(() => toFormState(role));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(role));
  }

  function togglePermission(permId: string) {
    setForm((p) => ({
      ...p,
      permissionIds: p.permissionIds.includes(permId) ? p.permissionIds.filter((id) => id !== permId) : [...p.permissionIds, permId],
    }));
  }

  function handleSave() {
    if (!form.name.trim()) return;

    if (isEdit && role) {
      const updated: Role = { ...role, name: form.name.trim(), permissionIds: form.permissionIds };
      updateRole(updated);
      onSave(updated);
      toast.success("Papel atualizado", { description: `${updated.name} foi atualizado.` });
    } else {
      const newRole: Role = { id: `role_${Date.now()}`, name: form.name.trim(), permissionIds: form.permissionIds };
      addRole(newRole);
      onSave(newRole);
      toast.success("Papel criado", { description: `${newRole.name} foi adicionado ao workspace.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar papel" : "Novo papel"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize o nome e as permissões deste papel." : "Crie um papel customizado com o conjunto de permissões que fizer sentido."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Nome</Label>
            <Input id="role-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Permissões</Label>
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-border p-2">
              {permissions.map((p) => (
                <label key={p.id} className="flex items-center gap-2.5 rounded-md px-1.5 py-1 text-sm">
                  <Checkbox checked={form.permissionIds.includes(p.id)} onCheckedChange={() => togglePermission(p.id)} />
                  <span className="flex-1 text-foreground">{p.description}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.key}</span>
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
            {isEdit ? "Salvar alterações" : "Criar papel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
