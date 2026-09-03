"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { StatusBadge } from "@/components/domain/badges";
import { EditTaskDialog } from "@/features/tasks/edit-task-dialog";
import { getUserById } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import type { Task } from "@/types";

const RELATED_HREF: Record<Task["relatedType"], (id: string) => string> = {
  customer: (id) => `/customers/${id}`,
  ticket: (id) => `/tickets/${id}`,
  conversation: (id) => `/inbox/${id}`,
  workflow: (id) => `/automation/workflows/${id}`,
};

const RELATED_LABEL: Record<Task["relatedType"], string> = {
  customer: "cliente",
  ticket: "ticket",
  conversation: "conversa",
  workflow: "workflow",
};

interface TaskRowProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  /** Mostra o link para a entidade vinculada (usado na página geral de Tarefas, onde o contexto não é fixo). */
  showRelated?: boolean;
}

export function TaskRow({ task, onUpdate, onDelete, showRelated = false }: TaskRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  // Força a remontagem do formulário a cada abertura, para descartar qualquer rascunho não salvo da edição anterior.
  const [editKey, setEditKey] = useState(0);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const assignee = getUserById(task.assigneeId);
  const href = showRelated ? RELATED_HREF[task.relatedType]?.(task.relatedId) : undefined;

  return (
    <>
      <Card className="flex-row items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <CheckCircle2 className={`size-4 shrink-0 ${task.status === "done" ? "text-success" : "text-muted-foreground"}`} />
          <div className="min-w-0">
            <p className={`truncate text-sm ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.title}</p>
            {href && (
              <Link href={href} className="text-xs capitalize text-primary hover:underline">
                {RELATED_LABEL[task.relatedType]} · {task.relatedId}
              </Link>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
          {task.dueAt && <span>Prazo {formatRelative(task.dueAt)}</span>}
          {assignee && <EntityAvatar name={assignee.name} size="xs" />}
          <StatusBadge status={task.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal />
                <span className="sr-only">Ações da tarefa</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  setEditKey((k) => k + 1);
                  setEditOpen(true);
                }}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDeleteOpen(true)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <EditTaskDialog key={editKey} task={task} open={editOpen} onOpenChange={setEditOpen} onSave={onUpdate} />

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir tarefa?</DialogTitle>
            <DialogDescription>
              &ldquo;{task.title}&rdquo; será removida permanentemente. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id);
                setConfirmDeleteOpen(false);
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
