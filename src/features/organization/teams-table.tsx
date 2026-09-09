"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { TeamFormDialog } from "@/features/organization/team-form-dialog";
import { deleteTeam, getUserById } from "@/data/mock";
import type { Team } from "@/types";

interface TeamsTableProps {
  teams: Team[];
  onUpdate: (team: Team) => void;
  onDelete: (id: string) => void;
}

export function TeamsTable({ teams, onUpdate, onDelete }: TeamsTableProps) {
  const [editing, setEditing] = useState<Team | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState<Team | undefined>(undefined);

  function handleDelete() {
    if (!deleting) return;
    deleteTeam(deleting.id);
    onDelete(deleting.id);
    toast.success("Time removido", { description: `${deleting.name} foi removido.` });
    setDeleting(undefined);
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Membros</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {t.memberIds.length === 0 && <span className="text-sm text-muted-foreground">Sem membros</span>}
                    {t.memberIds.map((id) => {
                      const user = getUserById(id);
                      return user ? <EntityAvatar key={id} name={user.name} size="xs" className="ring-2 ring-background" /> : null;
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal />
                        <span className="sr-only">Ações do time</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => {
                          setEditing(t);
                          setEditOpen(true);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(t)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TeamFormDialog key={editing?.id} team={editing} open={editOpen} onOpenChange={setEditOpen} onSave={onUpdate} />

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(undefined)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir time?</DialogTitle>
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
    </>
  );
}
