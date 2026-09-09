import type { Department } from "@/types";
import { getEmployeesByDepartment } from "./employees";

export const departments: Department[] = [
  { id: "dept_leadership", name: "Liderança", headId: "emp_001" },
  { id: "dept_engineering", name: "Engenharia", headId: "emp_003" },
  { id: "dept_product", name: "Produto", headId: "emp_011" },
  { id: "dept_design", name: "Design", headId: "emp_014" },
  { id: "dept_sales", name: "Vendas", headId: "emp_016" },
  { id: "dept_cs", name: "Sucesso do Cliente", headId: "emp_021" },
  { id: "dept_marketing", name: "Marketing", headId: "emp_025" },
  { id: "dept_people", name: "People & Talent", headId: "emp_028" },
  { id: "dept_finance", name: "Finanças & Operações", headId: "emp_031" },
];

export function getDepartmentById(id: string) {
  return departments.find((d) => d.id === id);
}

export function addDepartment(department: Department) {
  departments.push(department);
}

export function updateDepartment(id: string, patch: Partial<Department>): Department | undefined {
  const department = departments.find((d) => d.id === id);
  if (!department) return undefined;
  Object.assign(department, patch);
  return department;
}

/** Recusa a exclusão se ainda houver colaboradores vinculados — evita departamento "órfão" no dataset. */
export function deleteDepartment(id: string): boolean {
  if (getEmployeesByDepartment(id).length > 0) return false;
  const idx = departments.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  departments.splice(idx, 1);
  return true;
}
