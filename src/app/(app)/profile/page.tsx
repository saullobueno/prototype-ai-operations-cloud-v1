"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { useAuth } from "@/core/auth/AuthProvider";
import { getRoleById, getTeamById } from "@/data/mock";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");

  if (!user) return null;

  const role = getRoleById(user.roleId);
  const teams = user.teamIds.map((id) => getTeamById(id)).filter(Boolean);

  return (
    <PageContainer>
      <PageHeader title="Perfil" description="Suas informações pessoais — visíveis para o time." />

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Foto do perfil</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-3">
            <EntityAvatar name={user.name} imageUrl={user.avatarUrl} size="lg" />
            <Button variant="outline" size="sm" onClick={() => toast("O upload de foto não está disponível neste protótipo.")}>Alterar foto</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Informações pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label>Nome completo</Label>
              <Input className="max-w-sm" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <Input className="max-w-sm" value={user.email} disabled />
            </div>
            <div className="grid gap-1.5">
              <Label>Telefone</Label>
              <Input className="max-w-sm" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 11 90000-0000" />
            </div>
            <div className="grid gap-1.5">
              <Label>Bio</Label>
              <Textarea className="max-w-sm" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Uma frase curta sobre você" />
            </div>
            <Button onClick={() => toast.success("Perfil salvo")}>Salvar alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Papel e time</CardTitle>
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link href="/admin/users">Gerenciar em Administração <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Papel</span>
              {role && <Badge variant="secondary">{role.name}</Badge>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Times</span>
              <div className="flex gap-1.5">
                {teams.map((t) => (
                  <Badge key={t!.id} variant="secondary">{t!.name}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
