import type { User } from "@/types";

export const users: User[] = [
  {
    id: "usr_edivan",
    name: "Edivan",
    email: "edivan@econform.com.br",
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
];

export const CURRENT_USER_ID = "usr_edivan";
