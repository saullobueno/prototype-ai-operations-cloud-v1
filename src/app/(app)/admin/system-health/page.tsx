import { CheckCircle2 } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent } from "@/components/ui/card";

const SERVICES = [
  { name: "API", status: "operational" },
  { name: "Motor de Workflows", status: "operational" },
  { name: "AI Runtime", status: "operational" },
  { name: "Integrações", status: "operational" },
  { name: "Busca de Conhecimento", status: "operational" },
  { name: "Notificações", status: "degraded" },
];

const STATUS_COLOR: Record<string, string> = {
  operational: "text-success",
  degraded: "text-warning",
  outage: "text-danger",
};

const STATUS_LABEL: Record<string, string> = {
  operational: "Operacional",
  degraded: "Degradado",
  outage: "Fora do ar",
};

export default function SystemHealthPage() {
  return (
    <SettingsSection title="Status do sistema" description="Status ao vivo dos serviços internos (ilustrativo).">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <Card key={s.name}>
            <CardContent className="flex items-center justify-between pt-4">
              <span className="text-sm font-medium text-foreground">{s.name}</span>
              <span className={`flex items-center gap-1.5 text-sm ${STATUS_COLOR[s.status]}`}>
                <CheckCircle2 className="size-3.5" /> {STATUS_LABEL[s.status]}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </SettingsSection>
  );
}
