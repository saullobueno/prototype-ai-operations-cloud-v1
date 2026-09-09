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
import { addOffboarding } from "@/data/mock/offboardings";
import { updateEmployee } from "@/data/mock/employees";
import type { Employee, Offboarding } from "@/types";

interface OffboardEmployeeDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: (employee: Employee, offboarding: Offboarding) => void;
}

// Modela o "desligamento" como o processo de RH que ele é (nasce um Offboarding, o colaborador
// muda de status), em vez de uma exclusão física do cadastro — ver guidance do briefing sobre não
// forçar delete destrutivo quando já existe um processo de negócio para isso.
export function OffboardEmployeeDialog({ employee, open, onOpenChange, onDone }: OffboardEmployeeDialogProps) {
  const [lastDay, setLastDay] = useState(() => new Date().toISOString().slice(0, 10));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setLastDay(new Date().toISOString().slice(0, 10));
  }

  function handleConfirm() {
    if (!employee || !lastDay) return;
    const offboarding: Offboarding = {
      id: `offb_${Date.now()}`,
      employeeId: employee.id,
      status: "in_progress",
      lastDay: new Date(lastDay).toISOString(),
    };
    addOffboarding(offboarding);
    const updated = updateEmployee(employee.id, { status: "offboarding" });
    if (updated) {
      onDone(updated, offboarding);
      toast.success("Desligamento iniciado", { description: `O processo de offboarding de ${updated.name} foi criado.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Iniciar desligamento</DialogTitle>
          <DialogDescription>
            {employee ? `Cria um processo de offboarding para ${employee.name} e atualiza o status do colaborador.` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="offboard-last-day">Último dia de trabalho</Label>
          <Input id="offboard-last-day" type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} autoFocus />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!lastDay}>
            Iniciar desligamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
