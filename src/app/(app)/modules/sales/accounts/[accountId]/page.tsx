"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountDetailIndexPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/modules/sales/accounts/${accountId}/overview`);
  }, [accountId, router]);

  return null;
}
