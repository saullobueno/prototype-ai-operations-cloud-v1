"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDetailIndexPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/modules/people/employees/${employeeId}/overview`);
  }, [employeeId, router]);

  return null;
}
