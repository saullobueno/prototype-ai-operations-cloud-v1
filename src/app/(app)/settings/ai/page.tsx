"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PolicyRuleRow } from "@/components/domain/policy-rule-row";
import { policies } from "@/data/mock";

const MODELS = [
  { name: "Fast", description: "Baixa latência, ideal para triagem e respostas simples.", costPerK: "€0,02" },
  { name: "Balanced", description: "Modelo padrão para a maioria dos agentes.", costPerK: "€0,06" },
  { name: "Advanced", description: "Melhor raciocínio, usado para escalonamentos complexos.", costPerK: "€0,18" },
];

export default function AISettingsPage() {
  const [guardrails, setGuardrails] = useState({
    largeRefunds: true,
    accountDeletion: true,
    autoKnowledgeEdits: false,
  });

  return (
    <SettingsSection title="IA" description="Modelos, políticas de agentes, guardrails, uso e custos.">
      <Card>
        <CardHeader><CardTitle className="text-base">Modelos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {MODELS.map((m) => (
            <div key={m.name} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <div>
                <p className="font-medium text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
              <span className="text-muted-foreground">{m.costPerK} / 1K tokens</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Agentes</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link href="/ai/agents">Gerenciar agentes →</Link></Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Políticas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {policies.map((p) => (
            <div key={p.id}>
              <p className="mb-1.5 text-sm font-medium text-foreground">{p.name}</p>
              <div className="space-y-1">
                {p.rules.map((r) => (
                  <PolicyRuleRow key={r.id} rule={r} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Guardrails</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Exigir aprovação humana para qualquer reembolso acima de €500</span>
            <Switch checked={guardrails.largeRefunds} onCheckedChange={(v) => setGuardrails((p) => ({ ...p, largeRefunds: v }))} />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Nunca permitir que a IA exclua dados de clientes</span>
            <Switch checked={guardrails.accountDeletion} onCheckedChange={(v) => setGuardrails((p) => ({ ...p, accountDeletion: v }))} />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-foreground">Permitir que a IA publique edições de conhecimento automaticamente</span>
            <Switch checked={guardrails.autoKnowledgeEdits} onCheckedChange={(v) => setGuardrails((p) => ({ ...p, autoKnowledgeEdits: v }))} />
          </label>
        </CardContent>
      </Card>

      <Button onClick={() => toast.success("Configurações de IA salvas")}>Salvar alterações</Button>
    </SettingsSection>
  );
}
