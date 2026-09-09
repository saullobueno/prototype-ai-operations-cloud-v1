"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { PolicyRuleRow } from "@/components/domain/policy-rule-row";
import { RiskBadge } from "@/components/domain/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { businessPolicies } from "@/data/mock/businessPolicies";
import { businessAuditLogs } from "@/data/mock/businessAuditLogs";
import { getOpenExceptions } from "@/data/mock/processExceptions";
import { sops } from "@/data/mock/sops";
import { getProcessById } from "@/data/mock/processes";
import { getUserById } from "@/data/mock";
import { formatDateTime, formatRelative } from "@/lib/format";

const ACTOR_LABEL: Record<string, string> = { human: "Humano", agent: "IA", system: "Sistema" };

export default function BusinessCompliancePage() {
  const openExceptions = getOpenExceptions();
  const highSeverityOpen = openExceptions.filter((e) => e.severity === "high").length;
  const logs = [...businessAuditLogs].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <PageContainer>
      <PageHeader title="Compliance" description="Políticas, SOPs e trilha de auditoria relevantes para compliance em Business Operations." />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <KPIStatCard label="Exceções abertas" value={String(openExceptions.length)} />
        <KPIStatCard label="Severidade alta" value={String(highSeverityOpen)} />
        <KPIStatCard label="SOPs publicadas" value={String(sops.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Políticas de governança</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {businessPolicies.map((p) => (
                <div key={p.id}>
                  <p className="mb-1.5 text-sm font-medium text-foreground">{p.name}</p>
                  <div className="space-y-1">
                    {p.rules.map((r) => <PolicyRuleRow key={r.id} rule={r} />)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Exceções abertas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {openExceptions.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma exceção aberta.</p>}
              {openExceptions.map((e) => {
                const process = getProcessById(e.processId);
                return (
                  <div key={e.id} className="flex items-start justify-between gap-3 rounded-md bg-muted/50 px-3 py-2 text-sm">
                    <div>
                      <p className="text-foreground">{e.reason}</p>
                      <p className="text-xs text-muted-foreground">{process?.name} · {formatRelative(e.createdAt)}</p>
                    </div>
                    <RiskBadge level={e.severity} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">SOPs por processo</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {sops.map((s) => (
                <div key={s.id} className="text-sm">
                  <p className="font-medium text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">Atualizado {formatRelative(s.updatedAt)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Trilha de auditoria</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {logs.map((log) => {
                const actor = log.actorType === "human" ? getUserById(log.actorId)?.name ?? log.actorId : log.actorId;
                return (
                  <div key={log.id} className="flex items-center justify-between gap-3 text-sm">
                    <p className="text-foreground">
                      <span className="text-muted-foreground">[{ACTOR_LABEL[log.actorType]}] </span>
                      {actor} — {log.action.replace(/_/g, " ")}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
