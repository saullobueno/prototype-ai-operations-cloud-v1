import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  Headset,
  LayoutDashboard,
  ListChecks,
  Plug,
  Radio,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  Wallet,
  Workflow,
} from "lucide-react";
import { businessNav } from "@/components/navigation/business-nav-config";
import { salesNav } from "@/components/navigation/sales-nav-config";
import { financeNav } from "@/components/navigation/finance-nav-config";
import { peopleNav } from "@/components/navigation/people-nav-config";

export interface NavLeaf {
  label: string;
  href: string;
  /** Opcional para itens dentro de um NavGroup — a linha vertical do accordion já indica a hierarquia, ícone vira redundante. */
  icon?: LucideIcon;
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

/** Item fixo no topo da sidebar, fora de qualquer seção — a home cross-módulo. */
export const commandCenterItem: NavLeaf = { label: "Painel", href: "/overview", icon: LayoutDashboard };

export interface ModuleSubGroup {
  label: string;
  items: { label: string; href: string }[];
}

export interface OperationsModule {
  key: string;
  label: string;
  icon: LucideIcon;
  status: "active" | "coming_soon";
  /** Rota usada quando o módulo está recolhido (modo ícone) ou como fallback de "home" do módulo. */
  homeHref: string;
  groups: ModuleSubGroup[];
}

/** Seção OPERATIONS — um módulo de domínio por accordion, reaproveitando os *-nav-config.ts de cada módulo. */
export const operationsModules: OperationsModule[] = [
  {
    key: "customer",
    label: "Customer Operations",
    icon: Headset,
    status: "active",
    homeHref: "/modules/customer",
    groups: [
      {
        label: "",
        items: [
          { label: "Visão geral", href: "/modules/customer" },
          { label: "Inbox", href: "/inbox" },
          { label: "Customers", href: "/customers" },
          { label: "Tickets", href: "/tickets" },
          { label: "Qualidade", href: "/quality" },
        ],
      },
    ],
  },
  { key: "business", label: "Business Operations", icon: Building2, status: "active", homeHref: "/modules/business", groups: businessNav },
  { key: "sales", label: "Sales Operations", icon: TrendingUp, status: "active", homeHref: "/modules/sales", groups: salesNav },
  { key: "finance", label: "Finance Operations", icon: Wallet, status: "active", homeHref: "/modules/finance", groups: financeNav },
  { key: "people", label: "People Operations", icon: UsersRound, status: "active", homeHref: "/modules/people", groups: peopleNav },
];

/** Seção INTELLIGENCE — capacidades compartilhadas por todos os módulos acima. */
export const intelligenceNav: NavEntry[] = [
  {
    label: "AI Workforce",
    icon: Sparkles,
    items: [
      { label: "Agentes", href: "/ai/agents" },
      { label: "Atividade de IA", href: "/ai/activity" },
      { label: "Avaliações", href: "/ai/evaluations" },
      { label: "Copiloto", href: "/ai/copilot" },
    ],
  },
  {
    label: "Automação",
    icon: Workflow,
    items: [
      { label: "Workflows", href: "/automation/workflows" },
      { label: "Execuções", href: "/automation/runs" },
      { label: "Modelos", href: "/automation/templates" },
    ],
  },
  { label: "Base de conhecimento", href: "/knowledge", icon: BookOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

/** Seção PLATFORM — primitivas operacionais cross-módulo (Task/Approval/Activity/Event/Policy/Integration). */
export const platformNav: NavLeaf[] = [
  { label: "Tarefas", href: "/tasks", icon: ListChecks },
  { label: "Aprovações", href: "/approvals", icon: CheckCircle2 },
  { label: "Atividade", href: "/activity", icon: Activity },
  { label: "Eventos", href: "/events", icon: Radio },
  { label: "Políticas", href: "/policies", icon: ScrollText },
  { label: "Integrações", href: "/integrations", icon: Plug },
];

export const footerNav: NavLeaf[] = [{ label: "Configurações", href: "/settings", icon: Settings }];

export const adminNav: NavLeaf = { label: "Administração", href: "/admin", icon: ShieldCheck };
