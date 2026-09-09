"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Laptop, Smartphone } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const MY_SESSIONS = [
  { id: "session_current", device: "Windows · Chrome", icon: Laptop, location: "São Paulo, BR", current: true },
  { id: "session_mobile", device: "iPhone 15 · App", icon: Smartphone, location: "São Paulo, BR", current: false },
];

export default function AccountSecurityPage() {
  const [mfa, setMfa] = useState(false);

  return (
    <SettingsSection title="Segurança" description="Senha, autenticação de dois fatores e sessões da sua conta.">
      <Card>
        <CardHeader><CardTitle className="text-base">Senha</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label>Senha atual</Label>
            <Input type="password" className="max-w-sm" placeholder="••••••••" />
          </div>
          <div className="grid gap-1.5">
            <Label>Nova senha</Label>
            <Input type="password" className="max-w-sm" placeholder="••••••••" />
          </div>
          <div className="grid gap-1.5">
            <Label>Confirmar nova senha</Label>
            <Input type="password" className="max-w-sm" placeholder="••••••••" />
          </div>
          <Button onClick={() => toast.success("Senha atualizada")}>Atualizar senha</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Autenticação de dois fatores</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Exigir um código adicional ao entrar na sua conta</span>
            <Switch checked={mfa} onCheckedChange={setMfa} />
          </label>
          {mfa && (
            <Button size="sm" variant="outline" onClick={() => toast("Códigos de recuperação não estão disponíveis neste protótipo.")}>
              Gerar códigos de recuperação
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Sessões ativas</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success("Você saiu de todos os outros dispositivos")}>
            Sair de todos os dispositivos
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {MY_SESSIONS.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-foreground">
                <s.icon className="size-3.5 text-muted-foreground" />
                {s.device} — {s.location}
              </span>
              <span className="text-muted-foreground">{s.current ? "Este dispositivo" : "Ativo"}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
