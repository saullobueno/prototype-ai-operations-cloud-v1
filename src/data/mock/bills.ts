import type { Bill, BillStatus } from "@/types";
import { daysAgo } from "@/lib/time";
import { vendors } from "./vendors";

// Payables — referencia vendors reais de src/data/mock/vendors.ts (entidade compartilhada com
// Business Operations). Os 6 primeiros vendors (status "active") concentram a maior parte das bills.

const activeVendorIds = vendors.filter((v) => v.status === "active").map((v) => v.id);

const featuredBills: Bill[] = [
  {
    id: "bill_cloudedge_001",
    vendorId: "ven_002",
    amountCents: 1_240_000,
    status: "pending_approval",
    dueDate: daysAgo(-6),
    approvalId: "appr_fin_bill_1",
    createdAt: daysAgo(4),
  },
  {
    id: "bill_meridianlegal_001",
    vendorId: "ven_003",
    amountCents: 380_000,
    status: "pending_approval",
    dueDate: daysAgo(-10),
    approvalId: "appr_fin_bill_2",
    createdAt: daysAgo(2),
  },
  {
    id: "bill_praxisdc_001",
    vendorId: "ven_005",
    amountCents: 96_000,
    status: "approved",
    dueDate: daysAgo(-3),
    createdAt: daysAgo(8),
  },
];

function statusForIndex(i: number): BillStatus {
  const bucket = i % 6;
  if (bucket === 0) return "pending_approval";
  if (bucket === 1) return "rejected";
  if (bucket === 2 || bucket === 3) return "paid";
  return "approved";
}

const generatedBills: Bill[] = Array.from({ length: 22 }).map((_, i) => {
  const vendorId = activeVendorIds[i % activeVendorIds.length];
  const amountCents = 18_000 + ((i * 15_300) % 320_000);
  const status = statusForIndex(i);
  const createdDaysAgo = 3 + ((i * 7) % 90);
  return {
    id: `bill_gen_${i + 1}`,
    vendorId,
    amountCents,
    status,
    dueDate: status === "paid" ? daysAgo(createdDaysAgo - 12) : daysAgo(-(5 + (i % 25))),
    createdAt: daysAgo(createdDaysAgo),
  };
});

export const bills: Bill[] = [...featuredBills, ...generatedBills];

export function getBillById(id: string) {
  return bills.find((b) => b.id === id);
}

export function getBillsByVendor(vendorId: string) {
  return bills.filter((b) => b.vendorId === vendorId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function updateBill(billId: string, patch: Partial<Bill>) {
  const bill = bills.find((b) => b.id === billId);
  if (bill) Object.assign(bill, patch);
  return bill;
}

// Persistência simplificada, mesmo padrão de src/data/mock/deals.ts.
export function addBill(bill: Bill) {
  bills.push(bill);
}

// Só remove bills que ainda não viraram fato financeiro consumado — a página de contas a pagar
// não expõe essa ação para bills já pagas (ver src/app/(app)/modules/finance/bills/page.tsx).
export function deleteBill(billId: string) {
  const idx = bills.findIndex((b) => b.id === billId);
  if (idx !== -1) bills.splice(idx, 1);
}
