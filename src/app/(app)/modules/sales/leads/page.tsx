"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search, Target } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { ICPBadge, StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeadFormDialog } from "@/features/sales/lead-form-dialog";
import { leads } from "@/data/mock";
import type { Lead, LeadStatus } from "@/types";

type FilterTab = "all" | LeadStatus;

const SOURCE_LABEL: Record<Lead["source"], string> = {
  website: "Website",
  referral: "Indicação",
  outbound: "Outbound",
  event: "Evento",
  import: "Importação",
  partner: "Parceiro",
};

function scoreColor(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-muted-foreground";
}

export default function LeadsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    let list = leads;
    if (tab !== "all") list = list.filter((l) => l.status === tab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => b.leadScore - a.leadScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  return (
    <PageContainer>
      <PageHeader
        title="Leads"
        description={`${leads.length} leads no funil`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo lead
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="new">Novos</TabsTrigger>
            <TabsTrigger value="contacted">Contatados</TabsTrigger>
            <TabsTrigger value="qualified">Qualificados</TabsTrigger>
            <TabsTrigger value="disqualified">Desqualificados</TabsTrigger>
            <TabsTrigger value="converted">Convertidos</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar leads..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Target} title="Nenhum lead corresponde aos filtros" description="Tente ajustar sua busca ou filtros." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>ICP fit</TableHead>
                <TableHead>Lead score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <ClickableTableRow key={lead.id} href={`/modules/sales/leads/${lead.id}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                  <TableCell className="text-muted-foreground">{SOURCE_LABEL[lead.source]}</TableCell>
                  <TableCell>
                    <ICPBadge tier={lead.icpFit} />
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${scoreColor(lead.leadScore)}`}>{lead.leadScore}</span>
                    <span className="text-muted-foreground">/100</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreHorizontal />
                          <span className="sr-only">Ações do lead</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditLead(lead)}>Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <LeadFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <LeadFormDialog
        lead={editLead ?? undefined}
        open={editLead !== null}
        onOpenChange={(next) => {
          if (!next) setEditLead(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />
    </PageContainer>
  );
}
