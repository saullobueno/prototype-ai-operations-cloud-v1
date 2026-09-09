"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { RiskBadge } from "@/components/domain/badges";
import { retentionRisks } from "@/data/mock/retentionRisks";
import { getEmployeeById } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";

const RISK_ORDER = { high: 0, medium: 1, low: 2 };

// Sinal de apoio à decisão do gestor/RH — nunca uma ação automática (ver spec §10).
export default function RetentionRiskPage() {
  const router = useRouter();
  const sorted = [...retentionRisks].sort((a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]);

  return (
    <PageContainer>
      <PageHeader
        title="Risco de retenção"
        description="Sinais do Workforce Insights Agent para apoiar a conversa entre gestor e colaborador — não uma decisão automática."
      />

      {sorted.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="Nenhum sinal de risco no momento" />
      ) : (
        <div className="space-y-3">
          {sorted.map((risk) => {
            const employee = getEmployeeById(risk.employeeId);
            if (!employee) return null;
            const department = getDepartmentById(employee.departmentId);
            return (
              <Card key={risk.employeeId} className="cursor-pointer px-4 py-3.5 transition-colors hover:bg-accent" onClick={() => router.push(`/modules/people/employees/${employee.id}`)}>
                <CardContent className="space-y-2 px-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <EntityAvatar name={employee.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{employee.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {employee.title} · {department?.name}
                        </p>
                      </div>
                    </div>
                    <RiskBadge level={risk.riskLevel} />
                  </div>
                  <ul className="space-y-1 pl-1">
                    {risk.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
