import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { organization } from "@/data/mock";
import { formatDate } from "@/lib/format";

export default function AdminOrganizationsPage() {
  return (
    <SettingsSection title="Organizações" description="Este protótipo suporta uma única organização — a arquitetura já está pronta para contas multi-organização no futuro.">
      <Card>
        <CardContent className="flex items-center justify-between pt-4">
          <div>
            <p className="font-medium text-foreground">{organization.name}</p>
            <p className="text-sm text-muted-foreground">{organization.domain} · Criada em {formatDate(organization.createdAt)}</p>
          </div>
          <Badge className="capitalize">{organization.plan}</Badge>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
