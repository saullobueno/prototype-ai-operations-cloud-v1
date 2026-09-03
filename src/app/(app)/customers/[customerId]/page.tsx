"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDetailIndexPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/customers/${customerId}/overview`);
  }, [customerId, router]);

  return null;
}
