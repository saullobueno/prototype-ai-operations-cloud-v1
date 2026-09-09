import type { Offboarding } from "@/types";
import { daysAgo } from "@/lib/time";

export const offboardings: Offboarding[] = [
  { id: "offb_001", employeeId: "emp_033", status: "in_progress", lastDay: daysAgo(-12) },
  { id: "offb_002", employeeId: "emp_035", status: "completed", lastDay: daysAgo(95) },
];

export function getOffboardingByEmployee(employeeId: string) {
  return offboardings.find((o) => o.employeeId === employeeId);
}

/** Um Offboarding nasce do desligamento de um colaborador (ação "Iniciar desligamento" na
 * listagem/perfil de Employee) — não é criado solto a partir da própria listagem de offboarding. */
export function addOffboarding(offboarding: Offboarding) {
  offboardings.push(offboarding);
}

export function updateOffboardingStatus(id: string, status: Offboarding["status"]): Offboarding | undefined {
  const offboarding = offboardings.find((o) => o.id === id);
  if (!offboarding) return undefined;
  offboarding.status = status;
  return offboarding;
}
