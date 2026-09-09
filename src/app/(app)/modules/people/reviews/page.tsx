"use client";

import { useState } from "react";
import { ClipboardList, MoreHorizontal, Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReviewStatusBadge } from "@/features/people/people-badges";
import { ReviewFormDialog } from "@/features/people/review-form-dialog";
import { performanceReviews } from "@/data/mock/performanceReviews";
import { getEmployeeById } from "@/data/mock/employees";
import { getDepartmentById } from "@/data/mock/departments";
import type { PerformanceReview } from "@/types";

export default function ReviewsPage() {
  // Espelha o array compartilhado `performanceReviews` em estado local só para forçar o re-render
  // quando uma avaliação é criada ou corrigida (mesma referência mutada). Não há exclusão pela
  // listagem — avaliação é registro histórico oficial.
  const [version, setVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editReview, setEditReview] = useState<PerformanceReview | null>(null);

  return (
    <PageContainer>
      <PageHeader
        title="Avaliações"
        description={`${performanceReviews.length} avaliações de performance registradas`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Nova avaliação
          </Button>
        }
      />

      {performanceReviews.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhuma avaliação registrada" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border" key={version}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Nota</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceReviews.map((review) => {
                const employee = getEmployeeById(review.employeeId);
                if (!employee) return null;
                const department = getDepartmentById(employee.departmentId);
                return (
                  <ClickableTableRow key={review.id} href={`/modules/people/employees/${employee.id}/performance`}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <EntityAvatar name={employee.name} size="sm" />
                        <p className="font-medium text-foreground">{employee.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{department?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{review.cycle}</TableCell>
                    <TableCell>
                      <ReviewStatusBadge status={review.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">{review.rating ? review.rating.toFixed(1) : "—"}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                            <span className="sr-only">Ações da avaliação</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setEditReview(review)}>Editar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ReviewFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={() => setVersion((v) => v + 1)} />
      <ReviewFormDialog
        review={editReview ?? undefined}
        open={editReview !== null}
        onOpenChange={(next) => {
          if (!next) setEditReview(null);
        }}
        onSave={() => setVersion((v) => v + 1)}
      />
    </PageContainer>
  );
}
