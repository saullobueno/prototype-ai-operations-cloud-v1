"use client";

import { useRouter } from "next/navigation";
import { Users2 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { employees, getEmployeesByManager } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";

// "Times" aqui = gestor + liderados diretos (a entidade `Team` core, em src/data/mock/teams.ts, é
// sobre squads de suporte/produto ligadas a `User`, não a `Employee` — não serve para organograma
// de RH). Cada colaborador que tem pelo menos um liderado direto vira um "time".
export default function PeopleTeamsPage() {
  const router = useRouter();
  const managers = employees.filter((e) => getEmployeesByManager(e.id).length > 0);

  return (
    <PageContainer>
      <PageHeader title="Times" description={`${managers.length} times organizados por gestor direto`} />

      {managers.length === 0 ? (
        <EmptyState icon={Users2} title="Nenhum time encontrado" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {managers.map((manager) => {
            const reports = getEmployeesByManager(manager.id);
            const department = getDepartmentById(manager.departmentId);
            return (
              <Card key={manager.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-base">
                    <EntityAvatar name={manager.name} size="sm" />
                    <div>
                      <p>{manager.name}</p>
                      <p className="text-xs font-normal text-muted-foreground">
                        {manager.title} · {department?.name}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{reports.length} liderados</p>
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-accent"
                      onClick={() => router.push(`/modules/people/employees/${r.id}`)}
                    >
                      <EntityAvatar name={r.name} size="xs" />
                      <div className="min-w-0">
                        <p className="truncate text-sm text-foreground">{r.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{r.title}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
