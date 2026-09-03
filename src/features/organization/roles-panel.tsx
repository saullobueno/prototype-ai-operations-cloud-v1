"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { permissions, roles } from "@/data/mock";
import { cn } from "@/lib/utils";

export function RolesPanel() {
  const [selected, setSelected] = useState(roles[2].id);
  const role = roles.find((r) => r.id === selected)!;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
      <div className="space-y-1">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
              r.id === selected ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-accent"
            )}
          >
            {r.name}
            <Badge variant="secondary" className="text-[10px]">{r.permissionIds.length}</Badge>
          </button>
        ))}
      </div>
      <Card>
        <CardContent className="space-y-1.5 pt-4">
          {permissions.map((p) => (
            <label key={p.id} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
              <Checkbox checked={role.permissionIds.includes(p.id)} disabled />
              <span className="flex-1 text-foreground">{p.description}</span>
              <span className="font-mono text-xs text-muted-foreground">{p.key}</span>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
