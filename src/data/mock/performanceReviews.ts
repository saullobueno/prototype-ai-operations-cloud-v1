import type { PerformanceReview } from "@/types";

export const performanceReviews: PerformanceReview[] = [
  { id: "rev_001", employeeId: "emp_017", cycle: "2025 H2", status: "completed", rating: 4.2 },
  { id: "rev_002", employeeId: "emp_017", cycle: "2026 H1", status: "in_progress" },
  { id: "rev_003", employeeId: "emp_006", cycle: "2025 H2", status: "completed", rating: 4.6 },
  { id: "rev_004", employeeId: "emp_022", cycle: "2025 H2", status: "completed", rating: 3.1 },
  { id: "rev_005", employeeId: "emp_012", cycle: "2025 H2", status: "completed", rating: 4.0 },
  { id: "rev_006", employeeId: "emp_018", cycle: "2025 H2", status: "completed", rating: 2.8 },
  { id: "rev_007", employeeId: "emp_026", cycle: "2026 H1", status: "in_progress" },
  { id: "rev_008", employeeId: "emp_009", cycle: "2026 H1", status: "scheduled" },
  { id: "rev_009", employeeId: "emp_029", cycle: "2026 H1", status: "scheduled" },
  { id: "rev_010", employeeId: "emp_007", cycle: "2025 H2", status: "completed", rating: 3.9 },
];

export function getReviewsByEmployee(employeeId: string) {
  return performanceReviews.filter((r) => r.employeeId === employeeId);
}

export function addPerformanceReview(review: PerformanceReview) {
  performanceReviews.push(review);
}

// Registro histórico oficial — permite correção (ex.: nota lançada errada), mas não exclusão pela
// listagem (ver briefing: "delete de review histórica é mais questionável").
export function updatePerformanceReview(id: string, patch: Partial<PerformanceReview>): PerformanceReview | undefined {
  const review = performanceReviews.find((r) => r.id === id);
  if (!review) return undefined;
  Object.assign(review, patch);
  return review;
}
