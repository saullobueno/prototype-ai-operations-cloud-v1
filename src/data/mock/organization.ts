import type { Organization, Workspace } from "@/types";

export const organization: Organization = {
  id: "org_acme",
  name: "ACME Cloud",
  domain: "acmecloud.com",
  plan: "business",
  createdAt: "2022-01-10T09:00:00.000Z",
};

export const workspaces: Workspace[] = [
  {
    id: "ws_production",
    name: "ACME Cloud",
    environment: "production",
    organizationId: organization.id,
    createdAt: "2022-01-10T09:00:00.000Z",
  },
  {
    id: "ws_sandbox",
    name: "ACME Cloud",
    environment: "sandbox",
    organizationId: organization.id,
    createdAt: "2022-01-10T09:00:00.000Z",
  },
];
