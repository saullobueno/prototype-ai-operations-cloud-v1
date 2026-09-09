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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PEOPLE_REQUEST_TYPE_LABEL } from "@/features/people/people-badges";
import { addPeopleRequest } from "@/data/mock/peopleRequests";
import { employees } from "@/data/mock/employees";
import type { PeopleRequest, PeopleRequestType } from "@/types";

const TYPE_OPTIONS: PeopleRequestType[] = ["time_off", "equipment", "expense", "internal_mobility", "document"];

interface PeopleRequestFormDialogProps {
  /** Fixa o colaborador solicitante (usado dentro da página do colaborador) — esconde o seletor. */
  defaultEmployeeId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (request: PeopleRequest) => void;
}

// Só criação — a solicitação é do próprio colaborador; decisão (aprovar/rejeitar) acontece em
// /modules/people/approvals via decidePeopleApproval, não aqui.
export function PeopleRequestFormDialog({ defaultEmployeeId, open, onOpenChange, onCreate }: PeopleRequestFormDialogProps) {
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId ?? employees[0]?.id ?? "");
  const [type, setType] = useState<PeopleRequestType>("time_off");

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setEmployeeId(defaultEmployeeId ?? employees[0]?.id ?? "");
      setType("time_off");
    }
  }

  function handleCreate() {
    if (!employeeId) return;
    const request: PeopleRequest = {
      id: `preq_${Date.now()}`,
      employeeId,
      type,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    addPeopleRequest(request);
    onCreate(request);
    toast.success("Solicitação criada", { description: `${PEOPLE_REQUEST_TYPE_LABEL[type]} enviada para aprovação.` });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nova solicitação</DialogTitle>
          <DialogDescription>Crie uma solicitação de colaborador para revisão do time de People.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {!defaultEmployeeId && (
            <div className="space-y-1.5">
              <Label>Colaborador</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as PeopleRequestType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {PEOPLE_REQUEST_TYPE_LABEL[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!employeeId}>
            Criar solicitação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
