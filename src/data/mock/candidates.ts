import type { Candidate } from "@/types";
import { daysAgo } from "@/lib/time";

export const candidates: Candidate[] = [
  { id: "cand_001", name: "Pedro Guimarães", role: "Software Engineer", stage: "applied", appliedAt: daysAgo(2) },
  { id: "cand_002", name: "Mariana Xavier", role: "Software Engineer", stage: "applied", appliedAt: daysAgo(1) },
  { id: "cand_003", name: "Leonardo Brito", role: "Data Analyst", stage: "screening", appliedAt: daysAgo(6) },
  { id: "cand_004", name: "Carolina Fontes", role: "Product Designer", stage: "screening", appliedAt: daysAgo(5) },
  { id: "cand_005", name: "Rafael Andrade", role: "Account Executive", stage: "interview", appliedAt: daysAgo(12) },
  { id: "cand_006", name: "Sofia Marques", role: "CS Specialist", stage: "interview", appliedAt: daysAgo(9) },
  { id: "cand_007", name: "Igor Cavalcante", role: "Software Engineer", stage: "interview", appliedAt: daysAgo(14) },
  { id: "cand_008", name: "Daniela Rocha", role: "Marketing Specialist", stage: "offer", appliedAt: daysAgo(20) },
  { id: "cand_009", name: "Eduardo Lins", role: "DevOps Engineer", stage: "offer", appliedAt: daysAgo(18) },
  { id: "cand_010", name: "Beatriz Correia", role: "Product Manager", stage: "hired", appliedAt: daysAgo(35) },
  { id: "cand_011", name: "Vitor Hugo Sales", role: "Software Engineer", stage: "hired", appliedAt: daysAgo(40) },
  { id: "cand_012", name: "Amanda Peixoto", role: "Account Executive", stage: "rejected", appliedAt: daysAgo(25) },
  { id: "cand_013", name: "Ricardo Teles", role: "Support Engineer", stage: "rejected", appliedAt: daysAgo(22) },
  { id: "cand_014", name: "Juliana Amorim", role: "Software Engineer", stage: "screening", appliedAt: daysAgo(4) },
];

export function getCandidateById(id: string) {
  return candidates.find((c) => c.id === id);
}

export function getCandidatesByStage(stage: Candidate["stage"]) {
  return candidates.filter((c) => c.stage === stage);
}

export function addCandidate(candidate: Candidate) {
  candidates.push(candidate);
}

export function updateCandidate(id: string, patch: Partial<Candidate>): Candidate | undefined {
  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) return undefined;
  Object.assign(candidate, patch);
  return candidate;
}

export function deleteCandidate(id: string) {
  const idx = candidates.findIndex((c) => c.id === id);
  if (idx !== -1) candidates.splice(idx, 1);
}
