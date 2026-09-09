"use client";

import { ArrowRightLeft } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { ClickableTableRow } from "@/components/domain/clickable-table-row";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mobilityEvents, type MobilityType } from "@/data/mock/peopleMobility";
import { getEmployeeById } from "@/data/mock/employees";
import { formatDate } from "@/lib/format";

const TYPE_LABEL: Record<MobilityType, string> = {
  promotion: "Promoção",
  lateral_move: "Movimentação lateral",
  department_transfer: "Transferência de departamento",
};

export default function MobilityPage() {
  const sorted = [...mobilityEvents].sort((a, b) => +new Date(b.effectiveDate) - +new Date(a.effectiveDate));

  return (
    <PageContainer>
      <PageHeader title="Mobilidade interna" description={`${mobilityEvents.length} movimentações registradas`} />

      {sorted.length === 0 ? (
        <EmptyState icon={ArrowRightLeft} title="Nenhuma movimentação registrada" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>De</TableHead>
                <TableHead>Para</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((event) => {
                const employee = getEmployeeById(event.employeeId);
                if (!employee) return null;
                return (
                  <ClickableTableRow key={event.id} href={`/modules/people/employees/${employee.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <EntityAvatar name={employee.name} size="sm" />
                        <p className="font-medium text-foreground">{employee.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{TYPE_LABEL[event.type]}</TableCell>
                    <TableCell className="text-muted-foreground">{event.fromTitle}</TableCell>
                    <TableCell className="font-medium text-foreground">{event.toTitle}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(event.effectiveDate)}</TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
