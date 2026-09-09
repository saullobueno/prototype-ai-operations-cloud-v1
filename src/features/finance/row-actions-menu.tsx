"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface RowAction {
  key: string;
  label: string;
  destructive?: boolean;
  onSelect: () => void;
  /** Se presente, a ação abre um dialog de confirmação simples (mesmo padrão de src/features/tasks/task-row.tsx) antes de rodar onSelect. */
  confirm?: { title: string; description: string; confirmLabel?: string };
}

/**
 * Menu de ações por linha (Editar/Excluir/etc.), reutilizado nas listagens de Finance Operations.
 * O botão de trigger recebe stopPropagation porque várias listagens usam ClickableTableRow — sem
 * isso, abrir o menu também dispararia a navegação da linha.
 */
export function RowActionsMenu({ actions, label = "Ações" }: { actions: RowAction[]; label?: string }) {
  const [pending, setPending] = useState<RowAction | null>(null);

  if (actions.length === 0) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal />
            <span className="sr-only">{label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((a) => (
            <DropdownMenuItem
              key={a.key}
              variant={a.destructive ? "destructive" : undefined}
              onSelect={() => (a.confirm ? setPending(a) : a.onSelect())}
            >
              {a.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent className="sm:max-w-sm">
          {pending?.confirm && (
            <>
              <DialogHeader>
                <DialogTitle>{pending.confirm.title}</DialogTitle>
                <DialogDescription>{pending.confirm.description}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPending(null)}>
                  Cancelar
                </Button>
                <Button
                  variant={pending.destructive ? "destructive" : "default"}
                  onClick={() => {
                    pending.onSelect();
                    setPending(null);
                  }}
                >
                  {pending.confirm.confirmLabel ?? "Confirmar"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
