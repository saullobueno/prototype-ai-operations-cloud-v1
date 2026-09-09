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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addWorkflow, updateWorkflow, upsertWorkflowVersion } from "@/data/mock";
import type { Workflow, WorkflowTriggerType } from "@/types";

const TRIGGER_OPTIONS: { value: WorkflowTriggerType; label: string }[] = [
  { value: "conversation_created", label: "Conversa criada" },
  { value: "ticket_created", label: "Ticket criado" },
  { value: "customer_created", label: "Cliente criado" },
  { value: "message_received", label: "Mensagem recebida" },
  { value: "payment_failed", label: "Pagamento falhou" },
  { value: "sla_approaching", label: "SLA se aproximando" },
  { value: "webhook", label: "Webhook" },
  { value: "schedule", label: "Agendamento" },
  { value: "manual", label: "Manual" },
];

interface TemplateFormState {
  name: string;
  description: string;
  category: string;
  triggerType: WorkflowTriggerType;
}

function toFormState(template?: Workflow): TemplateFormState {
  return {
    name: template?.name ?? "",
    description: template?.description ?? "",
    category: template?.templateCategory ?? "",
    triggerType: template?.trigger.type ?? "manual",
  };
}

interface TemplateFormDialogProps {
  /** Presente = modo edição (muta este modelo). Ausente = modo criação. */
  template?: Workflow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Workflow) => void;
}

export function TemplateFormDialog({ template, open, onOpenChange, onSave }: TemplateFormDialogProps) {
  const isEdit = Boolean(template);
  const [form, setForm] = useState<TemplateFormState>(() => toFormState(template));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(template));
  }

  function handleSave() {
    if (!form.name.trim()) return;

    if (isEdit && template) {
      const updated: Workflow = {
        ...template,
        name: form.name.trim(),
        description: form.description.trim(),
        templateCategory: form.category.trim() || undefined,
        trigger: { type: form.triggerType },
      };
      updateWorkflow(updated);
      onSave(updated);
      toast.success("Modelo atualizado", { description: `${updated.name} foi atualizado.` });
    } else {
      const id = `wf_tpl_${Date.now()}`;
      const versionId = `${id}_v1`;
      upsertWorkflowVersion({
        id: versionId,
        workflowId: id,
        version: 1,
        nodes: [{ id: "n1", type: "trigger", label: "Novo gatilho", position: { x: 240, y: 20 } }],
        edges: [],
        publishedAt: new Date().toISOString(),
      });
      const newTemplate: Workflow = {
        id,
        name: form.name.trim(),
        description: form.description.trim(),
        status: "draft",
        trigger: { type: form.triggerType },
        currentVersionId: versionId,
        totalRuns: 0,
        successRuns: 0,
        failedRuns: 0,
        waitingRuns: 0,
        isTemplate: true,
        templateCategory: form.category.trim() || undefined,
      };
      addWorkflow(newTemplate);
      onSave(newTemplate);
      toast.success("Modelo criado", { description: `${newTemplate.name} foi adicionado aos modelos.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar modelo" : "Novo modelo"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados deste modelo de workflow." : "Crie um novo modelo reutilizável de workflow."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="template-name">Nome</Label>
            <Input id="template-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="template-description">Descrição</Label>
            <Textarea
              id="template-description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="template-category">Categoria</Label>
              <Input
                id="template-category"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="ex: Suporte"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gatilho</Label>
              <Select value={form.triggerType} onValueChange={(v) => setForm((p) => ({ ...p, triggerType: v as WorkflowTriggerType }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {isEdit ? "Salvar alterações" : "Criar modelo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
