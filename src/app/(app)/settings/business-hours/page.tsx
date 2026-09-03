"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DAYS = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

export default function BusinessHoursSettingsPage() {
  const [hours, setHours] = useState(
    DAYS.map((day, i) => ({ day, enabled: i < 5, from: "09:00", to: "18:00" }))
  );

  function update(i: number, patch: Partial<(typeof hours)[number]>) {
    setHours((prev) => prev.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  }

  return (
    <SettingsSection title="Horário de atendimento" description="Defina quando seu time está disponível — usado para SLA e roteamento.">
      <Card>
        <CardContent className="space-y-2 pt-4">
          {hours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-4 border-b border-border py-2 last:border-0">
              <Switch checked={h.enabled} onCheckedChange={(v) => update(i, { enabled: v })} />
              <span className="w-28 text-sm text-foreground">{h.day}</span>
              {h.enabled ? (
                <div className="flex items-center gap-2">
                  <Input type="time" value={h.from} onChange={(e) => update(i, { from: e.target.value })} className="h-8 w-28" />
                  <span className="text-muted-foreground">até</span>
                  <Input type="time" value={h.to} onChange={(e) => update(i, { to: e.target.value })} className="h-8 w-28" />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Fechado</span>
              )}
            </div>
          ))}
          <Button className="mt-2" onClick={() => toast.success("Horário de atendimento salvo")}>Salvar alterações</Button>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
