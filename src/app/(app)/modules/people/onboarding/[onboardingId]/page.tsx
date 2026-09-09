"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { HealthMeterRow } from "@/components/domain/health-meter";
import { OnboardingStatusBadge } from "@/features/people/people-badges";
import { OnboardingStepsList } from "@/features/people/onboarding-steps";
import { onboardings } from "@/data/mock/onboardings";
import { getEmployeeById } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";
import { formatDate } from "@/lib/format";

export default function OnboardingDetailPage({ params }: { params: Promise<{ onboardingId: string }> }) {
  const { onboardingId } = use(params);
  const onboarding = onboardings.find((o) => o.id === onboardingId);

  if (!onboarding) notFound();

  const employee = getEmployeeById(onboarding.employeeId);
  const department = employee ? getDepartmentById(employee.departmentId) : undefined;
  const done = onboarding.steps.filter((s) => s.status === "done").length;

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {employee && <EntityAvatar name={employee.name} size="lg" />}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Onboarding — {employee?.name ?? onboarding.employeeId}</h1>
              <OnboardingStatusBadge status={onboarding.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {employee?.title} · {department?.name}
            </p>
          </div>
        </div>
        {employee && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/modules/people/employees/${employee.id}`}>Ver perfil do colaborador</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Etapas do workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingStepsList steps={onboarding.steps} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <HealthMeterRow label="Progresso" value={Math.round((done / onboarding.steps.length) * 100)} tone={onboarding.status === "delayed" ? "danger" : "default"} />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Iniciado em</span>
              <span className="font-medium text-foreground">{formatDate(onboarding.startedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Concluído em</span>
              <span className="font-medium text-foreground">{onboarding.completedAt ? formatDate(onboarding.completedAt) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Etapas concluídas</span>
              <span className="font-medium text-foreground">
                {done}/{onboarding.steps.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
