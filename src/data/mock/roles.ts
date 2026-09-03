import type { Role } from "@/types";
import { permissions } from "./permissions";

const allPermissionIds = permissions.map((p) => p.id);
const noBillingNoAdmin = allPermissionIds.filter(
  (id) => id !== "perm_billing_write" && id !== "perm_admin_access"
);
const operationalOnly = [
  "perm_tickets_read",
  "perm_tickets_write",
  "perm_conversations_read",
  "perm_conversations_write",
  "perm_customers_read",
  "perm_customers_write",
  "perm_agents_read",
  "perm_workflows_read",
  "perm_knowledge_read",
  "perm_knowledge_write",
  "perm_analytics_read",
];
const viewOnly = [
  "perm_tickets_read",
  "perm_conversations_read",
  "perm_customers_read",
  "perm_agents_read",
  "perm_workflows_read",
  "perm_knowledge_read",
  "perm_analytics_read",
];

export const roles: Role[] = [
  { id: "role_owner", name: "Owner", permissionIds: allPermissionIds },
  { id: "role_admin", name: "Admin", permissionIds: noBillingNoAdmin.concat("perm_admin_access") },
  {
    id: "role_manager",
    name: "Manager",
    permissionIds: operationalOnly.concat("perm_agents_execute_refund", "perm_approvals_write", "perm_settings_write"),
  },
  { id: "role_agent", name: "Agent", permissionIds: operationalOnly },
  { id: "role_viewer", name: "Viewer", permissionIds: viewOnly },
];
