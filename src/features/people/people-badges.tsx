import { CheckCircle2, CircleDashed, CircleDot, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidateStage, EmploymentStatus, Goal, OnboardingStepStatus, PeopleRequestType, ReviewStatus } from "@/types";

const dotClass = "size-1.5 rounded-full";

function Badge({ label, className, dotColor }: { label: string; className: string; dotColor: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium", className)}>
      <span className={cn(dotClass, dotColor)} />
      {label}
    </span>
  );
}

const EMPLOYMENT_STATUS_MAP: Record<EmploymentStatus, { label: string; className: string; dotColor: string }> = {
  active: { label: "Ativo", className: "bg-success/15 text-success dark:text-success", dotColor: "bg-success" },
  onboarding: { label: "Onboarding", className: "bg-info/15 text-info", dotColor: "bg-info" },
  on_leave: { label: "Licença", className: "bg-warning/15 text-warning-foreground dark:text-warning", dotColor: "bg-warning" },
  offboarding: { label: "Offboarding", className: "bg-warning/15 text-warning-foreground dark:text-warning", dotColor: "bg-warning" },
  terminated: { label: "Desligado", className: "bg-muted text-muted-foreground", dotColor: "bg-muted-foreground" },
};

export function EmploymentStatusBadge({ status }: { status: EmploymentStatus }) {
  const entry = EMPLOYMENT_STATUS_MAP[status];
  return <Badge {...entry} />;
}

const CANDIDATE_STAGE_MAP: Record<CandidateStage, { label: string; className: string; dotColor: string }> = {
  applied: { label: "Aplicou", className: "bg-muted text-muted-foreground", dotColor: "bg-muted-foreground" },
  screening: { label: "Triagem", className: "bg-info/15 text-info", dotColor: "bg-info" },
  interview: { label: "Entrevista", className: "bg-violet-500/15 text-violet-600 dark:text-violet-400", dotColor: "bg-violet-500" },
  offer: { label: "Oferta", className: "bg-warning/15 text-warning-foreground dark:text-warning", dotColor: "bg-warning" },
  hired: { label: "Contratado", className: "bg-success/15 text-success dark:text-success", dotColor: "bg-success" },
  rejected: { label: "Rejeitado", className: "bg-danger/15 text-danger", dotColor: "bg-danger" },
};

export function CandidateStageBadge({ stage }: { stage: CandidateStage }) {
  const entry = CANDIDATE_STAGE_MAP[stage];
  return <Badge {...entry} />;
}

const GOAL_STATUS_MAP: Record<Goal["status"], { label: string; className: string; dotColor: string }> = {
  on_track: { label: "No prazo", className: "bg-success/15 text-success dark:text-success", dotColor: "bg-success" },
  at_risk: { label: "Em risco", className: "bg-warning/15 text-warning-foreground dark:text-warning", dotColor: "bg-warning" },
  achieved: { label: "Alcançada", className: "bg-info/15 text-info", dotColor: "bg-info" },
};

export function GoalStatusBadge({ status }: { status: Goal["status"] }) {
  const entry = GOAL_STATUS_MAP[status];
  return <Badge {...entry} />;
}

const REVIEW_STATUS_MAP: Record<ReviewStatus, { label: string; className: string; dotColor: string }> = {
  scheduled: { label: "Agendada", className: "bg-muted text-muted-foreground", dotColor: "bg-muted-foreground" },
  in_progress: { label: "Em andamento", className: "bg-info/15 text-info", dotColor: "bg-info" },
  completed: { label: "Concluída", className: "bg-success/15 text-success dark:text-success", dotColor: "bg-success" },
};

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const entry = REVIEW_STATUS_MAP[status];
  return <Badge {...entry} />;
}

const ONBOARDING_STATUS_MAP: Record<"in_progress" | "completed" | "delayed", { label: string; className: string; dotColor: string }> = {
  in_progress: { label: "Em andamento", className: "bg-info/15 text-info", dotColor: "bg-info" },
  completed: { label: "Concluído", className: "bg-success/15 text-success dark:text-success", dotColor: "bg-success" },
  delayed: { label: "Atrasado", className: "bg-danger/15 text-danger", dotColor: "bg-danger" },
};

export function OnboardingStatusBadge({ status }: { status: "in_progress" | "completed" | "delayed" }) {
  const entry = ONBOARDING_STATUS_MAP[status];
  return <Badge {...entry} />;
}

export const PEOPLE_REQUEST_TYPE_LABEL: Record<PeopleRequestType, string> = {
  time_off: "Day off / Férias",
  equipment: "Equipamento",
  expense: "Despesa",
  internal_mobility: "Mobilidade interna",
  document: "Documento",
};

export function OnboardingStepIcon({ status }: { status: OnboardingStepStatus }) {
  if (status === "done") return <CheckCircle2 className="size-4 text-success" />;
  if (status === "in_progress") return <CircleDot className="size-4 text-info" />;
  if (status === "blocked") return <ShieldAlert className="size-4 text-danger" />;
  return <CircleDashed className="size-4 text-muted-foreground" />;
}
