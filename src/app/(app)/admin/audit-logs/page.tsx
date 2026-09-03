"use client";

import { useMemo, useState } from "react";
import { SettingsSection } from "@/components/layout/settings-section";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { agents, auditLogs, getUserById } from "@/data/mock";
import { formatDateTime } from "@/lib/format";

function actorName(actorType: string, actorId: string) {
  if (actorType === "human") return getUserById(actorId)?.name ?? actorId;
  if (actorType === "agent") return agents.find((a) => a.id === actorId)?.name ?? actorId;
  return "Sistema";
}

export default function AuditLogsPage() {
  const [actorType, setActorType] = useState("all");

  const filtered = useMemo(() => {
    const list = [...auditLogs].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return actorType === "all" ? list : list.filter((l) => l.actorType === actorType);
  }, [actorType]);

  return (
    <SettingsSection title="Audit Logs" description="Um registro somente leitura de cada ação tomada por humanos, agentes e o sistema.">
      <div className="flex justify-end">
        <Select value={actorType} onValueChange={setActorType}>
          <SelectTrigger size="sm" className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os autores</SelectItem>
            <SelectItem value="human">Humano</SelectItem>
            <SelectItem value="agent">Agente</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Alvo</TableHead>
              <TableHead>Quando</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <span className="flex items-center gap-2"><EntityAvatar name={actorName(log.actorType, log.actorId)} size="xs" />{actorName(log.actorType, log.actorId)}</span>
                </TableCell>
                <TableCell className="font-mono text-xs">{log.action}</TableCell>
                <TableCell className="text-muted-foreground">{log.targetType} · {log.targetId}</TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(log.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SettingsSection>
  );
}
