import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { agents } from "@/data/mock";

const usageByAgent = agents.map((a, i) => ({ agent: a.name, runs: 120 + i * 47 }));

export default function AdminUsagePage() {
  return (
    <SettingsSection title="Uso" description="Consumo de IA entre agentes e times.">
      <Card>
        <CardHeader><CardTitle className="text-base">Execuções por agente (últimos 7 dias)</CardTitle></CardHeader>
        <CardContent>
          <SimpleBarChart data={usageByAgent} xKey="agent" yKey="runs" horizontal height={280} colorIndex={4} />
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
