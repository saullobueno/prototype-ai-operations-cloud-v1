"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Background, BackgroundVariant, Controls, type Edge, type Node, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { RevenueGraphNode, type RevenueGraphNodeData } from "./revenue-graph-node";
import { getContactsByAccount, getDealsByAccount, getInteractionsByAccount, getSignalsByAccount } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@/types";

const nodeTypes = { revenueGraphNode: RevenueGraphNode };

const COL_X = [40, 280, 520, 760, 1000, 1240, 1480, 1720];
const ROW_GAP = 90;

interface FlowNode {
  id: string;
  col: number;
  row: number;
  data: RevenueGraphNodeData;
  href?: string;
}

export function RevenueGraph({ account }: { account: Account }) {
  const router = useRouter();

  const contacts = getContactsByAccount(account.id);
  const interactions = getInteractionsByAccount(account.id);
  const deals = getDealsByAccount(account.id);
  const signals = getSignalsByAccount(account.id);

  const openDeals = deals.filter((d) => d.status === "open");
  const avgProbability = openDeals.length > 0 ? Math.round(openDeals.reduce((s, d) => s + d.probability, 0) / openDeals.length) : 0;
  const totalRevenueCents = deals.reduce((s, d) => s + (d.status === "won" ? d.amountCents : d.status === "open" ? d.amountCents * (d.probability / 100) : 0), 0);
  const negativeSignals = signals.filter((s) => s.impact === "negative").length;
  const dominantIntent = interactions.find((i) => i.aiAnalysis)?.aiAnalysis?.intent ?? "Sem intenção detectada";

  const { flowNodes, flowEdges } = useMemo(() => {
    const nodes: FlowNode[] = [];
    const edges: { source: string; target: string }[] = [];

    const accountNodeId = `n_account_${account.id}`;
    nodes.push({ id: accountNodeId, col: 0, row: 0, data: { label: account.name, sublabel: account.industry, kind: "account" }, href: `/modules/sales/accounts/${account.id}` });

    contacts.forEach((c, i) => {
      const id = `n_contact_${c.id}`;
      nodes.push({ id, col: 1, row: i, data: { label: c.name, sublabel: c.role, kind: "contact" } });
      edges.push({ source: accountNodeId, target: id });
    });

    interactions.slice(0, 5).forEach((interaction, i) => {
      const id = `n_interaction_${interaction.id}`;
      const tone = interaction.aiAnalysis?.sentiment === "positive" ? "positive" : interaction.aiAnalysis?.sentiment === "negative" ? "negative" : "neutral";
      nodes.push({ id, col: 2, row: i, data: { label: interaction.subject ?? interaction.type, sublabel: interaction.type, kind: "interaction", tone } });
      const sourceContact = contacts.find((c) => c.id === interaction.contactId);
      edges.push({ source: sourceContact ? `n_contact_${sourceContact.id}` : accountNodeId, target: id });
    });

    deals.forEach((deal, i) => {
      const id = `n_deal_${deal.id}`;
      const tone = deal.riskLevel === "high" ? "negative" : deal.status === "won" ? "positive" : "neutral";
      nodes.push({ id, col: 3, row: i, data: { label: deal.name, sublabel: formatCurrency(deal.amountCents), kind: "deal", tone }, href: `/modules/sales/deals/${deal.id}` });
      const relatedInteractions = interactions.filter((int) => int.dealId === deal.id);
      if (relatedInteractions.length > 0) {
        relatedInteractions.slice(0, 2).forEach((int) => edges.push({ source: `n_interaction_${int.id}`, target: id }));
      } else {
        edges.push({ source: accountNodeId, target: id });
      }
    });

    signals.slice(0, 6).forEach((signal, i) => {
      const id = `n_signal_${signal.id}`;
      nodes.push({ id, col: 4, row: i, data: { label: signal.type.replace(/_/g, " "), sublabel: signal.detail, kind: "signal", tone: signal.impact }, href: undefined });
      const dealId = signal.dealId ? `n_deal_${signal.dealId}` : null;
      edges.push({ source: dealId && nodes.some((n) => n.id === dealId) ? dealId : accountNodeId, target: id });
    });

    const intentId = "n_intent";
    nodes.push({ id: intentId, col: 5, row: 0, data: { label: dominantIntent, sublabel: "Intenção dominante", kind: "intent", tone: negativeSignals > 0 ? "negative" : "neutral" } });
    signals.slice(0, 6).forEach((signal) => edges.push({ source: `n_signal_${signal.id}`, target: intentId }));
    if (signals.length === 0) edges.push({ source: accountNodeId, target: intentId });

    const probabilityId = "n_probability";
    nodes.push({ id: probabilityId, col: 6, row: 0, data: { label: `${avgProbability}%`, sublabel: "Probabilidade média", kind: "probability", tone: avgProbability >= 50 ? "positive" : avgProbability > 0 ? "neutral" : "neutral" } });
    edges.push({ source: intentId, target: probabilityId });

    const revenueId = "n_revenue";
    nodes.push({ id: revenueId, col: 7, row: 0, data: { label: formatCurrency(totalRevenueCents), sublabel: "Revenue projetado", kind: "revenue", tone: "positive" } });
    edges.push({ source: probabilityId, target: revenueId });

    const flowNodes: Node<RevenueGraphNodeData>[] = nodes.map((n) => ({
      id: n.id,
      type: "revenueGraphNode",
      position: { x: COL_X[n.col], y: n.row * ROW_GAP },
      data: n.data,
    }));

    const flowEdges: Edge[] = edges.map((e, i) => ({
      id: `e_${i}_${e.source}_${e.target}`,
      source: e.source,
      target: e.target,
      style: { stroke: "var(--border)" },
    }));

    return { flowNodes, flowEdges };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.id]);

  const hrefById = useMemo(() => {
    const map = new Map<string, string>();
    const accountNodeId = `n_account_${account.id}`;
    map.set(accountNodeId, `/modules/sales/accounts/${account.id}`);
    deals.forEach((deal) => map.set(`n_deal_${deal.id}`, `/modules/sales/deals/${deal.id}`));
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.id]);

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-lg border border-border bg-muted/20">
      <ReactFlowProvider>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            const href = hrefById.get(node.id);
            if (href) router.push(href);
          }}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
