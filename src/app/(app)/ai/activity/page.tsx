"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, Check, X } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { AutonomyBadge, StatusBadge } from "@/components/domain/badges";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { agents, approvals as approvalsStore, agentRuns, CURRENT_USER_ID, getCustomerById } from "@/data/mock";
import { decideApproval } from "@/features/governance/decide-approval";
import { formatCurrency, formatDateTime } from "@/lib/format";

const APPROVAL_TYPE_LABEL: Record<string, string> = {
  refund: "Reembolso",
  account_deletion: "Exclusão de conta",
  subscription_change: "Mudança de assinatura",
  escalation: "Escalonamento",
};

export default function AIActivityPage() {
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [approvals, setApprovals] = useState(approvalsStore);
  // Espelha agentRuns em estado local só para forçar o re-render da tabela quando uma
  // aprovação vinculada a um run altera o status/steps desse run (mesma referência mutada).
  const [runsVersion, setRunsVersion] = useState(0);

  const runs = useMemo(() => {
    const list = [...agentRuns].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
    return agentFilter === "all" ? list : list.filter((r) => r.agentId === agentFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentFilter, runsVersion]);

  function decide(id: string, status: "approved" | "rejected") {
    decideApproval(id, status, CURRENT_USER_ID);
    setApprovals([...approvalsStore]);
    setRunsVersion((v) => v + 1);
    toast.success(status === "approved" ? "Aprovado" : "Rejeitado", {
      description:
        status === "approved"
          ? "A execução do agente foi marcada como concluída e uma atividade foi registrada na timeline do cliente."
          : "A execução do agente foi encerrada sem ação e uma atividade foi registrada na timeline do cliente.",
    });
  }

  const pending = approvals.filter((a) => a.status === "pending");

  return (
    <PageContainer>
      <PageHeader title="AI Activity" description="Cada ação que seu AI Workforce tomou, e o que está esperando aprovação humana." />

      {pending.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-sm font-medium text-foreground">Aprovações pendentes</p>
          {pending.map((a) => {
            const customer = a.customerId ? getCustomerById(a.customerId) : undefined;
            return (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/[0.06] px-4 py-3">
                <div className="max-w-xl">
                  <p className="text-sm font-medium text-foreground">
                    {APPROVAL_TYPE_LABEL[a.type] ?? a.type} {a.amountCents ? `— ${formatCurrency(a.amountCents)}` : ""} {customer && `— ${customer.name}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.context}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(a.id, "rejected")}>
                    <X className="size-3.5" /> Rejeitar
                  </Button>
                  <Button size="sm" className="gap-1" onClick={() => decide(a.id, "approved")}>
                    <Check className="size-3.5" /> Aprovar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger size="sm" className="w-56"><SelectValue placeholder="Filtrar por agente" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os agentes</SelectItem>
            {agents.map((a) => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {runs.length === 0 ? (
        <EmptyState icon={Activity} title="Nenhuma atividade de IA ainda" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente</TableHead>
                <TableHead>Autonomia</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quando</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((r) => {
                const agent = agents.find((a) => a.id === r.agentId);
                const customer = r.customerId ? getCustomerById(r.customerId) : undefined;
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link href={`/ai/agents/${r.agentId}/runs/${r.id}`} className="font-medium text-foreground hover:underline">
                        {agent?.name}
                      </Link>
                    </TableCell>
                    <TableCell>{agent && <AutonomyBadge level={agent.autonomyLevel} />}</TableCell>
                    <TableCell className="text-muted-foreground">{customer?.name ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(r.startedAt)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
