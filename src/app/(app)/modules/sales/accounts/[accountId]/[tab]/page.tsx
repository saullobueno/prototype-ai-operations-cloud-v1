"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import {
  ContactsTab,
  DealsTab,
  InteractionsTab,
  OverviewTab,
  RevenueGraphTab,
  SignalsTab,
  TimelineTab,
} from "@/features/sales/account-tabs";

const TAB_COMPONENTS: Record<string, (props: { accountId: string }) => React.ReactElement> = {
  overview: OverviewTab,
  contacts: ContactsTab,
  interactions: InteractionsTab,
  deals: DealsTab,
  signals: SignalsTab,
  "revenue-graph": RevenueGraphTab,
  timeline: TimelineTab,
};

export default function AccountTabPage({ params }: { params: Promise<{ accountId: string; tab: string }> }) {
  const { accountId, tab } = use(params);
  const TabComponent = TAB_COMPONENTS[tab];

  if (!TabComponent) notFound();

  return <TabComponent accountId={accountId} />;
}
