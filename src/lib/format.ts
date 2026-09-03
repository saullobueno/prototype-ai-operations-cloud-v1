import { format, formatDistance, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NOW } from "./time";

export function formatCurrency(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

export function formatRelative(iso: string): string {
  return formatDistance(new Date(iso), NOW, { addSuffix: true, locale: ptBR });
}

export function formatDate(iso: string, pattern = "d 'de' MMM 'de' yyyy"): string {
  return format(new Date(iso), pattern, { locale: ptBR });
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "d 'de' MMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatTime(iso: string): string {
  return format(new Date(iso), "HH:mm");
}

/** Retorna minutos restantes até um deadline (negativo se já passou). Usado no SLABadge. */
export function minutesUntil(iso: string): number {
  return differenceInMinutes(new Date(iso), NOW);
}

export function formatMinutesDuration(totalMinutes: number): string {
  const abs = Math.abs(totalMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const sign = totalMinutes < 0 ? "-" : "";
  if (h === 0) return `${sign}${m}min`;
  return `${sign}${h}h ${m}min`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
