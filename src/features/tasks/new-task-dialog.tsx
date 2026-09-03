"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskFormFields, relatedOptions, type RelatedType } from "@/features/tasks/task-form-fields";
import { users } from "@/data/mock";
import type { Task } from "@/types";

interface NewTaskDialogProps {
  onCreate: (task: Task) => void;
  defaultRelatedType?: RelatedType;
  defaultRelatedId?: string;
  /** Esconde o seletor de vínculo quando o contexto já é conhecido (ex.: dentro da página de um cliente). */
  lockRelated?: boolean;
  triggerLabel?: string;
}

export function NewTaskDialog({
  onCreate,
  defaultRelatedType = "customer",
  defaultRelatedId,
  lockRelated = false,
  triggerLabel = "Nova tarefa",
}: NewTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState(users[0]?.id ?? "");
  const [status, setStatus] = useState<Task["status"]>("new");
  const [dueAt, setDueAt] = useState("");
  const [relatedType, setRelatedType] = useState<RelatedType>(defaultRelatedType);
  const [relatedId, setRelatedId] = useState(defaultRelatedId ?? relatedOptions(defaultRelatedType)[0]?.id ?? "");

  function handleRelatedTypeChange(next: RelatedType) {
    setRelatedType(next);
    setRelatedId(relatedOptions(next)[0]?.id ?? "");
  }

  function reset() {
    setTitle("");
    setAssigneeId(users[0]?.id ?? "");
    setStatus("new");
    setDueAt("");
    setRelatedType(defaultRelatedType);
    setRelatedId(defaultRelatedId ?? relatedOptions(defaultRelatedType)[0]?.id ?? "");
  }

  function handleCreate() {
    if (!title.trim() || !assigneeId || !relatedId) return;
    onCreate({
      id: `task_${Date.now()}`,
      title: title.trim(),
      relatedType,
      relatedId,
      assigneeId,
      status,
      dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
    });
    setOpen(false);
    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
          <DialogDescription>Crie um item de trabalho e atribua a alguém da equipe.</DialogDescription>
        </DialogHeader>

        <TaskFormFields
          title={title}
          onTitleChange={setTitle}
          assigneeId={assigneeId}
          onAssigneeChange={setAssigneeId}
          status={status}
          onStatusChange={setStatus}
          dueAt={dueAt}
          onDueAtChange={setDueAt}
          relatedType={relatedType}
          onRelatedTypeChange={handleRelatedTypeChange}
          relatedId={relatedId}
          onRelatedIdChange={setRelatedId}
          lockRelated={lockRelated}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !relatedId}>
            Criar tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
