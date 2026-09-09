"use client";

import { useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { AIInsightCard } from "@/components/domain/ai-insight-card";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { OnboardingStatusBadge } from "@/features/people/people-badges";
import { employees, getActiveHeadcount } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";
import { onboardings } from "@/data/mock/onboardings";
import { peopleRequests } from "@/data/mock/peopleRequests";
import { formatDate } from "@/lib/format";

export default function PeopleOverviewPage() {
  const router = useRouter();

  const headcount = getActiveHeadcount();
  const activeOnboardings = onboardings.filter((o) => o.status !== "completed");
  const delayedOnboardings = onboardings.filter((o) => o.status === "delayed");
  const openRequests = peopleRequests.filter((r) => r.status === "pending");

  const completed = onboardings.filter((o) => o.status === "completed" && o.completedAt);
  const avgOnboardingDays =
    completed.length > 0
      ? Math.round(completed.reduce((sum, o) => sum + (+new Date(o.completedAt!) - +new Date(o.startedAt)) / (1000 * 60 * 60 * 24), 0) / completed.length)
      : 0;

  const recentHires = [...employees].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate)).slice(0, 5);

  return (
    <PageContainer>
      <PageHeader title="People Operations" description="Ciclo de vida do colaborador, onboarding, performance e força de trabalho em um só lugar." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Headcount ativo" value={String(headcount)} />
        <KPIStatCard label="Onboardings ativos" value={String(activeOnboardings.length)} />
        <KPIStatCard label="Solicitações abertas" value={String(openRequests.length)} />
        <KPIStatCard label="Duração média do onboarding" value={`${avgOnboardingDays} dias`} />
      </div>

      {delayedOnboardings.length > 0 && (
        <div className="mb-6">
          <AIInsightCard
            title={`${delayedOnboardings.length} processo(s) de onboarding precisam de atenção`}
            description="O Employee Onboarding Agent sinalizou etapas bloqueadas ou atrasadas — recomendação para revisão do time de People."
            actionLabel="Ver onboardings"
            onAction={() => router.push("/modules/people/onboarding")}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Contratações recentes</h2>
          <div className="space-y-2">
            {recentHires.map((employee) => {
              const department = getDepartmentById(employee.departmentId);
              return (
                <Card
                  key={employee.id}
                  className="cursor-pointer py-3 transition-colors hover:bg-accent"
                  onClick={() => router.push(`/modules/people/employees/${employee.id}`)}
                >
                  <CardContent className="flex items-center gap-3 px-4">
                    <EntityAvatar name={employee.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {employee.title} · {department?.name}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(employee.startDate)}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Onboardings precisando de atenção</h2>
          <div className="space-y-2">
            {activeOnboardings.length === 0 && (
              <Card className="py-6">
                <CardContent className="text-center text-sm text-muted-foreground">Nenhum onboarding em andamento.</CardContent>
              </Card>
            )}
            {activeOnboardings.map((onboarding) => {
              const employee = employees.find((e) => e.id === onboarding.employeeId);
              if (!employee) return null;
              const doneSteps = onboarding.steps.filter((s) => s.status === "done").length;
              return (
                <Card
                  key={onboarding.id}
                  className="cursor-pointer py-3 transition-colors hover:bg-accent"
                  onClick={() => router.push(`/modules/people/onboarding/${onboarding.id}`)}
                >
                  <CardContent className="flex items-center gap-3 px-4">
                    <EntityAvatar name={employee.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doneSteps}/{onboarding.steps.length} etapas · iniciado em {formatDate(onboarding.startedAt)}
                      </p>
                    </div>
                    <OnboardingStatusBadge status={onboarding.status} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
