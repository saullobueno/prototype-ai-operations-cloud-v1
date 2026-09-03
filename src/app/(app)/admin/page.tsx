import { SettingsSection } from "@/components/layout/settings-section";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { customers, workflows, agents, integrations, getPendingApprovals } from "@/data/mock";

export default function AdminOverviewPage() {
  return (
    <SettingsSection title="Visão geral" description="Status geral da conta ACME Cloud.">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIStatCard label="Clientes" value={customers.length.toLocaleString("pt-BR")} />
        <KPIStatCard label="Agentes de IA ativos" value={String(agents.filter((a) => a.status === "active").length)} />
        <KPIStatCard label="Workflows" value={String(workflows.length)} />
        <KPIStatCard label="Integrações conectadas" value={String(integrations.filter((i) => i.status === "connected").length)} />
        <KPIStatCard label="Aprovações pendentes" value={String(getPendingApprovals().length)} />
        <KPIStatCard label="Plano" value="Business" />
        <KPIStatCard label="Status do sistema" value="Operacional" />
        <KPIStatCard label="Violações de guardrail (30d)" value="0" />
      </div>
    </SettingsSection>
  );
}
