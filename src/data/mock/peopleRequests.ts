import type { PeopleRequest } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const peopleRequests: PeopleRequest[] = [
  { id: "preq_001", employeeId: "emp_021", type: "time_off", status: "pending", approvalId: "papr_001", createdAt: hoursAgo(6) },
  { id: "preq_002", employeeId: "emp_005", type: "equipment", status: "pending", approvalId: "papr_003", createdAt: daysAgo(2) },
  { id: "preq_003", employeeId: "emp_007", type: "time_off", status: "approved", createdAt: daysAgo(20) },
  { id: "preq_004", employeeId: "emp_009", type: "expense", status: "approved", createdAt: daysAgo(18) },
  { id: "preq_005", employeeId: "emp_022", type: "internal_mobility", status: "pending", createdAt: daysAgo(4) },
  { id: "preq_006", employeeId: "emp_018", type: "document", status: "approved", createdAt: daysAgo(35) },
  { id: "preq_007", employeeId: "emp_024", type: "equipment", status: "rejected", createdAt: daysAgo(40) },
  { id: "preq_008", employeeId: "emp_013", type: "time_off", status: "approved", createdAt: daysAgo(50) },
  { id: "preq_009", employeeId: "emp_026", type: "expense", status: "pending", createdAt: daysAgo(1) },
  { id: "preq_010", employeeId: "emp_032", type: "document", status: "approved", createdAt: daysAgo(60) },
  { id: "preq_011", employeeId: "emp_015", type: "time_off", status: "approved", createdAt: daysAgo(28) },
  { id: "preq_012", employeeId: "emp_008", type: "equipment", status: "approved", createdAt: daysAgo(45) },
];

export function getRequestsByEmployee(employeeId: string) {
  return peopleRequests.filter((r) => r.employeeId === employeeId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function addPeopleRequest(request: PeopleRequest) {
  peopleRequests.push(request);
}

export function updatePeopleRequest(id: string, patch: Partial<PeopleRequest>): PeopleRequest | undefined {
  const request = peopleRequests.find((r) => r.id === id);
  if (!request) return undefined;
  Object.assign(request, patch);
  return request;
}

/** Cancelamento de uma solicitação ainda pendente (pelo próprio colaborador ou por People Ops). */
export function deletePeopleRequest(id: string) {
  const idx = peopleRequests.findIndex((r) => r.id === id);
  if (idx !== -1) peopleRequests.splice(idx, 1);
}
