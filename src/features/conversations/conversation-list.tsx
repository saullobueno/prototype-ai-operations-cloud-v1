"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Inbox, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { EmptyState } from "@/components/domain/empty-state";
import { conversations, getCustomerById, CURRENT_USER_ID } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

type ViewFilter = "all" | "unassigned" | "mine" | "escalated" | "urgent";

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-danger",
  high: "bg-warning",
  medium: "bg-info",
  low: "bg-muted-foreground",
};

export function ConversationList() {
  const params = useParams<{ conversationId?: string }>();
  const activeId = params?.conversationId;
  const [view, setView] = useState<ViewFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = [...conversations].sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt));
    if (view === "unassigned") list = list.filter((c) => !c.assigneeId);
    if (view === "mine") list = list.filter((c) => c.assigneeId === CURRENT_USER_ID);
    if (view === "escalated") list = list.filter((c) => c.assigneeType === "human" && c.status !== "resolved" && c.status !== "closed");
    if (view === "urgent") list = list.filter((c) => c.priority === "urgent" || c.priority === "high");
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => {
        const customer = getCustomerById(c.customerId);
        return c.subject.toLowerCase().includes(q) || customer?.name.toLowerCase().includes(q);
      });
    }
    return list;
  }, [view, query]);

  return (
    <div className="flex h-full w-full flex-col md:w-80 md:border-r md:border-border">
      <div className="space-y-2 border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar conversas..." className="h-8 pl-7 text-sm" />
        </div>
        <Select value={view} onValueChange={(v) => setView(v as ViewFilter)}>
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as conversas</SelectItem>
            <SelectItem value="unassigned">Sem responsável</SelectItem>
            <SelectItem value="mine">Minhas conversas</SelectItem>
            <SelectItem value="escalated">Escaladas para humano</SelectItem>
            <SelectItem value="urgent">Prioridade alta e urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="Nenhuma conversa corresponde aos filtros" className="border-none" />
        ) : (
          filtered.map((c) => {
            const customer = getCustomerById(c.customerId);
            const active = c.id === activeId;
            return (
              <Link
                key={c.id}
                href={`/inbox/${c.id}`}
                className={cn(
                  "flex gap-2.5 border-b border-border px-3 py-2.5 transition-colors hover:bg-accent",
                  active && "bg-primary/5"
                )}
              >
                <div className="relative shrink-0">
                  <EntityAvatar name={customer?.name ?? "?"} size="sm" />
                  <span className={cn("absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-background", PRIORITY_DOT[c.priority])} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("truncate text-sm", active ? "font-semibold text-foreground" : "font-medium text-foreground")}>{customer?.name}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{formatRelative(c.lastMessageAt)}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.subject}</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
