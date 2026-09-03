"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const COLORS = ["#2a78d6", "#4a3aa7", "#1baf7a", "#e34948", "#eda100"];

export default function BrandingSettingsPage() {
  const [color, setColor] = useState(COLORS[0]);

  return (
    <SettingsSection title="Identidade visual" description="Personalize a aparência do seu workspace para o time.">
      <Card>
        <CardContent className="space-y-5 pt-4">
          <div className="grid gap-1.5">
            <Label>Logo</Label>
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">Logo</div>
              <Button variant="outline" size="sm" onClick={() => toast("O upload de logo não está disponível neste protótipo.")}>Enviar</Button>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Cor primária</Label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="size-8 rounded-full border-2 transition-transform hover:scale-105"
                  style={{ backgroundColor: c, borderColor: c === color ? "var(--foreground)" : "transparent" }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="mb-2 text-xs text-muted-foreground">Prévia</p>
            <Button style={{ backgroundColor: color }} className="text-white hover:opacity-90">Ação primária</Button>
          </div>
          <Button onClick={() => toast.success("Identidade visual salva")}>Salvar alterações</Button>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
