"use client";

import { useState } from "react";
import { HelpCircle, Menu, PanelLeft, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "@/components/layout/sidebar-context";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationDropdown } from "@/components/domain/notification-dropdown";
import { CommandPalette } from "@/components/navigation/command-palette";
import { useAskAI } from "@/components/layout/ask-ai-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { setOpen: setAskAIOpen } = useAskAI();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu" onClick={() => setMobileOpen(true)}>
        <Menu className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Alternar barra lateral" onClick={toggleCollapsed}>
        <PanelLeft className="size-4" />
      </Button>

      <button
        onClick={() => setPaletteOpen(true)}
        className="flex h-9 flex-1 max-w-md items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Pesquisar qualquer coisa...</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="outline" size="sm" className="gap-1.5 text-ai-accent" onClick={() => setAskAIOpen(true)}>
          <Sparkles className="size-3.5" />
          <span className="hidden sm:inline">IA</span>
        </Button>
        <NotificationDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Ajuda">
              <HelpCircle className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Ajuda</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setPaletteOpen(true)}>Atalhos de teclado (⌘K)</DropdownMenuItem>
            <DropdownMenuItem disabled>Novidades</DropdownMenuItem>
            <DropdownMenuItem disabled>Documentação</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserMenu />
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navegação</SheetTitle>
          <SidebarNav />
        </SheetContent>
      </Sheet>
    </header>
  );
}
