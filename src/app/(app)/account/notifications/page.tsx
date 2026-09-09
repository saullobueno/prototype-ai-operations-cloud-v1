"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function AccountNotificationsPage() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [digest, setDigest] = useState(false);
  const [mentions, setMentions] = useState(true);

  return (
    <SettingsSection title="Notificações" description="Como você quer ser avisado sobre o que acontece na plataforma.">
      <Card>
        <CardHeader><CardTitle className="text-base">Minhas notificações</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Notificações por email</span>
            <Switch checked={email} onCheckedChange={setEmail} />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Notificações push no navegador</span>
            <Switch checked={push} onCheckedChange={setPush} />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Resumo diário por email</span>
            <Switch checked={digest} onCheckedChange={setDigest} />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Menções e atribuições diretas a mim</span>
            <Switch checked={mentions} onCheckedChange={setMentions} />
          </label>
          <Button onClick={() => toast.success("Preferências de notificação salvas")}>Salvar alterações</Button>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
