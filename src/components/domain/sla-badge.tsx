import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMinutesDuration } from "@/lib/format";
import { minutesUntilBreach } from "@/data/mock";
import type { Ticket } from "@/types";

export function SLABadge({ ticket }: { ticket: Ticket }) {
  const remaining = minutesUntilBreach(ticket);
  if (remaining === null) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const breached = remaining < 0;
  const critical = !breached && remaining < 60;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        breached ? "text-danger" : critical ? "text-warning" : "text-muted-foreground"
      )}
    >
      <Clock className="size-3" />
      {breached ? `Rompido há ${formatMinutesDuration(remaining)}` : `${formatMinutesDuration(remaining)} restantes`}
    </span>
  );
}
