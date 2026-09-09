"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { slaForPriority, teams, updateTicket, users } from "@/data/mock";
import type { Priority, Ticket } from "@/types";

const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

const UNASSIGNED = "__unassigned__";

interface TicketFormState {
  title: string;
  priority: Priority;
  assigneeId: string;
  teamId: string;
}

function toFormState(ticket: Ticket): TicketFormState {
  return {
    title: ticket.title,
    priority: ticket.priority,
    assigneeId: ticket.assigneeId ?? UNASSIGNED,
    teamId: ticket.teamId ?? UNASSIGNED,
  };
}

interface TicketFormDialogProps {
  ticket: Ticket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ticket: Ticket) => void;
}

/** Edita um ticket existente — título, prioridade, responsável e time. Não há modo de criação
 * aqui: tickets nascem a partir de uma conversa (ver CreateTicketDialog em features/conversations). */
export function TicketFormDialog({ ticket, open, onOpenChange, onSave }: TicketFormDialogProps) {
  const [form, setForm] = useState<TicketFormState>(() => toFormState(ticket));

  // Recarrega o formulário sempre que o dialog transiciona de fechado para aberto (troca de
  // ticket em edição). Ajuste de estado durante a renderização (em vez de useEffect) conforme
  // https://react.dev/learn/you-might-not-need-an-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(ticket));
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const priorityChanged = form.priority !== ticket.priority;
    const updated = updateTicket(ticket.id, {
      title: form.title.trim(),
      priority: form.priority,
      assigneeId: form.assigneeId === UNASSIGNED ? undefined : form.assigneeId,
      teamId: form.teamId === UNASSIGNED ? undefined : form.teamId,
      // Recalcula o SLA quando a prioridade muda, mesma regra usada na criação do ticket.
      slaId: priorityChanged ? slaForPriority(form.priority).id : ticket.slaId,
    });
    if (updated) {
      onSave(updated);
      toast.success("Ticket atualizado", { description: `${updated.id} foi atualizado.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar ticket</DialogTitle>
          <DialogDescription>Atualize o título, a prioridade e a atribuição deste ticket.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ticket-edit-title">Título</Label>
            <Input id="ticket-edit-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => setForm((p) => ({ ...p, priority: v as Priority }))}>
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
            <div className="space-y-1.5">
              <Label>Time</Label>
              <Select value={form.teamId} onValueChange={(v) => setForm((p) => ({ ...p, teamId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED}>Sem time</SelectItem>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Responsável</Label>
            <Select value={form.assigneeId} onValueChange={(v) => setForm((p) => ({ ...p, assigneeId: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNASSIGNED}>Sem responsável</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
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
          <Button onClick={handleSave} disabled={!form.title.trim()}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
