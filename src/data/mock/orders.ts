import type { Order, Payment } from "@/types";
import { customers } from "./customers";
import { daysAgo, monthsAgo } from "@/lib/time";

const planAmountCents: Record<string, number> = {
  Starter: 4900,
  Professional: 14900,
  Business: 39900,
  Enterprise: 99900,
};

export const orders: Order[] = customers.flatMap((customer, i) => {
  const base = planAmountCents[customer.plan];
  const list: Order[] = [
    {
      id: `order_${customer.id}_1`,
      customerId: customer.id,
      amountCents: base,
      status: "paid",
      createdAt: monthsAgo(1),
      description: `Plano ${customer.plan} — assinatura mensal`,
    },
    {
      id: `order_${customer.id}_2`,
      customerId: customer.id,
      amountCents: base,
      status: "paid",
      createdAt: monthsAgo(2),
      description: `Plano ${customer.plan} — assinatura mensal`,
    },
  ];

  // Alguns clientes têm um pedido com problema recente (usado pelas conversas/tickets de billing).
  if (i % 4 === 0) {
    list.unshift({
      id: `order_${customer.id}_0`,
      customerId: customer.id,
      amountCents: base,
      status: "failed",
      createdAt: daysAgo(2),
      description: `Plano ${customer.plan} — assinatura mensal`,
    });
  }

  return list;
});

export const payments: Payment[] = orders.map((order, i) => {
  const failed = order.status === "failed";
  return {
    id: `pay_${order.id}`,
    customerId: order.customerId,
    orderId: order.id,
    amountCents: order.amountCents,
    status: failed ? "failed" : "completed",
    method: i % 3 === 0 ? "Visa •••• 4242" : i % 3 === 1 ? "Mastercard •••• 8931" : "Débito direto SEPA",
    createdAt: order.createdAt,
  };
});
