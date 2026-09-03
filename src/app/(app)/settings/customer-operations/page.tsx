"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slas } from "@/data/mock";

export default function CustomerOperationsSettingsPage() {
  const [assignment, setAssignment] = useState("round_robin");
  const [tags, setTags] = useState(["billing", "technical", "vip", "churn-risk"]);
  const [newTag, setNewTag] = useState("");

  function addTag() {
    if (!newTag.trim()) return;
    setTags((prev) => [...prev, newTag.trim()]);
    setNewTag("");
  }

  return (
    <SettingsSection title="Customer Operations" description="Regras de atribuição, SLA, prioridades, status, tags e campos personalizados.">
      <Card>
        <CardHeader><CardTitle className="text-base">Atribuição</CardTitle></CardHeader>
        <CardContent>
          <Select value={assignment} onValueChange={setAssignment}>
            <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="round_robin">Round-robin</SelectItem>
              <SelectItem value="by_team">Por time</SelectItem>
              <SelectItem value="by_skill">Por habilidade</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Políticas de SLA</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {slas.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{s.name}</span>
              <span className="text-muted-foreground">
                {s.firstResponseMinutes}min de primeira resposta · {s.resolutionMinutes / 60}h de resolução
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t} variant="secondary" className="gap-1">
                {t}
                <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))} aria-label={`Remover ${t}`}>
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex max-w-sm gap-2">
            <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Nova tag" onKeyDown={(e) => e.key === "Enter" && addTag()} />
            <Button size="icon" variant="outline" onClick={addTag}><Plus className="size-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => toast.success("Configurações de Customer Operations salvas")}>Salvar alterações</Button>
    </SettingsSection>
  );
}
