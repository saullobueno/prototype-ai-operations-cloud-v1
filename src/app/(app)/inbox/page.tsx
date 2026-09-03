import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/domain/empty-state";

export default function InboxIndexPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyState icon={MessageSquare} title="Selecione uma conversa para começar" description="Escolha uma conversa na lista para ver o histórico, a análise de IA e o contexto do cliente." className="border-none" />
    </div>
  );
}
