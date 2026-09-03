import { CURRENT_USER_ID, getUserById, getRoleById, permissions } from "@/data/mock";
import type { RoleName } from "@/types";

/**
 * RBAC visual do protótipo (docs/07-papeis-e-permissoes.md).
 * Não há enforcement real — apenas esconde/mostra elementos de UI conforme o role
 * do usuário logado (usr_edivan, role Owner por padrão, ver docs/07 §2).
 */

export function getCurrentUserRole(): RoleName {
  const user = getUserById(CURRENT_USER_ID);
  const role = user ? getRoleById(user.roleId) : undefined;
  return role?.name ?? "Viewer";
}

export function currentUserHasPermission(permissionKey: string): boolean {
  const user = getUserById(CURRENT_USER_ID);
  const permission = permissions.find((p) => p.key === permissionKey);
  if (!user || !permission) return false;
  const role = getRoleById(user.roleId);
  return role?.permissionIds.includes(permission.id) ?? false;
}

const ROLE_RANK: Record<RoleName, number> = {
  Owner: 5,
  Admin: 4,
  Manager: 3,
  Agent: 2,
  Viewer: 1,
};

/** true se o role atual tem rank >= ao mínimo exigido (docs/07 §3). */
export function currentUserAtLeast(minRole: RoleName): boolean {
  return ROLE_RANK[getCurrentUserRole()] >= ROLE_RANK[minRole];
}

export function canAccessSettings(): boolean {
  return currentUserAtLeast("Manager");
}

export function canAccessAdmin(): boolean {
  return currentUserAtLeast("Admin");
}

export function canAccessBilling(): boolean {
  return currentUserAtLeast("Owner");
}

export function canBuildAgentsOrWorkflows(): boolean {
  return currentUserAtLeast("Manager");
}

export function canApprove(): boolean {
  return currentUserAtLeast("Manager");
}
