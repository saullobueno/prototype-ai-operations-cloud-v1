"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/domain/badges";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserFormDialog } from "@/features/organization/user-form-dialog";
import { CURRENT_USER_ID, deleteUser, getRoleById } from "@/data/mock";
import type { User } from "@/types";

interface UsersTableProps {
  users: User[];
  onUpdate: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UsersTable({ users, onUpdate, onDelete }: UsersTableProps) {
  const [editing, setEditing] = useState<User | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState<User | undefined>(undefined);

  function handleDelete() {
    if (!deleting) return;
    if (deleting.id === CURRENT_USER_ID) {
      toast.error("Você não pode remover a si mesmo.");
      setDeleting(undefined);
      return;
    }
    deleteUser(deleting.id);
    onDelete(deleting.id);
    toast.success("Usuário removido", { description: `${deleting.name} foi removido do workspace.` });
    setDeleting(undefined);
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <EntityAvatar name={u.name} size="sm" />
                    <div>
                      <p className="font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleById(u.roleId)?.name}</TableCell>
                <TableCell><StatusBadge status={u.status} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal />
                        <span className="sr-only">Ações do usuário</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => {
                          setEditing(u);
                          setEditOpen(true);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(u)}>
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserFormDialog key={editing?.id} user={editing} open={editOpen} onOpenChange={setEditOpen} onSave={onUpdate} />

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(undefined)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover usuário?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleting?.name}&rdquo; perderá acesso ao workspace. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(undefined)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
