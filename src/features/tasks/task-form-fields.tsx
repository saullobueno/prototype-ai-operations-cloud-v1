"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { conversations, customers, tickets, users, workflows } from "@/data/mock";
import type { Task } from "@/types";

export type RelatedType = Task["relatedType"];

export const RELATED_TYPE_LABEL: Record<RelatedType, string> = {
  customer: "Cliente",
  ticket: "Ticket",
  conversation: "Conversa",
  workflow: "Workflow",
};

// A ordem reflete o fluxo esperado: criada -> aprovada -> em execução -> em revisão -> aprovada pelo supervisor.
export const STATUS_OPTIONS: { value: Task["status"]; label: string }[] = [
  { value: "new", label: "Novo" },
  { value: "todo", label: "A fazer" },
  { value: "in_progress", label: "Em andamento" },
  { value: "review", label: "Revisão" },
  { value: "done", label: "Concluída" },
  { value: "canceled", label: "Cancelada" },
];

export function relatedOptions(type: RelatedType) {
  switch (type) {
    case "customer":
      return customers.map((c) => ({ id: c.id, label: c.name }));
    case "ticket":
      return tickets.map((t) => ({ id: t.id, label: t.title }));
    case "conversation":
      return conversations.map((c) => ({ id: c.id, label: c.subject }));
    case "workflow":
      return workflows.map((w) => ({ id: w.id, label: w.name }));
  }
}

interface TaskFormFieldsProps {
  title: string;
  onTitleChange: (v: string) => void;
  assigneeId: string;
  onAssigneeChange: (v: string) => void;
  status: Task["status"];
  onStatusChange: (v: Task["status"]) => void;
  dueAt: string;
  onDueAtChange: (v: string) => void;
  relatedType: RelatedType;
  onRelatedTypeChange: (v: RelatedType) => void;
  relatedId: string;
  onRelatedIdChange: (v: string) => void;
  lockRelated?: boolean;
}

export function TaskFormFields({
  title,
  onTitleChange,
  assigneeId,
  onAssigneeChange,
  status,
  onStatusChange,
  dueAt,
  onDueAtChange,
  relatedType,
  onRelatedTypeChange,
  relatedId,
  onRelatedIdChange,
  lockRelated = false,
}: TaskFormFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="task-title">Título</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ex: Fazer follow-up com o cliente"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Responsável</Label>
          <Select value={assigneeId} onValueChange={onAssigneeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => onStatusChange(v as Task["status"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!lockRelated && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Vincular a</Label>
            <Select value={relatedType} onValueChange={(v) => onRelatedTypeChange(v as RelatedType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(RELATED_TYPE_LABEL) as RelatedType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {RELATED_TYPE_LABEL[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{RELATED_TYPE_LABEL[relatedType]}</Label>
            <Select value={relatedId} onValueChange={onRelatedIdChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {relatedOptions(relatedType).map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="task-due">Prazo (opcional)</Label>
        <Input id="task-due" type="date" value={dueAt} onChange={(e) => onDueAtChange(e.target.value)} />
      </div>
    </div>
  );
}
