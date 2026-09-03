"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/page-header";
import { PriorityBadge, StatusBadge } from "@/components/domain/badges";
import { SLABadge } from "@/components/domain/sla-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { AIAnalysisPanel } from "@/features/conversations/ai-analysis-panel";
import { NewTaskDialog } from "@/features/tasks/new-task-dialog";
import { TaskRow } from "@/features/tasks/task-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addTask,
  deleteTask,
  getConversationById,
  getCustomerById,
  getMessagesByConversation,
  getTasksByRelated,
  getTeamById,
  getUserById,
  tickets,
  updateTask,
} from "@/data/mock";
import { escalateTicket, resolveTicket } from "@/features/tickets/ticket-actions";
import { formatDateTime } from "@/lib/format";
import type { Task } from "@/types";
import { ListChecks, MessageSquare } from "lucide-react";

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const router = useRouter();
  const ticket = tickets.find((t) => t.id === ticketId);
  const [status, setStatus] = useState(ticket?.status);
  const [tasks, setTasks] = useState<Task[]>(() => (ticket ? getTasksByRelated("ticket", ticket.id) : []));

  if (!ticket) notFound();

  const customer = getCustomerById(ticket.customerId);
  const assignee = ticket.assigneeId ? getUserById(ticket.assigneeId) : undefined;
  const team = ticket.teamId ? getTeamById(ticket.teamId) : undefined;
  const conversation = ticket.conversationId ? getConversationById(ticket.conversationId) : undefined;
  const messages = conversation ? getMessagesByConversation(conversation.id) : [];
  const related = customer
    ? tickets.filter((t) => t.id !== ticket.id && t.customerId === customer.id)
    : [];

  // Persistência simplificada: grava de volta no mock compartilhado (via helper compartilhado
  // com a lista de tickets, para não duplicar a lógica de mutação) para que a mudança sobreviva
  // à navegação dentro da sessão (não sobrevive a um reload).
  function handleResolve() {
    if (!ticket) return;
    resolveTicket(ticket);
    setStatus("resolved");
    toast.success(`${ticket.id} marcado como resolvido`);
  }

  function handleEscalate() {
    if (!ticket) return;
    escalateTicket(ticket);
    toast("Escalado — prioridade elevada para urgente");
    router.refresh();
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Ticket {ticket.id}</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{ticket.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleEscalate}>Escalar</Button>
            <Button size="sm" onClick={handleResolve} disabled={status === "resolved"}>Resolver</Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5"><span className="text-muted-foreground">Status</span><StatusBadge status={status ?? ticket.status} /></span>
          <span className="flex items-center gap-1.5"><span className="text-muted-foreground">Prioridade</span><PriorityBadge priority={ticket.priority} /></span>
          <span className="flex items-center gap-1.5"><span className="text-muted-foreground">Responsável</span>{assignee ? assignee.name : "Sem responsável"}</span>
          <span className="flex items-center gap-1.5"><span className="text-muted-foreground">Time</span>{team?.name ?? "—"}</span>
          <span className="flex items-center gap-1.5"><span className="text-muted-foreground">SLA</span><SLABadge ticket={ticket} /></span>
          {customer && (
            <Link href={`/customers/${customer.id}`} className="flex items-center gap-1.5 text-primary hover:underline">
              <span className="text-muted-foreground">Cliente</span> {customer.name}
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="conversation">Conversa</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="related">Relacionados</TabsTrigger>
          {conversation?.aiAnalysis && <TabsTrigger value="ai">Análise de IA</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardContent className="pt-4 text-sm text-muted-foreground">
              <p>
                Criado em {formatDateTime(ticket.createdAt)}
                {ticket.resolvedAt && <> · Resolvido em {formatDateTime(ticket.resolvedAt)}</>}
              </p>
              {conversation && (
                <p className="mt-2">
                  Vinculado à conversa:{" "}
                  <Link href={`/inbox/${conversation.id}`} className="text-primary hover:underline">
                    {conversation.subject}
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversation" className="mt-4">
          {messages.length === 0 ? (
            <EmptyState icon={MessageSquare} title="Nenhuma conversa vinculada" />
          ) : (
            <div className="space-y-3 rounded-lg border border-border p-4">
              {messages.map((m) => (
                <div key={m.id} className="text-sm">
                  <p className="text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</p>
                  <p className="text-foreground">{m.body}</p>
                </div>
              ))}
              {conversation && (
                <Button asChild variant="link" className="h-auto px-0">
                  <Link href={`/inbox/${conversation.id}`}>Abrir conversa completa →</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <NewTaskDialog
              defaultRelatedType="ticket"
              defaultRelatedId={ticket.id}
              lockRelated
              onCreate={(task) => {
                addTask(task);
                setTasks((prev) => [task, ...prev]);
              }}
            />
          </div>

          {tasks.length === 0 ? (
            <EmptyState icon={ListChecks} title="Nenhuma tarefa vinculada a este ticket" />
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
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
        </TabsContent>

        <TabsContent value="related" className="mt-4">
          {related.length === 0 ? (
            <EmptyState icon={ListChecks} title="Nenhum ticket relacionado deste cliente" />
          ) : (
            <div className="space-y-2">
              {related.map((t) => (
                <Link key={t.id} href={`/tickets/${t.id}`}>
                  <Card className="flex-row items-center justify-between px-4 py-3 transition-colors hover:bg-accent">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{t.id}</span>
                      <span className="text-sm text-muted-foreground">{t.title}</span>
                    </div>
                    <StatusBadge status={t.status} />
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {conversation?.aiAnalysis && (
          <TabsContent value="ai" className="mt-4">
            <div className="overflow-hidden rounded-lg border border-border">
              <AIAnalysisPanel analysis={conversation.aiAnalysis} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </PageContainer>
  );
}
