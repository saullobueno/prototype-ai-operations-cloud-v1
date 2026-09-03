"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import {
  ActivityTab,
  ConversationsTab,
  FilesTab,
  NotesTab,
  OrdersTab,
  OverviewTab,
  PaymentsTab,
  TasksTab,
  TicketsTab,
  TimelineTab,
} from "@/features/customers/customer-tabs";

const TAB_COMPONENTS: Record<string, (props: { customerId: string }) => React.ReactElement> = {
  overview: OverviewTab,
  activity: ActivityTab,
  conversations: ConversationsTab,
  tickets: TicketsTab,
  orders: OrdersTab,
  payments: PaymentsTab,
  tasks: TasksTab,
  notes: NotesTab,
  files: FilesTab,
  timeline: TimelineTab,
};

export default function CustomerTabPage({ params }: { params: Promise<{ customerId: string; tab: string }> }) {
  const { customerId, tab } = use(params);
  const TabComponent = TAB_COMPONENTS[tab];

  if (!TabComponent) notFound();

  return <TabComponent customerId={customerId} />;
}
