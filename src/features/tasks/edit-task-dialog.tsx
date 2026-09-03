"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskFormFields, relatedOptions, type RelatedType } from "@/features/tasks/task-form-fields";
import type { Task } from "@/types";

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
}

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [dueAt, setDueAt] = useState(task.dueAt ? task.dueAt.slice(0, 10) : "");
  const [relatedType, setRelatedType] = useState<RelatedType>(task.relatedType);
  const [relatedId, setRelatedId] = useState(task.relatedId);

  function handleRelatedTypeChange(next: RelatedType) {
    setRelatedType(next);
    setRelatedId(relatedOptions(next)[0]?.id ?? "");
  }

  function handleSave() {
    if (!title.trim() || !assigneeId || !relatedId) return;
    onSave({
      ...task,
      title: title.trim(),
      assigneeId,
      status,
      relatedType,
      relatedId,
      dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
          <DialogDescription>Atualize os detalhes deste item de trabalho.</DialogDescription>
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
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !relatedId}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
