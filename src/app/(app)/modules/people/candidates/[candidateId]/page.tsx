"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
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
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { CheckCircle2, MoreHorizontal, UserCheck } from "lucide-react";
import { CandidateStageBadge } from "@/features/people/people-badges";
import { CandidateFormDialog } from "@/features/people/candidate-form-dialog";
import { ConvertCandidateDialog } from "@/features/people/convert-candidate-dialog";
import { NewTaskDialog } from "@/features/tasks/new-task-dialog";
import { TaskRow } from "@/features/tasks/task-row";
import { getCandidateById, deleteCandidate } from "@/data/mock/candidates";
import { getTasksByCandidate, addPeopleTask, updatePeopleTask, deletePeopleTask } from "@/data/mock/peopleTasks";
import { formatDate } from "@/lib/format";

export default function CandidateDetailPage({ params }: { params: Promise<{ candidateId: string }> }) {
  const { candidateId } = use(params);
  const router = useRouter();
  const [, setVersion] = useState(0);
  const candidate = getCandidateById(candidateId);
  const [tasks, setTasks] = useState(() => getTasksByCandidate(candidateId));
  const [editOpen, setEditOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!candidate) notFound();

  function handleDelete() {
    if (!candidate) return;
    deleteCandidate(candidate.id);
    toast.success("Candidato excluído", { description: `${candidate.name} foi removido do funil.` });
    router.push("/modules/people/candidates");
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <EntityAvatar name={candidate.name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{candidate.name}</h1>
              <CandidateStageBadge stage={candidate.stage} />
            </div>
            <p className="text-sm text-muted-foreground">{candidate.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {candidate.stage === "hired" && (
            <Button size="sm" onClick={() => setConvertOpen(true)}>
              <UserCheck /> Converter em colaborador
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal />
                <span className="sr-only">Ações do candidato</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>Editar</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Vaga</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{candidate.role}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Etapa atual</p>
            <div className="mt-1.5">
              <CandidateStageBadge stage={candidate.stage} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Aplicou em</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{formatDate(candidate.appliedAt)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Tarefas do processo seletivo</h2>
          <NewTaskDialog
            defaultRelatedType="candidate"
            defaultRelatedId={candidateId}
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

      <CandidateFormDialog candidate={candidate} open={editOpen} onOpenChange={setEditOpen} onSave={() => setVersion((v) => v + 1)} />
      <ConvertCandidateDialog
        candidate={candidate}
        open={convertOpen}
        onOpenChange={setConvertOpen}
        onConverted={(employee) => router.push(`/modules/people/employees/${employee.id}`)}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir candidato?</DialogTitle>
            <DialogDescription>&ldquo;{candidate.name}&rdquo; será removido permanentemente do funil de contratação.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
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
