"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plug, Search } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/domain/badges";
import { EmptyState } from "@/components/domain/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { integrations as initialIntegrations } from "@/data/mock";

const CATEGORIES = ["all", "crm", "erp", "payments", "analytics", "storage", "communication"];

const CATEGORY_LABEL: Record<string, string> = {
  all: "Todas as categorias",
  crm: "CRM",
  erp: "ERP",
  payments: "Pagamentos",
  analytics: "Analytics",
  storage: "Armazenamento",
  communication: "Comunicação",
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = integrations;
    if (category !== "all") list = list.filter((i) => i.category === category);
    if (query.trim()) list = list.filter((i) => i.name.toLowerCase().includes(query.trim().toLowerCase()));
    return list;
  }, [integrations, category, query]);

  function connect(id: string) {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, status: "connected", connectedAt: new Date().toISOString() } : i)));
    toast.success("Integração conectada");
  }

  return (
    <PageContainer>
      <PageHeader title="Integrações" description={`${integrations.filter((i) => i.status === "connected").length} conectadas de ${integrations.length}`} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger size="sm" className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{CATEGORY_LABEL[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar integrações..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Plug} title="Nenhuma integração corresponde aos filtros" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((i) => (
            <Card key={i.id}>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Plug className="size-4" />
                  </div>
                  <StatusBadge status={i.status} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{i.name}</p>
                  <p className="text-xs uppercase text-muted-foreground">{CATEGORY_LABEL[i.category]}</p>
                </div>
                {i.status !== "connected" && (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => connect(i.id)}>Conectar</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
