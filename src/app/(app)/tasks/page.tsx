"use client";

import { useMemo, useState } from "react";
import { ListChecks } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewTaskDialog } from "@/features/tasks/new-task-dialog";
import { TaskRow } from "@/features/tasks/task-row";
import { tasks as tasksStore, addTask, updateTask, deleteTask } from "@/data/mock";
import type { Task } from "@/types";

type FilterTab = "all" | Task["status"];

const TAB_LABEL: Record<FilterTab, string> = {
  all: "Todas",
  new: "Novo",
  todo: "A fazer",
  in_progress: "Em andamento",
  review: "Revisão",
  done: "Concluídas",
  canceled: "Canceladas",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(tasksStore);
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(() => (tab === "all" ? tasks : tasks.filter((t) => t.status === tab)), [tab, tasks]);

  return (
    <PageContainer>
      <PageHeader
        title="Tarefas"
        description="Itens de trabalho atribuídos pela sua equipe, vinculados a clientes, tickets e workflows."
        actions={
          <NewTaskDialog
            onCreate={(task) => {
              addTask(task);
              setTasks((prev) => [task, ...prev]);
            }}
          />
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)} className="mb-4">
        <TabsList>
          {(Object.keys(TAB_LABEL) as FilterTab[]).map((key) => (
            <TabsTrigger key={key} value={key}>
              {TAB_LABEL[key]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={ListChecks} title="Nenhuma tarefa por aqui" />
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              showRelated
              onUpdate={(updated) => {
                updateTask(updated);
                setTasks((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
              }}
              onDelete={(id) => {
                deleteTask(id);
                setTasks((prev) => prev.filter((x) => x.id !== id));
              }}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
