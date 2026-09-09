import type { Reconciliation } from "@/types";

// Últimos 6 períodos de reconciliação bancária. Os exemplos concretos de divergência
// (pagamentos duplicados, mismatches) ficam detalhados em financialAnomalies.ts.
export const reconciliations: Reconciliation[] = [
  { id: "recon_2026_08", period: "Agosto 2026", matchedCents: 48_240_000, unmatchedCents: 312_000, mismatches: 4, status: "discrepancy" },
  { id: "recon_2026_07", period: "Julho 2026", matchedCents: 45_180_000, unmatchedCents: 96_000, mismatches: 2, status: "discrepancy" },
  { id: "recon_2026_06", period: "Junho 2026", matchedCents: 43_960_000, unmatchedCents: 0, mismatches: 0, status: "balanced" },
  { id: "recon_2026_05", period: "Maio 2026", matchedCents: 41_720_000, unmatchedCents: 0, mismatches: 0, status: "balanced" },
  { id: "recon_2026_04", period: "Abril 2026", matchedCents: 39_880_000, unmatchedCents: 148_000, mismatches: 1, status: "discrepancy" },
  { id: "recon_2026_03", period: "Março 2026", matchedCents: 38_140_000, unmatchedCents: 0, mismatches: 0, status: "balanced" },
];

export function getReconciliationById(id: string) {
  return reconciliations.find((r) => r.id === id);
}

// Resultado de um processo automático — não é criável/editável livremente. A única ação humana é
// confirmar que as divergências de um período foram revisadas manualmente e encerrar o período.
export function markReconciliationReviewed(id: string) {
  const found = reconciliations.find((r) => r.id === id);
  if (found) {
    found.status = "balanced";
    found.unmatchedCents = 0;
    found.mismatches = 0;
  }
  return found;
}
