"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AutonomyBadge } from "@/components/domain/badges";
import { knowledgeSources, policies, tools } from "@/data/mock";
import type { Agent, AutonomyLevel } from "@/types";
import { cn } from "@/lib/utils";

const STEPS = ["Identity", "Goal", "Personality", "Knowledge", "Tools", "Policies", "Review"] as const;

const STEP_LABEL: Record<(typeof STEPS)[number], string> = {
  Identity: "Identidade",
  Goal: "Objetivo",
  Personality: "Personalidade",
  Knowledge: "Conhecimento",
  Tools: "Ferramentas",
  Policies: "Políticas",
  Review: "Revisão",
};

const PERSONALITY_OPTIONS = ["Profissional", "Amigável", "Conciso", "Descontraído", "Formal", "Empático", "Analítico"];

const AUTONOMY_OPTIONS: { value: AutonomyLevel; label: string; description: string }[] = [
  { value: "autonomous", label: "Autônomo", description: "Executa ações sozinho, dentro das políticas configuradas." },
  { value: "assisted", label: "Assistido", description: "Sugere ações e um humano confirma antes de executar." },
  { value: "approval_required", label: "Aprovação humana", description: "Ações sensíveis (ex.: reembolsos) exigem aprovação antes de executar." },
  { value: "human_only", label: "Somente humano", description: "Não executa ações — apenas apoia um atendente humano." },
];

const HIGH_RISK_TOOL_IDS = tools.filter((t) => t.riskLevel === "high").map((t) => t.id);

interface AgentFormState {
  name: string;
  description: string;
  goal: string;
  personality: string[];
  knowledgeSourceIds: string[];
  toolIds: string[];
  policyIds: string[];
  autonomyLevel: AutonomyLevel;
}

function toFormState(agent?: Agent): AgentFormState {
  return {
    name: agent?.name ?? "",
    description: agent?.description ?? "",
    goal: agent?.goal ?? "",
    personality: agent?.personality ?? [],
    knowledgeSourceIds: agent?.knowledgeSourceIds ?? [],
    toolIds: agent?.toolIds ?? [],
    policyIds: agent?.policyIds ?? [],
    autonomyLevel: agent?.autonomyLevel ?? "assisted",
  };
}

export function AgentBuilder({ agent }: { agent?: Agent }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AgentFormState>(() => toFormState(agent));

  function toggle<K extends "personality" | "knowledgeSourceIds" | "toolIds" | "policyIds">(key: K, value: string) {
    setForm((prev) => {
      const list = prev[key];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  }

  function toggleTool(toolId: string) {
    const isHighRisk = HIGH_RISK_TOOL_IDS.includes(toolId);
    const enabling = !form.toolIds.includes(toolId);
    if (isHighRisk && enabling && form.policyIds.length === 0) {
      toast.warning("Esta ação exige uma política de aprovação antes de poder ser habilitada.");
      return;
    }
    toggle("toolIds", toolId);
  }

  function submit() {
    toast.success(agent ? `${form.name} atualizado` : `${form.name} criado`, {
      description: "Este protótipo não persiste agentes após recarregar a página.",
    });
    router.push(agent ? `/ai/agents/${agent.id}` : "/ai/agents");
  }

  const current = STEPS[step];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
      <Card>
        <CardContent className="space-y-5 pt-5">
          {current === "Identity" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="ex: Support Agent" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </div>
            </div>
          )}

          {current === "Goal" && (
            <div className="space-y-1.5">
              <Label htmlFor="goal">O que este agente deve alcançar?</Label>
              <Textarea id="goal" value={form.goal} onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))} rows={3} placeholder="Resolver solicitações de suporte ao cliente" />
            </div>
          )}

          {current === "Personality" && (
            <div className="flex flex-wrap gap-2">
              {PERSONALITY_OPTIONS.map((p) => {
                const checked = form.personality.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggle("personality", p)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      checked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          )}

          {current === "Knowledge" && (
            <div className="space-y-2">
              {knowledgeSources.map((k) => (
                <label key={k.id} className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm">
                  <Checkbox checked={form.knowledgeSourceIds.includes(k.id)} onCheckedChange={() => toggle("knowledgeSourceIds", k.id)} />
                  {k.name}
                </label>
              ))}
            </div>
          )}

          {current === "Tools" && (
            <div className="space-y-2">
              {tools.map((t) => {
                const isHighRisk = t.riskLevel === "high";
                return (
                  <label key={t.id} className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm">
                    <Checkbox checked={form.toolIds.includes(t.id)} onCheckedChange={() => toggleTool(t.id)} />
                    <span className="flex-1">{t.name}</span>
                    {isHighRisk && (
                      <span className="flex items-center gap-1 text-xs text-warning">
                        <AlertTriangle className="size-3" /> requer política
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {current === "Policies" && (
            <div className="space-y-5">
              <div className="space-y-2">
                {policies.map((p) => (
                  <label key={p.id} className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm">
                    <Checkbox checked={form.policyIds.includes(p.id)} onCheckedChange={() => toggle("policyIds", p.id)} />
                    {p.name}
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Nível de autonomia</Label>
                <RadioGroup
                  value={form.autonomyLevel}
                  onValueChange={(v) => setForm((p) => ({ ...p, autonomyLevel: v as AutonomyLevel }))}
                >
                  {AUTONOMY_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-start gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm">
                      <RadioGroupItem value={opt.value} className="mt-0.5" />
                      <span>
                        <span className="block font-medium text-foreground">{opt.label}</span>
                        <span className="block text-xs text-muted-foreground">{opt.description}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {current === "Review" && (
            <div className="space-y-3 text-sm">
              {STEPS.slice(0, -1).map((s, i) => (
                <button key={s} onClick={() => setStep(i)} className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left transition-colors hover:bg-accent">
                  <span className="text-muted-foreground">{STEP_LABEL[s]}</span>
                  <span className="font-medium text-foreground">
                    {s === "Identity" && (form.name || "—")}
                    {s === "Goal" && (form.goal ? "Definido" : "—")}
                    {s === "Personality" && `${form.personality.length} selecionadas`}
                    {s === "Knowledge" && `${form.knowledgeSourceIds.length} fontes`}
                    {s === "Tools" && `${form.toolIds.length} ferramentas`}
                    {s === "Policies" && `${form.policyIds.length} políticas`}
                  </span>
                </button>
              ))}
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-muted-foreground">Autonomia</span>
                <AutonomyBadge level={form.autonomyLevel} />
              </div>
            </div>
          )}

          <div className="flex justify-between border-t border-border pt-4">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Voltar
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Próximo</Button>
            ) : (
              <Button onClick={submit} disabled={!form.name.trim()}>
                {agent ? "Salvar alterações" : "Criar agente"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-1.5">
        <div className="mb-2 flex items-center justify-between rounded-md border border-border bg-muted/40 px-2.5 py-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Autonomia</span>
          <AutonomyBadge level={form.autonomyLevel} />
        </div>
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
              i === step ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-accent"
            )}
          >
            <span className={cn("flex size-4 items-center justify-center rounded-full border text-[10px]", i < step ? "border-success bg-success text-success-foreground" : i === step ? "border-primary text-primary" : "border-border")}>
              {i < step ? <Check className="size-3" /> : i + 1}
            </span>
            {STEP_LABEL[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
