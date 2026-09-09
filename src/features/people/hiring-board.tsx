"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { CandidateFormDialog } from "@/features/people/candidate-form-dialog";
import { formatDate } from "@/lib/format";
import type { Candidate, CandidateStage } from "@/types";

const STAGES: { id: CandidateStage; label: string }[] = [
  { id: "applied", label: "Aplicou" },
  { id: "screening", label: "Triagem" },
  { id: "interview", label: "Entrevista" },
  { id: "offer", label: "Oferta" },
  { id: "hired", label: "Contratado" },
  { id: "rejected", label: "Rejeitado" },
];

interface HiringBoardProps {
  candidates: Candidate[];
  /** Notifica o pai (que filtra `candidates` por estágio) para recalcular após uma edição de etapa. */
  onChanged?: () => void;
}

export function HiringBoard({ candidates, onChanged }: HiringBoardProps) {
  const router = useRouter();
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {STAGES.map((stage) => {
        const stageCandidates = candidates.filter((c) => c.stage === stage.id);
        return (
          <div key={stage.id} className="w-64 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-foreground">{stage.label}</p>
              <p className="text-xs text-muted-foreground">{stageCandidates.length}</p>
            </div>
            <div className="space-y-2">
              {stageCandidates.length === 0 && (
                <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">Sem candidatos</div>
              )}
              {stageCandidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className="cursor-pointer py-3 transition-colors hover:bg-accent"
                  onClick={() => router.push(`/modules/people/candidates/${candidate.id}`)}
                >
                  <CardContent className="space-y-2 px-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <EntityAvatar name={candidate.name} size="xs" />
                        <p className="truncate text-sm font-medium text-foreground">{candidate.name}</p>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs" className="shrink-0">
                              <MoreHorizontal />
                              <span className="sr-only">Ações do candidato</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditCandidate(candidate)}>Editar / mudar etapa</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{candidate.role}</p>
                    <p className="text-xs text-muted-foreground">Aplicou em {formatDate(candidate.appliedAt)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      <CandidateFormDialog
        candidate={editCandidate ?? undefined}
        open={editCandidate !== null}
        onOpenChange={(next) => {
          if (!next) setEditCandidate(null);
        }}
        onSave={() => onChanged?.()}
      />
    </div>
  );
}
