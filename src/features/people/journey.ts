import type { Activity } from "@/types";
import { daysAgo } from "@/lib/time";
import { getEmployeeById } from "@/data/mock/employees";
import { getOnboardingByEmployee } from "@/data/mock/onboardings";
import { getOffboardingByEmployee } from "@/data/mock/offboardings";
import { getGoalsByEmployee } from "@/data/mock/goals";
import { getReviewsByEmployee } from "@/data/mock/performanceReviews";
import { getRequestsByEmployee } from "@/data/mock/peopleRequests";
import { getFeedbackByEmployee } from "@/data/mock/peopleFeedback";
import { getMobilityByEmployee } from "@/data/mock/peopleMobility";
import { PEOPLE_REQUEST_TYPE_LABEL } from "@/features/people/people-badges";
import { formatDate } from "@/lib/format";

// PerformanceReview não tem campo de data — aproximamos por ciclo só para posicionar o evento na
// linha do tempo (dado ilustrativo, mesmo espírito de src/data/mock/salesAnalyticsSeries.ts).
const CYCLE_APPROX_DATE: Record<string, string> = {
  "2025 H1": daysAgo(240),
  "2025 H2": daysAgo(90),
  "2026 H1": daysAgo(20),
};

/**
 * Monta a "Journey" do colaborador — timeline unificada de onboarding, metas, avaliações,
 * solicitações, feedback e mobilidade interna — reaproveitando o tipo `Activity` e o agrupador
 * `groupActivitiesByDay` já usados pela Timeline do Customer 360 (mesmo padrão de UI).
 */
export function buildEmployeeJourney(employeeId: string): Activity[] {
  const employee = getEmployeeById(employeeId);
  const onboarding = getOnboardingByEmployee(employeeId);
  const offboarding = getOffboardingByEmployee(employeeId);
  const goals = getGoalsByEmployee(employeeId);
  const reviews = getReviewsByEmployee(employeeId);
  const requests = getRequestsByEmployee(employeeId);
  const feedback = getFeedbackByEmployee(employeeId);
  const mobility = getMobilityByEmployee(employeeId);

  const items: Activity[] = [];
  let seq = 0;
  const push = (action: string, createdAt: string, actorType: Activity["actorType"] = "system", actorId = "system") => {
    items.push({ id: `journey_${employeeId}_${seq++}`, actorType, actorId, action, relatedType: "employee", relatedId: employeeId, createdAt });
  };

  if (employee) push(`Ingressou na empresa como ${employee.title}`, employee.startDate, "system");

  if (onboarding) {
    push("Onboarding iniciado", onboarding.startedAt, "agent", "agent_people_onboarding");
    for (const step of onboarding.steps) {
      if (step.status === "done" && step.completedAt) {
        push(`Etapa de onboarding concluída: ${step.label}`, step.completedAt, step.ownerType === "human" ? "human" : step.ownerType === "agent" ? "agent" : "system", step.ownerType === "agent" ? "agent_people_onboarding" : employeeId);
      }
    }
    if (onboarding.completedAt) push("Onboarding concluído", onboarding.completedAt, "system");
  }

  for (const mob of mobility) {
    const label = mob.type === "promotion" ? "Promoção" : mob.type === "lateral_move" ? "Movimentação lateral" : "Transferência de departamento";
    push(`${label}: ${mob.fromTitle} → ${mob.toTitle}`, mob.effectiveDate, "human");
  }

  for (const goal of goals) {
    if (goal.status === "achieved") push(`Meta alcançada: ${goal.title}`, goal.dueDate, "human", employeeId);
  }

  for (const review of reviews) {
    if (review.status === "completed") {
      const date = CYCLE_APPROX_DATE[review.cycle] ?? daysAgo(60);
      push(`Avaliação de performance concluída — ciclo ${review.cycle}${review.rating ? ` (nota ${review.rating.toFixed(1)})` : ""}`, date, "human");
    } else if (review.status === "scheduled") {
      const date = CYCLE_APPROX_DATE[review.cycle] ?? daysAgo(5);
      push(`Avaliação de performance agendada — ciclo ${review.cycle}`, date, "system");
    }
  }

  for (const req of requests) {
    const label = PEOPLE_REQUEST_TYPE_LABEL[req.type];
    const verb = req.status === "pending" ? "criada, aguardando aprovação" : req.status === "approved" ? "aprovada" : "rejeitada";
    push(`Solicitação de ${label} ${verb}`, req.createdAt, "human", employeeId);
  }

  for (const fb of feedback) {
    push(`Recebeu feedback de um colega`, fb.createdAt, "human");
  }

  if (offboarding) {
    push(`Processo de desligamento iniciado — último dia em ${formatDate(offboarding.lastDay)}`, daysAgo(5), "human");
  }

  return items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
