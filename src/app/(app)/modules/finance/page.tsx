"use client";

import { Wallet } from "lucide-react";
import { ModuleComingSoon } from "@/components/domain/module-coming-soon";

export default function FinanceModulePage() {
  return <ModuleComingSoon icon={Wallet} name="Finance Operations" areas={["Notas fiscais", "Despesas", "Pagamentos", "Fluxo de caixa", "Aprovações", "Agentes financeiros"]} />;
}
