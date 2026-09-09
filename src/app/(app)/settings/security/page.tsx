"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SecuritySettingsPage() {
  const [sso, setSso] = useState(true);
  const [mfa, setMfa] = useState(false);

  return (
    <SettingsSection title="Segurança" description="Regras de autenticação aplicadas a todos os usuários da plataforma.">
      <Card>
        <CardHeader><CardTitle className="text-base">Autenticação</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Exigir SSO para todos os usuários</span>
            <Switch checked={sso} onCheckedChange={setSso} />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Exigir autenticação multifator</span>
            <Switch checked={mfa} onCheckedChange={setMfa} />
          </label>
          <Button onClick={() => toast.success("Políticas de segurança salvas")}>Salvar alterações</Button>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
