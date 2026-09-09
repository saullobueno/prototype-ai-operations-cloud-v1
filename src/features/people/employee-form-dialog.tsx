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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addEmployee, updateEmployee } from "@/data/mock/employees";
import { departments } from "@/data/mock/departments";
import { employees } from "@/data/mock/employees";
import type { Employee, EmploymentStatus } from "@/types";

const STATUS_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: "active", label: "Ativo" },
  { value: "onboarding", label: "Onboarding" },
  { value: "on_leave", label: "Licença" },
  { value: "offboarding", label: "Offboarding" },
  { value: "terminated", label: "Desligado" },
];

const NO_MANAGER = "__none__";

interface EmployeeFormState {
  name: string;
  email: string;
  title: string;
  departmentId: string;
  managerId: string;
  status: EmploymentStatus;
  startDate: string;
  location: string;
}

function toFormState(employee?: Employee): EmployeeFormState {
  return {
    name: employee?.name ?? "",
    email: employee?.email ?? "",
    title: employee?.title ?? "",
    departmentId: employee?.departmentId ?? departments[0]?.id ?? "",
    managerId: employee?.managerId ?? NO_MANAGER,
    status: employee?.status ?? "onboarding",
    startDate: employee?.startDate ? employee.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    location: employee?.location ?? "",
  };
}

interface EmployeeFormDialogProps {
  /** Presente = modo edição (muta este colaborador). Ausente = modo criação. */
  employee?: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (employee: Employee) => void;
}

export function EmployeeFormDialog({ employee, open, onOpenChange, onSave }: EmployeeFormDialogProps) {
  const isEdit = Boolean(employee);
  const [form, setForm] = useState<EmployeeFormState>(() => toFormState(employee));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(employee));
  }

  const managerOptions = employees.filter((e) => e.id !== employee?.id);

  function handleSave() {
    if (!form.name.trim() || !form.email.trim() || !form.title.trim() || !form.departmentId) return;
    const managerId = form.managerId === NO_MANAGER ? undefined : form.managerId;

    if (isEdit && employee) {
      const updated = updateEmployee(employee.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        title: form.title.trim(),
        departmentId: form.departmentId,
        managerId,
        status: form.status,
        startDate: new Date(form.startDate).toISOString(),
        location: form.location.trim() || undefined,
      });
      if (updated) {
        onSave(updated);
        toast.success("Colaborador atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newEmployee: Employee = {
        id: `emp_${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        title: form.title.trim(),
        departmentId: form.departmentId,
        managerId,
        status: form.status,
        startDate: new Date(form.startDate).toISOString(),
        location: form.location.trim() || undefined,
      };
      addEmployee(newEmployee);
      onSave(newEmployee);
      toast.success("Colaborador criado", { description: `${newEmployee.name} foi adicionado à organização.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar colaborador" : "Novo colaborador"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados básicos deste colaborador." : "Adicione um novo colaborador à organização."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="employee-name">Nome</Label>
            <Input id="employee-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="employee-email">Email</Label>
              <Input id="employee-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-title">Cargo</Label>
              <Input id="employee-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Departamento</Label>
              <Select value={form.departmentId} onValueChange={(v) => setForm((p) => ({ ...p, departmentId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Gestor</Label>
              <Select value={form.managerId} onValueChange={(v) => setForm((p) => ({ ...p, managerId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_MANAGER}>Sem gestor</SelectItem>
                  {managerOptions.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as EmploymentStatus }))}>
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
              <Label htmlFor="employee-start">Início</Label>
              <Input id="employee-start" type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="employee-location">Local</Label>
            <Input id="employee-location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="ex: Lisboa, PT" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim() || !form.title.trim()}>
            {isEdit ? "Salvar alterações" : "Criar colaborador"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
