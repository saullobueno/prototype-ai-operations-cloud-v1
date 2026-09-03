"use client";

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Plus } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { users } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import { NOW } from "@/lib/time";

export default function SecuritySettingsPage() {
  const [sso, setSso] = useState(true);
  const [mfa, setMfa] = useState(false);
  const [keys, setKeys] = useState<{ id: string; label: string; createdAt: string }[]>([
    { id: "key_1", label: "Chave de API de produção", createdAt: new Date(NOW.getTime() - 30 * 86400000).toISOString() },
  ]);

  function generateKey() {
    const id = `key_${Date.now()}`;
    setKeys((prev) => [{ id, label: `Nova chave de API`, createdAt: new Date().toISOString() }, ...prev]);
    toast.success("Chave de API gerada", { description: "sk_live_" + Math.random().toString(36).slice(2, 18) + " — copie agora, ela não será exibida novamente." });
  }

  return (
    <SettingsSection title="Segurança" description="Autenticação, sessões e chaves de API.">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Sessões ativas</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {users.slice(0, 3).map((u) => (
            <div key={u.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><EntityAvatar name={u.name} size="xs" />{u.name}</span>
              <span className="text-muted-foreground">Ativo {formatRelative(NOW.toISOString())}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Chaves de API</CardTitle>
          <Button size="sm" variant="outline" onClick={generateKey}><Plus /> Gerar chave</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-foreground"><KeyRound className="size-3.5 text-muted-foreground" />{k.label}</span>
              <span className="text-muted-foreground">Criada {formatRelative(k.createdAt)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
