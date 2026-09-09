import type { BusinessProcess } from "@/types";
import { getExceptionsByProcess } from "@/data/mock/processExceptions";

export interface BottleneckEntry {
  process: BusinessProcess;
  score: number;
  reasons: string[];
}

/** Combina taxa de exceção, duração média e volume de exceções abertas num score simples
 * de 0-100 para ranquear processos por gargalo. Puramente heurístico — não é ML de verdade,
 * apenas o suficiente para ordenar a lista de forma plausível no protótipo. */
export function rankBottlenecks(processes: BusinessProcess[]): BottleneckEntry[] {
  const maxDuration = Math.max(1, ...processes.map((p) => p.avgDurationHours));

  return processes
    .map((process) => {
      const openExceptions = getExceptionsByProcess(process.id).filter((e) => e.status === "open").length;
      const durationScore = (process.avgDurationHours / maxDuration) * 40;
      const exceptionScore = process.exceptionRate * 0.4;
      const manualScore = (100 - process.automationRate) * 0.2;
      const score = Math.round(durationScore + exceptionScore + manualScore);

      const reasons: string[] = [];
      if (process.exceptionRate >= 15) reasons.push(`Taxa de exceção alta (${process.exceptionRate}%)`);
      if (process.avgDurationHours >= 40) reasons.push(`Duração média acima do esperado (${process.avgDurationHours}h)`);
      if (process.automationRate <= 40) reasons.push(`Baixa automação (${process.automationRate}%) — muito trabalho manual`);
      if (openExceptions > 0) reasons.push(`${openExceptions} exceção${openExceptions > 1 ? "ões" : ""} aberta${openExceptions > 1 ? "s" : ""}`);
      if (reasons.length === 0) reasons.push("Sem sinais relevantes de gargalo no momento");

      return { process, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}
