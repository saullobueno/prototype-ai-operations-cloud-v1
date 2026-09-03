"use client";

import { TrendingUp } from "lucide-react";
import { ModuleComingSoon } from "@/components/domain/module-coming-soon";

export default function SalesModulePage() {
  return <ModuleComingSoon icon={TrendingUp} name="Sales Operations" areas={["Leads", "Contas", "Negociações", "Pipeline", "Agentes de vendas", "Analytics de receita"]} />;
}
