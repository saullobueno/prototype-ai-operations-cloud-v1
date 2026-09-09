import type { Team } from "@/types";

export const teams: Team[] = [
  { id: "team_billing", name: "Billing", memberIds: ["usr_maria"] },
  { id: "team_technical", name: "Technical Support", memberIds: ["usr_pedro"] },
  { id: "team_success", name: "Customer Success", memberIds: ["usr_sofia"] },
  { id: "team_triage", name: "Triage", memberIds: [] },
  { id: "team_qa", name: "Quality Assurance", memberIds: [] },
  { id: "team_sales", name: "Sales", memberIds: ["usr_rafaela", "usr_diego"] },
  { id: "team_finance", name: "Finance", memberIds: [] },
  { id: "team_platform", name: "Platform / Admin", memberIds: ["usr_thomas", "usr_edivan"] },
];

// Persistência simplificada, mesmo padrão de tasks.ts: a tela /admin/teams muta este array
// compartilhado para que o efeito sobreviva à navegação dentro da sessão — não sobrevive a um reload.
export function addTeam(team: Team) {
  teams.push(team);
}

export function updateTeam(updated: Team) {
  const idx = teams.findIndex((t) => t.id === updated.id);
  if (idx !== -1) teams[idx] = updated;
}

export function deleteTeam(id: string) {
  const idx = teams.findIndex((t) => t.id === id);
  if (idx !== -1) teams.splice(idx, 1);
}
