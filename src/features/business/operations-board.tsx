"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { RiskBadge } from "@/components/domain/badges";
import { getProcessById } from "@/data/mock/processes";
import { getUserById } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import type { OperationalCase, OperationalCaseStatus } from "@/types";

const COLUMNS: { status: OperationalCaseStatus; label: string }[] = [
  { status: "open", label: "Aberto" },
  { status: "in_progress", label: "Em andamento" },
  { status: "resolved", label: "Resolvido" },
];

interface OperationsBoardProps {
  cases: OperationalCase[];
  /** Ao clicar num card — abre o caso para edição (status, severidade, responsável). */
  onCaseClick: (operationalCase: OperationalCase) => void;
}

export function OperationsBoard({ cases, onCaseClick }: OperationsBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {COLUMNS.map((col) => {
        const colCases = cases.filter((c) => c.status === col.status);
        return (
          <div key={col.status} className="w-80 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-foreground">{col.label}</p>
              <p className="text-xs text-muted-foreground">{colCases.length}</p>
            </div>
            <div className="space-y-2">
              {colCases.length === 0 && (
                <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">Nenhum caso</div>
              )}
              {colCases.map((c) => {
                const process = c.processId ? getProcessById(c.processId) : undefined;
                const assignee = c.assigneeId ? getUserById(c.assigneeId) : undefined;
                return (
                  <Card
                    key={c.id}
                    className="cursor-pointer py-3 transition-colors hover:bg-accent"
                    onClick={() => onCaseClick(c)}
                  >
                    <CardContent className="space-y-2 px-3">
                      <p className="text-sm font-medium text-foreground">{c.title}</p>
                      {process && <p className="text-xs text-muted-foreground">{process.name}</p>}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {assignee && <EntityAvatar name={assignee.name} size="xs" />}
                          <span className="text-xs text-muted-foreground">{formatRelative(c.createdAt)}</span>
                        </div>
                        <RiskBadge level={c.severity} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
