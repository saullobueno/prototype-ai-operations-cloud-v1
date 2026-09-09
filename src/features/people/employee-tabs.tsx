"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  File,
  FileText,
  MoreHorizontal,
  Plus,
  Sheet as SheetIcon,
  ClipboardList,
  MessageSquare,
  Target as TargetIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { HealthMeterRow } from "@/components/domain/health-meter";
import { AIInsightCard } from "@/components/domain/ai-insight-card";
import { StatusBadge } from "@/components/domain/badges";
import { NewTaskDialog } from "@/features/tasks/new-task-dialog";
import { TaskRow } from "@/features/tasks/task-row";
import { EmploymentStatusBadge, GoalStatusBadge, PEOPLE_REQUEST_TYPE_LABEL, ReviewStatusBadge } from "@/features/people/people-badges";
import { OnboardingStepsList } from "@/features/people/onboarding-steps";
import { GoalFormDialog } from "@/features/people/goal-form-dialog";
import { ReviewFormDialog } from "@/features/people/review-form-dialog";
import { PeopleRequestFormDialog } from "@/features/people/people-request-form-dialog";
import { buildEmployeeJourney } from "@/features/people/journey";
import { groupActivitiesByDay } from "@/core/activity";
import { getEmployeeById, getEmployeesByManager } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";
import { getOnboardingByEmployee } from "@/data/mock/onboardings";
import { getGoalsByEmployee, deleteGoal } from "@/data/mock/goals";
import { getReviewsByEmployee } from "@/data/mock/performanceReviews";
import { getFeedbackByEmployee, addPeopleFeedback } from "@/data/mock/peopleFeedback";
import { getDocumentsByEmployee, addEmployeeDocument, type EmployeeDocument } from "@/data/mock/employeeDocuments";
import { getRequestsByEmployee, deletePeopleRequest } from "@/data/mock/peopleRequests";
import { getRetentionRiskByEmployee } from "@/data/mock/retentionRisks";
import { getTasksByEmployee, addPeopleTask, updatePeopleTask, deletePeopleTask } from "@/data/mock/peopleTasks";
import { CURRENT_USER_ID, getUserById } from "@/data/mock";
import { formatDate, formatDateTime, formatRelative } from "@/lib/format";
import type { Goal, PeopleRequest, PerformanceReview } from "@/types";

function personName(id: string): string {
  return getEmployeeById(id)?.name ?? getUserById(id)?.name ?? id;
}

