import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bot,
  BookOpen,
  Building2,
  ClipboardCheck,
  Headset,
  History,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  MessageSquareText,
  Settings,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";

export interface NavLeaf {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavLeaf[];
}

export type NavEntry = NavLeaf | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

export const primaryNav: NavEntry[] = [
  { label: "Visão geral", href: "/overview", icon: LayoutDashboard },
  {
    label: "Operações",
    icon: Inbox,
    items: [
      { label: "Caixa de entrada", href: "/inbox", icon: Inbox },
      { label: "Tickets", href: "/tickets", icon: Ticket },
      { label: "Tarefas", href: "/tasks", icon: ListChecks },
      { label: "Atividade", href: "/activity", icon: Activity },
    ],
  },
  { label: "Clientes", href: "/customers", icon: Users },
  {
    label: "IA",
    icon: Sparkles,
    items: [
      { label: "Agentes", href: "/ai/agents", icon: Bot },
      { label: "Copiloto", href: "/ai/copilot", icon: MessageSquareText },
      { label: "Avaliações", href: "/ai/evaluations", icon: ClipboardCheck },
      { label: "Atividade de IA", href: "/ai/activity", icon: Activity },
    ],
  },
  {
    label: "Automação",
    icon: Workflow,
    items: [
      { label: "Workflows", href: "/automation/workflows", icon: Workflow },
      { label: "Execuções", href: "/automation/runs", icon: History },
      { label: "Modelos", href: "/automation/templates", icon: LayoutTemplate },
    ],
  },
  { label: "Base de conhecimento", href: "/knowledge", icon: BookOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Qualidade", href: "/quality", icon: BadgeCheck },
];

export interface ModuleEntry {
  label: string;
  href: string;
  icon: LucideIcon;
  status: "active" | "coming_soon";
}

export const modulesNav: ModuleEntry[] = [
  { label: "Customer Operations", href: "/overview", icon: Headset, status: "active" },
  { label: "Sales Operations", href: "/modules/sales", icon: TrendingUp, status: "coming_soon" },
  { label: "Finance Operations", href: "/modules/finance", icon: Wallet, status: "coming_soon" },
  { label: "Business Operations", href: "/modules/business", icon: Building2, status: "coming_soon" },
];

export const footerNav: NavLeaf[] = [{ label: "Configurações", href: "/settings", icon: Settings }];

export const adminNav: NavLeaf = { label: "Admin", href: "/admin", icon: ShieldCheck };
