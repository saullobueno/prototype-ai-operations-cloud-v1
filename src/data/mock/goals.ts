import type { Goal } from "@/types";
import { daysAgo } from "@/lib/time";

export const goals: Goal[] = [
  { id: "goal_001", employeeId: "emp_017", title: "Fechar €120k em novos negócios no Q3", progress: 72, status: "on_track", dueDate: daysAgo(-25) },
  { id: "goal_002", employeeId: "emp_017", title: "Certificação em metodologia de vendas consultivas", progress: 100, status: "achieved", dueDate: daysAgo(10) },
  { id: "goal_003", employeeId: "emp_017", title: "Reduzir ciclo médio de vendas em 15%", progress: 40, status: "at_risk", dueDate: daysAgo(-40) },
  { id: "goal_004", employeeId: "emp_012", title: "Lançar v2 do onboarding de produto", progress: 65, status: "on_track", dueDate: daysAgo(-15) },
  { id: "goal_005", employeeId: "emp_006", title: "Reduzir tempo médio de build em 30%", progress: 85, status: "on_track", dueDate: daysAgo(-5) },
  { id: "goal_006", employeeId: "emp_022", title: "Elevar NPS da carteira para 60+", progress: 30, status: "at_risk", dueDate: daysAgo(-20) },
  { id: "goal_007", employeeId: "emp_026", title: "Publicar 12 estudos de caso no trimestre", progress: 100, status: "achieved", dueDate: daysAgo(3) },
  { id: "goal_008", employeeId: "emp_009", title: "Migrar pipeline de CI/CD para o novo cluster", progress: 55, status: "on_track", dueDate: daysAgo(-30) },
  { id: "goal_009", employeeId: "emp_018", title: "Expandir carteira em 8 novas contas Enterprise", progress: 20, status: "at_risk", dueDate: daysAgo(-50) },
  { id: "goal_010", employeeId: "emp_029", title: "Implementar pesquisa de clima trimestral", progress: 90, status: "on_track", dueDate: daysAgo(-8) },
];

export function getGoalsByEmployee(employeeId: string) {
  return goals.filter((g) => g.employeeId === employeeId);
}

export function addGoal(goal: Goal) {
  goals.push(goal);
}

export function updateGoal(id: string, patch: Partial<Goal>): Goal | undefined {
  const goal = goals.find((g) => g.id === id);
  if (!goal) return undefined;
  Object.assign(goal, patch);
  return goal;
}

export function deleteGoal(id: string) {
  const idx = goals.findIndex((g) => g.id === id);
  if (idx !== -1) goals.splice(idx, 1);
}
