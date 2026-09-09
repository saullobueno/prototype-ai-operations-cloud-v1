import type { Onboarding, OnboardingStep } from "@/types";
import { daysAgo, monthsAgo } from "@/lib/time";

// Etapas do workflow de onboarding conforme docs/AI_OPERATIONS_CLOUD_COMPLETE_SPEC.md §10:
// Employee Created -> Role Identified -> Onboarding Process -> Equipment Request ->
// Accounts Request -> Documents -> Manager Notification -> Tasks -> Completion.
const STEP_LABELS: { id: string; label: string; ownerType: OnboardingStep["ownerType"] }[] = [
  { id: "step_employee_created", label: "Colaborador criado", ownerType: "system" },
  { id: "step_role_identified", label: "Cargo identificado", ownerType: "system" },
  { id: "step_onboarding_process", label: "Processo de onboarding iniciado", ownerType: "agent" },
  { id: "step_equipment_request", label: "Solicitação de equipamento", ownerType: "agent" },
  { id: "step_accounts_request", label: "Solicitação de contas e acessos", ownerType: "agent" },
  { id: "step_documents", label: "Documentos", ownerType: "human" },
  { id: "step_manager_notification", label: "Notificação ao gestor", ownerType: "system" },
  { id: "step_tasks", label: "Tarefas de integração", ownerType: "human" },
  { id: "step_completion", label: "Conclusão", ownerType: "system" },
];

/** Gera as 9 etapas todas concluídas, usada para onboardings históricos já finalizados. */
function allDoneSteps(startedAt: string): OnboardingStep[] {
  return STEP_LABELS.map((s) => ({ id: s.id, label: s.label, ownerType: s.ownerType, status: "done", completedAt: startedAt }));
}

export const onboardings: Onboarding[] = [
  // Marina Costa (emp_005) — em andamento, nas etapas de documentos.
  {
    id: "onb_001",
    employeeId: "emp_005",
    status: "in_progress",
    startedAt: daysAgo(9),
    steps: [
      { id: "step_employee_created", label: "Colaborador criado", ownerType: "system", status: "done", completedAt: daysAgo(9) },
      { id: "step_role_identified", label: "Cargo identificado", ownerType: "system", status: "done", completedAt: daysAgo(9) },
      { id: "step_onboarding_process", label: "Processo de onboarding iniciado", ownerType: "agent", status: "done", completedAt: daysAgo(8) },
      { id: "step_equipment_request", label: "Solicitação de equipamento", ownerType: "agent", status: "done", completedAt: daysAgo(7) },
      { id: "step_accounts_request", label: "Solicitação de contas e acessos", ownerType: "agent", status: "done", completedAt: daysAgo(6) },
      { id: "step_documents", label: "Documentos", ownerType: "human", status: "in_progress" },
      { id: "step_manager_notification", label: "Notificação ao gestor", ownerType: "system", status: "done", completedAt: daysAgo(9) },
      { id: "step_tasks", label: "Tarefas de integração", ownerType: "human", status: "pending" },
      { id: "step_completion", label: "Conclusão", ownerType: "system", status: "pending" },
    ],
  },
  // Isabela Rezende (emp_027) — atrasada: solicitação de equipamento bloqueada.
  {
    id: "onb_002",
    employeeId: "emp_027",
    status: "delayed",
    startedAt: daysAgo(3),
    steps: [
      { id: "step_employee_created", label: "Colaborador criado", ownerType: "system", status: "done", completedAt: daysAgo(3) },
      { id: "step_role_identified", label: "Cargo identificado", ownerType: "system", status: "done", completedAt: daysAgo(3) },
      { id: "step_onboarding_process", label: "Processo de onboarding iniciado", ownerType: "agent", status: "done", completedAt: daysAgo(3) },
      { id: "step_equipment_request", label: "Solicitação de equipamento", ownerType: "agent", status: "blocked" },
      { id: "step_accounts_request", label: "Solicitação de contas e acessos", ownerType: "agent", status: "in_progress" },
      { id: "step_documents", label: "Documentos", ownerType: "human", status: "pending" },
      { id: "step_manager_notification", label: "Notificação ao gestor", ownerType: "system", status: "done", completedAt: daysAgo(3) },
      { id: "step_tasks", label: "Tarefas de integração", ownerType: "human", status: "pending" },
      { id: "step_completion", label: "Conclusão", ownerType: "system", status: "pending" },
    ],
  },
  // Históricos, já concluídos.
  { id: "onb_003", employeeId: "emp_020", status: "completed", startedAt: monthsAgo(3), completedAt: daysAgo(75), steps: allDoneSteps(monthsAgo(3)) },
  { id: "onb_004", employeeId: "emp_013", status: "completed", startedAt: monthsAgo(6), completedAt: daysAgo(168), steps: allDoneSteps(monthsAgo(6)) },
  { id: "onb_005", employeeId: "emp_019", status: "completed", startedAt: monthsAgo(5), completedAt: daysAgo(138), steps: allDoneSteps(monthsAgo(5)) },
  { id: "onb_006", employeeId: "emp_034", status: "completed", startedAt: monthsAgo(5), completedAt: daysAgo(140), steps: allDoneSteps(monthsAgo(5)) },
];

export function getOnboardingByEmployee(employeeId: string) {
  return onboardings.find((o) => o.employeeId === employeeId);
}

/** Cria um onboarding novo (1ª etapa já concluída) para um colaborador recém-contratado — o ponto de
 * entrada natural de um Onboarding é a contratação de um candidato, não um botão solto na listagem. */
export function createOnboardingForEmployee(employeeId: string): Onboarding {
  const now = new Date().toISOString();
  const steps: OnboardingStep[] = STEP_LABELS.map((s, i) => ({
    id: s.id,
    label: s.label,
    ownerType: s.ownerType,
    status: i === 0 ? "done" : "pending",
    completedAt: i === 0 ? now : undefined,
  }));
  const onboarding: Onboarding = { id: `onb_${Date.now()}`, employeeId, status: "in_progress", startedAt: now, steps };
  onboardings.push(onboarding);
  return onboarding;
}

export function updateOnboardingStep(onboardingId: string, stepId: string, status: OnboardingStep["status"]) {
  const onboarding = onboardings.find((o) => o.id === onboardingId);
  if (!onboarding) return;
  const step = onboarding.steps.find((s) => s.id === stepId);
  if (!step) return;
  step.status = status;
  step.completedAt = status === "done" ? new Date().toISOString() : undefined;
  if (onboarding.steps.every((s) => s.status === "done")) {
    onboarding.status = "completed";
    onboarding.completedAt = new Date().toISOString();
  }
}
