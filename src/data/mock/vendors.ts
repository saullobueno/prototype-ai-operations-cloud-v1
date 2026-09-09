import type { Vendor } from "@/types";

// Entidade compartilhada entre Business Operations (Vendor Onboarding) e Finance Operations (Payables).
// Os primeiros 3 vendors representam o caminho feliz: nasceram de um ProcessRun de Vendor Onboarding
// concluído em Business Operations e já aparecem como fornecedor ativo em Finance.

export const vendors: Vendor[] = [
  {
    id: "ven_001",
    name: "Nordic Supplies AB",
    category: "Office & Facilities",
    status: "active",
    contactEmail: "billing@nordicsupplies.se",
    taxId: "SE556677889901",
    onboardedAt: "2026-08-14T10:00:00Z",
    createdAt: "2026-08-02T09:00:00Z",
  },
  {
    id: "ven_002",
    name: "CloudEdge Infrastructure",
    category: "Software & Cloud",
    status: "active",
    contactEmail: "ap@cloudedge.io",
    taxId: "IE9876543C",
    onboardedAt: "2026-07-20T14:30:00Z",
    createdAt: "2026-07-10T09:00:00Z",
  },
  {
    id: "ven_003",
    name: "Meridian Legal Partners",
    category: "Professional Services",
    status: "active",
    contactEmail: "accounts@meridianlegal.com",
    taxId: "GB445566778",
    onboardedAt: "2026-06-02T11:00:00Z",
    createdAt: "2026-05-22T09:00:00Z",
  },
  {
    id: "ven_004",
    name: "Atlas Marketing Group",
    category: "Marketing & Media",
    status: "active",
    contactEmail: "finance@atlasmkt.com",
    taxId: "US841122334",
    onboardedAt: "2026-04-11T09:00:00Z",
    createdAt: "2026-04-01T09:00:00Z",
  },
  {
    id: "ven_005",
    name: "Praxis Data Center Services",
    category: "Software & Cloud",
    status: "active",
    contactEmail: "billing@praxisdc.com",
    taxId: "DE297733441",
    onboardedAt: "2026-03-18T09:00:00Z",
    createdAt: "2026-03-05T09:00:00Z",
  },
  {
    id: "ven_006",
    name: "Bright Path Travel",
    category: "Travel",
    status: "active",
    contactEmail: "corporate@brightpathtravel.com",
    onboardedAt: "2026-02-09T09:00:00Z",
    createdAt: "2026-01-28T09:00:00Z",
  },
  {
    id: "ven_007",
    name: "Solaris Facilities Management",
    category: "Office & Facilities",
    status: "pending_approval",
    contactEmail: "ap@solarisfm.com",
    taxId: "FR38221199001",
    createdAt: "2026-09-01T09:00:00Z",
  },
  {
    id: "ven_008",
    name: "Vantage Compliance Consulting",
    category: "Professional Services",
    status: "pending_approval",
    contactEmail: "billing@vantagecompliance.com",
    createdAt: "2026-09-05T09:00:00Z",
  },
  {
    id: "ven_009",
    name: "Ferrous Print & Signage",
    category: "Marketing & Media",
    status: "inactive",
    contactEmail: "info@ferrousprint.com",
    onboardedAt: "2025-11-04T09:00:00Z",
    createdAt: "2025-10-20T09:00:00Z",
  },
];

export function getVendorById(id: string) {
  return vendors.find((v) => v.id === id);
}

// Persistência simplificada, mesmo padrão de src/data/mock/customers.ts.
export function addVendor(vendor: Vendor) {
  vendors.push(vendor);
}

export function updateVendor(vendorId: string, patch: Partial<Vendor>) {
  const vendor = vendors.find((v) => v.id === vendorId);
  if (vendor) Object.assign(vendor, patch);
  return vendor;
}

export function deleteVendor(vendorId: string) {
  const idx = vendors.findIndex((v) => v.id === vendorId);
  if (idx !== -1) vendors.splice(idx, 1);
}
