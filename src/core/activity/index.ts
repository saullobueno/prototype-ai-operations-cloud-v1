import { format, isSameDay } from "date-fns";
import type { Activity } from "@/types";
import { NOW } from "@/lib/time";

export interface ActivityGroup {
  label: string;
  items: Activity[];
}

/** Agrupa activities por dia (Today / Yesterday / data), usado na Timeline do Customer 360. */
export function groupActivitiesByDay(items: Activity[]): ActivityGroup[] {
  const sorted = [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const groups: ActivityGroup[] = [];

  for (const activity of sorted) {
    const date = new Date(activity.createdAt);
    const label = dayLabel(date);
    const existing = groups.find((g) => g.label === label);
    if (existing) {
      existing.items.push(activity);
    } else {
      groups.push({ label, items: [activity] });
    }
  }

  return groups;
}

function dayLabel(date: Date): string {
  const yesterday = new Date(NOW);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, NOW)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}
