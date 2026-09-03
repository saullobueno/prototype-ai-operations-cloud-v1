import type { KnowledgeSource } from "@/types";
import { daysAgo, hoursAgo } from "@/lib/time";

export const knowledgeSources: KnowledgeSource[] = [
  { id: "ks_website", type: "website", name: "Central de Ajuda (acmecloud.com/help)", syncStatus: "synced", lastSyncedAt: hoursAgo(6) },
  { id: "ks_product_docs", type: "notion", name: "Documentação do produto", syncStatus: "synced", lastSyncedAt: daysAgo(1) },
  { id: "ks_refund_policy", type: "pdf", name: "Política de reembolso", syncStatus: "synced", lastSyncedAt: daysAgo(3) },
  { id: "ks_internal_procedures", type: "google_drive", name: "Procedimentos internos", syncStatus: "synced", lastSyncedAt: daysAgo(2) },
  { id: "ks_api_reference", type: "url", name: "Referência de API", syncStatus: "syncing" },
  { id: "ks_onboarding_kit", type: "manual", name: "Kit de onboarding (uploads manuais)", syncStatus: "error", lastSyncedAt: daysAgo(9) },
];
