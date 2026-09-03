import type { SLA, Ticket } from "@/types";
import { minutesUntil } from "@/lib/format";

export const slas: SLA[] = [
  { id: "sla_urgent", name: "Urgente", firstResponseMinutes: 30, resolutionMinutes: 120, appliesToPriority: ["urgent"] },
  { id: "sla_high", name: "Prioridade alta", firstResponseMinutes: 60, resolutionMinutes: 240, appliesToPriority: ["high"] },
  { id: "sla_normal", name: "Normal", firstResponseMinutes: 240, resolutionMinutes: 1440, appliesToPriority: ["medium"] },
  { id: "sla_low", name: "Prioridade baixa", firstResponseMinutes: 1440, resolutionMinutes: 4320, appliesToPriority: ["low"] },
];

export function slaForPriority(priority: string): SLA {
  return slas.find((s) => s.appliesToPriority.includes(priority as never)) ?? slas[2];
}

/** Minutos até o deadline de resolução do ticket (negativo se já rompido). null se não aplicável. */
export function minutesUntilBreach(ticket: Ticket): number | null {
  if (!ticket.slaId || ticket.status === "resolved" || ticket.status === "closed") return null;
  const sla = slas.find((s) => s.id === ticket.slaId);
  if (!sla) return null;
  const deadline = new Date(ticket.createdAt);
  deadline.setMinutes(deadline.getMinutes() + sla.resolutionMinutes);
  return minutesUntil(deadline.toISOString());
}
