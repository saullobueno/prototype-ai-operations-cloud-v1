"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { OperationsBoard } from "@/features/business/operations-board";
import { CaseFormDialog } from "@/features/business/case-form-dialog";
import { operationalCases } from "@/data/mock/operationalCases";
import type { OperationalCase } from "@/types";

export default function OperationsBoardPage() {
  // Espelha o array compartilhado `operationalCases` em estado local só para forçar o
  // re-render quando um caso é criado ou editado (mesma referência mutada).
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCase, setEditCase] = useState<OperationalCase | null>(null);

  return (
    <PageContainer>
      <PageHeader
        title="Quadro de operações"
        description={`${operationalCases.length} casos operacionais em andamento neste workspace`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Novo caso
          </Button>
        }
      />
      <OperationsBoard key={version} cases={operationalCases} onCaseClick={setEditCase} />

      <CaseFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <CaseFormDialog
        operationalCase={editCase ?? undefined}
        open={editCase !== null}
        onOpenChange={(next) => {
          if (!next) setEditCase(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />
    </PageContainer>
  );
}
