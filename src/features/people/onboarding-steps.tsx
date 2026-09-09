import { Bot, Cog, User as UserIcon } from "lucide-react";
import { OnboardingStepIcon } from "@/features/people/people-badges";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OnboardingStep } from "@/types";

const OWNER_ICON = { human: UserIcon, agent: Bot, system: Cog };
const OWNER_LABEL = { human: "Humano", agent: "Agente de IA", system: "Sistema" };

/** Visualização do workflow de onboarding (Employee Created -> ... -> Completion), ver spec §10. */
export function OnboardingStepsList({ steps }: { steps: OnboardingStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const OwnerIcon = OWNER_ICON[step.ownerType];
        const isLast = i === steps.length - 1;
        return (
          <div key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && <span className="absolute left-[7px] top-5 h-full w-px bg-border" />}
            <div className="z-10 mt-0.5 shrink-0 rounded-full bg-card">
              <OnboardingStepIcon status={step.status} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className={cn("text-sm font-medium", step.status === "pending" ? "text-muted-foreground" : "text-foreground")}>{step.label}</p>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <OwnerIcon className="size-3" />
                  {OWNER_LABEL[step.ownerType]}
                </span>
              </div>
              {step.completedAt && <p className="text-xs text-muted-foreground">Concluído em {formatDateTime(step.completedAt)}</p>}
              {step.status === "blocked" && <p className="text-xs text-danger">Bloqueado — precisa de atenção humana</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
