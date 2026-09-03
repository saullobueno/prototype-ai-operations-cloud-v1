"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organization, workspaces } from "@/data/mock";

export default function GeneralSettingsPage() {
  const [name, setName] = useState(workspaces[0].name);
  const [timezone, setTimezone] = useState("Europe/Lisbon");

  return (
    <SettingsSection title="Geral" description="Informações básicas sobre o seu workspace.">
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="grid gap-1.5">
            <Label>Nome do workspace</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label>Domínio</Label>
            <Input value={organization.domain} disabled className="max-w-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label>Fuso horário</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Lisbon">Europe/Lisbon</SelectItem>
                <SelectItem value="Europe/London">Europe/London</SelectItem>
                <SelectItem value="America/New_York">America/New York</SelectItem>
                <SelectItem value="America/Sao_Paulo">America/São Paulo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toast.success("Configurações salvas")}>Salvar alterações</Button>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
