"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Group {
  label: string;
  items: { label: string; href: string }[];
}

export function SecondarySidebarLayout({ title, groups, children }: { title: string; groups: Group[]; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
      <aside className="shrink-0 md:w-56">
        <p className="mb-3 px-2 text-lg font-semibold tracking-tight text-foreground">{title}</p>
        <nav className="space-y-4">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors",
                        active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
