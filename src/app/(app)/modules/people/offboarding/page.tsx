"use client";

import { UserMinus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { StatusBadge } from "@/components/domain/badges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { offboardings } from "@/data/mock/offboardings";
import { getEmployeeById } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";
import { formatDate } from "@/lib/format";

export default function OffboardingPage() {
  const sorted = [...offboardings].sort((a, b) => +new Date(b.lastDay) - +new Date(a.lastDay));

  return (
    <PageContainer>
      <PageHeader title="Offboarding" description={`${offboardings.length} processos de desligamento registrados`} />

      {sorted.length === 0 ? (
        <EmptyState icon={UserMinus} title="Nenhum offboarding registrado" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último dia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((offboarding) => {
                const employee = getEmployeeById(offboarding.employeeId);
                if (!employee) return null;
                const department = getDepartmentById(employee.departmentId);
                return (
                  <ClickableTableRow key={offboarding.id} href={`/modules/people/employees/${employee.id}`}>
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
                    <TableCell>
                      <StatusBadge status={offboarding.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(offboarding.lastDay)}</TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
