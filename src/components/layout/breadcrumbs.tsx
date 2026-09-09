"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { adminNav as adminNavGroups } from "@/components/navigation/admin-nav-config";
import { settingsNav } from "@/components/navigation/settings-nav-config";
import { commandCenterItem, intelligenceNav, isNavGroup, operationsModules, platformNav } from "@/components/navigation/nav-config";
import {
  getAccountById,
  getAgentById,
  getCandidateById,
  getConversationById,
  getCustomerById,
  getDealById,
  getEmployeeById,
  getInvoiceById,
  getKnowledgeDocumentById,
  getLeadById,
  getProcessById,
  getTicketById,
  getWorkflow,
  onboardings,
} from "@/data/mock";

interface Crumb {
  label: string;
  href?: string;
}

interface FlatEntry {
  /** Trilha de ancestrais até o item (módulo + subgrupo, ou grupo do Admin/Settings) — sem o Painel. */
  chain: Crumb[];
  itemLabel: string;
  itemHref: string;
}

/** Rótulos conhecidos para segmentos [tab]/sufixo reaproveitados entre várias telas de detalhe. */
const SEGMENT_LABELS: Record<string, string> = {
  overview: "Visão geral",
  activity: "Atividade",
  conversations: "Conversas",
  tickets: "Tickets",
  orders: "Pedidos",
  subscriptions: "Assinaturas",
  tasks: "Tarefas",
  notes: "Notas",
  files: "Arquivos",
  contacts: "Contatos",
  deals: "Deals",
  team: "Time",
  goals: "Metas",
  performance: "Performance",
  feedback: "Feedback",
  documents: "Documentos",
  requests: "Solicitações",
  journey: "Jornada",
  runs: "Execuções",
  workflow: "Workflow",
  agents: "Agentes",
  approvals: "Aprovações",
  policies: "Políticas",
  analytics: "Analytics",
  ai: "IA",
  edit: "Editar",
  new: "Novo",
};

/** Resolve o primeiro segmento dinâmico após um item de nav conhecido (o ID de uma entidade) para o nome real dela. */
const ENTITY_RESOLVERS: { pattern: RegExp; resolve: (id: string) => string | undefined }[] = [
  { pattern: /^\/customers\/([^/]+)/, resolve: (id) => getCustomerById(id)?.name },
  { pattern: /^\/tickets\/([^/]+)/, resolve: (id) => getTicketById(id)?.title },
  { pattern: /^\/inbox\/([^/]+)/, resolve: (id) => getConversationById(id)?.subject },
  { pattern: /^\/modules\/sales\/leads\/([^/]+)/, resolve: (id) => getLeadById(id)?.name },
  { pattern: /^\/modules\/sales\/accounts\/([^/]+)/, resolve: (id) => getAccountById(id)?.name },
  { pattern: /^\/modules\/sales\/deals\/([^/]+)/, resolve: (id) => getDealById(id)?.name },
  { pattern: /^\/modules\/finance\/invoices\/([^/]+)/, resolve: (id) => getInvoiceById(id)?.number },
  { pattern: /^\/modules\/business\/processes\/([^/]+)/, resolve: (id) => getProcessById(id)?.name },
  { pattern: /^\/modules\/people\/employees\/([^/]+)/, resolve: (id) => getEmployeeById(id)?.name },
  { pattern: /^\/modules\/people\/candidates\/([^/]+)/, resolve: (id) => getCandidateById(id)?.name },
  { pattern: /^\/modules\/people\/onboarding\/([^/]+)/, resolve: (id) => getEmployeeById(onboardings.find((o) => o.id === id)?.employeeId ?? "")?.name },
  { pattern: /^\/ai\/agents\/([^/]+)/, resolve: (id) => getAgentById(id)?.name },
  { pattern: /^\/automation\/workflows\/([^/]+)/, resolve: (id) => getWorkflow(id)?.name },
  { pattern: /^\/knowledge\/([^/]+)/, resolve: (id) => getKnowledgeDocumentById(id)?.title },
];

