"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Bot,
  BookOpen,
  Inbox,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  Ticket,
  Users,
  Workflow,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { agents, customers, conversations, knowledgeDocuments, tickets, workflows } from "@/data/mock";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const [search, setSearch] = useState("");

  function go(href: string) {
    onOpenChange(false);
    setSearch("");
    router.push(href);
  }

  const q = search.trim().toLowerCase();
  const matchedCustomers = q ? customers.filter((c) => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedConversations = q ? conversations.filter((c) => c.subject.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedTickets = q ? tickets.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedAgents = q ? agents.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedWorkflows = q ? workflows.filter((w) => w.name.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedKnowledge = q ? knowledgeDocuments.filter((d) => d.title.toLowerCase().includes(q)).slice(0, 5) : [];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Paleta de comandos" description="Busque clientes, conversas, tickets, workflows, base de conhecimento e agentes">
      <CommandInput placeholder="Pesquisar qualquer coisa, ou executar um comando..." value={search} onValueChange={setSearch} />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        {!q && (
          <>
            <CommandGroup heading="Ações">
              <CommandItem onSelect={() => go("/tickets?new=1")}>
                <Plus /> Criar ticket
              </CommandItem>
              <CommandItem onSelect={() => go("/customers")}>
                <Users /> Buscar cliente
              </CommandItem>
              <CommandItem onSelect={() => go("/ai/agents/new")}>
                <Bot /> Abrir criador de agente de IA
              </CommandItem>
              <CommandItem onSelect={() => go("/automation/workflows/new")}>
                <Workflow /> Criar workflow
              </CommandItem>
              <CommandItem onSelect={() => go("/inbox")}>
                <Inbox /> Ver conversas não resolvidas
              </CommandItem>
              <CommandItem onSelect={() => go("/analytics")}>
                <BarChart3 /> Ir para Analytics
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navegar">
              <CommandItem onSelect={() => go("/overview")}>
                <LayoutDashboard /> Visão geral
              </CommandItem>
              <CommandItem onSelect={() => go("/inbox")}>
                <Inbox /> Caixa de entrada
              </CommandItem>
              <CommandItem onSelect={() => go("/customers")}>
                <Users /> Clientes
              </CommandItem>
              <CommandItem onSelect={() => go("/tickets")}>
                <Ticket /> Tickets
              </CommandItem>
              <CommandItem onSelect={() => go("/knowledge")}>
                <BookOpen /> Base de conhecimento
              </CommandItem>
              <CommandItem onSelect={() => go("/ai/agents")}>
                <Sparkles /> Agentes de IA
              </CommandItem>
              <CommandItem onSelect={() => go("/automation/workflows")}>
                <Workflow /> Workflows
              </CommandItem>
              <CommandItem onSelect={() => go("/settings")}>
                <Settings /> Configurações
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {matchedCustomers.length > 0 && (
          <CommandGroup heading="Clientes">
            {matchedCustomers.map((c) => (
              <CommandItem key={c.id} onSelect={() => go(`/customers/${c.id}`)}>
                <Users /> {c.name} <span className="text-muted-foreground">— {c.company}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedConversations.length > 0 && (
          <CommandGroup heading="Conversas">
            {matchedConversations.map((c) => (
              <CommandItem key={c.id} onSelect={() => go(`/inbox/${c.id}`)}>
                <Inbox /> {c.subject}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedTickets.length > 0 && (
          <CommandGroup heading="Tickets">
            {matchedTickets.map((t) => (
              <CommandItem key={t.id} onSelect={() => go(`/tickets/${t.id}`)}>
                <Ticket /> {t.id} — {t.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedAgents.length > 0 && (
          <CommandGroup heading="Agentes de IA">
            {matchedAgents.map((a) => (
              <CommandItem key={a.id} onSelect={() => go(`/ai/agents/${a.id}`)}>
                <Bot /> {a.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedWorkflows.length > 0 && (
          <CommandGroup heading="Workflows">
            {matchedWorkflows.map((w) => (
              <CommandItem key={w.id} onSelect={() => go(`/automation/workflows/${w.id}`)}>
                <Workflow /> {w.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedKnowledge.length > 0 && (
          <CommandGroup heading="Base de conhecimento">
            {matchedKnowledge.map((d) => (
              <CommandItem key={d.id} onSelect={() => go(`/knowledge/${d.id}`)}>
                <BookOpen /> {d.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
