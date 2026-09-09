"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addBusinessPolicy, updateBusinessPolicy } from "@/data/mock/businessPolicies";
import type { Policy, PolicyAction, PolicyRule } from "@/types";

const ACTION_OPTIONS: { value: PolicyAction; label: string }[] = [
  { value: "ai_can_execute", label: "IA pode executar" },
  { value: "human_approval", label: "Aprovação humana" },
  { value: "finance_approval", label: "Aprovação do financeiro" },
  { value: "never_execute", label: "Nunca executar" },
];

interface PolicyFormState {
  name: string;
  rules: PolicyRule[];
}

function toFormState(policy?: Policy): PolicyFormState {
  return {
    name: policy?.name ?? "",
    rules: policy?.rules.map((r) => ({ ...r })) ?? [{ id: `rule_${Date.now()}`, condition: "", action: "human_approval" }],
  };
}

interface PolicyFormDialogProps {
  /** Presente = modo edição (muta esta política). Ausente = modo criação. */
  policy?: Policy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (policy: Policy) => void;
}

export function PolicyFormDialog({ policy, open, onOpenChange, onSave }: PolicyFormDialogProps) {
  const isEdit = Boolean(policy);
  const [form, setForm] = useState<PolicyFormState>(() => toFormState(policy));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(policy));
  }

  const validRules = form.rules.filter((r) => r.condition.trim());
  const canSave = Boolean(form.name.trim()) && validRules.length > 0;

  function updateRule(id: string, patch: Partial<PolicyRule>) {
    setForm((p) => ({ ...p, rules: p.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }

  function addRule() {
    setForm((p) => ({ ...p, rules: [...p.rules, { id: `rule_${Date.now()}`, condition: "", action: "human_approval" }] }));
  }

  function removeRule(id: string) {
    setForm((p) => ({ ...p, rules: p.rules.filter((r) => r.id !== id) }));
  }

  function handleSave() {
    if (!canSave) return;
    const rules = validRules.map((r) => ({ ...r, condition: r.condition.trim() }));

    if (isEdit && policy) {
      const updated = updateBusinessPolicy(policy.id, { name: form.name.trim(), rules });
      if (updated) {
        onSave(updated);
        toast.success("Política atualizada", { description: `${updated.name} foi atualizada.` });
      }
    } else {
      const newPolicy: Policy = { id: `policy_biz_${Date.now()}`, name: form.name.trim(), rules };
      addBusinessPolicy(newPolicy);
      onSave(newPolicy);
      toast.success("Política criada", { description: `${newPolicy.name} foi adicionada à governança de Business Operations.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar política" : "Nova política"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize as regras de governança desta política." : "Defina uma nova regra de governança para o AI Workforce de Business Operations."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="policy-name">Nome</Label>
            <Input id="policy-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>

          <div className="space-y-1.5">
            <Label>Regras</Label>
            <div className="space-y-2">
              {form.rules.map((rule) => (
                <div key={rule.id} className="flex items-start gap-2">
                  <Input
                    value={rule.condition}
                    onChange={(e) => updateRule(rule.id, { condition: e.target.value })}
                    placeholder="Ex: valor de contrato <= €5.000/ano"
                    className="flex-1"
                  />
                  <Select value={rule.action} onValueChange={(v) => updateRule(rule.id, { action: v as PolicyAction })}>
                    <SelectTrigger className="w-44 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTION_OPTIONS.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="mt-1.5 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRule(rule.id)}
                    disabled={form.rules.length <= 1}
                  >
                    <Trash2 />
                    <span className="sr-only">Remover regra</span>
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-1 gap-1" onClick={addRule}>
              <Plus className="size-3.5" /> Adicionar regra
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {isEdit ? "Salvar alterações" : "Criar política"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