function humanize(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  return segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Constrói a lista de entradas navegáveis com sua trilha de ancestrais — a mesma fonte de dados da sidebar. */
function buildFlatEntries(): FlatEntry[] {
  const entries: FlatEntry[] = [];

  for (const mod of operationsModules) {
    for (const group of mod.groups) {
      const chain: Crumb[] = [{ label: "Operations" }, { label: mod.label, href: mod.homeHref }];
      if (group.label) chain.push({ label: group.label });
      for (const item of group.items) entries.push({ chain, itemLabel: item.label, itemHref: item.href });
    }
  }

  for (const entry of intelligenceNav) {
    if (isNavGroup(entry)) {
      const chain: Crumb[] = [{ label: "Intelligence" }, { label: entry.label }];
      for (const item of entry.items) entries.push({ chain, itemLabel: item.label, itemHref: item.href });
    } else {
      entries.push({ chain: [{ label: "Intelligence" }], itemLabel: entry.label, itemHref: entry.href });
    }
  }

  for (const item of platformNav) entries.push({ chain: [{ label: "Platform" }], itemLabel: item.label, itemHref: item.href });

  for (const group of adminNavGroups) {
    const chain: Crumb[] = [{ label: "Administração", href: "/admin" }];
    if (group.label && group.label !== "Visão geral") chain.push({ label: group.label });
    for (const item of group.items) entries.push({ chain, itemLabel: item.label, itemHref: item.href });
  }

  for (const group of settingsNav) {
    const chain: Crumb[] = [{ label: "Configurações", href: "/settings" }, { label: group.label }];
    for (const item of group.items) entries.push({ chain, itemLabel: item.label, itemHref: item.href });
  }

  return entries;
}

const FLAT_ENTRIES = buildFlatEntries();

function findBestMatch(pathname: string): FlatEntry | undefined {
  const matches = FLAT_ENTRIES.filter((e) => pathname === e.itemHref || pathname.startsWith(`${e.itemHref}/`));
  if (matches.length === 0) return undefined;
  return matches.reduce((best, e) => (e.itemHref.length > best.itemHref.length ? e : best));
}

function buildTrail(pathname: string): Crumb[] {
  const home: Crumb = { label: commandCenterItem.label, href: pathname === commandCenterItem.href ? undefined : commandCenterItem.href };
  const match = findBestMatch(pathname);
  if (!match) return [home];

  const isExactItem = pathname === match.itemHref;
  const crumbs: Crumb[] = [
    home,
    ...match.chain,
    { label: match.itemLabel, href: isExactItem ? undefined : match.itemHref },
  ];

  if (!isExactItem) {
    const remainder = pathname.slice(match.itemHref.length).split("/").filter(Boolean);
    let acc = match.itemHref;
    remainder.forEach((segment, i) => {
      acc += `/${segment}`;
      const isLastSegment = i === remainder.length - 1;
      const resolved = i === 0 ? ENTITY_RESOLVERS.find((r) => r.pattern.test(pathname))?.resolve(segment) : undefined;
      crumbs.push({ label: resolved ?? humanize(segment), href: isLastSegment ? undefined : acc });
    });
  }

  return crumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  // O Painel é a home cross-módulo, acima de toda a hierarquia — não faz sentido ele aparecer como uma "página dentro de si mesma".
  if (pathname === commandCenterItem.href) return null;

  const crumbs = buildTrail(pathname);

  return (
    <Breadcrumb className="px-4 py-2 md:px-6">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          const isHome = i === 0;
          return (
            <Fragment key={`${crumb.href ?? crumb.label}-${i}`}>
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbLink asChild className="max-w-[220px] truncate">
                    <Link href={crumb.href} aria-label={isHome ? crumb.label : undefined}>
                      {isHome ? <LayoutDashboard className="size-4" /> : crumb.label}
                    </Link>
                  </BreadcrumbLink>
                ) : isLast ? (
                  <BreadcrumbPage className="max-w-[220px] truncate">
                    {isHome ? <LayoutDashboard className="size-4" aria-label={crumb.label} /> : crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <span className="max-w-[220px] truncate text-muted-foreground">{crumb.label}</span>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
