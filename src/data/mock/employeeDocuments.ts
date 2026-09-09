// Documentos do colaborador — modelo próprio e leve (FileAttachment em src/types/index.ts é
// específico de Customer 360, com customerId obrigatório, então não serve para Employee 360).
import { daysAgo } from "@/lib/time";

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  kind: "pdf" | "doc" | "sheet" | "other";
  sizeKb: number;
  uploadedById: string;
  createdAt: string;
}

export const employeeDocuments: EmployeeDocument[] = [
  { id: "edoc_001", employeeId: "emp_005", name: "Contrato_de_trabalho_Marina_Costa.pdf", kind: "pdf", sizeKb: 312, uploadedById: "usr_edivan", createdAt: daysAgo(9) },
  { id: "edoc_002", employeeId: "emp_005", name: "Documento_de_identificacao.pdf", kind: "pdf", sizeKb: 96, uploadedById: "usr_edivan", createdAt: daysAgo(8) },
  { id: "edoc_003", employeeId: "emp_017", name: "Contrato_de_trabalho_Rafael_Souza.pdf", kind: "pdf", sizeKb: 298, uploadedById: "usr_edivan", createdAt: daysAgo(720) },
  { id: "edoc_004", employeeId: "emp_017", name: "Plano_de_comissionamento_2026.xlsx", kind: "sheet", sizeKb: 54, uploadedById: "usr_edivan", createdAt: daysAgo(60) },
  { id: "edoc_005", employeeId: "emp_021", name: "Contrato_de_trabalho_Juliana_Prado.pdf", kind: "pdf", sizeKb: 305, uploadedById: "usr_edivan", createdAt: daysAgo(840) },
];

export function getDocumentsByEmployee(employeeId: string) {
  return employeeDocuments.filter((d) => d.employeeId === employeeId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function addEmployeeDocument(doc: EmployeeDocument) {
  employeeDocuments.push(doc);
}

export function deleteEmployeeDocument(id: string) {
  const idx = employeeDocuments.findIndex((d) => d.id === id);
  if (idx !== -1) employeeDocuments.splice(idx, 1);
}
