import { subDays, subHours, subMinutes, subMonths } from "date-fns";

/**
 * Data-âncora fixa do dataset mock. Usar sempre isto (nunca `new Date()`/`Date.now()`
 * em nível de módulo) para manter os timestamps determinísticos entre server e client
 * e evitar mismatches de hidratação do Next.js.
 */
export const NOW = new Date("2026-09-02T09:15:00.000Z");

export function daysAgo(n: number): string {
  return subDays(NOW, n).toISOString();
}

export function hoursAgo(n: number): string {
  return subHours(NOW, n).toISOString();
}

export function minutesAgo(n: number): string {
  return subMinutes(NOW, n).toISOString();
}

export function monthsAgo(n: number): string {
  return subMonths(NOW, n).toISOString();
}
