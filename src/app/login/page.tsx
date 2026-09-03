"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/core/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("edivan@econform.com.br");
  const [password, setPassword] = useState("••••••••••");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      login();
      router.push("/workspaces");
    }, 500);
  }

  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AI Operations Cloud</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Entre no seu workspace</CardTitle>
              <CardDescription>Informe suas credenciais para continuar.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : "Entrar"}
                </Button>
              </form>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full" type="button" onClick={handleSubmit}>
                  Continuar com Google
                </Button>
                <Button variant="outline" className="w-full" type="button" onClick={handleSubmit}>
                  Continuar com SSO
                </Button>
              </div>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Este é um protótipo visual — qualquer credencial faz login.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden bg-sidebar lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-6 lg:p-12">
        <div className="max-w-md space-y-4 text-sidebar-foreground">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Customer Operations</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Uma única camada operacional para cada cliente, workflow, agente e decisão.
          </h2>
          <p className="text-sm text-muted-foreground">
            Rode sua empresa com IA, automação e pessoas trabalhando juntas.
          </p>
        </div>
      </div>
    </div>
  );
}
