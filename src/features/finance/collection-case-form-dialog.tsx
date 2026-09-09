"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateCollectionCase } from "@/data/mock/collectionCases";
import type { CollectionCase, CollectionCaseStatus } from "@/types";

const STATUS_OPTIONS: { value: CollectionCaseStatus; label: string }[] = [
  { value: "monitoring", label: "Monitorando" },
  { value: "contacted", label: "Contatado" },
  { value: "escalated", label: "Escalado" },
  { value: "resolved", label: "Resolvido" },
];

interface CollectionCaseFormDialogProps {
  collectionCase: CollectionCase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (collectionCase: CollectionCase) => void;
}

// Fluxo de cobrança: não é criável/excluível pela UI (o Payment Recovery Agent abre os casos) —
// só permite ajustar o status e a estratégia registrada, mesmo padrão de dialog de edição das
// demais entidades de Finance (presença de `collectionCase` sempre significa edição aqui).
export function CollectionCaseFormDialog({ collectionCase, open, onOpenChange, onSave }: CollectionCaseFormDialogProps) {
  const [status, setStatus] = useState<CollectionCaseStatus>(collectionCase.status);
  const [strategy, setStrategy] = useState(collectionCase.strategy);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStatus(collectionCase.status);
      setStrategy(collectionCase.strategy);
    }
  }

  function handleSave() {
    if (!strategy.trim()) return;
    const updated = updateCollectionCase(collectionCase.id, { status, strategy: strategy.trim() });
    if (updated) {
      onSave(updated);
      toast.success("Caso de cobrança atualizado");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar caso de cobrança</DialogTitle>
          <DialogDescription>Ajuste o status e a estratégia definida pelo Payment Recovery Agent.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as CollectionCaseStatus)}>
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
          <div className="space-y-1.5">
            <Label htmlFor="case-strategy">Estratégia</Label>
            <Textarea id="case-strategy" value={strategy} onChange={(e) => setStrategy(e.target.value)} rows={4} autoFocus />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!strategy.trim()}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
