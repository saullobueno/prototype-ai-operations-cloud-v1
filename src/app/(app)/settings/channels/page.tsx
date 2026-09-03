"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { channels as initialChannels } from "@/data/mock";

export default function ChannelsSettingsPage() {
  const [channels, setChannels] = useState(initialChannels);

  function toggle(id: string) {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c))
    );
    toast.success("Canal atualizado");
  }

  return (
    <SettingsSection title="Canais" description="Por onde seus clientes podem falar com você.">
      <Card>
        <CardContent className="space-y-1 pt-4">
          {channels.map((c) => (
            <label key={c.id} className="flex items-center justify-between border-b border-border py-3 text-sm last:border-0">
              <span className="text-foreground">{c.name}</span>
              <Switch checked={c.status === "active"} onCheckedChange={() => toggle(c.id)} />
            </label>
          ))}
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
