import type { Team } from "@/types";

export const teams: Team[] = [
  { id: "team_billing", name: "Billing", memberIds: ["usr_maria"] },
  { id: "team_technical", name: "Technical Support", memberIds: ["usr_pedro"] },
  { id: "team_success", name: "Customer Success", memberIds: ["usr_sofia"] },
  { id: "team_triage", name: "Triage", memberIds: [] },
  { id: "team_qa", name: "Quality Assurance", memberIds: [] },
  { id: "team_sales", name: "Sales", memberIds: [] },
  { id: "team_finance", name: "Finance", memberIds: [] },
  { id: "team_platform", name: "Platform / Admin", memberIds: ["usr_thomas", "usr_edivan"] },
];
