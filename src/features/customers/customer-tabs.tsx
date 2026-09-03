"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  File,
  FileText,
  Image as ImageIcon,
  Inbox,
  Plus,
  Sheet as SheetIcon,
  StickyNote,
  Ticket as TicketIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { PriorityBadge, StatusBadge } from "@/components/domain/badges";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { NewTaskDialog } from "@/features/tasks/new-task-dialog";
import { TaskRow } from "@/features/tasks/task-row";
import { groupActivitiesByDay } from "@/core/activity";
import { formatCurrency, formatDate, formatDateTime, formatRelative } from "@/lib/format";
import {
  addFile,
  addNote,
  addTask,
  deleteTask,
  getActivitiesByCustomer,
  getConversationsByCustomer,
  getCustomerById,
  getFilesByCustomer,
  getNotesByCustomer,
  getOrdersByCustomer,
  getPaymentsByCustomer,
  getTasksByCustomer,
  getTicketsByCustomer,
  getUserById,
  updateTask,
  CURRENT_USER_ID,
} from "@/data/mock";

const HEALTH_LABEL: Record<string, string> = { healthy: "Saudável", at_risk: "Em risco", critical: "Crítico" };

export function OverviewTab({ customerId }: { customerId: string }) {
  const customer = getCustomerById(customerId)!;
  const tickets = getTicketsByCustomer(customerId).slice(0, 3);
  const conversations = getConversationsByCustomer(customerId).slice(0, 3);
  const openTickets = getTicketsByCustomer(customerId).filter((t) => t.status !== "resolved" && t.status !== "closed").length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saúde da conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saúde</span>
            <span className="font-medium text-foreground">{HEALTH_LABEL[customer.health]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tickets abertos</span>
            <span className="font-medium text-foreground">{openTickets}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plano</span>
            <span className="font-medium text-foreground">{customer.plan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tags</span>
            <span className="font-medium text-foreground">{customer.tags.join(", ") || "—"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Tickets recentes</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/customers/${customerId}/tickets`}>Ver tudo</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {tickets.length === 0 && <p className="text-sm text-muted-foreground">Nenhum ticket ainda.</p>}
          {tickets.map((t) => (
            <Link key={t.id} href={`/tickets/${t.id}`} className="block text-sm">
              <p className="font-medium text-foreground">{t.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge status={t.status} />
                <PriorityBadge priority={t.priority} />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Conversas recentes</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/customers/${customerId}/conversations`}>Ver tudo</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {conversations.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma conversa ainda.</p>}
          {conversations.map((c) => (
            <Link key={c.id} href={`/inbox/${c.id}`} className="block text-sm">
              <p className="font-medium text-foreground">{c.subject}</p>
              <p className="text-xs text-muted-foreground">{formatRelative(c.lastMessageAt)}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function TimelineTab({ customerId }: { customerId: string }) {
  const groups = groupActivitiesByDay(getActivitiesByCustomer(customerId));

  if (groups.length === 0) {
    return <EmptyState icon={ActivityIcon} title="Nenhuma atividade ainda" description="A atividade vai aparecer aqui conforme esse cliente interage com sua equipe." />;
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

export const ActivityTab = TimelineTab;

export function ConversationsTab({ customerId }: { customerId: string }) {
  const conversations = getConversationsByCustomer(customerId);
  if (conversations.length === 0) {
    return <EmptyState icon={Inbox} title="Nenhuma conversa ainda" description="Conversas com esse cliente vão aparecer aqui." />;
  }
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {conversations.map((c) => (
        <Link key={c.id} href={`/inbox/${c.id}`} className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{c.subject}</p>
            <p className="text-xs capitalize text-muted-foreground">{c.channel} · {formatRelative(c.lastMessageAt)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <PriorityBadge priority={c.priority} />
            <StatusBadge status={c.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}

export function TicketsTab({ customerId }: { customerId: string }) {
  const tickets = getTicketsByCustomer(customerId);
  if (tickets.length === 0) {
    return <EmptyState icon={TicketIcon} title="Nenhum ticket ainda" />;
  }
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t) => (
            <ClickableTableRow key={t.id} href={`/tickets/${t.id}`}>
              <TableCell className="font-medium">{t.id}</TableCell>
              <TableCell>{t.title}</TableCell>
              <TableCell><StatusBadge status={t.status} /></TableCell>
              <TableCell><PriorityBadge priority={t.priority} /></TableCell>
              <TableCell className="text-muted-foreground">{formatDate(t.createdAt)}</TableCell>
            </ClickableTableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function OrdersTab({ customerId }: { customerId: string }) {
  const orders = getOrdersByCustomer(customerId);
  if (orders.length === 0) return <EmptyState icon={FileText} title="Nenhum pedido ainda" />;
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.description}</TableCell>
              <TableCell><StatusBadge status={o.status} /></TableCell>
              <TableCell className="text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(o.amountCents)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function PaymentsTab({ customerId }: { customerId: string }) {
  const payments = getPaymentsByCustomer(customerId);
  if (payments.length === 0) return <EmptyState icon={FileText} title="Nenhum pagamento ainda" />;
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Método</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.method}</TableCell>
              <TableCell><StatusBadge status={p.status} /></TableCell>
              <TableCell className="text-muted-foreground">{formatDate(p.createdAt)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(p.amountCents)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TasksTab({ customerId }: { customerId: string }) {
  const [tasks, setTasks] = useState(() => getTasksByCustomer(customerId));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <NewTaskDialog
          defaultRelatedType="customer"
          defaultRelatedId={customerId}
          lockRelated
          onCreate={(task) => {
            addTask(task);
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
    </div>
  );
}

export function NotesTab({ customerId }: { customerId: string }) {
  const [notes, setNotes] = useState(() => getNotesByCustomer(customerId));
  const [draft, setDraft] = useState("");
  const currentUser = getUserById(CURRENT_USER_ID);

  function handleAddNote() {
    if (!draft.trim()) return;
    const note = { id: `note_${Date.now()}`, customerId, authorId: CURRENT_USER_ID, body: draft.trim(), createdAt: new Date().toISOString() };
    addNote(note);
    setNotes((prev) => [note, ...prev]);
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 pt-4">
          <Textarea placeholder="Escreva uma nota interna..." value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleAddNote} disabled={!draft.trim()}>
              <StickyNote /> Adicionar nota
            </Button>
          </div>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <EmptyState icon={StickyNote} title="Nenhuma nota ainda" />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const author = getUserById(note.authorId);
            return (
              <Card key={note.id} className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {author && <EntityAvatar name={author.name} size="xs" />}
                  <span className="text-sm font-medium text-foreground">{author?.name ?? currentUser?.name}</span>
                  <span className="text-xs text-muted-foreground">{formatRelative(note.createdAt)}</span>
                </div>
                <p className="mt-1.5 text-sm text-foreground">{note.body}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

const FILE_ICON = { pdf: FileText, image: ImageIcon, doc: FileText, sheet: SheetIcon, other: File };

export function FilesTab({ customerId }: { customerId: string }) {
  const [files, setFiles] = useState(() => getFilesByCustomer(customerId));

  function fakeUpload() {
    const file = { id: `file_${Date.now()}`, customerId, name: "Documento_enviado.pdf", sizeKb: 128, kind: "pdf" as const, uploadedById: CURRENT_USER_ID, createdAt: new Date().toISOString() };
    addFile(file);
    setFiles((prev) => [file, ...prev]);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={fakeUpload}>
          <Plus /> Enviar arquivo
        </Button>
      </div>
      {files.length === 0 ? (
        <EmptyState icon={File} title="Nenhum arquivo ainda" />
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {files.map((f) => {
            const Icon = FILE_ICON[f.kind];
            const uploader = getUserById(f.uploadedById);
            return (
              <div key={f.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.sizeKb} KB · Enviado por {uploader?.name} · {formatRelative(f.createdAt)}
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
