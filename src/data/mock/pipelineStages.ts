import type { PipelineStage } from "@/types";

export const pipelineStages: PipelineStage[] = [
  { id: "stage_qualification", name: "Qualification", order: 1, defaultProbability: 10 },
  { id: "stage_discovery", name: "Discovery", order: 2, defaultProbability: 25 },
  { id: "stage_proposal", name: "Proposal", order: 3, defaultProbability: 50 },
  { id: "stage_negotiation", name: "Negotiation", order: 4, defaultProbability: 75 },
  { id: "stage_closed_won", name: "Closed Won", order: 5, defaultProbability: 100 },
  { id: "stage_closed_lost", name: "Closed Lost", order: 6, defaultProbability: 0 },
];

export function getPipelineStageById(id: string): PipelineStage | undefined {
  return pipelineStages.find((s) => s.id === id);
}
