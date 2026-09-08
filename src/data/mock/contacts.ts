import type { Contact } from "@/types";
import { customers } from "./customers";
import { accounts } from "./accounts";

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

// ---------- Sales Operations — contatos por Account (prospects, ainda não convertidos) ----------

const accountContactSeed: Record<string, { name: string; email: string; role: string }[]> = {
  acc_meridianfreight: [
    { name: "Fábio Menezes", email: "fabio.menezes@meridianfreight.com", role: "VP of Operations (decision maker)" },
    { name: "Ricardo Bastos", email: "ricardo.bastos@meridianfreight.com", role: "Ops Manager (champion)" },
  ],
  acc_solsticehealth: [{ name: "Débora Aquino", email: "debora.aquino@solsticehealth.com", role: "CTO" }],
  acc_keplerrobotics: [{ name: "Vinícius Hollanda", email: "vinicius.hollanda@keplerrobotics.io", role: "Head of Engineering" }],
  acc_bluewavetelecom: [{ name: "Patrícia Souza", email: "patricia.souza@bluewavetelecom.com", role: "VP of Procurement" }],
  acc_graniteretail: [{ name: "Cauã Ribeiro", email: "caua.ribeiro@graniteretailgroup.com", role: "IT Manager" }],
  acc_aurorafintech: [{ name: "Renata Lopes", email: "renata.lopes@aurorafintech.com", role: "Head of Risk" }],
  acc_nordwindenergy: [{ name: "Sérgio Palhano", email: "sergio.palhano@nordwindenergy.com", role: "COO" }],
  acc_silvercrestmedia: [{ name: "Bianca Ferraz", email: "bianca.ferraz@silvercrestmedia.com", role: "Head of IT" }],
  acc_terracottahospitality: [{ name: "Marina Torres", email: "marina.torres@terracottahospitality.com", role: "VP of Operations" }],
  acc_vantagebiotech: [{ name: "Henrique Salles", email: "henrique.salles@vantagebiotech.com", role: "Head of IT" }],
  acc_palisadeinsurance: [{ name: "Otto Ramires", email: "otto.ramires@palisadeinsurance.com", role: "CTO" }],
  acc_coppervalleyfoods: [{ name: "Ivo Cardim", email: "ivo.cardim@coppervalleyfoods.com", role: "Procurement Director" }],
};

export const accountContacts: Contact[] = accounts
  .filter((account) => account.status !== "customer")
  .flatMap((account) =>
    (accountContactSeed[account.id] ?? []).map((seed, i) => ({
      id: `contact_${account.id}_${i}`,
      accountId: account.id,
      name: seed.name,
      email: seed.email,
      role: seed.role,
    }))
  );

contacts.push(...accountContacts);
