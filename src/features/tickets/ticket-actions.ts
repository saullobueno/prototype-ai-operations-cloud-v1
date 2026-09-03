import type { Ticket } from "@/types";

// Persistência simplificada: muta o objeto Ticket diretamente (mesma referência do array
// compartilhado `tickets`) para que a mudança sobreviva à navegação dentro da sessão — não
// sobrevive a um reload. Compartilhado entre a lista de tickets e o detalhe do ticket para
// não duplicar a lógica de mutação. Ver docs/06-fluxos-e-ai-moments.md.
export function resolveTicket(ticket: Ticket) {
  ticket.status = "resolved";
  ticket.resolvedAt = new Date().toISOString();
}

export function escalateTicket(ticket: Ticket) {
  ticket.priority = "urgent";
}
