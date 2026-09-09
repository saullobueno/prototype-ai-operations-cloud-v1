"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Moon, Sun, SunMoon } from "lucide-react";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const THEME_OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: SunMoon },
];

export default function AccountPreferencesPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("pt-BR");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <SettingsSection title="Preferências" description="Tema e idioma usados apenas na sua conta.">
      <Card>
        <CardHeader><CardTitle className="text-base">Tema</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                  mounted && theme === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <opt.icon className="size-3.5" /> {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Idioma</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label>Idioma da interface</Label>
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
          <Button onClick={() => toast.success("Preferências salvas")}>Salvar alterações</Button>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
