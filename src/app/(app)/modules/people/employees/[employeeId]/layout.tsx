"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { EmploymentStatusBadge } from "@/features/people/people-badges";
import { EmployeeFormDialog } from "@/features/people/employee-form-dialog";
import { OffboardEmployeeDialog } from "@/features/people/offboard-employee-dialog";
import { getEmployeeById } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const TABS = [
  { slug: "overview", label: "Visão geral" },
  { slug: "activity", label: "Atividade" },
  { slug: "team", label: "Time" },
  { slug: "goals", label: "Metas" },
  { slug: "performance", label: "Performance" },
  { slug: "feedback", label: "Feedback" },
  { slug: "documents", label: "Documentos" },
  { slug: "requests", label: "Solicitações" },
  { slug: "tasks", label: "Tarefas" },
  { slug: "journey", label: "Jornada" },
];

export default function EmployeeDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = use(params);
  const pathname = usePathname();
  // Força o re-render após editar/desligar (o array `employees` é mutado in-place — mesma
  // referência de objeto — então o componente precisa ser explicitamente re-avaliado).
  const [, setVersion] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [offboardOpen, setOffboardOpen] = useState(false);

  const employee = getEmployeeById(employeeId);

  if (!employee) notFound();

  const department = getDepartmentById(employee.departmentId);
  const manager = employee.managerId ? getEmployeeById(employee.managerId) : undefined;
  const canOffboard = employee.status !== "offboarding" && employee.status !== "terminated";

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <EntityAvatar name={employee.name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{employee.name}</h1>
              <EmploymentStatusBadge status={employee.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {employee.title} · {department?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Gestor</p>
            <p className="font-medium text-foreground">{manager?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Início</p>
            <p className="font-medium text-foreground">{formatDate(employee.startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Local</p>
            <p className="font-medium text-foreground">{employee.location ?? "—"}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal />
                <span className="sr-only">Ações do colaborador</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>Editar</DropdownMenuItem>
              {canOffboard && (
                <DropdownMenuItem variant="destructive" onSelect={() => setOffboardOpen(true)}>
                  Iniciar desligamento
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <EmployeeFormDialog employee={employee} open={editOpen} onOpenChange={setEditOpen} onSave={() => setVersion((v) => v + 1)} />
      <OffboardEmployeeDialog
        employee={offboardOpen ? employee : null}
        open={offboardOpen}
        onOpenChange={setOffboardOpen}
        onDone={() => setVersion((v) => v + 1)}
      />

      <div className="mb-6 border-b border-border">
        <nav className="-mb-px flex gap-5 overflow-x-auto">
          {TABS.map((tab) => {
            const href = `/modules/people/employees/${employeeId}/${tab.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={tab.slug}
                href={href}
                className={cn(
                  "whitespace-nowrap border-b-2 px-0.5 py-2.5 text-sm font-medium transition-colors",
                  active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </PageContainer>
  );
}
