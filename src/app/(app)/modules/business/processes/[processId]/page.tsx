"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Activity as ActivityIcon, Check, ClipboardList, History, MoreHorizontal, Plus, ShieldCheck, X } from "lucide-react";
import { PageContainer } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/domain/empty-state";
import { KPIStatCard } from "@/components/domain/kpi-stat-card";
import { AutonomyBadge, StatusBadge } from "@/components/domain/badges";
import { PolicyRuleRow } from "@/components/domain/policy-rule-row";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { DonutChart } from "@/components/charts/donut-chart";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { ProcessFlow } from "@/features/business/process-flow";
import { ProcessRunTrace } from "@/features/business/process-run-trace";
import { ProcessFormDialog } from "@/features/business/process-form-dialog";
import { SopFormDialog } from "@/features/business/sop-form-dialog";
import { decideBusinessApproval } from "@/features/business/decide-business-approval";
import { groupActivitiesByDay } from "@/core/activity";
import { deleteProcess, getProcessById } from "@/data/mock/processes";
import { getStagesByProcess } from "@/data/mock/processStages";
import { getRunsByProcess } from "@/data/mock/processRuns";
import { deleteSop, getSopByProcess } from "@/data/mock/sops";
import { getExceptionsByProcess } from "@/data/mock/processExceptions";
import { businessTasks } from "@/data/mock/businessTasks";
import { businessAgents } from "@/data/mock/businessAgents";
import { businessApprovals as businessApprovalsStore } from "@/data/mock/businessApprovals";
import { businessPolicies } from "@/data/mock/businessPolicies";
import { getUserById, CURRENT_USER_ID } from "@/data/mock";
import { getVendorById } from "@/data/mock/vendors";
import { formatCurrency, formatDateTime, formatRelative } from "@/lib/format";
import type { Activity, BusinessProcessCategory } from "@/types";

const CATEGORY_LABEL: Record<BusinessProcessCategory, string> = {
  procurement: "Procurement",
  onboarding: "Onboarding",
  compliance: "Compliance",
  operations: "Operações",
  finance: "Finanças",
  hr: "RH",
};

function relevantAgentIds(category: BusinessProcessCategory): string[] {
  const ids = ["agent_biz_process", "agent_biz_exception", "agent_biz_optimization"];
  if (category === "onboarding" || category === "compliance") ids.push("agent_biz_compliance");
  else ids.push("agent_biz_ops_coordinator");
  return ids;
}

function relevantPolicyIds(processId: string): string[] {
  const ids = ["policy_biz_process_exception"];
  if (processId === "proc_vendor_onboarding") ids.push("policy_biz_vendor_onboarding");
  if (processId === "proc_expense_reimbursement") ids.push("policy_biz_expense");
  return ids;
}

