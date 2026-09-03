"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { notifications as notificationsStore } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

// Persistência simplificada: grava de volta no array compartilhado para que o estado de
// leitura sobreviva à navegação dentro da sessão — não sobrevive a um reload.
// Ver docs/06-fluxos-e-ai-moments.md.
export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(notificationsStore);
  const unread = notifications.filter((n) => !n.read).length;

  function markRead(id: string) {
    const n = notificationsStore.find((n) => n.id === id);
    if (n) n.read = true;
    setNotifications([...notificationsStore]);
  }

  function markAllRead() {
    notificationsStore.forEach((n) => {
      n.read = true;
    });
    setNotifications([...notificationsStore]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full bg-danger" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>
          {unread > 0 && (
            <button className="text-xs font-medium text-primary hover:underline" onClick={markAllRead}>
              Marcar todas como lidas
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              role={n.read ? undefined : "button"}
              tabIndex={n.read ? undefined : 0}
              onClick={n.read ? undefined : () => markRead(n.id)}
              onKeyDown={n.read ? undefined : (e) => e.key === "Enter" && markRead(n.id)}
              className={cn(
                "flex gap-2 border-b border-border px-3 py-2.5 last:border-0",
                !n.read && "cursor-pointer bg-primary/5 hover:bg-primary/10"
              )}
            >
              <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", !n.read ? "bg-primary" : "bg-transparent")} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{formatRelative(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
