"use client";

import { Building2 } from "lucide-react";
import { ModuleComingSoon } from "@/components/domain/module-coming-soon";

export default function BusinessModulePage() {
  return <ModuleComingSoon icon={Building2} name="Business Operations" areas={["Processos", "Projetos", "Tarefas", "Aprovações", "Documentos", "Agentes de negócio"]} />;
}
