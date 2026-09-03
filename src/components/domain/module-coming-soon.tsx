"use client";

import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ModuleComingSoonProps {
  icon: LucideIcon;
  name: string;
  areas: string[];
}

export function ModuleComingSoon({ icon: Icon, name, areas }: ModuleComingSoonProps) {
  return (
    <PageContainer>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-lg">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">{name}</h1>
                <Badge variant="outline">Em breve</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{areas.join(" · ")}</p>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Este módulo vai compartilhar os mesmos Customers, Events, Agents e Workflows que você já usa em Customer Operations.
            </p>
            <Button variant="outline" onClick={() => toast("Obrigado, vamos avisar quando estiver disponível.")}>
              Avisar quando disponível
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