export default function ProcessDetailPage({ params }: { params: Promise<{ processId: string }> }) {
  const { processId } = use(params);
  const router = useRouter();
  const process = getProcessById(processId);
  if (!process) notFound();

  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
  const [approvals, setApprovals] = useState(businessApprovalsStore);
  // Força o re-render quando o processo/SOP são editados ou excluídos (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [editProcessOpen, setEditProcessOpen] = useState(false);
  const [deleteProcessOpen, setDeleteProcessOpen] = useState(false);
  const [sopFormOpen, setSopFormOpen] = useState(false);
  const [deleteSopOpen, setDeleteSopOpen] = useState(false);

  function handleDeleteProcess() {
    if (!process) return;
    deleteProcess(process.id);
    toast.success("Processo excluído", { description: `${process.name} foi removido da biblioteca de processos.` });
    router.push("/modules/business/processes");
  }

  const stages = getStagesByProcess(process.id);
  const runs = getRunsByProcess(process.id);
  const runIds = runs.map((r) => r.id);
  const latestRun = runs[0];
  const owner = getUserById(process.ownerId);
  const sop = getSopByProcess(process.id);
  const exceptions = getExceptionsByProcess(process.id);
  const tasks = businessTasks.filter((t) => (t.relatedType === "process" && t.relatedId === process.id) || (t.relatedType === "process_run" && runIds.includes(t.relatedId)));
  const agents = businessAgents.filter((a) => relevantAgentIds(process.category).includes(a.id));
  const policies = businessPolicies.filter((p) => relevantPolicyIds(process.id).includes(p.id));
  const processApprovals = approvals.filter((a) => a.relatedType === "process_run" && runIds.includes(a.relatedId ?? ""));
  const relatedVendor = latestRun?.relatedType === "vendor" ? getVendorById(latestRun.relatedId ?? "") : undefined;

  function decide(id: string, decision: "approved" | "rejected") {
    decideBusinessApproval(id, decision, CURRENT_USER_ID);
    setApprovals([...businessApprovalsStore]);
    toast.success(decision === "approved" ? "Aprovado" : "Rejeitado", {
      description: decision === "approved" ? "O processo pode prosseguir para a próxima etapa." : "O run foi marcado como bloqueado até nova decisão.",
    });
  }

  function handleDeleteSop() {
    if (!sop) return;
    deleteSop(sop.id);
    toast.success("SOP excluída", { description: `${sop.title} foi removida.` });
    setDeleteSopOpen(false);
    setVersion((v) => v + 1);
  }

  const stepStatusBreakdown = (() => {
    const counts: Record<string, number> = {};
    runs.flatMap((r) => r.steps).forEach((s) => { counts[s.status] = (counts[s.status] ?? 0) + 1; });
    const LABEL: Record<string, string> = { completed: "Concluído", in_progress: "Em andamento", pending: "Pendente", blocked: "Bloqueado", skipped: "Ignorado" };
    return Object.entries(counts).map(([name, value]) => ({ name: LABEL[name] ?? name, value }));
  })();

  const runsByStatus = (() => {
    const counts: Record<string, number> = {};
    runs.forEach((r) => { counts[r.status] = (counts[r.status] ?? 0) + 1; });
    return Object.entries(counts).map(([status, count]) => ({ status, execucoes: count }));
  })();

  const activities: Activity[] = [
    { id: `act_proc_${process.id}_created`, actorType: "human", actorId: process.ownerId, action: `Processo "${process.name}" criado`, relatedType: "process", relatedId: process.id, createdAt: process.createdAt },
    ...runs.map((r) => ({ id: `act_run_${r.id}_started`, actorType: "system" as const, actorId: "system", action: `Run "${r.subject}" iniciado`, relatedType: "process_run", relatedId: r.id, createdAt: r.startedAt })),
    ...runs.filter((r) => r.completedAt).map((r) => ({ id: `act_run_${r.id}_completed`, actorType: "system" as const, actorId: "system", action: `Run "${r.subject}" concluído`, relatedType: "process_run", relatedId: r.id, createdAt: r.completedAt! })),
    ...exceptions.map((e) => ({ id: `act_exc_${e.id}`, actorType: "agent" as const, actorId: "agent_biz_exception", action: `Exceção sinalizada: ${e.reason}`, relatedType: "process_exception", relatedId: e.id, createdAt: e.createdAt })),
  ];
  const activityGroups = groupActivitiesByDay(activities);

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          <Link href="/modules/business/processes" className="text-primary hover:underline">Biblioteca de processos</Link> · {CATEGORY_LABEL[process.category]}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{process.name}</h1>
          <div className="flex items-center gap-2">
            <StatusBadge status={process.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs">
                  <MoreHorizontal />
                  <span className="sr-only">Ações do processo</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setEditProcessOpen(true)}>Editar processo</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={() => setDeleteProcessOpen(true)}>Excluir processo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{process.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Dono</span>
            {owner?.name ?? "—"}
          </span>
          {process.slaHours && (
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">SLA</span>
              {process.slaHours}h
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Criado em</span>
            {formatRelative(process.createdAt)}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="runs">Runs</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <KPIStatCard label="Execuções totais" value={process.totalRuns.toLocaleString("pt-BR")} />
            <KPIStatCard label="Execuções ativas" value={String(process.activeRuns)} />
            <KPIStatCard label="Duração média" value={`${process.avgDurationHours}h`} />
            <KPIStatCard label="Taxa de exceção" value={`${process.exceptionRate}%`} />
            <KPIStatCard label="Automação" value={`${process.automationRate}%`} />
          </div>

          {latestRun && (
            <Card>
              <CardHeader><CardTitle className="text-base">Última execução — {latestRun.subject}</CardTitle></CardHeader>
              <CardContent>
                <ProcessFlow stages={stages} steps={latestRun.steps} />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                <CardTitle className="text-base">{sop?.title ?? "SOP deste processo"}</CardTitle>
                {sop ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal />
                        <span className="sr-only">Ações da SOP</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setSopFormOpen(true)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleteSopOpen(true)}>Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => setSopFormOpen(true)}>
                    <Plus className="size-3.5" /> Criar SOP
                  </Button>
                )}
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {sop ? (
                  <>
                    <p>{sop.content}</p>
                    <p className="mt-2 text-xs">Atualizado {formatRelative(sop.updatedAt)}</p>
                  </>
                ) : (
                  <p>Nenhuma SOP publicada para este processo ainda.</p>
                )}
              </CardContent>
            </Card>

            {relatedVendor && (
              <Card>
                <CardHeader><CardTitle className="text-base">Fornecedor vinculado</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-3">
                  <EntityAvatar name={relatedVendor.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{relatedVendor.name}</p>
                    <p className="text-xs text-muted-foreground">{relatedVendor.category}</p>
                  </div>
                  <StatusBadge status={relatedVendor.status} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Esteira do processo</CardTitle></CardHeader>
            <CardContent>
              <ProcessFlow stages={stages} steps={latestRun?.steps} />
              <p className="mt-3 text-xs text-muted-foreground">
                {stages.length} etapas · coloridas de acordo com o status da execução mais recente ({latestRun?.subject ?? "sem execuções ainda"}).
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runs" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/modules/business/processes/${process.id}/runs`}>Ver todas as execuções</Link>
            </Button>
          </div>
          {runs.length === 0 ? (
            <EmptyState icon={History} title="Nenhuma execução registrada ainda" description="Este processo ainda está em desenho e não teve nenhum run disparado." />
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Execução</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Iniciada em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((r) => (
                    <>
                      <TableRow key={r.id} role="button" tabIndex={0} className="cursor-pointer" onClick={() => setExpandedRunId(expandedRunId === r.id ? null : r.id)}>
                        <TableCell className="font-medium">{r.subject}</TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{formatDateTime(r.startedAt)}</TableCell>
                      </TableRow>
                      {expandedRunId === r.id && (
                        <TableRow key={`${r.id}_detail`} className="hover:bg-transparent">
                          <TableCell colSpan={3} className="bg-muted/30 p-4">
                            <div className="space-y-4">
                              <ProcessFlow stages={stages} steps={r.steps} />
                              <ProcessRunTrace steps={r.steps} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          {tasks.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Nenhuma tarefa vinculada a este processo" />
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prazo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((t) => {
                    const assignee = getUserById(t.assigneeId);
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.title}</TableCell>
                        <TableCell className="text-muted-foreground">{assignee?.name ?? "—"}</TableCell>
                        <TableCell><StatusBadge status={t.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{t.dueAt ? formatRelative(t.dueAt) : "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="agents" className="mt-4 space-y-2">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="flex items-start gap-3 pt-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-ai-accent/15 text-ai-accent">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{agent.name}</p>
                    <StatusBadge status={agent.status} />
                    <AutonomyBadge level={agent.autonomyLevel} />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{agent.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approvals" className="mt-4 space-y-2">
          {processApprovals.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="Nenhuma aprovação vinculada a este processo" />
          ) : (
            processApprovals.map((a) => (
              <div key={a.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${a.status === "pending" ? "border-warning/30 bg-warning/[0.06]" : "border-border"}`}>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {a.type.replace(/_/g, " ")} {a.amountCents ? `— ${formatCurrency(a.amountCents)}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.context}</p>
                </div>
                {a.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(a.id, "rejected")}><X className="size-3.5" /> Rejeitar</Button>
                    <Button size="sm" className="gap-1" onClick={() => decide(a.id, "approved")}><Check className="size-3.5" /> Aprovar</Button>
                  </div>
                ) : (
                  <StatusBadge status={a.status} />
                )}
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="policies" className="mt-4 space-y-4">
          {policies.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-4">
                <p className="mb-2 text-sm font-medium text-foreground">{p.name}</p>
                <div className="space-y-1.5">
                  {p.rules.map((rule) => <PolicyRuleRow key={rule.id} rule={rule} />)}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Execuções por status</CardTitle></CardHeader>
              <CardContent>
                {runsByStatus.length === 0 ? <p className="text-sm text-muted-foreground">Sem execuções ainda.</p> : <SimpleBarChart data={runsByStatus} xKey="status" yKey="execucoes" />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Etapas por status</CardTitle></CardHeader>
              <CardContent>
                {stepStatusBreakdown.length === 0 ? <p className="text-sm text-muted-foreground">Sem execuções ainda.</p> : <DonutChart data={stepStatusBreakdown} />}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          {activityGroups.length === 0 ? (
            <EmptyState icon={ActivityIcon} title="Nenhuma atividade ainda" />
          ) : (
            <div className="space-y-6">
              {activityGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                  <div className="space-y-4 border-l border-border pl-4">
                    {group.items.map((activity) => (
                      <div key={activity.id} className="relative">
                        <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(activity.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ProcessFormDialog
        process={process}
        open={editProcessOpen}
        onOpenChange={setEditProcessOpen}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteProcessOpen} onOpenChange={setDeleteProcessOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir processo?</DialogTitle>
            <DialogDescription>
              &ldquo;{process.name}&rdquo; será removido da biblioteca de processos.
              {process.totalRuns > 0
                ? ` As ${process.totalRuns} execuções já registradas permanecem no histórico, mas ficarão sem processo vinculado.`
                : ""}{" "}
              Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProcessOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProcess}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SopFormDialog
        processId={process.id}
        sop={sop}
        open={sopFormOpen}
        onOpenChange={setSopFormOpen}
        onSave={() => setVersion((v) => v + 1)}
      />

      <Dialog open={deleteSopOpen} onOpenChange={setDeleteSopOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir SOP?</DialogTitle>
            <DialogDescription>
              &ldquo;{sop?.title}&rdquo; será removida permanentemente. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSopOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteSop}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
