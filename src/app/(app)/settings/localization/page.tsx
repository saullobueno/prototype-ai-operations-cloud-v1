"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LocalizationSettingsPage() {
  const [language, setLanguage] = useState("pt-BR");
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy");
  const [currency, setCurrency] = useState("EUR");

  return (
    <SettingsSection title="Localização" description="Idioma, formato de data e moeda para este workspace.">
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="grid gap-1.5">
            <Label>Idioma</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Formato de data</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                <SelectItem value="MMM d, yyyy">MMM d, yyyy</SelectItem>
                <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Moeda</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="BRL">BRL (R$)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toast.success("Localização salva")}>Salvar alterações</Button>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
