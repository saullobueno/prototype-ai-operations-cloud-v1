import type { FileAttachment, Note } from "@/types";
import { daysAgo } from "@/lib/time";

export const notes: Note[] = [
  { id: "note_1", customerId: "cus_001", authorId: "usr_maria", body: "Conta Enterprise, muito responsiva. Prefere e-mail a chat.", createdAt: daysAgo(30) },
  { id: "note_2", customerId: "cus_001", authorId: "usr_sofia", body: "Renovação chega no Q1 — sinalizado como oportunidade de expansão.", createdAt: daysAgo(10) },
  { id: "note_3", customerId: "cus_010", authorId: "usr_maria", body: "Billing tem sido um ponto de dor recorrente após o downgrade — ficar de olho no risco de churn.", createdAt: daysAgo(5) },
  { id: "note_4", customerId: "cus_007", authorId: "usr_sofia", body: "Escalado duas vezes este trimestre. Considerar uma ligação proativa de health check.", createdAt: daysAgo(2) },
];

export const files: FileAttachment[] = [
  { id: "file_1", customerId: "cus_001", name: "MSA_Novacorp_2024.pdf", sizeKb: 482, kind: "pdf", uploadedById: "usr_maria", createdAt: daysAgo(200) },
  { id: "file_2", customerId: "cus_001", name: "Checklist_de_onboarding.docx", sizeKb: 96, kind: "doc", uploadedById: "usr_sofia", createdAt: daysAgo(180) },
  { id: "file_3", customerId: "cus_010", name: "Email_confirmacao_downgrade.pdf", sizeKb: 64, kind: "pdf", uploadedById: "usr_maria", createdAt: daysAgo(35) },
  { id: "file_4", customerId: "cus_014", name: "QBR_Q2_2026.pdf", sizeKb: 1240, kind: "pdf", uploadedById: "usr_sofia", createdAt: daysAgo(60) },
];

// Persistência simplificada: grava de volta nestes arrays compartilhados para que notas e
// arquivos sobrevivam à navegação dentro da sessão — não sobrevive a um reload.
// Ver docs/06-fluxos-e-ai-moments.md.
export function addNote(note: Note) {
  notes.push(note);
}

export function addFile(file: FileAttachment) {
  files.push(file);
}
