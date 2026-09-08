import type { Proposal } from "@/types";
import { daysAgo, monthsAgo } from "@/lib/time";

export const proposals: Proposal[] = [
  { id: "prop_meridian", dealId: "deal_meridian_expansion", status: "sent", valueCents: 3_800_000, sentAt: daysAgo(20) },
  { id: "prop_solstice", dealId: "deal_solstice_platform", status: "viewed", valueCents: 6_400_000, sentAt: daysAgo(2) },
  { id: "prop_kepler", dealId: "deal_kepler_core", status: "sent", valueCents: 5_200_000, sentAt: daysAgo(9) },
  { id: "prop_bluewave", dealId: "deal_bluewave_enterprise", status: "sent", valueCents: 14_500_000, sentAt: daysAgo(4) },
  { id: "prop_aurora", dealId: "deal_aurora_core", status: "viewed", valueCents: 7_100_000, sentAt: daysAgo(1) },
  { id: "prop_nordwind", dealId: "deal_nordwind_core", status: "sent", valueCents: 21_000_000, sentAt: daysAgo(14) },
  { id: "prop_vantage", dealId: "deal_vantage_intro", status: "draft", valueCents: 5_800_000 },
  { id: "prop_novacorp", dealId: "deal_novacorp_won", status: "accepted", valueCents: 9_600_000, sentAt: monthsAgo(16) },
  { id: "prop_lumentech", dealId: "deal_lumentech_won", status: "accepted", valueCents: 4_200_000, sentAt: monthsAgo(15) },
  { id: "prop_vertexlabs", dealId: "deal_vertexlabs_won", status: "accepted", valueCents: 18_000_000, sentAt: monthsAgo(33) },
];

export function getProposalByDeal(dealId: string): Proposal | undefined {
  return proposals.find((p) => p.dealId === dealId);
}
