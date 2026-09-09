import type { User } from "@/types";

export const users: User[] = [
  {
    id: "usr_edivan",
    name: "Edivan",
    email: "edivan@econform.com.br",
    phone: "+55 11 90000-0000",
    bio: "Fundador e responsável pela operação do AI Operations Cloud.",
    roleId: "role_owner",
    teamIds: ["team_platform"],
    status: "active",
  },
  {
    id: "usr_maria",
    name: "Maria Silva",
    email: "maria@acmecloud.com",
    roleId: "role_manager",
    teamIds: ["team_billing"],
    status: "active",
  },
  {
    id: "usr_pedro",
    name: "Pedro Santos",
    email: "pedro@acmecloud.com",
    roleId: "role_agent",
    teamIds: ["team_technical"],
    status: "active",
  },
  {
    id: "usr_sofia",
    name: "Sofia Costa",
    email: "sofia@acmecloud.com",
    roleId: "role_agent",
    teamIds: ["team_success"],
    status: "active",
  },
  {
    id: "usr_thomas",
    name: "Thomas Anderson",
    email: "thomas@acmecloud.com",
    roleId: "role_admin",
    teamIds: ["team_platform"],
    status: "active",
  },
  {
    id: "usr_rafaela",
    name: "Rafaela Nunes",
    email: "rafaela@acmecloud.com",
    roleId: "role_manager",
    teamIds: ["team_sales"],
    status: "active",
  },
  {
    id: "usr_diego",
    name: "Diego Farias",
    email: "diego@acmecloud.com",
    roleId: "role_agent",
    teamIds: ["team_sales"],
    status: "active",
  },
];

export const CURRENT_USER_ID = "usr_edivan";

// Persistência simplificada, mesmo padrão de tasks.ts: as telas de administração de usuários
// (/admin/users) mutam este array compartilhado para que o efeito sobreviva à navegação dentro
// da sessão — não sobrevive a um reload.
export function addUser(user: User) {
  users.push(user);
}

export function updateUser(updated: User) {
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx !== -1) users[idx] = updated;
}

export function deleteUser(id: string) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) users.splice(idx, 1);
}
