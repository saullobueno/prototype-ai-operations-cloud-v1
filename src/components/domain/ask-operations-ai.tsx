"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateArticleDialog } from "@/features/knowledge/create-article-dialog";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "thinking";
  content: ReactNode;
}

interface ScriptedAnswer {
  content: ReactNode;
}

function useScriptedAnswers(navigate: (href: string) => void, openArticleDialog: (topic: string) => void): Record<string, ScriptedAnswer> {
  return {
    "por que a performance do suporte caiu essa semana?": {
      content: (
        <div className="space-y-3">
          <p>Encontrei 3 fatores que contribuíram:</p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Tickets relacionados a pagamento aumentaram 27%.</li>
            <li>O tempo médio de resposta aumentou 14%.</li>
            <li>Escalonamentos do Billing Agent aumentaram 9%.</li>
          </ul>
          <p className="font-medium">Ações recomendadas:</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => openArticleDialog("Motivos da queda de performance do suporte")}>
              Criar artigo na base de conhecimento
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/settings/ai")}>Revisar política</Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/automation/workflows")}>Criar workflow</Button>
          </div>
        </div>
      ),
    },
    "quais clientes estão em risco?": {
      content: (
        <div className="space-y-3">
          <p>4 clientes mostram sinais de risco no momento (sentimento em queda, problemas de billing não resolvidos ou SLA rompido):</p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Diego Ramírez — SolarWave (crítico, reembolso escalado para Finance)</li>
            <li>Patrícia Gomes — Velvet Studio (crítico, pagamento falhando repetidamente)</li>
            <li>Camila Rocha — Atlas Logix (em risco, divergência de billing em aberto)</li>
            <li>Maria Fernandes — Bright Retail (em risco, problemas recorrentes de SSO)</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate("/customers")}>Ver clientes em risco</Button>
          </div>
        </div>
      ),
    },
    "o que está travando a taxa de resolução por ia?": {
      content: (
        <div className="space-y-3">
          <p>O maior bloqueio é a cobertura de conhecimento sobre exceções de política de reembolso — isso responde por 31% das conversas que a IA não consegue resolver sozinha.</p>
          <p className="font-medium">Ação recomendada:</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate("/analytics/ai")}>Ver AI Performance</Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/knowledge")}>Revisar lacunas de conhecimento</Button>
          </div>
        </div>
      ),
    },
  };
}

const SUGGESTED_QUESTIONS = [
  "Por que a performance do suporte caiu essa semana?",
  "Quais clientes estão em risco?",
  "O que está travando a taxa de resolução por IA?",
];

export function AskOperationsAI({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [articleTopic, setArticleTopic] = useState<string | null>(null);
  const nextId = useRef(0);

  const navigate = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const openArticleDialog = (topic: string) => setArticleTopic(topic);

  const scriptedAnswers = useScriptedAnswers(navigate, openArticleDialog);

  function ask(question: string) {
    if (!question.trim()) return;
    const userMsg: ChatMessage = { id: `u_${nextId.current++}`, role: "user", content: question };
    const thinkingMsg: ChatMessage = { id: `t_${nextId.current++}`, role: "thinking", content: "Pensando..." };
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setInput("");

    window.setTimeout(() => {
      const key = question.trim().toLowerCase();
      const answer =
        scriptedAnswers[key] ??
        ({
          content: (
            <p>
              Ainda não tenho uma resposta pronta para isso neste protótipo — tente uma das perguntas sugeridas, ou
              pergunte sobre performance do suporte, clientes em risco ou taxa de resolução por IA.
            </p>
          ),
        } satisfies ScriptedAnswer);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingMsg.id),
        { id: `a_${nextId.current++}`, role: "assistant", content: answer.content },
      ]);
    }, 900);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-ai-accent" />
            Ask Operations AI
          </SheetTitle>
          <SheetDescription>Pergunte sobre os clientes, tickets ou operações deste workspace.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sugestões</p>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="block w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[90%] rounded-lg px-3 py-2 text-sm",
                  m.role === "user" && "bg-primary text-primary-foreground",
                  m.role === "assistant" && "bg-muted text-foreground",
                  m.role === "thinking" && "text-muted-foreground italic"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre suas operações..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <ArrowUp className="size-4" />
          </Button>
        </form>
      </SheetContent>

      <CreateArticleDialog
        topic={articleTopic ?? ""}
        open={articleTopic !== null}
        onOpenChange={(next) => {
          if (!next) setArticleTopic(null);
        }}
      />
    </Sheet>
  );
}
