"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function ClickableTableRow({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const router = useRouter();
  return (
    <TableRow
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(href);
      }}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </TableRow>
  );
}
