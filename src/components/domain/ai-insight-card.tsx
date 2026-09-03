import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIInsightCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AIInsightCard({ title, description, actionLabel, onAction }: AIInsightCardProps) {
  return (
    <Card className="border-ai-accent/30 bg-ai-accent/[0.04]">
      <CardContent className="flex items-start gap-3 pt-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ai-accent/15 text-ai-accent">
          <Sparkles className="size-4" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          {actionLabel && (
            <Button size="sm" variant="outline" className="mt-3" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