export function OverviewTab({ employeeId }: { employeeId: string }) {
  const router = useRouter();
  const employee = getEmployeeById(employeeId)!;
  const department = getDepartmentById(employee.departmentId);
  const manager = employee.managerId ? getEmployeeById(employee.managerId) : undefined;
  const onboarding = getOnboardingByEmployee(employeeId);
  const goals = getGoalsByEmployee(employeeId).slice(0, 3);
  const openRequests = getRequestsByEmployee(employeeId).filter((r) => r.status === "pending");
  const risk = getRetentionRiskByEmployee(employeeId);
  const doneSteps = onboarding ? onboarding.steps.filter((s) => s.status === "done").length : 0;

  return (
    <div className="space-y-6">
      {risk && risk.riskLevel !== "low" && (
        <AIInsightCard
          title={`Sinal de retenção: risco ${risk.riskLevel === "high" ? "alto" : "médio"}`}
          description={`${risk.reasons[0]} — recomendação do Workforce Insights Agent para revisão do gestor, não uma ação automática.`}
          actionLabel="Ver risco de retenção"
          onAction={() => router.push("/modules/people/retention-risk")}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <EmploymentStatusBadge status={employee.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Departamento</span>
              <span className="font-medium text-foreground">{department?.name ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gestor</span>
              <span className="font-medium text-foreground">{manager?.name ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Local</span>
              <span className="font-medium text-foreground">{employee.location ?? "—"}</span>
            </div>
          </CardContent>
        </Card>

        {onboarding ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Progresso do onboarding</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/modules/people/employees/${employeeId}/journey`}>Ver jornada</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <HealthMeterRow label="Etapas concluídas" value={Math.round((doneSteps / onboarding.steps.length) * 100)} tone={onboarding.status === "delayed" ? "danger" : "default"} />
              <p className="mt-1 text-xs text-muted-foreground">
                {doneSteps} de {onboarding.steps.length} etapas · iniciado em {formatDate(onboarding.startedAt)}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Metas recentes</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/modules/people/employees/${employeeId}/goals`}>Ver tudo</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma meta ainda.</p>}
              {goals.map((g) => (
                <div key={g.id} className="text-sm">
                  <p className="font-medium text-foreground">{g.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <GoalStatusBadge status={g.status} />
                    <span className="text-xs text-muted-foreground">{g.progress}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Solicitações abertas</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/modules/people/employees/${employeeId}/requests`}>Ver tudo</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {openRequests.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma solicitação pendente.</p>}
            {openRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{PEOPLE_REQUEST_TYPE_LABEL[r.type]}</span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function JourneyTab({ employeeId }: { employeeId: string }) {
  const groups = groupActivitiesByDay(buildEmployeeJourney(employeeId));

  if (groups.length === 0) {
    return <EmptyState icon={ActivityIcon} title="Nenhum evento ainda" description="A jornada deste colaborador vai aparecer aqui conforme onboarding, metas, avaliações e solicitações acontecem." />;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
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
  );
}

export const ActivityTab = JourneyTab;

export function TeamTab({ employeeId }: { employeeId: string }) {
  const employee = getEmployeeById(employeeId)!;
  const manager = employee.managerId ? getEmployeeById(employee.managerId) : undefined;
  const peers = manager ? getEmployeesByManager(manager.id).filter((e) => e.id !== employeeId) : [];
  const directReports = getEmployeesByManager(employeeId);

  function PersonRow({ person, role }: { person: ReturnType<typeof getEmployeeById>; role: string }) {
    if (!person) return null;
    return (
      <Link href={`/modules/people/employees/${person.id}`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent">
        <div className="flex items-center gap-2.5">
          <EntityAvatar name={person.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-foreground">{person.name}</p>
            <p className="text-xs text-muted-foreground">{person.title}</p>
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{role}</span>
      </Link>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gestor</CardTitle>
        </CardHeader>
        <CardContent>{manager ? <PersonRow person={manager} role="Gestor" /> : <p className="text-sm text-muted-foreground">Sem gestor direto.</p>}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Colegas de time ({peers.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {peers.length === 0 && <p className="text-sm text-muted-foreground">Nenhum colega no mesmo time.</p>}
          {peers.map((p) => (
            <PersonRow key={p.id} person={p} role="Par" />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liderados diretos ({directReports.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {directReports.length === 0 && <p className="text-sm text-muted-foreground">Nenhum liderado direto.</p>}
          {directReports.map((p) => (
            <PersonRow key={p.id} person={p} role="Liderado" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function GoalsTab({ employeeId }: { employeeId: string }) {
  const [goals, setGoals] = useState(() => getGoalsByEmployee(employeeId));
  const [createOpen, setCreateOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);

  function refresh() {
    setGoals(getGoalsByEmployee(employeeId));
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteGoal(deleteTarget.id);
    toast.success("Meta excluída", { description: `"${deleteTarget.title}" foi removida.` });
    refresh();
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
          <Plus /> Nova meta
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState icon={TargetIcon} title="Nenhuma meta ainda" />
      ) : (
        <div className="space-y-3">
          {goals.map((g) => (
            <Card key={g.id} className="px-4 py-3.5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{g.title}</p>
                <div className="flex shrink-0 items-center gap-2">
                  <GoalStatusBadge status={g.status} />
                  <span className="text-xs text-muted-foreground">até {formatDate(g.dueDate)}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal />
                        <span className="sr-only">Ações da meta</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEditGoal(g)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(g)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <HealthMeterRow label="Progresso" value={g.progress} tone={g.status === "at_risk" ? "danger" : "default"} />
            </Card>
          ))}
        </div>
      )}

      <GoalFormDialog defaultEmployeeId={employeeId} open={createOpen} onOpenChange={setCreateOpen} onSave={refresh} />
      <GoalFormDialog
        goal={editGoal ?? undefined}
        defaultEmployeeId={employeeId}
        open={editGoal !== null}
        onOpenChange={(next) => {
          if (!next) setEditGoal(null);
        }}
        onSave={refresh}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(next) => !next && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir meta?</DialogTitle>
            <DialogDescription>&ldquo;{deleteTarget?.title}&rdquo; será removida permanentemente. Essa ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PerformanceTab({ employeeId }: { employeeId: string }) {
  const [reviews, setReviews] = useState(() => getReviewsByEmployee(employeeId));
  const [createOpen, setCreateOpen] = useState(false);
  const [editReview, setEditReview] = useState<PerformanceReview | null>(null);

  function refresh() {
    setReviews(getReviewsByEmployee(employeeId));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
          <Plus /> Nova avaliação
        </Button>
      </div>

      {reviews.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhuma avaliação ainda" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ciclo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Nota</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.cycle}</TableCell>
                  <TableCell>
                    <ReviewStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">{r.rating ? r.rating.toFixed(1) : "—"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreHorizontal />
                          <span className="sr-only">Ações da avaliação</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditReview(r)}>Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ReviewFormDialog defaultEmployeeId={employeeId} open={createOpen} onOpenChange={setCreateOpen} onSave={refresh} />
      <ReviewFormDialog
        review={editReview ?? undefined}
        defaultEmployeeId={employeeId}
        open={editReview !== null}
        onOpenChange={(next) => {
          if (!next) setEditReview(null);
        }}
        onSave={refresh}
      />
    </div>
  );
}

export function FeedbackTab({ employeeId }: { employeeId: string }) {
  const [feedback, setFeedback] = useState(() => getFeedbackByEmployee(employeeId));
  const [draft, setDraft] = useState("");

  function handleAdd() {
    if (!draft.trim()) return;
    const entry = { id: `pfb_${Date.now()}`, employeeId, fromId: CURRENT_USER_ID, body: draft.trim(), createdAt: new Date().toISOString() };
    addPeopleFeedback(entry);
    setFeedback((prev) => [entry, ...prev]);
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 pt-4">
          <Textarea placeholder="Deixe um feedback para este colaborador..." value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleAdd} disabled={!draft.trim()}>
              <MessageSquare /> Enviar feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      {feedback.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Nenhum feedback ainda" />
      ) : (
        <div className="space-y-3">
          {feedback.map((f) => (
            <Card key={f.id} className="px-4 py-3">
              <div className="flex items-center gap-2">
                <EntityAvatar name={personName(f.fromId)} size="xs" />
                <span className="text-sm font-medium text-foreground">{personName(f.fromId)}</span>
                <span className="text-xs text-muted-foreground">{formatRelative(f.createdAt)}</span>
              </div>
              <p className="mt-1.5 text-sm text-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const DOC_ICON: Record<EmployeeDocument["kind"], typeof FileText> = { pdf: FileText, doc: FileText, sheet: SheetIcon, other: File };

export function DocumentsTab({ employeeId }: { employeeId: string }) {
  const [docs, setDocs] = useState(() => getDocumentsByEmployee(employeeId));

  function fakeUpload() {
    const doc: EmployeeDocument = { id: `edoc_${Date.now()}`, employeeId, name: "Documento_enviado.pdf", kind: "pdf", sizeKb: 156, uploadedById: CURRENT_USER_ID, createdAt: new Date().toISOString() };
    addEmployeeDocument(doc);
    setDocs((prev) => [doc, ...prev]);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={fakeUpload}>
          <Plus /> Enviar documento
        </Button>
      </div>
      {docs.length === 0 ? (
        <EmptyState icon={File} title="Nenhum documento ainda" />
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {docs.map((d) => {
            const Icon = DOC_ICON[d.kind];
            const uploader = personName(d.uploadedById);
            return (
              <div key={d.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.sizeKb} KB · Enviado por {uploader} · {formatRelative(d.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RequestsTab({ employeeId }: { employeeId: string }) {
  const [requests, setRequests] = useState(() => getRequestsByEmployee(employeeId));
  const [createOpen, setCreateOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<PeopleRequest | null>(null);

  function refresh() {
    setRequests(getRequestsByEmployee(employeeId));
  }

  function handleCancel() {
    if (!cancelTarget) return;
    deletePeopleRequest(cancelTarget.id);
    toast.success("Solicitação cancelada", { description: `${PEOPLE_REQUEST_TYPE_LABEL[cancelTarget.type]} foi cancelada.` });
    refresh();
    setCancelTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
          <Plus /> Nova solicitação
        </Button>
      </div>

      {requests.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhuma solicitação ainda" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{PEOPLE_REQUEST_TYPE_LABEL[r.type]}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  <TableCell>
                    {r.status === "pending" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                            <span className="sr-only">Ações da solicitação</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem variant="destructive" onSelect={() => setCancelTarget(r)}>
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PeopleRequestFormDialog defaultEmployeeId={employeeId} open={createOpen} onOpenChange={setCreateOpen} onCreate={refresh} />

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
    </div>
  );
}

export function TasksTab({ employeeId }: { employeeId: string }) {
  const [tasks, setTasks] = useState(() => getTasksByEmployee(employeeId));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <NewTaskDialog
          defaultRelatedType="employee"
          defaultRelatedId={employeeId}
          lockRelated
          onCreate={(task) => {
            addPeopleTask(task);
            setTasks((prev) => [task, ...prev]);
          }}
        />
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Nenhuma tarefa ainda" />
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onUpdate={(updated) => {
                updatePeopleTask(updated);
                setTasks((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
              }}
              onDelete={(id) => {
                deletePeopleTask(id);
                setTasks((prev) => prev.filter((x) => x.id !== id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

