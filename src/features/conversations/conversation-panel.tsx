"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Send, Sparkles, Ticket as TicketIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { toast } from "sonner";
import { AIAnalysisPanel } from "@/features/conversations/ai-analysis-panel";
import { ResolveWithAI } from "@/features/conversations/resolve-with-ai";
import { CreateTicketDialog } from "@/features/conversations/create-ticket-dialog";
import {
  activities as activitiesStore,
  agents,
  getCustomerById,
  getMessagesByConversation,
  getTicketByConversation,
  getUserById,
  messages as messagesStore,
  CURRENT_USER_ID,
} from "@/data/mock";
import type { Conversation, ConversationStatus, Message, Priority, Ticket } from "@/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

function authorName(message: Message): string {
  if (message.authorType === "customer") return getCustomerById(message.authorId)?.name ?? "Cliente";
  if (message.authorType === "human") return getUserById(message.authorId)?.name ?? "Atendente";
  if (message.authorType === "agent") return agents.find((a) => a.id === message.authorId)?.name ?? "Agente de IA";
  return "Sistema";
}

export function ConversationPanel({ conversation }: { conversation: Conversation }) {
  const router = useRouter();
  const customer = getCustomerById(conversation.customerId);
  const [messages, setMessages] = useState<Message[]>(() => getMessagesByConversation(conversation.id));
  const [status, setStatus] = useState<ConversationStatus>(conversation.status);
  const [priority, setPriority] = useState<Priority>(conversation.priority);
  const [reply, setReply] = useState("");
  const [ticket, setTicket] = useState<Ticket | undefined>(() => getTicketByConversation(conversation.id));
  const [createTicketOpen, setCreateTicketOpen] = useState(false);

  function pushMessage(msg: Message) {
    messagesStore.push(msg);
    setMessages((prev) => [...prev, msg]);
  }

  function logActivity(action: string) {
    activitiesStore.push({
      id: `act_${Date.now()}`,
      customerId: conversation.customerId,
      actorType: "agent",
      actorId: "agent_billing",
      action,
      relatedType: "conversation",
      relatedId: conversation.id,
      createdAt: new Date().toISOString(),
    });
  }

  // Persistência simplificada: grava de volta no mock compartilhado (a "conversation"
  // vem de um array em memória) para que o efeito sobreviva à navegação dentro da
  // sessão — não sobrevive a um reload. Ver docs/06-fluxos-e-ai-moments.md.
  function handleResolved(body: string) {
    const msg: Message = {
      id: `msg_${conversation.id}_${Date.now()}`,
      conversationId: conversation.id,
      authorType: "agent",
      authorId: "agent_billing",
      body,
      createdAt: new Date().toISOString(),
    };
    pushMessage(msg);
    conversation.status = "resolved";
    setStatus("resolved");
    logActivity("A IA resolveu a conversa");
    toast.success("Conversa resolvida pela IA", { description: "Uma nova atividade foi registrada na timeline do cliente." });
  }

  function handleEscalated() {
    conversation.assigneeType = "human";
    logActivity("A IA escalou a conversa para aprovação");
    toast("Escalado para aprovação humana", { description: "Esta solicitação precisa de aprovação do gestor antes que a IA possa continuar." });
  }

  function sendReply() {
    if (!reply.trim()) return;
    pushMessage({
      id: `msg_${conversation.id}_${Date.now()}`,
      conversationId: conversation.id,
      authorType: "human",
      authorId: CURRENT_USER_ID,
      body: reply.trim(),
      createdAt: new Date().toISOString(),
    });
    setReply("");
  }

  function createTicket() {
    if (ticket) {
      router.push(`/tickets/${ticket.id}`);
      return;
    }
    setCreateTicketOpen(true);
  }

  const canResolveWithAI = Boolean(conversation.aiAnalysis) && status !== "resolved" && status !== "closed";

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          {customer && <EntityAvatar name={customer.name} size="sm" />}
          <div>
            <p className="text-sm font-semibold text-foreground">{customer?.name}</p>
            <p className="text-xs text-muted-foreground">{conversation.subject}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v as ConversationStatus)}>
            <SelectTrigger size="sm" className="w-[110px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger size="sm" className="w-[110px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={createTicket} className="gap-1.5">
            <TicketIcon className="size-3.5" />
            {ticket ? ticket.id : "Criar ticket"}
          </Button>
        </div>
      </div>

      {conversation.aiAnalysis && <AIAnalysisPanel analysis={conversation.aiAnalysis} />}

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((m) => {
          const isCustomer = m.authorType === "customer";
          const isSystem = m.authorType === "system";
          if (isSystem) {
            return (
              <p key={m.id} className="text-center text-xs italic text-muted-foreground">
                {m.body}
              </p>
            );
          }
          return (
            <div key={m.id} className={cn("flex gap-2.5", !isCustomer && "flex-row-reverse")}>
              <EntityAvatar name={authorName(m)} size="sm" className="mt-0.5 shrink-0" />
              <div className={cn("max-w-[75%] space-y-1", !isCustomer && "items-end text-right")}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{authorName(m)}</span>
                  <span>{formatDateTime(m.createdAt)}</span>
                </div>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    isCustomer ? "bg-muted text-foreground" : m.authorType === "agent" ? "bg-ai-accent/10 text-foreground" : "bg-primary text-primary-foreground"
                  )}
                >
                  {m.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-t border-border p-4">
        {canResolveWithAI && (
          <ResolveWithAI conversation={{ ...conversation, status }} onResolved={handleResolved} onEscalated={handleEscalated} />
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Escreva uma resposta..."
            rows={2}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendReply();
              }
            }}
          />
          <div className="flex flex-col gap-1.5">
            <Button size="icon" variant="outline" type="button" onClick={() => toast("Anexos não estão disponíveis neste protótipo.")}>
              <Paperclip className="size-4" />
            </Button>
            <Button size="icon" onClick={sendReply} disabled={!reply.trim()}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-ai-accent" onClick={() => toast("Sugestões do Copilot ainda não foram roteirizadas para esta mensagem.")}>
          <Sparkles className="size-3.5" /> Ask Copilot
        </Button>
      </div>

      <CreateTicketDialog
        conversation={conversation}
        customer={customer}
        open={createTicketOpen}
        onOpenChange={setCreateTicketOpen}
        onCreated={(created) => {
          setTicket(created);
          logActivity(`Ticket ${created.id} criado a partir da conversa`);
        }}
      />
    </div>
  );
}
