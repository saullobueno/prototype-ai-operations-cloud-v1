import { cn } from "@/lib/utils";
import type { AutonomyLevel, CustomerHealth, Priority } from "@/types";
import { Bot, CircleCheck, ShieldAlert, User, UserCheck, UserRoundCog } from "lucide-react";

const dotClass = "size-1.5 rounded-full";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; className: string }> = {
    low: { label: "Baixa", className: "bg-muted text-muted-foreground" },
    medium: { label: "Média", className: "bg-info/15 text-info dark:text-info" },
    high: { label: "Alta", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
    urgent: { label: "Urgente", className: "bg-danger/15 text-danger dark:text-danger" },
  };
  const { label, className } = map[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium", className)}>
      <span className={cn(dotClass, priorityDot(priority))} />
      {label}
    </span>
  );
}

function priorityDot(priority: Priority) {
  switch (priority) {
    case "urgent":
      return "bg-danger";
    case "high":
      return "bg-warning";
    case "medium":
      return "bg-info";
    default:
      return "bg-muted-foreground";
  }
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  open: { label: "Aberto", className: "bg-info/15 text-info" },
  pending: { label: "Pendente", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
  waiting: { label: "Aguardando", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
  in_progress: { label: "Em andamento", className: "bg-info/15 text-info" },
  // Estados exclusivos de Task — cada um com uma cor própria para não colidir visualmente na mesma lista.
  new: { label: "Novo", className: "bg-muted text-muted-foreground" },
  todo: { label: "A fazer", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
  review: { label: "Revisão", className: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
  done: { label: "Concluída", className: "bg-success/15 text-success dark:text-success" },
  canceled: { label: "Cancelada", className: "bg-danger/15 text-danger" },
  resolved: { label: "Resolvido", className: "bg-success/15 text-success dark:text-success" },
  closed: { label: "Fechado", className: "bg-muted text-muted-foreground" },
  active: { label: "Ativo", className: "bg-success/15 text-success dark:text-success" },
  invited: { label: "Convidado", className: "bg-info/15 text-info" },
  suspended: { label: "Suspenso", className: "bg-danger/15 text-danger" },
  paused: { label: "Pausado", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  success: { label: "Sucesso", className: "bg-success/15 text-success dark:text-success" },
  failed: { label: "Falhou", className: "bg-danger/15 text-danger" },
  running: { label: "Em execução", className: "bg-info/15 text-info" },
  completed: { label: "Concluído", className: "bg-success/15 text-success dark:text-success" },
  escalated: { label: "Escalado", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
  connected: { label: "Conectado", className: "bg-success/15 text-success dark:text-success" },
  disconnected: { label: "Desconectado", className: "bg-muted text-muted-foreground" },
  error: { label: "Erro", className: "bg-danger/15 text-danger" },
  pending_approval: { label: "Aguardando aprovação", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
  approved: { label: "Aprovado", className: "bg-success/15 text-success dark:text-success" },
  rejected: { label: "Rejeitado", className: "bg-danger/15 text-danger" },
};

export function StatusBadge({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium", entry.className)}>
      <span className={cn(dotClass, entry.className.includes("success") ? "bg-success" : entry.className.includes("danger") ? "bg-danger" : entry.className.includes("warning") ? "bg-warning" : entry.className.includes("info") ? "bg-info" : entry.className.includes("violet") ? "bg-violet-500" : "bg-muted-foreground")} />
      {entry.label}
    </span>
  );
}

export function HealthBadge({ health }: { health: CustomerHealth }) {
  const map: Record<CustomerHealth, { label: string; className: string }> = {
    healthy: { label: "Saudável", className: "bg-success/15 text-success dark:text-success" },
    at_risk: { label: "Em risco", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
    critical: { label: "Crítico", className: "bg-danger/15 text-danger" },
  };
  const { label, className } = map[health];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium", className)}>
      <span className={cn(dotClass, health === "healthy" ? "bg-success" : health === "at_risk" ? "bg-warning" : "bg-danger")} />
      {label}
    </span>
  );
}

const AUTONOMY_MAP: Record<AutonomyLevel, { label: string; icon: typeof Bot }> = {
  autonomous: { label: "Autônomo", icon: Bot },
  assisted: { label: "Assistido", icon: UserRoundCog },
  approval_required: { label: "Aprovação humana", icon: UserCheck },
  human_only: { label: "Somente humano", icon: User },
};

export function AutonomyBadge({ level }: { level: AutonomyLevel }) {
  const { label, icon: Icon } = AUTONOMY_MAP[level];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      <Icon className="size-3" />
      {label}
    </span>
  );
}

export function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const map = {
    low: { label: "Risco baixo", className: "bg-muted text-muted-foreground" },
    medium: { label: "Risco médio", className: "bg-warning/15 text-warning-foreground dark:text-warning" },
    high: { label: "Risco alto", className: "bg-danger/15 text-danger" },
  } as const;
  const { label, className } = map[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium", className)}>
      <ShieldAlert className="size-3" />
      {label}
    </span>
  );
}

export function SuccessDot() {
  return <CircleCheck className="size-3.5 text-success" />;
}
