"use client";

import { useMemo, useState } from "react";
import { Building2, MoreHorizontal, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { ICPBadge, StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AccountFormDialog } from "@/features/sales/account-form-dialog";
import { accounts, deleteAccount, getDealsByAccount, getUserById } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import type { Account, AccountStatus } from "@/types";

type FilterTab = "all" | "active_deal" | "qualifying" | "customer" | "lost";

const FILTER_LABEL: Record<FilterTab, string> = {
  all: "Todos",
  active_deal: "Deal ativo",
  qualifying: "Qualificando",
  customer: "Clientes",
  lost: "Perdidos",
};

function matchesFilter(status: AccountStatus, tab: FilterTab) {
  if (tab === "all") return true;
  if (tab === "lost") return status === "lost" || status === "churned";
  return status === tab;
}

export default function AccountsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [deleteAccountTarget, setDeleteAccountTarget] = useState<Account | null>(null);

  const filtered = useMemo(() => {
    let list = accounts.filter((a) => matchesFilter(a.status, tab));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q) || a.industry.toLowerCase().includes(q) || a.domain.toLowerCase().includes(q));
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query, version]);

  return (
    <PageContainer>
      <PageHeader
        title="Accounts"
        description={`${accounts.length} accounts no funil`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo account
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            {(Object.keys(FILTER_LABEL) as FilterTab[]).map((t) => (
              <TabsTrigger key={t} value={t}>
                {FILTER_LABEL[t]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar accounts..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Building2} title="Nenhum account corresponde aos filtros" description="Tente ajustar sua busca ou filtros." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Indústria</TableHead>
                <TableHead>ICP fit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead>Deals abertos</TableHead>
                <TableHead className="text-right">Pipeline</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((account) => {
                const accountDeals = getDealsByAccount(account.id);
                const openDeals = accountDeals.filter((d) => d.status === "open");
                const pipelineCents = openDeals.reduce((s, d) => s + d.amountCents, 0);
                const owner = getUserById(account.ownerId);
                return (
                  <ClickableTableRow key={account.id} href={`/modules/sales/accounts/${account.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <EntityAvatar name={account.name} size="sm" />
                        <div>
                          <p className="font-medium text-foreground">{account.name}</p>
                          <p className="text-xs text-muted-foreground">{account.domain}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{account.industry}</TableCell>
                    <TableCell>
                      <ICPBadge tier={account.icpTier} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={account.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{owner?.name ?? "—"}</TableCell>
                    <TableCell>{openDeals.length}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(pipelineCents)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                            <span className="sr-only">Ações do account</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setEditAccount(account)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteAccountTarget(account)}>
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AccountFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <AccountFormDialog
        account={editAccount ?? undefined}
        open={editAccount !== null}
        onOpenChange={(next) => {
          if (!next) setEditAccount(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteAccountTarget !== null} onOpenChange={(next) => !next && setDeleteAccountTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir account?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteAccountTarget?.name}&rdquo; será removido permanentemente, junto com a referência dos deals associados. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccountTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteAccountTarget) {
                  deleteAccount(deleteAccountTarget.id);
                  toast.success("Account excluído", { description: `${deleteAccountTarget.name} foi removido.` });
                  setDeleteAccountTarget(null);
                  setVersion((v) => v + 1);
                }
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
