"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search, Users } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmploymentStatusBadge } from "@/features/people/people-badges";
import { EmployeeFormDialog } from "@/features/people/employee-form-dialog";
import { OffboardEmployeeDialog } from "@/features/people/offboard-employee-dialog";
import { employees, getEmployeeById } from "@/data/mock/employees";
import { departments, getDepartmentById } from "@/data/mock/departments";
import { formatDate } from "@/lib/format";
import type { Employee, EmploymentStatus } from "@/types";

const STATUS_OPTIONS: { value: EmploymentStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "active", label: "Ativo" },
  { value: "onboarding", label: "Onboarding" },
  { value: "on_leave", label: "Licença" },
  { value: "offboarding", label: "Offboarding" },
  { value: "terminated", label: "Desligado" },
];

export default function EmployeesPage() {
  const [query, setQuery] = useState("");
  const [departmentId, setDepartmentId] = useState("all");
  const [status, setStatus] = useState<EmploymentStatus | "all">("all");
  // Espelha o array compartilhado `employees` em estado local só para forçar o re-render quando um
  // colaborador é criado, editado ou desligado (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [offboardEmployee, setOffboardEmployee] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    let list = employees;
    if (departmentId !== "all") list = list.filter((e) => e.departmentId === departmentId);
    if (status !== "all") list = list.filter((e) => e.status === status);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, departmentId, status, version]);

  return (
    <PageContainer>
      <PageHeader
        title="Colaboradores"
        description={`${employees.length} colaboradores na organização`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo colaborador
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar colaboradores..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
        <Select value={departmentId} onValueChange={setDepartmentId}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as EmploymentStatus | "all")}>
          <SelectTrigger className="w-44">
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

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum colaborador corresponde aos filtros" description="Tente ajustar sua busca ou filtros." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Início</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((employee) => {
                const department = getDepartmentById(employee.departmentId);
                const manager = employee.managerId ? getEmployeeById(employee.managerId) : undefined;
                const canOffboard = employee.status !== "offboarding" && employee.status !== "terminated";
                return (
                  <ClickableTableRow key={employee.id} href={`/modules/people/employees/${employee.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <EntityAvatar name={employee.name} size="sm" />
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{department?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{manager?.name ?? "—"}</TableCell>
                    <TableCell>
                      <EmploymentStatusBadge status={employee.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(employee.startDate)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                            <span className="sr-only">Ações do colaborador</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setEditEmployee(employee)}>Editar</DropdownMenuItem>
                          {canOffboard && (
                            <DropdownMenuItem variant="destructive" onSelect={() => setOffboardEmployee(employee)}>
                              Iniciar desligamento
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <EmployeeFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <EmployeeFormDialog
        employee={editEmployee ?? undefined}
        open={editEmployee !== null}
        onOpenChange={(next) => {
          if (!next) setEditEmployee(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />
      <OffboardEmployeeDialog
        employee={offboardEmployee}
        open={offboardEmployee !== null}
        onOpenChange={(next) => {
          if (!next) setOffboardEmployee(null);
        }}
        onDone={() => setVersion((v) => v + 1)}
      />
    </PageContainer>
  );
}
