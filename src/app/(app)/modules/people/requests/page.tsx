"use client";

import { useMemo, useState } from "react";
import { ClipboardList, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PEOPLE_REQUEST_TYPE_LABEL } from "@/features/people/people-badges";
import { PeopleRequestFormDialog } from "@/features/people/people-request-form-dialog";
import { peopleRequests, deletePeopleRequest } from "@/data/mock/peopleRequests";
import { getEmployeeById } from "@/data/mock/employees";
import { formatDate } from "@/lib/format";
import type { PeopleRequest } from "@/types";

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function PeopleRequestsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  // Espelha o array compartilhado `peopleRequests` em estado local só para forçar o re-render
  // quando uma solicitação é criada ou cancelada (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<PeopleRequest | null>(null);

  const filtered = useMemo(() => {
    const list = tab === "all" ? peopleRequests : peopleRequests.filter((r) => r.status === tab);
    return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, version]);

  function handleCancel() {
    if (!cancelTarget) return;
    deletePeopleRequest(cancelTarget.id);
    toast.success("Solicitação cancelada", { description: `${PEOPLE_REQUEST_TYPE_LABEL[cancelTarget.type]} foi cancelada.` });
    setVersion((v) => v + 1);
    setCancelTarget(null);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Solicitações"
        description={`${peopleRequests.length} solicitações de colaboradores`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Nova solicitação
          </Button>
        }
      />

      <div className="mb-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhuma solicitação corresponde ao filtro" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((request) => {
                const employee = getEmployeeById(request.employeeId);
                if (!employee) return null;
                return (
                  <ClickableTableRow key={request.id} href={`/modules/people/employees/${employee.id}/requests`}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <EntityAvatar name={employee.name} size="sm" />
                        <p className="font-medium text-foreground">{employee.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{PEOPLE_REQUEST_TYPE_LABEL[request.type]}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(request.createdAt)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {request.status === "pending" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <MoreHorizontal />
                              <span className="sr-only">Ações da solicitação</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem variant="destructive" onSelect={() => setCancelTarget(request)}>
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <PeopleRequestFormDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={() => setVersion((v) => v + 1)} />

      <Dialog open={cancelTarget !== null} onOpenChange={(next) => !next && setCancelTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancelar solicitação?</DialogTitle>
            <DialogDescription>
              {cancelTarget ? `A solicitação de ${PEOPLE_REQUEST_TYPE_LABEL[cancelTarget.type]} será removida permanentemente.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Cancelar solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
