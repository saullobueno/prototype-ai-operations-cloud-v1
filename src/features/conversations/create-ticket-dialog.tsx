"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addTicket, nextTicketId, slaForPriority } from "@/data/mock";
import type { Conversation, Customer, Priority, Ticket } from "@/types";

const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

interface CreateTicketDialogProps {
  conversation: Conversation;
  customer?: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (ticket: Ticket) => void;
}

export function CreateTicketDialog({ conversation, customer, open, onOpenChange, onCreated }: CreateTicketDialogProps) {
  const router = useRouter();
  const suggestedTitle = conversation.aiAnalysis?.intent ?? conversation.subject;
  const suggestedPriority = conversation.aiAnalysis?.priority ?? conversation.priority;
  const [title, setTitle] = useState(suggestedTitle);
  const [priority, setPriority] = useState<Priority>(suggestedPriority);

  function reset() {
    setTitle(suggestedTitle);
    setPriority(suggestedPriority);
  }

  function handleCreate() {
    if (!title.trim()) return;
    const ticket: Ticket = {
      id: nextTicketId(),
      customerId: conversation.customerId,
      conversationId: conversation.id,
      title: title.trim(),
      status: "open",
      priority,
      slaId: slaForPriority(priority).id,
      createdAt: new Date().toISOString(),
    };
    addTicket(ticket);
    onCreated(ticket);
    onOpenChange(false);
    reset();
    toast.success("Ticket criado", {
      description: `${ticket.id} foi aberto para ${customer?.name ?? "o cliente"}.`,
      action: {
        label: "Ver ticket →",
        onClick: () => router.push(`/tickets/${ticket.id}`),
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar ticket</DialogTitle>
          <DialogDescription>Abra um ticket de suporte vinculado a esta conversa.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Cliente</Label>
            <Input value={customer?.name ?? "—"} disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ticket-title">Título</Label>
            <Input id="ticket-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Criar ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
