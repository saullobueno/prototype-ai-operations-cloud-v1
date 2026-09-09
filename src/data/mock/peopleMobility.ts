// Mobilidade interna — modelo próprio e leve (não faz parte de src/types/index.ts), conforme
// permitido pelo briefing: "pode ser uma lista simples derivada de registros no estilo Activity".
import { daysAgo } from "@/lib/time";

export type MobilityType = "promotion" | "lateral_move" | "department_transfer";

export interface MobilityEvent {
  id: string;
  employeeId: string;
  type: MobilityType;
  fromTitle: string;
  toTitle: string;
  fromDepartmentId?: string;
  toDepartmentId?: string;
  effectiveDate: string;
  note?: string;
}

export const mobilityEvents: MobilityEvent[] = [
  {
    id: "mob_001",
    employeeId: "emp_022",
    type: "promotion",
    fromTitle: "CS Specialist Jr.",
    toTitle: "CS Specialist",
    effectiveDate: daysAgo(90),
    note: "Promoção após consolidar a carteira de contas de médio porte.",
  },
  {
    id: "mob_002",
    employeeId: "emp_009",
    type: "lateral_move",
    fromTitle: "Software Engineer",
    toTitle: "DevOps Engineer",
    effectiveDate: daysAgo(150),
    note: "Transição para a especialização em infraestrutura a pedido do próprio colaborador.",
  },
  {
    id: "mob_003",
    employeeId: "emp_020",
    type: "department_transfer",
    fromTitle: "Sales Development Rep.",
    toTitle: "Sales Ops Analyst",
    fromDepartmentId: "dept_sales",
    toDepartmentId: "dept_sales",
    effectiveDate: daysAgo(80),
    note: "Migração de função dentro do próprio departamento para dar suporte a operações de vendas.",
  },
  {
    id: "mob_004",
    employeeId: "emp_004",
    type: "promotion",
    fromTitle: "Senior Software Engineer",
    toTitle: "Engineering Manager",
    effectiveDate: daysAgo(300),
    note: "Promoção para gestão após liderar com sucesso a squad de plataforma.",
  },
];

export function getMobilityByEmployee(employeeId: string) {
  return mobilityEvents.filter((m) => m.employeeId === employeeId);
}
