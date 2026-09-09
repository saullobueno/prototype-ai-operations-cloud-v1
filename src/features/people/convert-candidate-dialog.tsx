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
import { addEmployee, employees } from "@/data/mock/employees";
import { departments } from "@/data/mock/departments";
import { createOnboardingForEmployee } from "@/data/mock/onboardings";
import type { Candidate, Employee } from "@/types";

const NO_MANAGER = "__none__";

interface ConvertCandidateDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Chamado com o Employee recém-criado (o onboarding correspondente já foi criado junto). */
  onConverted: (employee: Employee) => void;
}

// Um Employee (e o Onboarding que o acompanha) nasce naturalmente da contratação de um candidato —
// este é o ponto de entrada real para "criar" um onboarding, em vez de um botão solto na listagem.
export function ConvertCandidateDialog({ candidate, open, onOpenChange, onConverted }: ConvertCandidateDialogProps) {
  const [title, setTitle] = useState(candidate.role);
  const [departmentId, setDepartmentId] = useState(departments[0]?.id ?? "");
  const [managerId, setManagerId] = useState(NO_MANAGER);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTitle(candidate.role);
      setDepartmentId(departments[0]?.id ?? "");
      setManagerId(NO_MANAGER);
      setStartDate(new Date().toISOString().slice(0, 10));
    }
  }

  function handleConfirm() {
    if (!title.trim() || !departmentId || !startDate) return;
    // NFD decompõe acentos em base + marca combinável; o filtro [^a-z\s] já remove a marca combinável
    // junto (ela não é a-z), então não precisa de uma regex própria para as combining diacritical marks.
    const emailSlug = candidate.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z\s]/g, "")
      .trim()
      .replace(/\s+/g, ".");
    const newEmployee: Employee = {
      id: `emp_${Date.now()}`,
      name: candidate.name,
      email: `${emailSlug}@acmecloud.com`,
      title: title.trim(),
      departmentId,
      managerId: managerId === NO_MANAGER ? undefined : managerId,
      status: "onboarding",
      startDate: new Date(startDate).toISOString(),
    };
    addEmployee(newEmployee);
    createOnboardingForEmployee(newEmployee.id);
    onConverted(newEmployee);
    toast.success("Colaborador criado", { description: `${newEmployee.name} foi contratado(a) e o onboarding já foi iniciado.` });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Converter em colaborador</DialogTitle>
          <DialogDescription>Cria o cadastro de {candidate.name} como colaborador(a) e inicia o onboarding.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="convert-title">Cargo</Label>
            <Input id="convert-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Departamento</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
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
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_MANAGER}>Sem gestor</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="convert-start">Data de início</Label>
            <Input id="convert-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!title.trim() || !departmentId || !startDate}>
            Criar colaborador
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
