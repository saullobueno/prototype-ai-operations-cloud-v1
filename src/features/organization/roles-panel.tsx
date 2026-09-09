"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RoleFormDialog } from "@/features/organization/role-form-dialog";
import { deleteRole, permissions, roles as rolesStore, SYSTEM_ROLE_IDS, updateRole, users } from "@/data/mock";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

export function RolesPanel() {
  const [roles, setRoles] = useState<Role[]>(rolesStore);
  const [selected, setSelected] = useState(roles[2]?.id ?? roles[0]?.id ?? "");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Role | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState<Role | undefined>(undefined);

  const role = roles.find((r) => r.id === selected) ?? roles[0];

  function togglePermission(permId: string) {
    if (!role) return;
    const nextIds = role.permissionIds.includes(permId)
      ? role.permissionIds.filter((id) => id !== permId)
      : [...role.permissionIds, permId];
    const updated: Role = { ...role, permissionIds: nextIds };
    updateRole(updated);
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }

  function handleDelete() {
    if (!deleting) return;
    const assignedUsers = users.filter((u) => u.roleId === deleting.id).length;
    if (assignedUsers > 0) {
      toast.error("Este papel está em uso", { description: `${assignedUsers} usuário(s) ainda têm este papel atribuído.` });
      setDeleting(undefined);
      return;
    }
    deleteRole(deleting.id);
    setRoles((prev) => prev.filter((r) => r.id !== deleting.id));
    if (selected === deleting.id) setSelected(roles.find((r) => r.id !== deleting.id)?.id ?? "");
    toast.success("Papel removido", { description: `${deleting.name} foi removido.` });
    setDeleting(undefined);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      <div className="space-y-1">
        <Button variant="outline" size="sm" className="mb-2 w-full gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="size-3.5" /> Novo papel
        </Button>
        {roles.map((r) => (
          <div
            key={r.id}
            className={cn(
              "group flex items-center justify-between rounded-md pr-1 text-sm transition-colors",
              r.id === selected ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-accent"
            )}
          >
            <button onClick={() => setSelected(r.id)} className="flex flex-1 items-center justify-between px-3 py-2 text-left">
              {r.name}
              <Badge variant="secondary" className="text-[10px]">{r.permissionIds.length}</Badge>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal />
                  <span className="sr-only">Ações do papel</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    setEditing(r);
                    setEditOpen(true);
                  }}
                >
                  Renomear
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={SYSTEM_ROLE_IDS.includes(r.id)}
                  onSelect={() => setDeleting(r)}
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="space-y-1.5 pt-4">
          {role &&
            permissions.map((p) => (
              <label key={p.id} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
                <Checkbox checked={role.permissionIds.includes(p.id)} onCheckedChange={() => togglePermission(p.id)} />
                <span className="flex-1 text-foreground">{p.description}</span>
                <span className="font-mono text-xs text-muted-foreground">{p.key}</span>
              </label>
            ))}
        </CardContent>
      </Card>

      <RoleFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={(created) => {
          setRoles((prev) => [...prev, created]);
          setSelected(created.id);
        }}
      />

      <RoleFormDialog
        key={editing?.id}
        role={editing}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={(updated) => setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))}
      />

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(undefined)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir papel?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleting?.name}&rdquo; será removido permanentemente. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(undefined)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
