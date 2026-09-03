import type { Contact } from "@/types";
import { customers } from "./customers";

export const contacts: Contact[] = customers.flatMap((customer, i) => {
  const primary: Contact = {
    id: `contact_${customer.id}_primary`,
    customerId: customer.id,
    name: customer.name,
    email: customer.email,
    role: "Primary contact",
  };

  if (customer.plan !== "Enterprise") return [primary];

  const secondaryNames = [
    "Julia Prado",
    "Marcos Vidal",
    "Elena Santos",
    "Rafael Brito",
    "Carla Duarte",
  ];
  const name = secondaryNames[i % secondaryNames.length];
  const secondary: Contact = {
    id: `contact_${customer.id}_billing`,
    customerId: customer.id,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@${customer.email.split("@")[1]}`,
    role: "Billing contact",
  };

  return [primary, secondary];
});
