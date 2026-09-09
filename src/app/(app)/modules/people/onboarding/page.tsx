"use client";

import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OnboardingStatusBadge } from "@/features/people/people-badges";
import { onboardings } from "@/data/mock/onboardings";
import { getEmployeeById } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";
import { formatDate } from "@/lib/format";

type FilterTab = "all" | "in_progress" | "delayed" | "completed";

export default function OnboardingPage() {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    const list = tab === "all" ? onboardings : onboardings.filter((o) => o.status === tab);
    return [...list].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
  }, [tab]);

  return (
    <PageContainer>
      <PageHeader title="Onboarding" description={`${onboardings.length} processos de onboarding registrados`} />

      <div className="mb-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="in_progress">Em andamento</TabsTrigger>
            <TabsTrigger value="delayed">Atrasados</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserPlus} title="Nenhum onboarding corresponde ao filtro" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Iniciado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((onboarding) => {
                const employee = getEmployeeById(onboarding.employeeId);
                if (!employee) return null;
                const department = getDepartmentById(employee.departmentId);
                const done = onboarding.steps.filter((s) => s.status === "done").length;
                return (
                  <ClickableTableRow key={onboarding.id} href={`/modules/people/onboarding/${onboarding.id}`}>
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
                    <TableCell className="text-muted-foreground">
                      {done}/{onboarding.steps.length} etapas
                    </TableCell>
                    <TableCell>
                      <OnboardingStatusBadge status={onboarding.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(onboarding.startedAt)}</TableCell>
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
