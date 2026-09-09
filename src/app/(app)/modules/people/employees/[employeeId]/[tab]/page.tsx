"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import {
  ActivityTab,
  DocumentsTab,
  FeedbackTab,
  GoalsTab,
  JourneyTab,
  OverviewTab,
  PerformanceTab,
  RequestsTab,
  TasksTab,
  TeamTab,
} from "@/features/people/employee-tabs";

const TAB_COMPONENTS: Record<string, (props: { employeeId: string }) => React.ReactElement> = {
  overview: OverviewTab,
  activity: ActivityTab,
  team: TeamTab,
  goals: GoalsTab,
  performance: PerformanceTab,
  feedback: FeedbackTab,
  documents: DocumentsTab,
  requests: RequestsTab,
  tasks: TasksTab,
  journey: JourneyTab,
};

export default function EmployeeTabPage({ params }: { params: Promise<{ employeeId: string; tab: string }> }) {
  const { employeeId, tab } = use(params);
  const TabComponent = TAB_COMPONENTS[tab];

  if (!TabComponent) notFound();

  return <TabComponent employeeId={employeeId} />;
}
