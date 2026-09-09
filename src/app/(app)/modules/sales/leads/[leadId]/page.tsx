"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { ICPBadge, StatusBadge } from "@/components/domain/badges";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LeadFormDialog } from "@/features/sales/lead-form-dialog";
import { addAccount, addDeal, deleteLead, getLeadById, getUserById, updateLead } from "@/data/mock";
import type { Account, Deal } from "@/types";

export default function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = use(params);
  const router = useRouter();
  const [, setVersion] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const lead = getLeadById(leadId);

  if (!lead) notFound();

  const owner = lead.ownerId ? getUserById(lead.ownerId) : undefined;

  function handleDelete() {
    if (!lead) return;
    deleteLead(lead.id);
    toast.success("Lead excluído", { description: `${lead.name} foi removido.` });
    router.push("/modules/sales/leads");
  }

  function handleConvert() {
    if (!lead || lead.status === "converted") return;

    const accountId = `acc_${Date.now()}`;
    const newAccount: Account = {
      id: accountId,
      name: lead.company,
      domain: lead.email.split("@")[1] ?? "",
      industry: "Não classificado",
      icpFitScore: lead.icpFit === "ideal" ? 90 : lead.icpFit === "good" ? 70 : 40,
      icpTier: lead.icpFit,
      ownerId: lead.ownerId ?? "usr_diego",
      status: "qualifying",
      enrichedAt: new Date().toISOString(),
      tags: [],
      createdAt: new Date().toISOString(),
    };
    addAccount(newAccount);

    const newDeal: Deal = {
      id: `deal_${Date.now()}`,
      name: `${lead.company} — Oportunidade inicial`,
      accountId,
      stageId: "stage_qualification",
      amountCents: 0,
      probability: 10,
      expectedCloseDate: new Date().toISOString(),
      ownerId: lead.ownerId ?? "usr_diego",
      status: "open",
      riskLevel: "low",
      riskReasons: [],
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    addDeal(newDeal);

    updateLead(lead.id, { status: "converted", accountId });
    toast.success("Lead convertido em Account", { description: `${lead.company} agora é um Account com um deal inicial.` });
    router.push(`/modules/sales/accounts/${accountId}`);
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <EntityAvatar name={lead.name} size="lg" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{lead.name}</h1>
            <p className="text-sm text-muted-foreground">
              {lead.title ? `${lead.title} · ` : ""}
              {lead.company} · {lead.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lead.status !== "converted" && lead.status !== "disqualified" && (
            <Button onClick={handleConvert}>Qualificar e converter em Account/Deal</Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal />
                <span className="sr-only">Ações do lead</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>Editar</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDeleteOpen(true)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Lead score</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{lead.leadScore}/100</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">ICP fit</p>
            <div className="mt-1.5">
              <ICPBadge tier={lead.icpFit} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Status</p>
            <div className="mt-1.5">
              <StatusBadge status={lead.status} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="pt-4">
          <p className="mb-2 text-sm font-medium text-foreground">Por que este score</p>
          <ul className="space-y-1.5">
            {lead.scoreReasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm">
          <div>
            <span className="text-muted-foreground">Fonte: </span>
            <span className="font-medium text-foreground capitalize">{lead.source}</span>
          </div>
          {owner && (
            <div>
              <span className="text-muted-foreground">Dono: </span>
              <span className="font-medium text-foreground">{owner.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <LeadFormDialog lead={lead} open={editOpen} onOpenChange={setEditOpen} onSave={() => setVersion((v) => v + 1)} />

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir lead?</DialogTitle>
            <DialogDescription>
              &ldquo;{lead.name}&rdquo; será removido permanentemente. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
